import logging
import jwt
from jwt import PyJWKClient, ExpiredSignatureError, InvalidTokenError
from fastapi import Header
from typing import Optional, Dict, Any
from apps.api.app.core.config import settings
from apps.api.app.core.exceptions import UnauthorizedException
from apps.api.app.db.client import get_supabase_client

import sys

logger = logging.getLogger("brandforge.security")

def is_test_environment() -> bool:
    return (
        settings.ENVIRONMENT == "test"
        or "pytest" in sys.modules
        or any("unittest" in arg or "pytest" in arg for arg in sys.argv)
    )

# Cache JWKS client to avoid recreating on every request
_jwks_client: Optional[PyJWKClient] = None

def _get_jwks_client() -> Optional[PyJWKClient]:
    global _jwks_client
    if _jwks_client is None and settings.SUPABASE_URL and "supabase.co" in settings.SUPABASE_URL:
        jwks_url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"
        try:
            _jwks_client = PyJWKClient(jwks_url, cache_jwk_set=True, lifespan=3600)
        except Exception as e:
            logger.warning("Could not initialize JWKS client for %s: %s", jwks_url, e)
    return _jwks_client


def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    FastAPI Security Dependency that extracts and cryptographically validates
    the user identity from the HTTP Bearer Authorization token.

    Supports:
    1. Asymmetric JWKS verification (RS256/ES256) via Supabase .well-known/jwks.json
    2. Supabase Auth API verification (supabase.auth.get_user)
    3. Shared secret HMAC verification (HS256) when SUPABASE_JWT_SECRET is configured
    4. Isolated test tokens strictly when in test environment

    Never accepts arbitrary bearer strings or unverified tokens.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedException("Missing or invalid Authorization header format. Expected 'Bearer <token>'")
    
    token = authorization.split("Bearer ")[1].strip()
    if not token:
        raise UnauthorizedException("Empty Bearer token provided")

    # Strictly isolated test tokens for automated test suite only
    if is_test_environment():
        if token.startswith("test-token-"):
            user_id = token.replace("test-token-", "")
            return {"id": user_id, "email": f"{user_id}@example.com", "role": "authenticated"}
        elif token == "valid-mock-token":
            return {"id": "user-test-123", "email": "founder@example.com", "role": "authenticated"}

    # In development and production, test tokens are strictly disallowed
    if token.startswith("test-token-") or token == "valid-mock-token":
        raise UnauthorizedException("Test tokens are disallowed outside test environment")

    # 1. Asymmetric JWKS verification (Supabase modern recommended approach)
    jwks = _get_jwks_client()
    if jwks:
        try:
            signing_key = jwks.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256", "ES256"],
                audience="authenticated",
            )
            user_id = payload.get("sub")
            if user_id:
                return {
                    "id": user_id,
                    "email": payload.get("email"),
                    "role": payload.get("role", "authenticated"),
                    "user_metadata": payload.get("user_metadata", {}),
                }
        except ExpiredSignatureError:
            raise UnauthorizedException("Authentication token has expired. Please sign in again.")
        except Exception as jwks_err:
            logger.debug("JWKS verification not applicable or failed: %s", jwks_err)

    # 2. Shared secret HMAC verification (if SUPABASE_JWT_SECRET configured)
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
            user_id = payload.get("sub")
            if user_id:
                return {
                    "id": user_id,
                    "email": payload.get("email"),
                    "role": payload.get("role", "authenticated"),
                    "user_metadata": payload.get("user_metadata", {}),
                }
        except ExpiredSignatureError:
            raise UnauthorizedException("Authentication token has expired. Please sign in again.")
        except InvalidTokenError as ite:
            logger.debug("HMAC token decode error: %s", ite)

    # 3. Direct Supabase Auth server verification via supabase-py client
    client = get_supabase_client()
    if client:
        try:
            user_response = client.auth.get_user(token)
            if user_response and user_response.user:
                u = user_response.user
                return {
                    "id": str(u.id),
                    "email": u.email,
                    "role": getattr(u, "role", "authenticated"),
                    "user_metadata": getattr(u, "user_metadata", {}) or {},
                }
        except Exception as sb_err:
            logger.debug("Supabase client auth.get_user failed: %s", sb_err)

    # If all cryptographic verification attempts fail, reject with 401
    raise UnauthorizedException("Invalid or untrusted authentication token")

