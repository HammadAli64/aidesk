import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.news_fetcher import NewsFetcher
from app.summarizer import Summarizer
from app.database import SessionLocal
from app.models import NewsArticle
from sqlalchemy import and_
from datetime import datetime

scheduler = AsyncIOScheduler()
fetcher = NewsFetcher()
summarizer = Summarizer()


async def fetch_and_process_news():
    """Fetch news from all APIs, summarize, and store in database"""
    print(f"[{datetime.now()}] Starting scheduled news fetch...")
    
    try:
        # Fetch news from all sources
        articles = await fetcher.fetch_all()
        print(f"Fetched {len(articles)} articles")

        db = SessionLocal()
        try:
            processed = 0
            for article in articles:
                # Check if article already exists
                existing = db.query(NewsArticle).filter(
                    NewsArticle.url == article.get("url", "")
                ).first()

                if existing:
                    continue  # Skip duplicates

                # Summarize article
                summary_data = await summarizer.summarize_article(
                    article.get("title", ""),
                    article.get("content", ""),
                )

                # Create new article record
                news_article = NewsArticle(
                    title=article.get("title", ""),
                    content=article.get("content", ""),
                    url=article.get("url", ""),
                    source=article.get("source", "Unknown"),
                    summary=summary_data.get("summary", ""),
                    keywords=summary_data.get("keywords", ""),
                    category=summary_data.get("category", "AI"),
                    published_at=article.get("published_at"),
                )

                db.add(news_article)
                processed += 1

            db.commit()
            print(f"Processed and stored {processed} new articles")
        except Exception as e:
            db.rollback()
            print(f"Error processing articles: {e}")
        finally:
            db.close()

    except Exception as e:
        print(f"Error in scheduled fetch: {e}")


def start_scheduler():
    """Start the scheduler to fetch news every 30 minutes"""
    scheduler.add_job(
        fetch_and_process_news,
        "interval",
        minutes=30,
        id="fetch_news",
        replace_existing=True,
    )
    scheduler.start()
    print("Scheduler started: fetching news every 30 minutes")


def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()

