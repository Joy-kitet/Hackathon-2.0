import os
from dotenv import load_dotenv
from firecrawl import FirecrawlApp, ScrapeOptions

# Load FIRECRAWL_API_KEY from .env file
load_dotenv()


class FirecrawlService:
    """
    Handles search and scraping functionality using the Firecrawl API.
    Useful for finding real-world waste management content from the web.
    """

    def __init__(self):
        """
        Initialize the Firecrawl app with your API key.
        """
        api_key = os.getenv("FIRECRAWL_API_KEY")

        if not api_key:
            raise ValueError("Missing FIRECRAWL_API_KEY in .env file")

        # Initialize Firecrawl SDK
        self.app = FirecrawlApp(api_key=api_key)

    async def search_articles(self, query: str, num_results: int = 3):
        """
        Perform a web search using Firecrawl based on the user's query.

        Args:
            query (str): Search term, e.g., "how to recycle banana peels"
            num_results (int): How many articles to retrieve (default = 3)

        Returns:
            List of search results (FirecrawlSearchResult.data)
        """
        try:
            result = self.app.search(
                query=query,
                limit=num_results,
                scrape_options=ScrapeOptions(
                    formats=["markdown"]  # So we get clean, simple text
                )
            )
            return result.data
        except Exception as e:
            print("🔴 Firecrawl search error:", e)
            return []

    async def scrape_page(self, url: str):
        """
        Scrape the main content of a specific webpage.

        Args:
            url (str): The URL to scrape

        Returns:
            Markdown content or None
        """
        try:
            result = self.app.scrape_url(
                url,
                formats=["markdown"]
            )
            return result.markdown if result else None
        except Exception as e:
            print("🔴 Firecrawl scrape error:", e)
            return None
