from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
import os

# Local modules
from src.prompts import WastePrompts
from src.models import (
    WasteQueryState,
    WasteItemInfo,
    WealthIdea,
    WealthIdeasResponse  # ✅ NEW wrapper for structured output
)
from src.firecrawl import FirecrawlService

# Load environment variables from .env file
load_dotenv()


class Workflow:
    """
    Handles AI workflow using LangGraph, Gemini, and Firecrawl.

    Executes a 3-step intelligent pipeline:
    1. Extract waste items from online articles
    2. Analyze each item for type, health risk, reuse potential
    3. Generate actionable waste-to-wealth project ideas
    """

    def __init__(self):
        # Validate and load Gemini API key
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if not google_api_key:
            raise ValueError("Missing GOOGLE_API_KEY in .env")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",  # Fast and cost-effective Gemini model
            temperature=0.3,
            max_output_tokens=1024,
            google_api_key=google_api_key
        )

        self.firecrawl = FirecrawlService()  # For scraping articles
        self.prompts = WastePrompts()        # Reusable prompt templates
        self.workflow = self._build_graph()  # LangGraph state machine

    def _build_graph(self):
        """
        Constructs LangGraph workflow:
        extract_items → analyze_items → generate_ideas → END
        """
        graph = StateGraph(WasteQueryState)

        graph.add_node("extract_items", self._extract_items_step)
        graph.add_node("analyze_items", self._analyze_items_step)
        graph.add_node("generate_ideas", self._generate_ideas_step)

        graph.set_entry_point("extract_items")
        graph.add_edge("extract_items", "analyze_items")
        graph.add_edge("analyze_items", "generate_ideas")
        graph.add_edge("generate_ideas", END)

        return graph.compile()

    async def _extract_items_step(self, state: WasteQueryState) -> Dict[str, Any]:
        """
        Step 1: Use Firecrawl to get articles, then use Gemini to extract relevant waste items.

        Args:
            state: Current query state from LangGraph

        Returns:
            Dict[str, Any]: {"extracted_waste_items": [...]}
        """
        print(f"🔍 Extracting waste items for query: {state.query}")

        articles = await self.firecrawl.search_articles(state.query, num_results=3)
        combined_content = ""

        for article in articles:
            url = article.get("url")
            scraped = await self.firecrawl.scrape_page(url)
            if scraped:
                combined_content += scraped + "\n\n"

        messages = [
            SystemMessage(content=self.prompts.WASTE_EXTRACTION_SYSTEM),
            HumanMessage(content=self.prompts.waste_extraction_user(
                state.query, combined_content))
        ]

        try:
            response = await self.llm.ainvoke(messages)
            extracted = [item.strip()
                         for item in response.content.split("\n") if item.strip()]
            extracted = extracted[:2]
            print(f"✅ Extracted waste items: {extracted}")
            return {"extracted_waste_items": extracted}
        except Exception as e:
            print("🔴 Extraction failed:", e)
            return {"extracted_waste_items": []}

    async def _analyze_items_step(self, state: WasteQueryState) -> Dict[str, Any]:
        """
        Step 2: For each waste item, generate structured information like category, reuse, risk, etc.

        Returns:
            Dict[str, Any]: {"items_info": [...]}
        """
        print(f"🧪 Analyzing waste items: {state.extracted_waste_items}")
        items_info: List[WasteItemInfo] = []

        for item in state.extracted_waste_items:
            try:
                messages = [
                    SystemMessage(content=self.prompts.WASTE_ANALYSIS_SYSTEM),
                    HumanMessage(
                        content=self.prompts.analyze_waste_item(item, state.query))
                ]
                structured_llm = self.llm.with_structured_output(WasteItemInfo)
                item_info = await structured_llm.ainvoke(messages)

                item_info.name = item  # Set item name
                items_info.append(item_info)
            except Exception as e:
                print(f"❌ Failed to analyze {item}: {e}")

        return {"items_info": items_info}

    async def _generate_ideas_step(self, state: WasteQueryState) -> Dict[str, Any]:
        """
        Step 3: Generate 2 most relevant money-making ideas from the analyzed waste items.

        Uses Gemini to suggest waste-to-wealth projects based on categorized input.

        Args:
            state (WasteQueryState): The current AI state with analyzed waste items.

        Returns:
            Dict[str, Any]: Dictionary with a trimmed list of wealth_ideas (max 2).
        """
        print("💡 Generating wealth ideas...")

        # Format: "Banana peels (organic)\nPlastic bottles (plastic)"
        items_text = "\n".join(
            [f"{item.name} ({item.category})" for item in state.items_info]
        )

        # Compose messages for Gemini
        messages = [
            SystemMessage(content=self.prompts.WEALTH_IDEA_SYSTEM),
            HumanMessage(
                content=self.prompts.generate_ideas_from_waste(items_text))
        ]

        try:
            # ✅ Use wrapper class since Gemini does not return List[T] directly
            structured_llm = self.llm.with_structured_output(
                WealthIdeasResponse)
            response = await structured_llm.ainvoke(messages)

            # ✅ Ensure we only return up to 2 most relevant ideas
            top_ideas = response.ideas[:2]

            print(f"✅ Ideas generated successfully: {len(top_ideas)} returned")
            return {"wealth_ideas": top_ideas}

        except Exception as e:
            print("❌ Failed to generate ideas:", e)
            return {"wealth_ideas": []}

    async def run(self, query: str) -> WasteQueryState:
        """
        Entry point for workflow:
        - General Q&A uses Gemini directly
        - Deeper queries run the full 3-step LangGraph pipeline

        Args:
            query: User input

        Returns:
            WasteQueryState: Structured result
        """
        print("🚀 Received query:", query)

        # 🤖 Handle general question directly
        if any(q in query.lower() for q in ["what", "how", "why", "when", "who"]) or len(query.split()) <= 6:
            print("💬 General question detected, responding directly...")

            messages = [
                SystemMessage(
                    content="You are a recycling and waste management expert. Answer clearly and concisely."),
                HumanMessage(content=query)
            ]

            try:
                response = await self.llm.ainvoke(messages)
                return WasteQueryState(
                    query=query,
                    quick_answer=response.content,
                    extracted_waste_items=[],
                    items_info=[],
                    wealth_ideas=[]
                )
            except Exception as e:
                print("⚠️ Gemini failed to answer:", e)
                return WasteQueryState(query=query, quick_answer="Sorry, I couldn't answer that right now.")

        # 🧠 Deeper query: run full pipeline
        print("⚙️ Running full structured pipeline...")
        initial_state = WasteQueryState(query=query)
        final_state = await self.workflow.ainvoke(initial_state)
        return WasteQueryState(**final_state)
