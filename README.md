# BrandForge — AI Brand Intelligence Studio

> **From rough idea to launch-ready brand.**

BrandForge is an AI-powered Brand Intelligence Studio that transforms a rough startup, product, community, or creator idea into a coherent, useful, and launch-ready brand system.

---

## 🌟 Overview

BrandForge moves beyond simple text generation or one-prompt AI wrappers. It implements a structured multi-stage workflow powered by specialized AI agents:

```text
Rough Idea ──► Discovery ──► Positioning ──► Brand Strategy ──► Naming 
              ──► Visual Direction ──► Brand Battle (Critic) ──► Consistency Guardian 
              ──► Launch Kit
```

---

## 🚀 Key Features

- **Structured AI Workflow**: 8 logical agents executing specialized roles with validated JSON output schemas.
- **Brand Battle / AI Critic**: Challenges weak, generic, or contradictory branding decisions before finalization.
- **Consistency Guardian**: Evaluates cross-artifact alignment (Voice, Personality, Positioning, Visuals) with automated revision loops.
- **Human-in-the-Loop**: Users retain full creative control to select naming territories, personality traits, and visual directions.
- **Launch Kit Generation**: Instantly generates landing page copy, social media launch posts, one-liners, and downloadable brand kits.

---

## 📂 Repository Structure

```text
brandforge/
├── AGENTS.md             # AI coding guidelines and ownership constraints
├── PROJECT_SPEC.md       # Master project specification (single source of truth)
├── README.md             # Public repository overview
├── .env.example          # Environment variables template
├── docker-compose.yml    # Container deployment orchestration
│
├── docs/                 # Technical documentation
│   ├── architecture.md   # System flowcharts & topology diagrams
│   ├── ai-workflow.md   # Agent schemas & state transitions
│   ├── database.md       # Supabase PostgreSQL schema & RLS policies
│   └── api.md            # REST API contract specification
│
├── apps/                 # Monorepo applications
│   ├── web/              # Next.js 14 frontend (TypeScript + Tailwind CSS + shadcn/ui)
│   └── api/              # FastAPI backend (LangGraph + Pydantic + Provider Abstraction)
│
├── packages/             # Shared monorepo packages
│   ├── schemas/          # Shared Pydantic data schemas & BrandState
│   ├── types/            # Shared TypeScript type definitions
│   └── prompts/          # AI agent system prompts
│
├── supabase/             # Database migrations & seeds
│   ├── migrations/       # PostgreSQL DDL migrations
│   └── seed.sql          # Seed data for local development
│
└── tests/                # Automated unit & integration tests
```

---

## 🛠️ Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Supabase CLI** (for local database development)

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your API credentials:

```bash
cp .env.example .env
```

### 2. Backend Setup (`apps/api`)

```bash
cd apps/api
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

FastAPI server runs at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup (`apps/web`)

```bash
cd apps/web
npm install
npm run dev
```

Next.js web client runs at `http://localhost:3000`.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
