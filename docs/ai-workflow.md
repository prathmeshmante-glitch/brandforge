# BrandForge — AI Workflow & Agent Specifications

This document defines the 8 logical AI agents, input/output schemas, shared state architecture, and critique revision loops.

---

## 1. Central `BrandState` Schema

The entire pipeline communicates using a shared structured TypedDict / Pydantic model:

```python
class BrandState(TypedDict, total=False):
    project_id: str
    idea: str
    constraints: dict

    discovery: dict
    positioning: dict
    personality: dict
    naming: dict
    visual_direction: dict

    critique: dict
    consistency: dict
    launch: dict

    selected_direction: dict
    status: str
    revision_count: int
    errors: list
```

---

## 2. Agent Specifications

### Agent 1: Discoverer
- **Role**: Extract target user segments, pain points, core problems, assumptions, and open questions from a raw user prompt.
- **Output Schema**: `DiscovererOutput` (`problem`, `target_users`, `context`, `goals`, `constraints`, `assumptions`, `open_questions`).

### Agent 2: Positioner
- **Role**: Formulate strategic positioning, value proposition, competitive angle, proof points, and category definition.
- **Output Schema**: `PositionerOutput` (`category`, `core_problem`, `value_proposition`, `differentiators`, `competitive_angle`, `positioning_statement`, `proof_points`).

### Agent 3: Brand Strategist
- **Role**: Define brand personality traits, brand archetype, tone guidelines (Do/Avoid), and emotional objectives.
- **Output Schema**: `StrategistOutput` (`personality`, `principles`, `tone`, `brand_archetype`, `emotional_goal`).

### Agent 4: Naming Agent
- **Role**: Generate naming territories (e.g. Collaboration, Speed, Premium, Community) with structured name options, rationales, strengths, and risks.
- **Output Schema**: `NamingOutput` (`territories`: List[`NamingTerritory`]).

### Agent 5: Creative Director
- **Role**: Define visual direction including color palette recommendations, typography pairs, composition, shape language, mood keywords, and logo concepts.
- **Output Schema**: `CreativeDirectorOutput` (`visual_direction`, `logo_direction`).

### Agent 6: Brand Battle / Critic
- **Role**: Challenge weak/generic choices, detect personality-naming mismatches, audience mismatches, and suggest revised options.
- **Output Schema**: `CriticOutput` (`issues`, `genericity_checks`, `audience_mismatch`, `contradictions`, `revised_options`).

### Agent 7: Consistency Guardian
- **Role**: Evaluate holistic brand consistency across name, voice, visuals, and strategy. Produce numerical consistency score and revision triggers.
- **Output Schema**: `ConsistencyGuardianOutput` (`overall_consistency`: int, `checks`: List[`ConsistencyCheck`], `required_revisions`: List[str]).

### Agent 8: Launch Agent
- **Role**: Generate launch assets including hero headlines, subheadlines, CTA copy, Instagram/LinkedIn posts, and brand voice samples.
- **Output Schema**: `LaunchAgentOutput` (`brand_name`, `tagline`, `one_line_pitch`, `landing_page`, `social`, `brand_voice_samples`, `launch_message`).

---

## 3. Revision Loop Logic

If `ConsistencyGuardianOutput.overall_consistency < 80` or `required_revisions` is non-empty, and `revision_count < MAX_REVISIONS` (default: 3):
1. State routes to `revise` node.
2. Critic feedback is attached to prompt context.
3. Relevant upstream agent (e.g. Naming or Creative) re-executes.
4. `ConsistencyGuardian` re-evaluates updated artifacts.
