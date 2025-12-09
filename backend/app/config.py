import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # API Keys
    NEWSDATA_KEY: str = os.getenv("NEWSDATA_KEY", "")
    GNEWS_KEY: str = os.getenv("GNEWS_KEY", "")
    MEDIASTACK_KEY: str = os.getenv("MEDIASTACK_KEY", "")
    SERPER_KEY: str = os.getenv("SERPER_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aidesk.db")
    
    # OpenAI Settings
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_MAX_TOKENS: int = int(os.getenv("OPENAI_MAX_TOKENS", "300"))
    
    # Scheduler Settings
    FETCH_INTERVAL_MINUTES: int = int(os.getenv("FETCH_INTERVAL_MINUTES", "30"))


settings = Settings()

