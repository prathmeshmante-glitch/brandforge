import unittest
from fastapi.testclient import TestClient
from apps.api.main import app
from apps.api.app.db.repository import repository


class TestChatAssistant(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.headers_user1 = {"Authorization": "Bearer test-token-user1"}
        self.headers_user2 = {"Authorization": "Bearer test-token-user2"}

        # Create a test project for user1
        res = self.client.post(
            "/api/projects",
            json={
                "name": "CleanNest",
                "idea": "An app where customers can book verified home-cleaning professionals, compare prices, and schedule recurring cleanings.",
                "constraints": {"industry": "Home Services"}
            },
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 201)
        self.project_id = res.json()["id"]

    def test_chat_ownership_isolation(self):
        # User 2 should NOT be able to view or chat with User 1's project
        res_get = self.client.get(
            f"/api/projects/{self.project_id}/chat",
            headers=self.headers_user2
        )
        self.assertEqual(res_get.status_code, 403)

        res_post = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Hello from an attacker"},
            headers=self.headers_user2
        )
        self.assertEqual(res_post.status_code, 403)

    def test_informational_chat_summary(self):
        # User 1 asks for the final brand summary
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Show me the final brand summary."},
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        reply = data["reply"]
        self.assertIn("Strategic Brand Summary", reply)
        self.assertIn("Project Idea", reply)
        self.assertIn("Current Final Brand Name", reply)
        self.assertIn("Consistency Result", reply)
        self.assertIn("Completed Stages", reply)

    def test_generative_chat_naming(self):
        # User 1 sends a naming generation request
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Give me 5 stronger names for this home cleaning app."},
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("reply", data)
        self.assertTrue(len(data["tools_executed"]) > 0)
        self.assertEqual(data["tools_executed"][0]["tool"], "generate_names")
        self.assertEqual(data["tools_executed"][0]["status"], "completed")

    def test_mutation_chat_premium(self):
        # User 1 requests a more premium brand
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Make the brand feel more premium."},
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data["tools_executed"]) > 0)
        self.assertEqual(data["tools_executed"][0]["tool"], "revise_personality")
        self.assertEqual(data["tools_executed"][0]["status"], "completed")
        reply = data["reply"]
        self.assertIn("Changed:", reply)
        self.assertIn("Because:", reply)
        self.assertIn("Downstream:", reply)
        self.assertIn("Current consistency:", reply)
        self.assertIn("Brand Kit:", reply)

    def test_mutation_chat_name_selection(self):
        # First generate names so naming artifact has candidates
        self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Give me 5 stronger names."},
            headers=self.headers_user1
        )
        # Select the second name
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Use the second name."},
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data["tools_executed"]) > 0)
        self.assertEqual(data["tools_executed"][0]["tool"], "apply_name_selection")
        self.assertIn("Selected Brand Name", data["reply"])
        self.assertIn("Brand Kit:", data["reply"])

    def test_mutation_chat_consistency_fix(self):
        res = self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Fix the consistency problems."},
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data["tools_executed"]) > 0)
        self.assertEqual(data["tools_executed"][0]["tool"], "run_consistency_check")
        self.assertIn("Consistency Harmonization", data["reply"])

    def test_state_synchronization_and_brand_kit(self):
        # After mutating the brand to feel premium
        self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "Make the brand feel more premium."},
            headers=self.headers_user1
        )
        # Verify brand-kit endpoint reflects updated state
        kit_res = self.client.get(
            f"/api/projects/{self.project_id}/brand-kit",
            headers=self.headers_user1
        )
        self.assertEqual(kit_res.status_code, 200)
        kit_data = kit_res.json()
        self.assertEqual(kit_data["project_id"], self.project_id)
        self.assertIn("personality", kit_data["artifacts"])
        self.assertIn("visual", kit_data["artifacts"])

    def test_chat_history_persistence(self):
        self.client.post(
            f"/api/projects/{self.project_id}/chat",
            json={"message": "What is our current brand summary?"},
            headers=self.headers_user1
        )
        res = self.client.get(
            f"/api/projects/{self.project_id}/chat",
            headers=self.headers_user1
        )
        self.assertEqual(res.status_code, 200)
        history = res.json()
        self.assertEqual(history["project_id"], self.project_id)
        self.assertTrue(len(history["messages"]) >= 2)


if __name__ == "__main__":
    unittest.main()
