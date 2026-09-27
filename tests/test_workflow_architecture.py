import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
os.environ["AI_PROVIDER"] = "mock"

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


class TestWorkflowArchitecture(unittest.TestCase):
    def setUp(self):
        self.headers = {"Authorization": "Bearer test-token-workflow-arch"}
        res = client.post(
            "/api/projects",
            json={
                "name": "Architecture Validation Project",
                "idea": "An AI studio system requiring exactly one execution per run",
                "constraints": {"mode": "strict"}
            },
            headers=self.headers
        )
        self.assertEqual(res.status_code, 201)
        self.project_id = res.json()["id"]

    def test_workflow_single_execution_and_idempotency(self):
        # 1. Start workflow
        res_start = client.post(f"/api/projects/{self.project_id}/workflow/start", headers=self.headers)
        self.assertIn(res_start.status_code, (200, 202))
        run_data = res_start.json()
        run_id = run_data["run_id"]

        # 2. When a run is actively running, duplicate start call returns that active run
        from apps.api.app.db.repository import repository
        repository.update_brand_run_status(run_id, "running")

        res_dup = client.post(f"/api/projects/{self.project_id}/workflow/start", headers=self.headers)
        self.assertIn(res_dup.status_code, (200, 202))
        self.assertEqual(res_dup.json()["run_id"], run_id)
        self.assertIn("already running", res_dup.json()["message"].lower())

        # 3. Status endpoint returns accurate progress
        res_status = client.get(f"/api/projects/{self.project_id}/workflow/{run_id}", headers=self.headers)
        self.assertEqual(res_status.status_code, 200)
        status_data = res_status.json()
        self.assertEqual(status_data["run_id"], run_id)
        self.assertEqual(len(status_data["stages"]), 8)


    def test_revision_flow_creates_new_traceable_run(self):
        # Initial run
        res_start = client.post(f"/api/projects/{self.project_id}/workflow/start", headers=self.headers)
        initial_run_id = res_start.json()["run_id"]

        # Request revision
        res_rev = client.post(
            f"/api/projects/{self.project_id}/revise",
            json={"target_stage": "personality", "feedback": "Make it bolder and more rebellious"},
            headers=self.headers
        )
        self.assertIn(res_rev.status_code, (200, 202))
        rev_data = res_rev.json()
        rev_run_id = rev_data.get("new_run_id") or rev_data.get("run_id")
        self.assertIsNotNone(rev_run_id)
        self.assertNotEqual(initial_run_id, rev_run_id)


if __name__ == "__main__":
    unittest.main()
