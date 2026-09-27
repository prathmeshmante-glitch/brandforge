import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
os.environ["AI_PROVIDER"] = "mock"

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


class TestConstraintsPersistence(unittest.TestCase):
    def setUp(self):
        self.headers = {"Authorization": "Bearer test-token-user-constraints"}

    def test_create_and_retrieve_project_constraints(self):
        constraints_payload = {
            "target_audience": "Solo indie founders & builders",
            "category": "Developer Tools & Productivity",
            "tags": ["ai", "branding", "bootstrapped"],
            "budget": "zero",
            "tone_preference": "minimalist neo-editorial"
        }

        # 1. Create project with constraints
        res = client.post(
            "/api/projects",
            json={
                "name": "Constraints Test Project",
                "idea": "An intelligent studio enforcing strict project constraints",
                "constraints": constraints_payload
            },
            headers=self.headers
        )
        self.assertEqual(res.status_code, 201)
        created_data = res.json()
        project_id = created_data["id"]
        self.assertEqual(created_data["constraints"], constraints_payload)

        # 2. Get project returns the exact constraints
        res_get = client.get(f"/api/projects/{project_id}", headers=self.headers)
        self.assertEqual(res_get.status_code, 200)
        get_data = res_get.json()
        self.assertEqual(get_data["constraints"], constraints_payload)

        # 3. List projects returns constraints
        res_list = client.get("/api/projects", headers=self.headers)
        self.assertEqual(res_list.status_code, 200)
        found = next((p for p in res_list.json() if p["id"] == project_id), None)
        self.assertIsNotNone(found)
        self.assertEqual(found["constraints"], constraints_payload)

        # 4. Start workflow and verify constraints are preserved across runs
        res_wf = client.post(f"/api/projects/{project_id}/workflow/start", headers=self.headers)
        self.assertIn(res_wf.status_code, (200, 202))

        # Check project after workflow start
        res_after = client.get(f"/api/projects/{project_id}", headers=self.headers)
        self.assertEqual(res_after.json()["constraints"], constraints_payload)

        # 5. Revise workflow and verify constraints are retained
        res_rev = client.post(
            f"/api/projects/{project_id}/revise",
            json={"target_stage": "naming", "feedback": "Make it shorter"},
            headers=self.headers
        )
        self.assertIn(res_rev.status_code, (200, 202))

        res_final = client.get(f"/api/projects/{project_id}", headers=self.headers)
        self.assertEqual(res_final.json()["constraints"], constraints_payload)


if __name__ == "__main__":
    unittest.main()
