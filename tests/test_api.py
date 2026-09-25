import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


class TestBrandForgeAPI(unittest.TestCase):
    def setUp(self):
        self.headers_user1 = {"Authorization": "Bearer test-token-user1"}
        self.headers_user2 = {"Authorization": "Bearer test-token-user2"}

    def test_root_and_health(self):
        res = client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

        res_health = client.get("/health")
        self.assertEqual(res_health.status_code, 200)
        self.assertEqual(res_health.json()["status"], "healthy")

    def test_unauthorized_access(self):
        # Missing Authorization header
        res = client.get("/api/projects")
        self.assertEqual(res.status_code, 401)
        self.assertIn("Authorization header", res.json()["detail"])

    def test_project_creation_and_listing(self):
        # User 1 creates project
        payload = {
            "name": "TeamUp Hackathon Matcher",
            "idea": "An app that helps college students find hackathon teammates",
            "constraints": {"budget": "low"}
        }
        res = client.post("/api/projects", json=payload, headers=self.headers_user1)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["name"], payload["name"])
        self.assertEqual(data["user_id"], "user1")
        project_id = data["id"]

        # User 1 lists projects -> should see project
        res_list = client.get("/api/projects", headers=self.headers_user1)
        self.assertEqual(res_list.status_code, 200)
        projects = res_list.json()
        self.assertTrue(any(p["id"] == project_id for p in projects))

        # User 2 lists projects -> should NOT see User 1's project
        res_list_user2 = client.get("/api/projects", headers=self.headers_user2)
        self.assertEqual(res_list_user2.status_code, 200)
        self.assertFalse(any(p["id"] == project_id for p in res_list_user2.json()))

    def test_project_ownership_isolation(self):
        # User 1 creates project
        payload = {"name": "Private Project", "idea": "Super secret startup idea"}
        res = client.post("/api/projects", json=payload, headers=self.headers_user1)
        project_id = res.json()["id"]

        # User 2 attempts to GET User 1's project -> 403 Forbidden
        res_access = client.get(f"/api/projects/{project_id}", headers=self.headers_user2)
        self.assertEqual(res_access.status_code, 403)
        self.assertIn("authorization", res_access.json()["detail"].lower())

    def test_brand_run_and_workflow_start(self):
        # Create project for User 1
        payload = {"name": "Run Test Project", "idea": "Testing run creation"}
        res = client.post("/api/projects", json=payload, headers=self.headers_user1)
        project_id = res.json()["id"]

        # Start workflow run
        res_run = client.post(f"/api/projects/{project_id}/workflow/start", headers=self.headers_user1)
        self.assertEqual(res_run.status_code, 202)
        run_data = res_run.json()
        self.assertEqual(run_data["project_id"], project_id)
        run_id = run_data["run_id"]

        # Check workflow status
        res_status = client.get(f"/api/projects/{project_id}/workflow/{run_id}", headers=self.headers_user1)
        self.assertEqual(res_status.status_code, 200)
        status_data = res_status.json()
        self.assertEqual(status_data["run_id"], run_id)
        self.assertEqual(len(status_data["stages"]), 8)

    def test_human_selection_persistence(self):
        res = client.post("/api/projects", json={"name": "Select Proj", "idea": "Selection testing idea"}, headers=self.headers_user1)
        project_id = res.json()["id"]

        selection_payload = {
            "direction_type": "preferred_name",
            "selected_value": {"name": "NexusCraft", "territory": "collaboration"}
        }
        res_sel = client.post(f"/api/projects/{project_id}/selection", json=selection_payload, headers=self.headers_user1)
        self.assertEqual(res_sel.status_code, 200)
        self.assertEqual(res_sel.json()["direction_type"], "preferred_name")

    def test_invalid_input_handling(self):
        # Short idea string < 5 chars -> 422 Unprocessable Entity
        res = client.post("/api/projects", json={"name": "Test", "idea": "123"}, headers=self.headers_user1)
        self.assertEqual(res.status_code, 422)


if __name__ == "__main__":
    unittest.main()
