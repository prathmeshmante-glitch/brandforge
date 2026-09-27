import time
import logging
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, Request, status
from apps.api.app.core.security import is_test_environment

logger = logging.getLogger("brandforge.ratelimit")

# In-memory timestamp buckets: ip_or_user_id -> list of float timestamps
_REQUEST_BUCKETS: Dict[str, List[float]] = defaultdict(list)


def rate_limiter(max_requests: int = 20, window_seconds: int = 60):
    """
    FastAPI dependency enforcing sliding window rate limits on sensitive/expensive endpoints.
    Returns HTTP 429 Too Many Requests if rate is exceeded.
    """
    def dependency(request: Request):
        if is_test_environment():
            return True

        # Identify client by user token if authenticated, or client IP
        auth_header = request.headers.get("Authorization", "")
        client_key = auth_header if auth_header else (request.client.host if request.client else "anonymous")
        endpoint_key = f"{client_key}:{request.url.path}"

        now = time.time()
        window_start = now - window_seconds

        # Prune old timestamps
        bucket = [t for t in _REQUEST_BUCKETS[endpoint_key] if t > window_start]
        _REQUEST_BUCKETS[endpoint_key] = bucket

        if len(bucket) >= max_requests:
            retry_after = int(window_seconds - (now - bucket[0])) + 1
            logger.warning(f"Rate limit exceeded for {endpoint_key}: {len(bucket)} requests in {window_seconds}s")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please wait {retry_after} seconds before retrying.",
                headers={"Retry-After": str(retry_after)}
            )

        _REQUEST_BUCKETS[endpoint_key].append(now)
        return True

    return dependency
