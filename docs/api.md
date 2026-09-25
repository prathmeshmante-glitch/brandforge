# BrandForge — REST API Contract

This document details the REST API specification for the FastAPI backend (`apps/api`).

---

## Base URL
`http://localhost:8000/api`

---

## Endpoints

### 1. Projects Management

#### `POST /api/projects`
- **Description**: Create a new branding project.
- **Request Body**:
  ```json
  {
    "name": "TeamUp",
    "idea": "An app that helps college students find hackathon teammates",
    "constraints": {}
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "uuid-1234",
    "name": "TeamUp",
    "idea": "...",
    "status": "created",
    "created_at": "2026-09-25T19:00:00Z"
  }
  ```

#### `GET /api/projects`
- **Description**: List all projects belonging to the authenticated user.
- **Response**: `200 OK` (Array of Project objects)

#### `GET /api/projects/{id}`
- **Description**: Retrieve detailed project info and latest brand run state.
- **Response**: `200 OK` (Project detail with runs and artifacts)

---

### 2. Workflow Execution

#### `POST /api/projects/{id}/workflow/start`
- **Description**: Start or restart an AI workflow run for a project.
- **Request Body**: `{ "provider": "openai" }`
- **Response**: `202 Accepted`
  ```json
  {
    "run_id": "run-5678",
    "status": "running"
  }
  ```

#### `GET /api/projects/{id}/workflow/{run_id}/stream`
- **Description**: Server-Sent Events (SSE) endpoint for streaming real-time workflow status updates.
- **Media Type**: `text/event-stream`
- **Events**: `discovery_completed`, `positioning_completed`, `naming_completed`, `critique_flagged`, `consistency_passed`, `workflow_completed`.

---

### 3. Human Control & Selection

#### `POST /api/projects/{id}/selection`
- **Description**: Save user choices (preferred naming territory, name choice, visual direction).
- **Request Body**:
  ```json
  {
    "direction_type": "preferred_name",
    "selected_value": {
      "name": "NexusCraft",
      "territory": "collaboration"
    }
  }
  ```
- **Response**: `200 OK`

#### `POST /api/projects/{id}/revise`
- **Description**: Trigger a revision loop with user feedback.
- **Request Body**:
  ```json
  {
    "target_stage": "naming",
    "feedback": "Make names feel more energetic and modern"
  }
  ```
- **Response**: `202 Accepted`

---

### 4. Brand Kit & Export

#### `GET /api/projects/{id}/brand-kit`
- **Description**: Fetch the full validated Brand Kit for a project.
- **Response**: `200 OK` (Combined JSON object with Strategy, Identity, Voice, Quality, Launch content)

#### `POST /api/projects/{id}/export`
- **Description**: Generate downloadable Brand Kit assets (e.g. PDF).
- **Request Body**: `{ "format": "pdf" }`
- **Response**: `200 OK` (`{ "download_url": "...", "export_id": "..." }`)
