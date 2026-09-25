import os
from apps.api.app.core.config import settings
from typing import Optional, Any


def get_supabase_client() -> Optional[Any]:
    """Retrieve Supabase client instance safely."""
    try:
        from supabase import create_client
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
    except (ImportError, Exception):
        return None
