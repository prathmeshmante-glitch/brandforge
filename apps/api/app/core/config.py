import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

# Pre-load environment files into process environment
load_dotenv("apps/api/.env")
load_dotenv(".env")
load_dotenv("apps/web/.env.local")


class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandForge API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment Configuration
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or "https://oibdfowksbcvudgcmytt.supabase.co"
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY", "your-supabase-secret-key")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # AI Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "*"]
    
    class Config:
        env_file = ("apps/api/.env", ".env", "apps/web/.env.local")
        extra = "ignore"


settings = Settings()
