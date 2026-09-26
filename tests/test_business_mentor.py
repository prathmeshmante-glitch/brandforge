import unittest
from fastapi.testclient import TestClient
from apps.api.main import app
from apps.api.app.db.repository import repository, DataRepository


class TestBusinessMentor(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.headers = {"Authorization": "Bearer test-token-mentor"}

        # Create project with a vague restaurant idea
        res = self.client.post(
            "/api/projects",
            json={
                "name": "Pune Restaurant App",
                "idea": "I want an app for restaurants in Pune.",
                "constraints": {"location": "Pune"}
            },
            headers=self.headers
        )
        self.assertEqual(res.status_code, 201)
        self.project_id = res.json()["id"]

    def test_vague_idea_diagnosis_not_instant_naming(self):
        """User gives a vague idea: 'I want an app for restaurants in Pune.'
        Assistant must diagnose business category, identify weak thesis, ask clarifying questions,
        and NOT immediately run naming or visual identity tools."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "I want an app for restaurants in Pune."},
            headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        reply = data["reply"]
        
        # Verify mentor tone and diagnosis
        self.assertIn("category", reply.lower())
        self.assertIn("customer", reply.lower())
        # Should not execute tools immediately for a vague premise
        self.assertEqual(data.get("tools_executed"), [])
        if "mentor" in data:
            self.assertEqual(data["mentor"]["intent"], "BUSINESS_CLARIFICATION")
            self.assertTrue(len(data["mentor"]["questions"]) > 0)

    def test_dual_audience_identification(self):
        """User mentions: 'Restaurant owners and diners.'
        Assistant must identify two distinct customer segments and ask to prioritize."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "We serve both restaurant owners and diners."},
            headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        reply = data["reply"]
        self.assertTrue(
            "two different customer segments" in reply.lower() or
            "two" in reply.lower() or
            "segment" in reply.lower()
        )
        if "mentor" in data:
            self.assertIn(data["mentor"]["intent"], ["BUSINESS_CLARIFICATION", "STRATEGIC_DECISION"])

    def test_positioning_critique_and_diagnosis(self):
        """User asks: 'Why is my positioning weak?'
        Assistant must analyze the positioning, value proposition, and differentiation."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Why is my positioning weak?"},
            headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        reply = data["reply"]
        self.assertTrue(
            "positioning" in reply.lower() or
            "differentiat" in reply.lower() or
            "value proposition" in reply.lower()
        )

    def test_practical_validation_experiment(self):
        """User asks: 'What should I validate next?'
        Assistant provides practical validation steps based on assumptions."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "What should I validate next?"},
            headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        reply = data["reply"]
        self.assertTrue(
            "validat" in reply.lower() or
            "assumption" in reply.lower() or
            "experiment" in reply.lower() or
            "test" in reply.lower()
        )
        if "mentor" in data:
            self.assertEqual(data["mentor"]["intent"], "VALIDATION")
            self.assertTrue(data["mentor"]["recommended_next_step"] != "")

    def test_brand_battle_challenge(self):
        """User asks: 'Challenge this brand.'
        Assistant executes run_brand_battle and provides constructive critique."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Challenge this brand."},
            headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data.get("tools_executed", [])) > 0)
        self.assertEqual(data["tools_executed"][0]["tool"], "run_brand_battle")

    def test_non_blocking_workflow_start(self):
        """POST /workflow/start must return 202 Accepted immediately with run_id and status: running."""
        res = self.client.post(
            f"/api/projects/{self.project_id}/workflow/start",
            headers=self.headers
        )
        self.assertEqual(res.status_code, 202)
        data = res.json()
        self.assertIn("run_id", data)
        self.assertEqual(data["status"], "running")
        self.assertIn("message", data)

    def test_persistence_across_restart_simulation(self):
        """Simulate backend restart by instantiating a fresh DiskBackedRepository
        and checking that projects, runs, and artifacts still exist."""
        # Check current project exists
        proj = repository.get_project_by_id(self.project_id)
        self.assertIsNotNone(proj)

        # Create new repository instance pointing to the same disk store
        new_repo = DataRepository()
        restored_proj = new_repo.get_project_by_id(self.project_id)
        self.assertIsNotNone(restored_proj)
        self.assertEqual(restored_proj["id"], self.project_id)
        self.assertEqual(restored_proj["name"], "Pune Restaurant App")


if __name__ == "__main__":
    unittest.main()
