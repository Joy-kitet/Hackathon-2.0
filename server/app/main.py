from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from src.workflow import Workflow
from src.models import WasteQueryState

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Waste Management & Recycling AI API",
    description="Backend API for analyzing waste and generating wealth ideas using Gemini + LangGraph",
    version="1.0.0"
)

# Allow frontend to access this API (CORS setup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the workflow
workflow = Workflow()

# Define request body model


class QueryRequest(BaseModel):
    query: str


@app.post("/api/analyze", response_model=WasteQueryState)
async def analyze_query(request: QueryRequest):
    """
    Analyze a waste-related query from the user.

    - If the query is a general question (e.g., "What is waste?"),
      return a short answer.
    - Otherwise, return structured data: extracted items, analysis, ideas.
    """

    result = await workflow.run(request.query)

    # If it's a quick general answer, return only that field
    if result.quick_answer:
        return WasteQueryState(
            query=result.query,
            quick_answer=result.quick_answer,
            extracted_waste_items=[],
            items_info=[],
            wealth_ideas=[]
        )

    # Otherwise, return the full AI-processed data
    return result
