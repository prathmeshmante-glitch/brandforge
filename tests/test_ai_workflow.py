import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from apps.api.ai.provider import get_ai_provider, MockAIProvider, OpenAIProvider
from apps.api.ai.graph_interface import (
    discover_node,
    position_node,
    personality_node,
    naming_node,
    visual_node,
    critic_node,
    consistency_node,
    revision_planner_node,
    launch_node,
    should_revise,
    run_brand_workflow,
)
from packages.schemas.brand_state import (
    ConsistencyGuardianOutput,
    ConsistencyRevisionTarget,
    ConsistencyCheck,
)


class TestAIWorkflowEngineFixes(unittest.TestCase):
    def setUp(self):
        self.provider = MockAIProvider()
        self.initial_state = {
            "project_id": "proj-fix-100",
            "run_id": "run-fix-200",
            "idea": "An app that helps college students find teammates for hackathons",
            "constraints": {"target_audience": "students"},
            "selected_direction": {"preferred_name": "NexusCraft"},
            "status": "pending",
            "revision_count": 0,
        }

    # -----------------------------------------------------------------------
    # FIX 1 TESTS: Provider Fallback & Error Handling
    # -----------------------------------------------------------------------
    def test_provider_mock_explicit_selection(self):
        provider = get_ai_provider("mock")
        self.assertIsInstance(provider, MockAIProvider)

    def test_openai_provider_missing_key_raises_error(self):
        # Ensure that when AI_PROVIDER=openai and key is missing, it raises ValueError, NOT fallback to Mock
        provider = OpenAIProvider(api_key="")
        with self.assertRaises(ValueError) as ctx:
            provider.generate_structured("prompt", "sys", None)
        self.assertIn("OPENAI_API_KEY", str(ctx.exception))

    def test_openai_provider_invalid_key_raises_runtime_error(self):
        # Invalid key must raise RuntimeError and NEVER silently return mock output
        provider = OpenAIProvider(api_key="invalid-key-xyz")
        with self.assertRaises(RuntimeError) as ctx:
            provider.generate_structured("prompt", "sys", None)
        self.assertIn("OpenAI API Failure", str(ctx.exception))

    # -----------------------------------------------------------------------
    # FIX 2 TESTS: Targeted Revision Loop & BrandState Mutations
    # -----------------------------------------------------------------------
    def test_structured_revision_target_schema(self):
        rev_target = ConsistencyRevisionTarget(
            target="naming",
            reason="Current name lacks energetic vibe",
            priority="high"
        )
        output = ConsistencyGuardianOutput(
            overall_consistency=75,
            checks=[ConsistencyCheck(area="name", status="fail", reason="Name mismatch")],
            required_revisions=[rev_target]
        )
        self.assertEqual(output.required_revisions[0].target, "naming")

    def test_targeted_revision_planner_execution_naming(self):
        state = dict(self.initial_state)
        # Populate initial state stages
        state = discover_node(state, self.provider)
        state = position_node(state, self.provider)
        state = personality_node(state, self.provider)
        state = naming_node(state, self.provider)
        state = visual_node(state, self.provider)
        
        # Inject low consistency with target="naming"
        state["consistency"] = {
            "overall_consistency": 72,
            "checks": [],
            "required_revisions": [{"target": "naming", "reason": "Weak territory", "priority": "high"}]
        }
        
        # Execute revision_planner_node
        revised_state = revision_planner_node(state, self.provider)
        
        # Assert revision_count incremented and last_revision_target updated
        self.assertEqual(revised_state["revision_count"], 1)
        self.assertEqual(revised_state["last_revision_target"], "naming")
        self.assertIn("naming", revised_state)
        self.assertIn("visual_direction", revised_state)
        self.assertIn("critique", revised_state)

    def test_targeted_revision_planner_execution_visual(self):
        state = dict(self.initial_state)
        state = discover_node(state, self.provider)
        state = position_node(state, self.provider)
        state = personality_node(state, self.provider)
        state = naming_node(state, self.provider)
        state = visual_node(state, self.provider)
        
        # Inject target="visual_direction"
        state["consistency"] = {
            "overall_consistency": 75,
            "checks": [],
            "required_revisions": [{"target": "visual_direction", "reason": "Color clash", "priority": "medium"}]
        }
        
        revised_state = revision_planner_node(state, self.provider)
        self.assertEqual(revised_state["revision_count"], 1)
        self.assertEqual(revised_state["last_revision_target"], "visual_direction")

    def test_max_revisions_limit_cutoff(self):
        # When revision_count == 3, should_revise must return "launch" to prevent infinite loop
        state_max = {
            "consistency": {
                "overall_consistency": 70,
                "required_revisions": [{"target": "naming", "reason": "Weak name", "priority": "high"}]
            },
            "revision_count": 3
        }
        self.assertEqual(should_revise(state_max), "launch")

    def test_human_selection_modifies_brandstate_and_launch(self):
        custom_state = dict(self.initial_state)
        custom_state["selected_direction"] = {"name": "TeamSync", "visual_style": "Cyber Minimal"}
        final_state = run_brand_workflow(custom_state, self.provider)
        self.assertEqual(final_state["launch"]["brand_name"], "TeamSync")


if __name__ == "__main__":
    unittest.main()
