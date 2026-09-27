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


def _resolve_cors_origins() -> List[str]:
    """
    Computes strict environment-specific CORS origins.
    Under production, wildcard '*' is strictly forbidden.
    """
    env = (os.getenv("ENVIRONMENT") or "development").strip().lower()
    is_render = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))
    custom_origins = [o.strip() for o in (os.getenv("ALLOWED_ORIGINS") or "").split(",") if o.strip()]
    production_origins = [
        "https://brandforge-jade.vercel.app",
        "https://brandforge.ai",
        "https://www.brandforge.ai",
    ]
    if env == "production" or is_render:
        # In production, NEVER allow "*"
        return list(dict.fromkeys(production_origins + custom_origins))

    dev_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    return list(dict.fromkeys(dev_origins + production_origins + custom_origins))


def _validate_production_ai_provider():
    """
    Validates that a real, functional AI provider and its credentials exist in production.
    Mock AI mode is strictly prohibited in production.
    """
    env = (os.getenv("ENVIRONMENT") or "development").strip().lower()
    is_render = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))
    provider = (os.getenv("AI_PROVIDER") or "gemini").strip().lower()

    if env == "production" or is_render:
        if provider == "mock":
            raise RuntimeError(
                "Production configuration error: MockAIProvider is disallowed in production. "
                "Configure a real AI provider (gemini, openai, anthropic)."
            )
        if provider == "openai":
            if not (os.getenv("OPENAI_API_KEY") or "").strip():
                raise RuntimeError("Production configuration error: OPENAI_API_KEY is required when AI_PROVIDER=openai.")
        elif provider == "gemini":
            if not (os.getenv("GEMINI_API_KEY") or "").strip():
                raise RuntimeError("Production configuration error: GEMINI_API_KEY is required when AI_PROVIDER=gemini.")
        elif provider == "anthropic":
            if not (os.getenv("ANTHROPIC_API_KEY") or "").strip():
                raise RuntimeError("Production configuration error: ANTHROPIC_API_KEY is required when AI_PROVIDER=anthropic.")


class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandForge API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment Configuration
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or "https://oibdfowksbcvudgcmytt.supabase.co"
    SUPABASE_SECRET_KEY: str = _resolve_supabase_secret_key()
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # AI Keys & Provider Selection
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    AI_MODEL: str = os.getenv("AI_MODEL", "")
    
    # CORS
    CORS_ORIGINS: List[str] = _resolve_cors_origins()
    
    class Config:
        env_file = ("apps/api/.env", ".env", "apps/web/.env.local")
        extra = "ignore"


# Validate on startup
_validate_production_ai_provider()

settings = Settings()

