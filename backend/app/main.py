from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from app.database import get_db, init_db
from app.models import NewsArticle
from app.news_fetcher import NewsFetcher
from app.summarizer import Summarizer
from app.cron_job import start_scheduler, fetch_and_process_news
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="AI Desk API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aidesk2-52rl.vercel.app/", "https://aidesk2-52rl.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    start_scheduler()
    print("FastAPI server started and scheduler initialized")


@app.on_event("shutdown")
async def shutdown_event():
    from app.cron_job import stop_scheduler
    stop_scheduler()


# Pydantic models
class NewsArticleResponse(BaseModel):
    id: int
    title: str
    content: Optional[str]
    url: str
    source: str
    summary: Optional[str]
    keywords: Optional[str]
    category: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# Routes
@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now()}


@app.get("/news/latest", response_model=List[NewsArticleResponse])
async def get_latest_news(
    limit: int = 50,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get latest news articles with optional filtering"""
    query = db.query(NewsArticle)

    if category:
        query = query.filter(NewsArticle.category == category)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (NewsArticle.title.ilike(search_term))
            | (NewsArticle.keywords.ilike(search_term))
        )

    articles = query.order_by(desc(NewsArticle.published_at)).limit(limit).all()
    return articles


@app.get("/news/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    categories = (
        db.query(NewsArticle.category)
        .distinct()
        .filter(NewsArticle.category.isnot(None))
        .all()
    )
    return {"categories": [cat[0] for cat in categories]}


@app.post("/news/fetch")
async def fetch_news():
    """Manually trigger news fetch"""
    try:
        await fetch_and_process_news()
        return {"status": "success", "message": "News fetched and processed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/news/{article_id}", response_model=NewsArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a specific article by ID"""
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

