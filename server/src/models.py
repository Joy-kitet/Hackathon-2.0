from typing import List, Optional
from pydantic import BaseModel


class WasteItemInfo(BaseModel):
    """
    Represents structured information about a single waste item.
    This helps users understand how to handle different types of waste.
    """
    name: str  # e.g., "banana peel"
    category: str  # e.g., "organic", "plastic", "electronic"
    recyclability: str  # e.g., "compostable", "recyclable", "non-recyclable"
    # e.g., "Attracts pests", "Toxic fumes when burned"
    health_risk: Optional[str] = None
    reuse_ideas: List[str] = []  # e.g., ["Fertilizer", "Animal feed"]


class WealthIdea(BaseModel):
    """
    A practical project that can turn waste into income or value.
    """
    title: str  # e.g., "Compost Production from Kitchen Waste"
    description: str  # Short explanation of what the idea is
    required_materials: List[str]  # What someone needs to implement it
    estimated_value: Optional[str] = None  # e.g., "Earn up to Ksh 3,000/month"


class WealthIdeasResponse(BaseModel):
    """
    Used to wrap the list of waste-to-wealth ideas when requesting
    structured output from Gemini/LLM.

    Gemini cannot return List[Model] directly — so we wrap it here.
    """
    ideas: List[WealthIdea]


class WasteQueryState(BaseModel):
    """
    Full structured output from the AI workflow.
    This is returned from the /api/analyze endpoint.
    """
    query: str  # The original user input
    extracted_waste_items: List[str] = []  # Waste items AI found in content
    items_info: List[WasteItemInfo] = []  # AI-generated structured analysis
    wealth_ideas: List[WealthIdea] = []  # Waste-to-wealth ideas
    analysis: Optional[str] = None  # A plain-language summary or advice
    quick_answer: Optional[str] = None  # For direct responses
