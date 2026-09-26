# BrandForge — Final Engineering Report
**Role**: Principal Full-Stack + AI Systems Engineer  
**Date**: September 26, 2026  
**Repository Branch**: `final-frontend-integration`

---

## 1. Architecture Overview

BrandForge is an AI Brand Intelligence Studio engineered to turn unstructured product concepts into a launch-ready brand system.
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, custom dark obsidian editorial design system with glassmorphic cards and micro-animations.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2 schemas, typed repositories, and JWT auth dependencies.
- **AI Orchestration**: LangGraph StateGraph pipeline with typed structured outputs via provider abstraction layer (`OpenAIProvider`, `GeminiProvider`, `MockAIProvider` for testing).
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth (ES256 JWKS verification), Supabase Storage.
- **Real-Time Streaming**: Server-Sent Events (SSE).

---

## 2. Authentication & Redirect Loop Resolution

### Root Cause Analysis
1. **Hydration Race Condition**: In `apps/web/lib/auth-context.tsx`, `signIn`, `signUp`, and `verifyOtp` did not set `user` and `session` synchronously into React state before resolving. The route guards (`ProtectedRoute` / `GuestOnlyRoute`) immediately evaluated `isLoading: false` with `user: null`, triggering `router.replace('/login')`.
2. **Aggressive 401 Eviction**: In `apps/web/lib/api.ts`, whenever FastAPI returned an HTTP 401 (e.g. backend `SUPABASE_URL` pointing to placeholder or session refresh), the API client called `supabase.auth.signOut()` and forcefully redirected to `/login`.
3. **Missing Backend URL**: FastAPI was missing `SUPABASE_URL` in its environment configuration, causing token verification to fail against the live Supabase JWKS endpoint.

### Fixes Implemented
- In `apps/web/lib/auth-context.tsx`: `signIn`, `signUp`, and `verifyOtp` set `user` and `session` synchronously into state before returning.
- In `apps/web/lib/auth-guard.tsx`: Both `ProtectedRoute` and `GuestOnlyRoute` check `user` and `session`, and render loading spinners during hydration rather than returning `null` or firing premature redirects.
- In `apps/web/lib/api.ts`: Replaced hard signout on 401 with a graceful `supabase.auth.refreshSession()` attempt and request retry.
- In `apps/api/app/core/config.py`: Verified `SUPABASE_URL` defaults to live project `https://oibdfowksbcvudgcmytt.supabase.co`.
- Confirmed live Supabase JWKS returns active `ES256` keys and `PyJWKClient` decodes them properly.

---

## 3. Database & Persistence Layer

- Implemented structured data persistence in `apps/api/app/db/repository.py`:
  - `projects`: Project metadata, idea, constraints, ownership (`user_id`).
  - `brand_runs`: Execution runs, run status, completion timestamps.
  - `brand_artifacts`: Individual stage outputs keyed by `run_id` and `stage`.
  - `selected_directions`: Human decisions (selected name, positioning angle, revision requests).
  - `exports`: Export jobs, formats, and download links.
  - `chat_messages`: Contextual chat messages and tool execution logs.

---

## 4. AI Workflow & 8-Agent Pipeline

The AI pipeline is implemented as a LangGraph StateGraph (`apps/api/ai/graph_interface.py`):
1. **Discoverer**: Extracts audience segments, pain points, problem statement, assumptions.
2. **Positioner**: Defines market category, value proposition, differentiators, and strategic positioning statement.
3. **Brand Strategist**: Establishes archetype, personality traits, principles, and tone guidelines.
4. **Naming Agent**: Generates naming territories, candidate names, rationales, and risk profiles.
5. **Creative Director**: Formulates visual mood, color palette, typography pairing, and logo concepts.
6. **Brand Battle / Critic**: Stress-tests the brand for genericity, audience friction, and contradictions.
7. **Consistency Guardian**: Verifies cross-stage alignment across 6 axes with numerical score.
8. **Launch Agent**: Synthesizes the final launch assets (pitch, tagline, landing page copy, social posts).

---

## 5. Shared `BrandState`

A typed dictionary structure (`packages/schemas/brand_state.py`) guarantees data contracts between all stages:
```python
class BrandState(TypedDict, total=False):
    project_id: str
    run_id: str
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

## 6. Targeted Revision Engine

- Critique findings are routed into targeted revisions (`POST /api/projects/{id}/revise`).
- Instead of re-running the entire pipeline from scratch, the engine executes only the targeted node and its downstream dependencies.
- Bounded to a maximum of 3 iterations to prevent infinite loops.

---

## 7. Human-In-The-Loop Control

- User selections are persisted via `POST /api/projects/{id}/selection`.
- Selected name and positioning angle flow directly into downstream nodes (`Creative Director`, `Critic`, `Consistency Guardian`, `Launch Agent`).
- Dedicated "Run 8-Agent Pipeline" button in the workflow sidebar allows user-initiated workflow triggers.

---

## 8. Server-Sent Events (SSE)

- Real backend execution events are streamed via `GET /api/projects/{project_id}/workflow/{run_id}/stream`.
- Emits real events: `workflow_started`, `stage_completed`, `revision_started`, `workflow_completed`.
- No simulated timers or fabricated progress bars.

---

## 9. BrandForge Conversational Assistant

- **Component**: `apps/web/components/studio/BrandChatDrawer.tsx`.
- **Backend Service**: `apps/api/app/services/chat_service.py` & `apps/api/app/api/chat.py`.
- **Allowlisted Server-Side Tools**:
  - `generate_names`: Produces alternative naming candidates.
  - `run_brand_battle`: Triggers fresh critique issues.
  - `run_consistency_check`: Evaluates system-wide alignment.
  - `generate_launch_copy`: Rewrites landing page messaging and social copy.
- **Context Awareness**: Assistant accesses active `BrandState` and applies modifications in real-time.
- **History Scoping**: Messages are persisted and isolated by `project_id` and authenticated `user_id`.

---

## 10. Brand Kit & Export System

- **Final Brand Kit**: Dynamically generated from state artifacts; rendered in `LaunchBrandKitView`.
- **Export Trigger**: User can initiate Brand Kit export via `POST /api/projects/{project_id}/export`.
- **Download Endpoint**: `GET /api/exports/{export_id}/download` serves the formatted Brand Kit JSON artifact.

---

## 11. Security & Tenant Isolation

- **Asymmetric JWT Verification**: Tokens validated against live Supabase JWKS using `PyJWKClient`.
- **Tenant Isolation**: Every API endpoint verifies `current_user["id"] == project["user_id"]`.
- **Tool Execution Boundaries**: Assistant can only invoke allowlisted internal methods; no arbitrary system execution.
- **Zero Secret Leakage**: No API keys or service role secrets exposed to frontend bundles.

---

## 12. Verification & Testing

1. **Frontend TypeScript Type Check**:
   - Command: `npx tsc --noEmit`
   - Result: **0 errors** (PASS).
2. **Frontend Production Build**:
   - Command: `npm run build`
   - Result: **Compiled successfully**; 10 static/dynamic routes generated (PASS).
3. **Backend Unit Test Suite**:
   - Command: `python -m unittest discover tests`
   - Result: **34/34 tests passed in 13.4s** (PASS).

---

## 13. Environment Configuration

### Frontend (`apps/web/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://oibdfowksbcvudgcmytt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_bYbDdPSKnQVqsksuvUPznQ_fKfCwMNZ
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bYbDdPSKnQVqsksuvUPznQ_fKfCwMNZ
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`):
```env
ENVIRONMENT=development
SUPABASE_URL=https://oibdfowksbcvudgcmytt.supabase.co
API_PREFIX=/api
AI_PROVIDER=openai
OPENAI_API_KEY=<required_for_live_llm_calls>
GEMINI_API_KEY=<optional>
```

---

## 14. Remaining Blockers

1. **Missing Third-Party AI API Credentials (`OPENAI_API_KEY` / `GEMINI_API_KEY`)**:
   - Neither `OPENAI_API_KEY` nor `GEMINI_API_KEY` is present in the local environment or `.env`.
   - In accordance with non-negotiable engineering rules, BrandForge **fails fast with an explicit configuration error** instead of silently fabricating mock output in development/production.
   - Once a valid API key is supplied in `.env`, the full 8-agent LangGraph workflow and studio assistant will execute live LLM calls immediately.
