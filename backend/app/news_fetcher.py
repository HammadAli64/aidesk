import httpx
import os
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


class NewsFetcher:
    def __init__(self):
        self.newsdata_key = os.getenv("NEWSDATA_KEY")
        self.gnews_key = os.getenv("GNEWS_KEY")
        self.mediastack_key = os.getenv("MEDIASTACK_KEY")
        self.serper_key = os.getenv("SERPER_KEY")

    async def fetch_newsdata(self, query: str = "AI OR LLM OR machine learning") -> List[Dict]:
        """Fetch news from NewsData.io API"""
        if not self.newsdata_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://newsdata.io/api/1/news",
                    params={
                        "apikey": self.newsdata_key,
                        "q": query,
                        "language": "en",
                        "category": "technology",
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    articles = []
                    for item in data.get("results", []):
                        articles.append({
                            "title": item.get("title", ""),
                            "content": item.get("content", "") or item.get("description", ""),
                            "url": item.get("link", ""),
                            "source": "NewsData.io",
                            "published_at": self._parse_date(item.get("pubDate")),
                        })
                    return articles
        except Exception as e:
            print(f"Error fetching from NewsData.io: {e}")
        return []

    async def fetch_gnews(self, query: str = "AI OR LLM OR machine learning") -> List[Dict]:
        """Fetch news from GNews API"""
        if not self.gnews_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://gnews.io/api/v4/search",
                    params={
                        "q": query,
                        "token": self.gnews_key,
                        "lang": "en",
                        "max": 10,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    articles = []
                    for item in data.get("articles", []):
                        articles.append({
                            "title": item.get("title", ""),
                            "content": item.get("content", "") or item.get("description", ""),
                            "url": item.get("url", ""),
                            "source": "GNews",
                            "published_at": self._parse_date(item.get("publishedAt")),
                        })
                    return articles
        except Exception as e:
            print(f"Error fetching from GNews: {e}")
        return []

    async def fetch_mediastack(self, query: str = "AI,LLM,machine learning") -> List[Dict]:
        """Fetch news from Mediastack API"""
        if not self.mediastack_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "http://api.mediastack.com/v1/news",
                    params={
                        "access_key": self.mediastack_key,
                        "keywords": query,
                        "languages": "en",
                        "categories": "technology",
                        "limit": 10,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    articles = []
                    for item in data.get("data", []):
                        articles.append({
                            "title": item.get("title", ""),
                            "content": item.get("description", ""),
                            "url": item.get("url", ""),
                            "source": "Mediastack",
                            "published_at": self._parse_date(item.get("published_at")),
                        })
                    return articles
        except Exception as e:
            print(f"Error fetching from Mediastack: {e}")
        return []

    async def fetch_serper(self, query: str = "AI LLM machine learning latest news") -> List[Dict]:
        """Fetch news from Serper API"""
        if not self.serper_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    "https://google.serper.dev/news",
                    json={"q": query},
                    headers={"X-API-KEY": self.serper_key},
                )
                if response.status_code == 200:
                    data = response.json()
                    articles = []
                    for item in data.get("news", []):
                        articles.append({
                            "title": item.get("title", ""),
                            "content": item.get("snippet", ""),
                            "url": item.get("link", ""),
                            "source": "Serper",
                            "published_at": self._parse_date(item.get("date")),
                        })
                    return articles
        except Exception as e:
            print(f"Error fetching from Serper: {e}")
        return []

    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """Parse various date formats to datetime"""
        if not date_str:
            return None

        formats = [
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d",
            "%a, %d %b %Y %H:%M:%S %Z",
        ]

        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except:
                continue

        return None

    def deduplicate_articles(self, articles: List[Dict]) -> List[Dict]:
        """Remove duplicate articles based on URL"""
        seen_urls = set()
        unique_articles = []

        for article in articles:
            url = article.get("url", "").strip()
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_articles.append(article)

        return unique_articles

    async def fetch_all(self) -> List[Dict]:
        """Fetch from all APIs and merge results"""
        query = "AI OR LLM OR machine learning OR artificial intelligence OR GPT OR OpenAI"
        
        results = await asyncio.gather(
            self.fetch_newsdata(query),
            self.fetch_gnews(query),
            self.fetch_mediastack(query),
            self.fetch_serper(query),
            return_exceptions=True,
        )

        all_articles = []
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
            elif isinstance(result, Exception):
                print(f"Error in fetch: {result}")

        # Deduplicate
        unique_articles = self.deduplicate_articles(all_articles)
        return unique_articles

