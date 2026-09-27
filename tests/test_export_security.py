import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
os.environ["AI_PROVIDER"] = "mock"

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


class TestExportSecurityAndSharing(unittest.TestCase):
    def setUp(self):
        self.headers_user1 = {"Authorization": "Bearer test-token-user1"}
        self.headers_user2 = {"Authorization": "Bearer test-token-user2"}

        # User 1 creates a project
        res = client.post(
            "/api/projects",
            json={
                "name": "SecureBrand Studio",
                "idea": "An intelligent studio for autonomous brands",
                "constraints": {"industry": "developer tools", "tone": "sharp"}
            },
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 201)
        self.project_id = res.json()["id"]

        # Run workflow to populate brand kit
        res_wf = client.post(f"/api/projects/{self.project_id}/workflow/start", headers=self.headers_user1)
        self.assertIn(res_wf.status_code, (200, 202))

    def test_export_pdf_creation_and_authorized_download(self):
        # User 1 creates PDF export
        res_exp = client.post(
            f"/api/projects/{self.project_id}/export",
            json={"format": "pdf"},
            headers=self.headers_user1
        )
        self.assertEqual(res_exp.status_code, 200)
        export_data = res_exp.json()
        export_id = export_data["export_id"]
        self.assertEqual(export_data["format"], "pdf")

        # 1. User 1 (owner) downloads export -> 200 OK and real PDF content
        res_down = client.get(f"/api/exports/{export_id}/download", headers=self.headers_user1)
        self.assertEqual(res_down.status_code, 200)
        self.assertEqual(res_down.headers["content-type"], "application/pdf")
        self.assertTrue(res_down.content.startswith(b"%PDF-"), "Export content must be a valid PDF starting with %PDF-")

        # 2. User 2 (unauthorized user) attempts to download User 1's export -> 403 Forbidden
        res_user2 = client.get(f"/api/exports/{export_id}/download", headers=self.headers_user2)
        self.assertEqual(res_user2.status_code, 403)
        self.assertIn("authorization", res_user2.json()["detail"].lower())

        # 3. Unauthenticated request to download export -> 401 Unauthorized
        res_anon = client.get(f"/api/exports/{export_id}/download")
        self.assertEqual(res_anon.status_code, 401)

    def test_public_brand_kit_sharing(self):
        # User 1 creates a public share link
        res_share = client.post(f"/api/projects/{self.project_id}/share", headers=self.headers_user1)
        self.assertEqual(res_share.status_code, 201)
        share_data = res_share.json()
        share_token = share_data["share_token"]
        self.assertTrue(len(share_token) > 16)
        self.assertIn("share_url", share_data)

        # Public visitor without any auth token can view the shared brand kit
        res_pub = client.get(f"/api/share/{share_token}")
        self.assertEqual(res_pub.status_code, 200)
        pub_data = res_pub.json()
        self.assertEqual(pub_data["share_token"], share_token)
        self.assertIn("snapshot", pub_data)
        self.assertNotIn("user_id", pub_data["snapshot"])  # No internal user leak

        # User 1 revokes the share link
        res_revoke = client.delete(f"/api/projects/{self.project_id}/share/{share_token}", headers=self.headers_user1)
        self.assertEqual(res_revoke.status_code, 200)

        # Public visitor can no longer view revoked link -> 404
        res_revoked_get = client.get(f"/api/share/{share_token}")
        self.assertEqual(res_revoked_get.status_code, 404)


if __name__ == "__main__":
    unittest.main()
