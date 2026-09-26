import os
import warnings
import logging
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

logger = logging.getLogger(__name__)

# Pre-load environment files into process environment
load_dotenv("apps/api/.env")
load_dotenv(".env")
load_dotenv("apps/web/.env.local")


def _resolve_supabase_secret_key() -> str:
    """
    Resolves the dedicated server-side secret key for Supabase admin/backend access.
    
    Security rules:
    1. NEVER fallback to NEXT_PUBLIC_* variables (e.g. anon key or publishable key).
    2. Supports SUPABASE_SERVICE_ROLE_KEY only as an explicitly named legacy fallback with a warning.
    3. If SUPABASE_SECRET_KEY is missing in production, fails explicitly with a clear configuration error.
    """
    secret = (os.getenv("SUPABASE_SECRET_KEY") or "").strip()
    if secret:
        return secret

    legacy_key = (os.getenv("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
    if legacy_key:
        warnings.warn(
            "Using legacy SUPABASE_SERVICE_ROLE_KEY as fallback for SUPABASE_SECRET_KEY. "
            "Please migrate to SUPABASE_SECRET_KEY in your server environment variables.",
            UserWarning,
            stacklevel=2,
        )
        return legacy_key

    # Check whether running in production
    env = (os.getenv("ENVIRONMENT") or "development").strip().lower()
    is_render = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))
    if env == "production" or is_render:
        raise RuntimeError(
            "Production configuration error: SUPABASE_SECRET_KEY is missing. "
            "A dedicated server-side secret key is required for production. "
            "Do NOT use NEXT_PUBLIC_* variables for server-side operations."
        )

    return ""


class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandForge API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment Configuration
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or "https://oibdfowksbcvudgcmytt.supabase.co"
    SUPABASE_SECRET_KEY: str = _resolve_supabase_secret_key()
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
