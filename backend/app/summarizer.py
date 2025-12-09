import os
import json
import asyncio
from typing import Dict, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class Summarizer:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=api_key)

    def _summarize_sync(self, title: str, content: str) -> Dict[str, str]:
        """
        Summarize article, extract keywords, and classify category.
        Returns: {summary, keywords, category}
        """
        if not content or len(content.strip()) < 50:
            content = title  # Use title if content is too short

        prompt = f"""Summarize the following news article into 2-3 lines.
Then extract 3-6 keywords.
Then classify into one category: AI, LLMs, Robotics, Tools, Research, Innovation, Industry.

Article Title: {title}
Article Content: {content[:2000]}

Return a JSON object with the following structure:
{{
    "summary": "2-3 line summary here",
    "keywords": "keyword1, keyword2, keyword3",
    "category": "one of: AI, LLMs, Robotics, Tools, Research, Innovation, Industry"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that summarizes news articles and extracts key information. Always return valid JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=300,
            )

            content = response.choices[0].message.content.strip()

            # Try to extract JSON from response
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            result = json.loads(content)

            return {
                "summary": result.get("summary", ""),
                "keywords": result.get("keywords", ""),
                "category": result.get("category", "AI"),
            }
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}, content: {content}")
            # Fallback
            return {
                "summary": f"{title}: {content[:150]}...",
                "keywords": "AI, technology",
                "category": "AI",
            }
        except Exception as e:
            print(f"Error summarizing article: {e}")
            return {
                "summary": f"{title}: {content[:150] if 'content' in locals() else title}...",
                "keywords": "AI, technology",
                "category": "AI",
            }

    async def summarize_article(self, title: str, content: str) -> Dict[str, str]:
        """Async wrapper for summarize_article"""
        return await asyncio.to_thread(self._summarize_sync, title, content)

