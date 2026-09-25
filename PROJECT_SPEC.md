# BrandForge — AI Brand Intelligence Studio

## 1. PROJECT OVERVIEW

BrandForge is an AI-powered Brand Intelligence Studio that transforms a rough startup, product, community or creator idea into a coherent, useful and launch-ready brand system.

The product is not a simple logo generator or one-prompt AI wrapper.

The core principle is:

> Rough Idea → AI Reasoning → Brand Strategy → Brand Identity → Critique → Consistency Check → Launch Kit

The system should help users make better branding decisions rather than merely generate large amounts of generic text.

The project follows the problem and workflow defined in the Inkloom Participant Handbook.

---

# 2. PROBLEM

Founders commonly begin with an incomplete idea such as:

"I want to create an app that helps students find teammates."

That idea is not yet a complete brand.

The founder still needs to determine:

- Who the product is really for
- What problem is actually being solved
- What the value proposition is
- How the brand should feel
- What differentiates the product
- What naming direction makes sense
- What visual language fits the audience
- How the brand should communicate
- How the product should launch

BrandForge addresses this problem through a structured AI workflow.

---

# 3. CORE OBJECTIVE

Build a working AI product in which AI meaningfully improves:

- reasoning
- distinctiveness
- consistency
- usefulness
- branding decisions

The product must allow the user to:

1. Enter an idea
2. Interact with the system
3. Trigger a real AI workflow
4. Review AI-generated decisions
5. Influence the direction
6. Receive a final brand system
7. Receive practical launch-ready assets
8. Export/share the final brand kit

A slide deck or mock interface alone is not sufficient.

---

# 4. PRODUCT CONCEPT

## Product Name

BrandForge

## Tagline

From rough idea to launch-ready brand.

## Product Category

AI Brand Intelligence / AI Brand Strategy Platform

## Primary User

Founders, creators, startups, student entrepreneurs, communities and small teams.

## Core Use Case

A user enters an incomplete product/startup idea and BrandForge converts it into a structured brand system through specialized AI agents.

---

# 5. CORE USER FLOW

```text
                         ┌─────────────────────┐
                         │    LANDING PAGE     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      SIGN IN        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   CREATE PROJECT    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     ROUGH IDEA      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     DISCOVERY       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    POSITIONING      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ BRAND PERSONALITY   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      NAMING         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ VISUAL DIRECTION    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    BRAND BATTLE     │
                         │     / CRITIQUE      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ CONSISTENCY GUARDIAN│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     LAUNCH KIT      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ EXPORT / SHARE      │
                         └─────────────────────┘
```

---

# 6. AI WORKFLOW

The AI must NOT follow this weak pattern:

User Idea → One Giant Prompt → Generic AI Response

Instead, BrandForge must use a structured multi-stage workflow.

```text
                              USER IDEA
                                  │
                                  ▼
                       ┌────────────────────┐
                       │ 1. DISCOVERER      │
                       │ Idea Understanding │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 2. POSITIONER      │
                       │ Strategy           │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 3. BRAND           │
                       │    STRATEGIST      │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 4. NAMING AGENT    │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 5. CREATIVE        │
                       │    DIRECTOR        │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 6. BRAND BATTLE    │
                       │    / CRITIC        │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ 7. CONSISTENCY     │
                       │    GUARDIAN        │
                       └─────────┬──────────┘
                                 │
                      ┌──────────┴──────────┐
                      │                     │
                   Issues?               No issues
                      │                     │
                     YES                    │
                      │                     │
                      ▼                     ▼
               ┌─────────────┐     ┌────────────────┐
               │ REVISION    │     │ 8. LAUNCH      │
               │ LOOP        │────►│    AGENT       │
               └──────┬──────┘     └───────┬────────┘
                      │                     │
                      └──────────┐          │
                                 │          │
                                 ▼          ▼
                         CONSISTENCY CHECK
                                 │
                                 ▼
                          FINAL BRAND KIT
```

---

# 7. AGENT ARCHITECTURE

BrandForge contains eight logical AI agents.

Important:

"Agent" means a specialized AI role/node in the workflow.

It does NOT mean each agent must use a different AI model.

The system should maintain shared structured state.

### AGENT 1 — DISCOVERER
**Purpose:** Understand the user's idea before branding decisions begin.  
**Responsibilities:**
- Extract the core problem
- Identify target users
- Identify user segments
- Identify pain points
- Identify goals
- Identify constraints
- Identify assumptions
- Identify unanswered questions

**Input:**
```json
{
  "idea": "...",
  "constraints": {},
  "optional_target_users": "...",
  "optional_context": "..."
}
```
**Output:**
```json
{
  "problem": "...",
  "target_users": [
    {
      "segment": "...",
      "needs": [],
      "pain_points": []
    }
  ],
  "context": "...",
  "goals": [],
  "constraints": [],
  "assumptions": [],
  "open_questions": []
}
```

### AGENT 2 — POSITIONER
**Purpose:** Convert discovery information into strategic positioning.  
**Responsibilities:**
- Define category
- Define core problem
- Define value proposition
- Identify differentiators
- Identify competitive angle
- Define positioning statement
- Identify proof points

**Input:** Discoverer output.  
**Output:**
```json
{
  "category": "...",
  "core_problem": "...",
  "value_proposition": "...",
  "differentiators": [],
  "competitive_angle": "...",
  "positioning_statement": "...",
  "proof_points": []
}
```

### AGENT 3 — BRAND STRATEGIST
**Purpose:** Define how the brand should feel and behave.  
**Responsibilities:**
- Select 3–5 brand personality traits
- Justify every trait against target users
- Define brand principles
- Define tone
- Define emotional objective
- Define traits to avoid

**Output:**
```json
{
  "personality": [
    {
      "trait": "Energetic",
      "reason": "..."
    }
  ],
  "principles": [],
  "tone": {
    "do": [],
    "avoid": []
  },
  "brand_archetype": "...",
  "emotional_goal": "..."
}
```

### AGENT 4 — NAMING AGENT
**Purpose:** Create strategically meaningful naming directions.  
The agent should NOT simply generate a random list of names. It must organize names into naming territories.  
**Output:**
```json
{
  "territories": [
    {
      "type": "collaboration",
      "description": "...",
      "names": [
        {
          "name": "...",
          "rationale": "...",
          "strengths": [],
          "risks": []
        }
      ]
    }
  ]
}
```

### AGENT 5 — CREATIVE DIRECTOR
**Purpose:** Translate strategy into a coherent visual language.  
**Responsibilities:** Color direction, Typography, Visual mood, Composition, Shapes, Imagery, Logo concept direction, Symbols, Things to avoid.  
**Output:**
```json
{
  "visual_direction": {
    "mood": [],
    "color_direction": [],
    "typography": [],
    "composition": [],
    "shape_language": [],
    "imagery": [],
    "symbol_concepts": [],
    "avoid": []
  },
  "logo_direction": {
    "concept": "...",
    "rationale": "..."
  }
}
```

### AGENT 6 — BRAND BATTLE / CRITIC
**Purpose:** Challenge weak, generic or contradictory branding decisions.  
This is one of BrandForge's main differentiating features.  
**Output:**
```json
{
  "issues": [
    {
      "area": "name",
      "severity": "high",
      "problem": "...",
      "evidence": "...",
      "suggestion": "..."
    }
  ],
  "genericity_checks": [],
  "audience_mismatch": [],
  "contradictions": [],
  "revised_options": []
}
```

### AGENT 7 — CONSISTENCY GUARDIAN
**Purpose:** Check whether every part of the brand behaves like one coherent system.  
**Output:**
```json
{
  "overall_consistency": 87,
  "checks": [
    {
      "area": "voice",
      "status": "pass",
      "reason": "..."
    },
    {
      "area": "name_personality",
      "status": "warning",
      "reason": "..."
    }
  ],
  "required_revisions": []
}
```

### AGENT 8 — LAUNCH AGENT
**Purpose:** Turn the approved brand into practical launch assets.  
**Output:**
```json
{
  "brand_name": "...",
  "tagline": "...",
  "one_line_pitch": "...",
  "landing_page": {
    "headline": "...",
    "subheadline": "...",
    "cta": "..."
  },
  "social": {
    "instagram": "...",
    "linkedin": "..."
  },
  "brand_voice_samples": [],
  "launch_message": "..."
}
```

---

# 8. CENTRAL LANGGRAPH STATE

The entire workflow should use one shared structured state.

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
    errors: list
```

---

# 9. LANGGRAPH WORKFLOW
START → discover → position → personality → naming → visualize → brand_battle → consistency → launch → END

Revision branch:
brand_battle → consistency → issues? (YES: revise → consistency / NO: launch)

---

# 10. STRUCTURED OUTPUT ARCHITECTURE

Use LLM → Structured Output / JSON Schema → Pydantic Validation → LangGraph State → Database.  
If validation fails: Invalid output → Validation → Repair / retry → Validated structured output.

---

# 11. HUMAN-IN-THE-LOOP

The user can select naming direction, personality, visual direction, request revisions, and approve final brand. The selected direction becomes part of shared `BrandState`.

---

# 12. AI WORKFLOW UI

Visibly show workflow stages (Discovery, Positioning, Personality, Naming, Visual Identity, Brand Battle, Consistency, Launch Kit), expandable with details on what was found and passed to the next agent.

---

# 13. BRAND BATTLE UI

Visually display side-by-side strategy options, AI Critic recommendations, genericity/conflict checks, and revised options.

---

# 14. CONSISTENCY GUARDIAN UI

Show Brand Health breakdown metrics (Audience Fit, Positioning, Personality, Name Fit, Visual Fit, Voice Consistency) and detailed explanations for warnings/mismatches.

---

# 15. FINAL BRAND KIT

Full view containing Brand Strategy, Brand Identity, Brand Voice, Quality checks, Launch kit assets, and PDF Export / Share features.

---

# 16. FRONTEND
Next.js, TypeScript, Tailwind CSS, shadcn/ui located in `apps/web/`.

---

# 17. FRONTEND COMPONENT STRUCTURE
Reusables: WorkflowTimeline, AgentStatusCard, AIInsightCard, DecisionCard, NameCard, BrandDirectionCard, CritiqueCard, ConsistencyCheckCard, BrandKitSection, ExportButton.

---

# 18. BACKEND
Python, FastAPI, Pydantic located in `apps/api/`.

---

# 19. DATABASE
PostgreSQL through Supabase (`profiles`, `projects`, `brand_runs`, `brand_artifacts`, `selected_directions`, `exports`).

---

# 20. DATABASE RELATIONSHIP
auth.users → profiles → projects → (brand_runs → brand_artifacts → exports, selected_directions).

---

# 21. AUTHENTICATION
Supabase Auth (Google, Email/password).

---

# 22. STORAGE
Supabase Storage for exports, generated assets, logos, PDF brand kits.

---

# 23. API DESIGN
REST endpoints for projects, workflow runs, streaming progress, selection, revision, brand kit, and exports.

---

# 24. WORKFLOW STREAMING
Real-time workflow progress update stream to UI.

---

# 25. MODEL ARCHITECTURE
Provider abstraction layer (`get_model(provider)`) supporting OpenAI, Anthropic, and Gemini. Default runtime: `AI_PROVIDER=openai`.

---

# 26. ENVIRONMENT VARIABLES
`.env.example` file specifying frontend and backend environment variables.

---

# 27. REPOSITORY STRUCTURE
```text
brandforge/
│
├── AGENTS.md
├── PROJECT_SPEC.md
├── README.md
├── .env.example
├── docker-compose.yml
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── schemas/
│   ├── types/
│   └── prompts/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── docs/
│   ├── architecture.md
│   ├── ai-workflow.md
│   ├── database.md
│   └── api.md
│
└── tests/
```

---

# 28. CODING AGENT DISTRIBUTION
Divided ownership: Architect (docs/packages), Frontend (apps/web), Backend (apps/api), AI Workflow (apps/api/ai, packages/prompts), Database (supabase/), QA (tests/).

---

# 29. GIT STRATEGY
Feature branches (`feat/frontend`, `feat/backend`, `feat/ai-workflow`, `feat/database`, `feat/tests`).

---

# 30. DEVELOPMENT ORDER
Phase 1 (Database+Auth) through Phase 10 (Deployment+testing+demo).

---

# 31. MVP SCOPE
End-to-end working system from rough idea to exported launch-ready brand kit with critique & consistency loops.

---

# 32. FEATURES TO EXCLUDE FROM V1
No logo editor, chat system, payments, team collaboration, mobile app, etc.

---

# 33. DEMO SCENARIO
"Platform that helps college students find teammates for hackathons."

---

# 34. DEMO SCRIPT STRUCTURE
2-4 minute concise demonstration covering problem, product, input, workflow reasoning, output, and critique/consistency differentiators.

---

# 35. STRONGEST DIFFERENTIATING FEATURE
Structured AI pipeline with critique, revision loop, and consistency validation.

---

# 36. BRANDFORGE TECHNICAL STORY
Structured brand state across specialized agents with Pydantic validation and LangGraph feedback loop.

---

# 37. WHY THE PRODUCT IS USEFUL
Delivers practical, launch-ready visual & strategic brand assets in one complete Brand Kit.

---

# 38. UI DESIGN PRINCIPLES
Minimal, strong typography, clear visual hierarchy, interactive decision cards.

---

# 39. DEPLOYMENT ARCHITECTURE
Vercel (Frontend Next.js) + Render/Railway (FastAPI Backend) + Supabase (PostgreSQL, Auth, Storage).

---

# 40. FINAL PRODUCT FLOW
Tell us your idea → Discover → Position → Shape → Visualize → Challenge → Consistency → Deliver → Export.

---

# 41. JUDGING ALIGNMENT
Engineered around Inkloom hackathon judging criteria.

---

# 42. INKLOOM REQUIREMENTS
Code: `INKLOOM-WCC`.

---

# 43. SUBMISSION REQUIREMENTS
Accessible GitHub repo, live product, demo video, social posts, required documentation.

---

# 44. FINAL CHECKLIST
Complete product, technical, AI, and submission checklists.
