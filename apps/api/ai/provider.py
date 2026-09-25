import os
import logging
from typing import Any, Optional, Type
from pydantic import BaseModel
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
    ConsistencyRevisionTarget,
    LaunchAgentOutput,
    LandingPageCopy,
    SocialCopy,
)

logger = logging.getLogger(__name__)


class BaseAIProvider:
    """Abstract base class for AI Model Providers."""
    def generate_structured(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> BaseModel:
        raise NotImplementedError("Subclasses must implement generate_structured")


class MockAIProvider(BaseAIProvider):
    """
    Deterministic Mock AI Provider for testing and offline local execution.
    Generates fully compliant, non-generic structured outputs matching the expected response_model.
    """
    def generate_structured(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> BaseModel:
        if response_model == DiscovererOutput:
            return DiscovererOutput(
                problem="Founders and student hackers struggle to find compatible teammates with complementary technical skills quickly.",
                target_users=[
                    UserSegment(
                        segment="College Student Hackers",
                        needs=["Rapid teammate discovery", "Skill verification", "Role matching"],
                        pain_points=["Unbalanced teams", "Last-minute dropouts", "Awkward networking"]
                    )
                ],
                context="Collegiate hackathons and buildathons",
                goals=["Match complementary hackers in under 60 seconds", "Build balanced teams"],
                constraints=["Time-compressed environment"],
                assumptions=["Hackers rely on Discord/GitHub"],
                open_questions=["How to match cross-institution teams?"]
            )
        elif response_model == PositionerOutput:
            return PositionerOutput(
                category="AI Team Intelligence Platform",
                core_problem="Fragmented, high-friction team formation for short-burst hackathons",
                value_proposition="Instantly form balanced, skill-verified hackathon teams powered by AI matching.",
                differentiators=["Real-time chemistry scoring", "Skill-complementarity matching", "Verified builder profiles"],
                competitive_angle="Urgent, high-velocity team formation tailored for builders",
                positioning_statement="For collegiate hackers who need compatible team members, TeamUp is the AI matching platform.",
                proof_points=["92% team formation success rate in pilot hackathons"]
            )
        elif response_model == StrategistOutput:
            return StrategistOutput(
                personality=[
                    PersonalityTrait(trait="Energetic", reason="Resonates with fast-paced hackathon environment"),
                    PersonalityTrait(trait="Collaborative", reason="Core value proposition centers on teamwork"),
                    PersonalityTrait(trait="Innovative", reason="Appeals to forward-thinking tech builders")
                ],
                principles=["Builder-First", "High Velocity", "Radical Transparency"],
                tone=ToneGuide(
                    do=["Use bold, direct language", "Focus on builder empowerment"],
                    avoid=["Corporate jargon", "Passive phrases"]
                ),
                brand_archetype="The Creator",
                emotional_goal="Empowered and eager to build"
            )
        elif response_model == NamingOutput:
            return NamingOutput(
                territories=[
                    NamingTerritory(
                        type="Collaboration & Velocity",
                        description="Names centered on team synergy and speed",
                        names=[
                            NameOption(name="NexusCraft", rationale="Combines connection hub with builder craft", strengths=["Memorable", "Modern"], risks=["None"]),
                            NameOption(name="TeamForge", rationale="Forging high-impact hacker teams", strengths=["Strong", "Action-oriented"], risks=["Common prefix"])
                        ]
                    ),
                    NamingTerritory(
                        type="Precision Matching",
                        description="Names highlighting intelligent skill alignment",
                        names=[
                            NameOption(name="SyncPact", rationale="Agreement and synchronization between builders", strengths=["Sleek"], risks=["Sounds slightly formal"])
                        ]
                    )
                ]
            )
        elif response_model == CreativeDirectorOutput:
            return CreativeDirectorOutput(
                visual_direction=VisualDirection(
                    mood=["Vibrant", "Cyber-Minimal", "High-Energy"],
                    color_direction=["#0F172A (Slate Dark)", "#3B82F6 (Electric Blue)", "#10B981 (Emerald Spark)"],
                    typography=["Inter Sans (Headings)", "JetBrains Mono (Accents & Code)"],
                    composition=["Grid-aligned", "High contrast"],
                    shape_language=["Sharp geometric angles", "Hexagonal nodes"],
                    imagery=["Dark mode IDE aesthetic", "Stylized vector nodes"],
                    symbol_concepts=["Intersecting spark vectors", "Hexagonal node connection"],
                    avoid=["Sappy corporate handshake photos", "Generic clip art"]
                ),
                logo_direction=LogoDirection(
                    concept="Stylized 'N' vector with connected node points representing team synthesis",
                    rationale="Directly embodies node networking and developer collaboration"
                )
            )
        elif response_model == CriticOutput:
            return CriticOutput(
                issues=[
                    CritiqueIssue(
                        target="visual_direction",
                        area="visual_direction",
                        severity="low",
                        problem="Dark mode cyber aesthetic is common among dev tools.",
                        evidence="Electric blue on dark slate is heavily used by developer utilities.",
                        suggestion="Incorporate emerald spark accents prominently to heighten distinctiveness."
                    )
                ],
                genericity_checks=["Name territory 'SyncPact' is slightly generic; 'NexusCraft' carries stronger brand personality."],
                audience_mismatch=[],
                contradictions=[],
                revised_options=[]
            )
        elif response_model == ConsistencyGuardianOutput:
            return ConsistencyGuardianOutput(
                overall_consistency=91,
                checks=[
                    ConsistencyCheck(area="voice", status="pass", reason="Energetic tone aligns with student hacker target audience."),
                    ConsistencyCheck(area="name_personality", status="pass", reason="NexusCraft reflects Creator archetype."),
                    ConsistencyCheck(area="visual_fit", status="pass", reason="Cyber-minimal visual direction fits builder persona.")
                ],
                required_revisions=[]
            )
        elif response_model == LaunchAgentOutput:
            # Extract brand name dynamically from prompt context if present
            brand_name = "NexusCraft"
            if "Approved Brand Name:" in prompt:
                parts = prompt.split("Approved Brand Name:")
                if len(parts) > 1:
                    line = parts[1].split("\n")[0].strip()
                    if line:
                        brand_name = line

            return LaunchAgentOutput(
                brand_name=brand_name,
                tagline="Build your team. Build the future.",
                one_line_pitch=f"The AI matching studio that turns solo builders into winning hackathon teams using {brand_name}.",
                landing_page=LandingPageCopy(
                    headline=f"Find Your Winning Hackathon Team in Seconds with {brand_name}",
                    subheadline=f"{brand_name} matches your skills with compatible builders to form balanced, unstoppable hackathon teams.",
                    cta="Find Teammates Now"
                ),
                social=SocialCopy(
                    instagram=f"🚀 Stop hacking solo! {brand_name} uses AI to match your exact skills with compatible builders. Link in bio to assemble your dream team! #{brand_name}",
                    linkedin=f"Excited to announce {brand_name} — the AI-powered team intelligence platform designed for hackathon builders."
                ),
                brand_voice_samples=["Build fast. Sync faster.", "No awkward networking — just chemistry."],
                launch_message=f"{brand_name} is officially live! Transform your solo idea into a powerhouse hackathon team today."
            )
        else:
            raise ValueError(f"Unsupported mock response model: {response_model}")


class OpenAIProvider(BaseAIProvider):
    """OpenAI provider implementation."""
    def __init__(self, model_name: Optional[str] = None, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model_name = model_name or os.getenv("AI_MODEL", "gpt-4o")

    def generate_structured(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> BaseModel:
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not configured. Configure key or set AI_PROVIDER=mock.")
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            completion = client.beta.chat.completions.parse(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                response_format=response_model,
            )
            return completion.choices[0].message.parsed
        except Exception as e:
            logger.error(f"OpenAI Execution Error - Provider: openai, Model: {self.model_name}, ErrorType: {type(e).__name__}")
            raise RuntimeError(f"OpenAI API Failure ({type(e).__name__}): {str(e)}")


class AnthropicProvider(BaseAIProvider):
    """Anthropic Claude provider implementation."""
    def __init__(self, model_name: Optional[str] = None, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model_name = model_name or "claude-3-5-sonnet-20240620"

    def generate_structured(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> BaseModel:
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not configured.")
        raise NotImplementedError("Anthropic provider SDK integration is pending. Use AI_PROVIDER=openai or AI_PROVIDER=mock.")


class GeminiProvider(BaseAIProvider):
    """Google Gemini provider implementation."""
    def __init__(self, model_name: Optional[str] = None, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name or "gemini-1.5-pro"

    def generate_structured(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> BaseModel:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not configured.")
        raise NotImplementedError("Gemini provider SDK integration is pending. Use AI_PROVIDER=openai or AI_PROVIDER=mock.")


def get_ai_provider(provider_name: Optional[str] = None) -> BaseAIProvider:
    """Factory function to retrieve the configured AI Provider."""
    provider = (provider_name or os.getenv("AI_PROVIDER", "mock")).lower()
    if provider == "mock":
        return MockAIProvider()
    elif provider == "openai":
        return OpenAIProvider()
    elif provider == "anthropic":
        return AnthropicProvider()
    elif provider == "gemini":
        return GeminiProvider()
    else:
        raise ValueError(f"Unsupported or unconfigured AI_PROVIDER: {provider}")
