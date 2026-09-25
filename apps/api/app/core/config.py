import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandForge API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY", "your-supabase-secret-key")
    
    # AI Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
