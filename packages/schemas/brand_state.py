from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Agent 1: Discoverer Schemas
# ---------------------------------------------------------------------------

class UserSegment(BaseModel):
    segment: str = Field(..., description="Target audience segment name")
    needs: List[str] = Field(default_factory=list, description="Key needs of this segment")
    pain_points: List[str] = Field(default_factory=list, description="Pain points experienced by this segment")


class DiscovererInput(BaseModel):
    idea: str = Field(..., description="The user's raw startup/product idea")
    constraints: Optional[Dict[str, Any]] = Field(default_factory=dict)
    optional_target_users: Optional[str] = None
    optional_context: Optional[str] = None


class DiscovererOutput(BaseModel):
    problem: str = Field(..., description="Extracted core problem statement")
    target_users: List[UserSegment] = Field(..., description="Identified target user segments")
    context: str = Field("", description="Broader market/industry context")
    goals: List[str] = Field(default_factory=list, description="Core goals of the product")
    constraints: List[str] = Field(default_factory=list, description="Identified constraints")
    assumptions: List[str] = Field(default_factory=list, description="Core assumptions made")
    open_questions: List[str] = Field(default_factory=list, description="Unanswered questions to clarify")


# ---------------------------------------------------------------------------
# Agent 2: Positioner Schemas
# ---------------------------------------------------------------------------

class PositionerOutput(BaseModel):
    category: str = Field(..., description="Defined product category")
    core_problem: str = Field(..., description="Refined core problem being solved")
    value_proposition: str = Field(..., description="Clear value proposition statement")
    differentiators: List[str] = Field(..., description="Key competitive differentiators")
    competitive_angle: str = Field(..., description="Unique market entry angle")
    positioning_statement: str = Field(..., description="Formal positioning statement")
    proof_points: List[str] = Field(default_factory=list, description="Supporting proof points")


# ---------------------------------------------------------------------------
# Agent 3: Brand Strategist Schemas
# ---------------------------------------------------------------------------

class PersonalityTrait(BaseModel):
    trait: str = Field(..., description="Personality trait name (e.g. Energetic, Premium)")
    reason: str = Field(..., description="Strategic justification mapped to target audience")


class ToneGuide(BaseModel):
    do: List[str] = Field(..., description="Communication guidelines to adopt")
    avoid: List[str] = Field(..., description="Tone behaviors to strictly avoid")


class StrategistOutput(BaseModel):
    personality: List[PersonalityTrait] = Field(..., description="3-5 defined personality traits")
    principles: List[str] = Field(..., description="Core brand principles")
    tone: ToneGuide = Field(..., description="Tone guidelines")
    brand_archetype: str = Field(..., description="Primary brand archetype (e.g. Creator, Explorer)")
    emotional_goal: str = Field(..., description="Target emotional response from users")


# ---------------------------------------------------------------------------
# Agent 4: Naming Agent Schemas
# ---------------------------------------------------------------------------

class NameOption(BaseModel):
    name: str = Field(..., description="Proposed brand name")
    rationale: str = Field(..., description="Strategic rationale for the name")
    strengths: List[str] = Field(default_factory=list, description="Key strengths")
    risks: List[str] = Field(default_factory=list, description="Potential risks or trademark cautions")


class NamingTerritory(BaseModel):
    type: str = Field(..., description="Territory category (e.g. collaboration, speed, premium)")
    description: str = Field(..., description="Territory theme explanation")
    names: List[NameOption] = Field(..., description="Names belonging to this territory")


class NamingOutput(BaseModel):
    territories: List[NamingTerritory] = Field(..., description="Grouped naming territories")


# ---------------------------------------------------------------------------
# Agent 5: Creative Director Schemas
# ---------------------------------------------------------------------------

class VisualDirection(BaseModel):
    mood: List[str] = Field(..., description="Mood keywords (e.g. sleek, vibrant)")
    color_direction: List[str] = Field(..., description="Color palette recommendations with hex codes")
    typography: List[str] = Field(..., description="Font pairings and typography direction")
    composition: List[str] = Field(..., description="Layout & spatial composition rules")
    shape_language: List[str] = Field(..., description="Geometric & organic shape language")
    imagery: List[str] = Field(..., description="Photography & visual style guidelines")
    symbol_concepts: List[str] = Field(..., description="Iconography and symbol themes")
    avoid: List[str] = Field(..., description="Visual clichés to avoid")


class LogoDirection(BaseModel):
    concept: str = Field(..., description="Primary logo concept proposal")
    rationale: str = Field(..., description="Rationale for logo direction")


class CreativeDirectorOutput(BaseModel):
    visual_direction: VisualDirection = Field(..., description="Visual system design guidelines")
    logo_direction: LogoDirection = Field(..., description="Logo direction")


# ---------------------------------------------------------------------------
# Agent 6: Brand Battle / Critic Schemas
# ---------------------------------------------------------------------------

class CritiqueIssue(BaseModel):
    target: str = Field("visual_direction", description="Affected artifact target: positioning, personality, naming, visual_direction, launch")
    area: str = Field(..., description="Area of concern (e.g. name, positioning, visual)")
    severity: str = Field(..., description="Severity level: low, medium, high")
    problem: str = Field(..., description="Detailed description of the issue")
    evidence: str = Field(..., description="Evidence supporting the critique")
    suggestion: str = Field(..., description="Actionable recommendation for improvement")


class CriticOutput(BaseModel):
    issues: List[CritiqueIssue] = Field(default_factory=list, description="List of identified issues")
    genericity_checks: List[str] = Field(default_factory=list, description="Genericity evaluation notes")
    audience_mismatch: List[str] = Field(default_factory=list, description="Audience mismatch warnings")
    contradictions: List[str] = Field(default_factory=list, description="Internal contradictions found")
    revised_options: List[Dict[str, Any]] = Field(default_factory=list, description="Alternative options proposed")


# ---------------------------------------------------------------------------
# Agent 7: Consistency Guardian Schemas
# ---------------------------------------------------------------------------

class ConsistencyCheck(BaseModel):
    area: str = Field(..., description="Checked relationship area (e.g. voice, name_personality)")
    status: str = Field(..., description="Status: pass, warning, fail")
    reason: str = Field(..., description="Explanation of evaluation")


class ConsistencyRevisionTarget(BaseModel):
    target: str = Field(..., description="Target artifact to revise: positioning, personality, naming, visual_direction, launch")
    reason: str = Field(..., description="Reason for requesting revision")
    priority: str = Field("medium", description="Priority level: low, medium, high")


class ConsistencyGuardianOutput(BaseModel):
    overall_consistency: int = Field(..., description="Overall score from 0 to 100")
    checks: List[ConsistencyCheck] = Field(..., description="Detailed relationship checks")
    required_revisions: List[ConsistencyRevisionTarget] = Field(default_factory=list, description="Structured revision targets")


# ---------------------------------------------------------------------------
# Agent 8: Launch Agent Schemas
# ---------------------------------------------------------------------------

class LandingPageCopy(BaseModel):
    headline: str = Field(..., description="Hero headline")
    subheadline: str = Field(..., description="Supporting subheadline")
    cta: str = Field(..., description="Primary call to action button text")


class SocialCopy(BaseModel):
    instagram: str = Field(..., description="Instagram launch post caption & hashtags")
    linkedin: str = Field(..., description="LinkedIn announcement post copy")


class LaunchAgentOutput(BaseModel):
    brand_name: str = Field(..., description="Final brand name")
    tagline: str = Field(..., description="Brand tagline")
    one_line_pitch: str = Field(..., description="Elevator pitch")
    landing_page: LandingPageCopy = Field(..., description="Hero landing page copy")
    social: SocialCopy = Field(..., description="Launch social media copy")
    brand_voice_samples: List[str] = Field(default_factory=list, description="Sample message executions")
    launch_message: str = Field(..., description="Overall launch announcement message")


# ---------------------------------------------------------------------------
# Central LangGraph Shared BrandState Model
# ---------------------------------------------------------------------------

class BrandStateModel(BaseModel):
    project_id: str = Field("", description="Unique project UUID")
    idea: str = Field(..., description="User's initial raw idea")
    constraints: Dict[str, Any] = Field(default_factory=dict, description="Project constraints")

    discovery: Optional[DiscovererOutput] = None
    positioning: Optional[PositionerOutput] = None
    personality: Optional[StrategistOutput] = None
    naming: Optional[NamingOutput] = None
    visual_direction: Optional[CreativeDirectorOutput] = None

    critique: Optional[CriticOutput] = None
    consistency: Optional[ConsistencyGuardianOutput] = None
    launch: Optional[LaunchAgentOutput] = None

    selected_direction: Dict[str, Any] = Field(default_factory=dict, description="User choices")
    status: str = Field("pending", description="Current workflow status")
    revision_count: int = Field(0, description="Number of critique revision iterations")
    errors: List[str] = Field(default_factory=list, description="Workflow errors recorded")
