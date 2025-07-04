class WastePrompts:
    """
    Collection of prompts used by the AI to extract and analyze waste-related data.
    """

    # 1. Prompt: Extract specific waste items from content
    WASTE_EXTRACTION_SYSTEM = """
    You are an environmental science assistant.
    Your job is to extract specific waste types or items from content.
    Focus only on clearly identifiable waste (e.g., plastic bottle, banana peel).
    Do not include vague terms like "garbage" or "trash".
    """

    @staticmethod
    def waste_extraction_user(query: str, content: str) -> str:
        """
        Prompt asking the AI to extract a list of waste items relevant to the query.

        Updated:
        - Limit results to **only 1–2** most relevant waste items based on the query.
        - Enforce minimal output to reduce token usage and increase focus.
        """
        return f"""Query: {query}

Content:
{content}

Instructions:
- Extract ONLY 1 to 2 of the most relevant and clearly identifiable waste items related to the query.
- Do NOT include vague terms like "waste", "garbage", or "pollution".
- Each item should be listed on a new line.
- Do NOT add any explanations or extra text.

Example format:
Plastic bottle
Used battery
"""

    # 2. Prompt: Analyze each waste item for recyclability and health/environment info
    WASTE_ANALYSIS_SYSTEM = """
    You are a professional waste recycling expert.
    For each waste item, provide structured information:
    - category (organic, plastic, electronic, etc.)
    - recyclability (recyclable, compostable, non-recyclable)
    - health risk (if any)
    - reuse ideas (up to 3 practical ideas)
    """

    @staticmethod
    def analyze_waste_item(item: str, content: str) -> str:
        """
        Prompt asking the AI to analyze a specific waste item.
        """
        return f"""Waste Item: {item}

Based on the following content, analyze the item:
{content[:2500]}

Return a JSON structure with:
- category
- recyclability
- health_risk (can be null)
- reuse_ideas (list of 2-3 reuse ideas)

Only return valid JSON.
"""

    # 3. Prompt: Generate money-making ideas from waste
    WEALTH_IDEA_SYSTEM = """
    You are a social innovation expert helping people turn waste into money.
    Suggest practical waste-to-wealth ideas based on what waste types are available.
    Ideas should be realistic for people in rural or urban Kenya.
    """

    @staticmethod
    def generate_ideas_from_waste(waste_info: str) -> str:
        """
        Prompt asking the AI to suggest waste-to-wealth ideas.
        """
        return f"""Waste Information:
{waste_info}

Instructions:
- Suggest exactly 2 **most relevant** and **practical** income-generating ideas.
- Each idea should include:
  - title
  - description
  - required materials
  - estimated value (optional)
- Only return a valid JSON list with 2 items.

Example format:
[
  {{
    "title": "Compost Business",
    "description": "Turn organic waste into compost and sell to farmers.",
    "required_materials": ["banana peels", "drum", "shovel"],
    "estimated_value": "Ksh 3,000 per month"
  }},
  ...
]
"""
