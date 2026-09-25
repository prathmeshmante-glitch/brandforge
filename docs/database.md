# BrandForge — Database Schema & Security Specification

This document details the PostgreSQL schema managed via Supabase, including table structures, foreign key relationships, triggers, indexes, Row Level Security (RLS) policies, and Supabase Storage bucket rules.

---

## 1. Schema Tables Overview

### `profiles`
Stores user profile information, automatically linked to Supabase Auth users via trigger.
- `id` (UUID, Primary Key, references `auth.users.id` ON DELETE CASCADE)
- `name` (TEXT) — Extracted from OAuth metadata or user email on signup
- `avatar_url` (TEXT) — Profile picture URL
- `created_at` (TIMESTAMPTZ, Default: `now()`)

### `projects`
Core project record created when a user inputs a brand idea.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `user_id` (UUID, NOT NULL, Foreign Key references `profiles.id` ON DELETE CASCADE)
- `name` (TEXT, NOT NULL) — Project title
- `idea` (TEXT, NOT NULL) — Raw startup / product idea input
- `status` (TEXT, Default: `'draft'`) — Current status (`draft`, `running`, `completed`)
- `created_at` (TIMESTAMPTZ, Default: `now()`)
- `updated_at` (TIMESTAMPTZ, Default: `now()`, automatically updated via trigger)

### `brand_runs`
Workflow run iterations for a given project.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `project_id` (UUID, NOT NULL, Foreign Key references `projects.id` ON DELETE CASCADE)
- `version` (INT, Default: 1) — Run version sequence
- `status` (TEXT, Default: `'pending'`) — Run status (`pending`, `running`, `completed`, `failed`)
- `started_at` (TIMESTAMPTZ, Default: `now()`)
- `completed_at` (TIMESTAMPTZ)
- *Constraint*: `UNIQUE (project_id, version)`

### `brand_artifacts`
Output JSON payloads produced by each AI agent for a specific run.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `run_id` (UUID, NOT NULL, Foreign Key references `brand_runs.id` ON DELETE CASCADE)
- `stage` (TEXT, NOT NULL) — Stage name (`discovery`, `positioning`, `personality`, `naming`, `visual`, `critique`, `consistency`, `launch`)
- `artifact_json` (JSONB, NOT NULL) — Validated Pydantic output JSON
- `created_at` (TIMESTAMPTZ, Default: `now()`)

### `selected_directions`
Human decision inputs recorded during the workflow.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `project_id` (UUID, NOT NULL, Foreign Key references `projects.id` ON DELETE CASCADE)
- `direction_type` (TEXT, NOT NULL) — Choice category (`preferred_name`, `naming_territory`, `personality`, `visual_style`)
- `selected_value` (JSONB, NOT NULL) — User decision payload
- `created_at` (TIMESTAMPTZ, Default: `now()`)

### `exports`
Exported PDF brand kits and zip bundles.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `project_id` (UUID, NOT NULL, Foreign Key references `projects.id` ON DELETE CASCADE)
- `type` (TEXT, NOT NULL) — Export format (`pdf`, `zip`, `json`)
- `storage_path` (TEXT, NOT NULL) — Path inside Supabase Storage
- `created_at` (TIMESTAMPTZ, Default: `now()`)

---

## 2. Automated PostgreSQL Triggers

### 1. Automatic User Profile Creation (`on_auth_user_created`)
Executes `SECURITY DEFINER` function `public.handle_new_user()` on `AFTER INSERT ON auth.users`.  
Automatically creates a corresponding record in `public.profiles` upon user registration via Supabase Auth (Email/Password or Google OAuth).

### 2. Project Timestamp Update (`tr_projects_updated_at`)
Executes `public.update_updated_at_column()` on `BEFORE UPDATE ON public.projects` to keep `updated_at` timestamps accurate.

---

## 3. Query Optimization & Indexes

- `idx_projects_user_id`: Fast lookup of projects by user ID.
- `idx_brand_runs_project_id`: Fast query of runs for a project.
- `idx_brand_artifacts_run_id`: Fast query of artifacts for a run.
- `idx_brand_artifacts_run_stage`: Composite index for retrieving specific stage artifacts (`run_id`, `stage`).
- `idx_selected_directions_project_id`: Fast query of user choices per project.
- `idx_exports_project_id`: Fast lookup of generated exports.

---

## 4. Row Level Security (RLS) & Access Control

All tables enforce PostgreSQL RLS. Users can **only** read, write, or mutate records associated with their own `auth.uid()`.

| Table | Operations Allowed | Policy Condition |
| :--- | :--- | :--- |
| `profiles` | `SELECT`, `UPDATE`, `INSERT` | `auth.uid() = id` |
| `projects` | `ALL` | `auth.uid() = user_id` |
| `brand_runs` | `ALL` | `EXISTS (projects WHERE id = project_id AND user_id = auth.uid())` |
| `brand_artifacts` | `ALL` | `EXISTS (brand_runs JOIN projects ON ... AND user_id = auth.uid())` |
| `selected_directions` | `ALL` | `EXISTS (projects WHERE id = project_id AND user_id = auth.uid())` |
| `exports` | `ALL` | `EXISTS (projects WHERE id = project_id AND user_id = auth.uid())` |

---

## 5. Supabase Storage Architecture & Security

- **Bucket Name**: `brand-assets` (Private, maximum file size: 50MB)
- **Allowed MIME Types**: `application/pdf`, `image/png`, `image/jpeg`, `image/svg+xml`, `application/json`
- **Object Path Structure**: `{user_id}/{project_id}/{asset_id}.pdf`
- **Storage RLS Policies**: Enforce `(storage.foldername(name))[1] = auth.uid()::text` for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
