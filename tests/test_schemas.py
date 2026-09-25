import unittest
import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from packages.schemas.brand_state import (
    DiscovererOutput,
    UserSegment,
    PositionerOutput,
    StrategistOutput,
    PersonalityTrait,
    ToneGuide,
    NamingOutput,
    NamingTerritory,
    NameOption,
    CreativeDirectorOutput,
    VisualDirection,
    LogoDirection,
    CriticOutput,
    CritiqueIssue,
    ConsistencyGuardianOutput,
    ConsistencyCheck,
    LaunchAgentOutput,
    LandingPageCopy,
    SocialCopy,
    BrandStateModel,
)


class TestBrandStateSchemas(unittest.TestCase):
    def test_discoverer_schema(self):
        data = {
            "problem": "Students struggle to find compatible teammates for hackathons.",
            "target_users": [
                {
                    "segment": "College CS Students",
                    "needs": ["Complementary skills", "Fast matching"],
                    "pain_points": ["Last-minute team formation", "Mismatched skill levels"]
                }
            ],
            "context": "Competitive collegiate hackathons",
            "goals": ["Connect hackers fast", "Build balanced teams"],
            "constraints": ["Short timeline"],
            "assumptions": ["Students use Discord/GitHub"],
            "open_questions": ["How to handle cross-university teams?"]
        }
        output = DiscovererOutput(**data)
        self.assertEqual(output.problem, data["problem"])
        self.assertEqual(len(output.target_users), 1)

    def test_positioner_schema(self):
        data = {
            "category": "Hackathon Collaboration Platform",
            "core_problem": "Fragmented hacker networking",
            "value_proposition": "Match with hackathon teammates based on verified skills and goals in seconds.",
            "differentiators": ["Skill-based matching algorithm", "Hackathon-specific profiles"],
            "competitive_angle": "Focus purely on hackathon urgency and team chemistry",
            "positioning_statement": "For hackathon participants who need compatible teammates, TeamUp is the matching studio.",
            "proof_points": ["90% team formation rate in pilot"]
        }
        output = PositionerOutput(**data)
        self.assertEqual(output.category, data["category"])

    def test_brand_state_model(self):
        state = BrandStateModel(
            project_id="test-123",
            idea="App for student hackathons",
            status="pending"
        )
        self.assertEqual(state.project_id, "test-123")
        self.assertEqual(state.revision_count, 0)


if __name__ == "__main__":
    unittest.main()
