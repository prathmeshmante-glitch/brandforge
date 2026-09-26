import os
import logging
from apps.api.app.core.config import settings
from typing import Optional, Any

logger = logging.getLogger(__name__)


def get_supabase_client() -> Optional[Any]:
    """
    Retrieve Supabase client instance safely for server-side persistence.
    Requires both SUPABASE_URL and SUPABASE_SECRET_KEY to be set.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SECRET_KEY:
        return None
    try:
        from supabase import create_client
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}")
        return None
