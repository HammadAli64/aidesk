from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True)
    url = Column(String, unique=True, nullable=False, index=True)
    source = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    keywords = Column(String, nullable=True)  # Comma-separated keywords
    category = Column(String, nullable=True, index=True)
    published_at = Column(DateTime, nullable=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

