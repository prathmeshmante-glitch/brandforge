# BrandForge — System Architecture & Flowcharts

This document describes the overall system topology, AI workflow diagram, state propagation flow, and database entity relationships for BrandForge.

---

## 1. Overall System Architecture

```text
                         GITHUB
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
          VERCEL                      RENDER / RAILWAY
              │                           │
              ▼                           ▼
        NEXT.JS WEB                    FASTAPI
        (apps/web)                    (apps/api)
                                          │
                                          ▼
                                      LANGGRAPH
                                  (apps/api/ai)
                                          │
                                 ┌────────┼────────┐
                                 ▼        ▼        ▼
                              OpenAI  Anthropic Gemini
                                         
                                          │
                                          ▼
                                     SUPABASE
                                  ┌──────┼──────┐
                                  ▼      ▼      ▼
                               PostgreSQL Auth Storage
```

---

## 2. AI Workflow Architecture

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

## 3. Database Entity Relationship Diagram

```text
auth.users
     │
     ▼
 profiles
     │
     ▼
 projects
     │
     ├──────────────┐
     ▼              ▼
brand_runs    selected_directions
     │
     ▼
brand_artifacts
     │
     ▼
  exports
```

---

## 4. End-to-End Execution Flow

1. **User Authentication**: User signs in via Supabase Auth (OAuth/Email) and retrieves JWT.
2. **Project Creation**: Client POSTs initial prompt and constraints to `/api/projects`.
3. **Workflow Initiation**: Backend spawns a LangGraph execution run (`brand_runs`), initializing `BrandState`.
4. **Agent Pipeline**:
   - `Discoverer` -> extracts problem, target audience, open questions.
   - `Positioner` -> defines category, value prop, competitive angle.
   - `Brand Strategist` -> defines personality traits, tone rules, archetype.
   - `Naming Agent` -> generates territory-structured name options.
   - `Creative Director` -> defines visual mood, palette, typography, logo direction.
   - `Critic` -> evaluates genericity, contradictions, audience mismatches.
   - `Consistency Guardian` -> scores overall alignment across artifacts.
   - `Revision Loop` -> auto-triggers if consistency < threshold (max 3 retries).
   - `Launch Agent` -> generates landing copy, launch social posts, brand voice samples.
5. **Human Decisions**: User submits selections via `/api/projects/{id}/selection` which injects into `BrandState`.
6. **Brand Kit Delivery & Export**: Complete brand kit persisted in `brand_artifacts` and available for PDF export.
