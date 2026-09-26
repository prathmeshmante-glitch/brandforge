import unittest
import time
import os
import sys
import jwt

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from apps.api.main import app
from apps.api.app.core.config import settings

client = TestClient(app)


class TestAuthSecurity(unittest.TestCase):
    def setUp(self):
        self.secret = "test-secret-key-32-bytes-minimum-length-for-hs256"
        self.original_secret = settings.SUPABASE_JWT_SECRET
        self.original_env = settings.ENVIRONMENT
        settings.SUPABASE_JWT_SECRET = self.secret

    def tearDown(self):
        settings.SUPABASE_JWT_SECRET = self.original_secret
        settings.ENVIRONMENT = self.original_env

    def test_missing_authorization_header(self):
        res = client.get("/api/projects")
        self.assertEqual(res.status_code, 401)
        self.assertIn("Authorization header", res.json()["detail"])

    def test_empty_bearer_token(self):
        res = client.get("/api/projects", headers={"Authorization": "Bearer "})
        self.assertEqual(res.status_code, 401)
        self.assertIn("Empty Bearer token", res.json()["detail"])

    def test_arbitrary_unverified_token_rejected(self):
        # Even if not test token, arbitrary strings must be rejected
        res = client.get("/api/projects", headers={"Authorization": "Bearer completely-bogus-token-xyz"})
        self.assertEqual(res.status_code, 401)
        self.assertIn("Invalid or untrusted authentication token", res.json()["detail"])

    def test_expired_jwt_rejected(self):
        # Create an expired JWT
        now = int(time.time())
        expired_payload = {
            "sub": "user-uuid-12345",
            "email": "expired@example.com",
            "role": "authenticated",
            "aud": "authenticated",
            "exp": now - 3600,  # 1 hour ago
            "iat": now - 7200,
        }
        expired_token = jwt.encode(expired_payload, self.secret, algorithm="HS256")
        res = client.get("/api/projects", headers={"Authorization": f"Bearer {expired_token}"})
        self.assertEqual(res.status_code, 401)
        self.assertIn("expired", res.json()["detail"].lower())

    def test_tampered_signature_jwt_rejected(self):
        # Create token signed with a different secret
        payload = {
            "sub": "user-uuid-12345",
            "email": "hacker@example.com",
            "role": "authenticated",
            "aud": "authenticated",
            "exp": int(time.time()) + 3600,
        }
        tampered_token = jwt.encode(payload, "wrong-secret-key-1234567890123456", algorithm="HS256")
        res = client.get("/api/projects", headers={"Authorization": f"Bearer {tampered_token}"})
        self.assertEqual(res.status_code, 401)
        self.assertIn("Invalid or untrusted authentication token", res.json()["detail"])

    def test_valid_jwt_authenticates_user(self):
        # Create a valid signed token
        user_uuid = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
        payload = {
            "sub": user_uuid,
            "email": "founder@brandforge.ai",
            "role": "authenticated",
            "aud": "authenticated",
            "exp": int(time.time()) + 3600,
            "iat": int(time.time()),
        }
        valid_token = jwt.encode(payload, self.secret, algorithm="HS256")

        # GET /api/projects with valid JWT
        res = client.get("/api/projects", headers={"Authorization": f"Bearer {valid_token}"})
        self.assertEqual(res.status_code, 200)

        # POST /api/projects with valid JWT creates project owned by user_uuid
        proj_res = client.post(
            "/api/projects",
            json={"name": "Verified Studio", "idea": "An AI branding studio for venture builders"},
            headers={"Authorization": f"Bearer {valid_token}"},
        )
        self.assertEqual(proj_res.status_code, 201)
        self.assertEqual(proj_res.json()["user_id"], user_uuid)

    def test_test_tokens_blocked_when_not_in_test_environment(self):
        from apps.api.app.core.security import get_current_user
        from apps.api.app.core.exceptions import UnauthorizedException
        from unittest.mock import patch

        # Patch is_test_environment to return False (simulating production)
        with patch("apps.api.app.core.security.is_test_environment", return_value=False):
            with self.assertRaises(UnauthorizedException) as ctx:
                get_current_user("Bearer test-token-user1")
            self.assertIn("disallowed outside test environment", str(ctx.exception.detail))


if __name__ == "__main__":
    unittest.main()
