# BrandForge — AI CODING AGENT RULES

## 1. PROJECT CONTEXT

BrandForge is an AI Brand Intelligence Studio.

The full product specification is in:

PROJECT_SPEC.md

PROJECT_SPEC.md is the source of truth.

Read PROJECT_SPEC.md before making architectural changes.

---

# 2. CORE PRODUCT PRINCIPLE

BrandForge is NOT a one-prompt AI wrapper.

The AI workflow is:

User Idea
→ Discover
→ Position
→ Personality
→ Naming
→ Visualize
→ Critique
→ Consistency
→ Launch

AI reasoning must remain structured and visible.

---

# 3. ARCHITECTURE

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Python
- FastAPI
- Pydantic

AI:
- LangGraph
- Structured outputs
- Provider abstraction

Database:
- Supabase PostgreSQL

Authentication:
- Supabase Auth

Storage:
- Supabase Storage

---

# 4. SHARED STATE

All AI agents communicate using shared structured BrandState.

Never pass uncontrolled giant text blobs when structured data can be used.

Use typed schemas.

Every AI node must have:
1. Input schema
2. Prompt
3. Output schema
4. Validation
5. Error handling

---

# 5. AI AGENTS

Implement these logical agents:
1. Discoverer
2. Positioner
3. Brand Strategist
4. Naming Agent
5. Creative Director
6. Brand Battle / Critic
7. Consistency Guardian
8. Launch Agent

---

# 6. AGENT RULES

Each agent must perform ONE clearly defined responsibility.

Do not create agents that duplicate existing responsibilities.

Do not let agents silently change previous validated decisions.

Changes to previous decisions must be represented as revisions.

---

# 7. HUMAN CONTROL

The user must be able to:
- Select directions
- Reject options
- Request alternatives
- Approve revisions

Do not build a completely autonomous workflow that hides decisions from the user.

---

# 8. FRONTEND RULES

Frontend agents own:
apps/web/

Do not modify:
- Supabase migrations
- AI workflow logic
- Backend business logic
unless explicitly requested.

Use reusable components.

Do not create duplicate UI components for identical functionality.

---

# 9. BACKEND RULES

Backend agents own:
apps/api/

Do not modify frontend code.

Use:
- FastAPI
- Pydantic
- service separation
- clear API contracts
- typed errors

---

# 10. DATABASE RULES

Database agents own:
supabase/

All user-owned data must respect authorization.

Use:
- foreign keys
- indexes
- timestamps
- RLS

Do not store unstructured duplicate data unnecessarily.

---

# 11. AI WORKFLOW RULES

AI workflow agents own:
apps/api/ai/
packages/prompts/

Use LangGraph.

Use structured outputs.

Do not make one giant prompt responsible for the entire product.

Do not hard-code the application to a single provider at the architecture level.

---

# 12. FILE OWNERSHIP

Frontend:
apps/web/

Backend:
apps/api/

AI:
apps/api/ai/
packages/prompts/

Database:
supabase/

Shared schemas/types:
packages/

Documentation:
docs/

Tests:
tests/

---

# 13. CODE QUALITY

All code must be:
- typed
- modular
- readable
- testable
- documented where necessary

Avoid unnecessary abstractions.

Avoid unnecessary dependencies.

Do not rewrite working code without a reason.

---

# 14. CHANGE SAFETY

Before modifying a file:
1. Understand its purpose.
2. Check dependencies.
3. Check whether another agent owns it.
4. Make the smallest required change.
5. Run relevant tests.

Never overwrite another agent's work.

---

# 15. GIT

Use feature branches/worktrees.

Examples:
feat/frontend
feat/backend
feat/ai-workflow
feat/database
feat/tests

Do not directly modify main during parallel development unless instructed.

---

# 16. MVP PRIORITY

Prioritize:
1. Working end-to-end workflow
2. AI reasoning
3. Structured state
4. Critique
5. Consistency
6. Human interaction
7. Final brand kit
8. UI polish

Do not spend excessive time on secondary features.

---

# 17. DO NOT BUILD IN V1

Do not add:
- payments
- chat
- social network
- team collaboration
- notifications
- marketplace
- complex admin dashboard
- full logo editor
- mobile app
unless specifically requested.

---

# 18. DEMO REQUIREMENT

The working demo must clearly show:
Problem → Product → Input → AI Workflow → Output → Differentiator

The AI workflow must be visible.

---

# 19. IMPORTANT

Before claiming a task is complete:
- run tests
- verify imports
- verify API contracts
- verify environment configuration
- verify changed files
- report any limitations

Never claim something works without testing it.
