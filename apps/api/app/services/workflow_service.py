import json
import asyncio
from typing import Dict, Any, AsyncGenerator
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.db.repository import repository
from apps.api.ai.graph_interface import run_brand_workflow, stream_brand_workflow

STAGES_LIST = [
    "discovery",
    "positioning",
    "personality",
    "naming",
    "visual",
    "critique",
    "consistency",
    "launch",
]


class WorkflowService:
    @staticmethod
    def start_workflow(project_id: str, user_id: str) -> Dict[str, Any]:
        # Enforce project ownership authorization
        project = ProjectService.get_user_project(project_id, user_id)
        run = RunService.create_run(project_id, user_id)
        
        # Load user selections if present
        selections = repository.get_selections_for_project(project_id)
        selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}
        
        initial_state = {
            "project_id": project_id,
            "run_id": run["id"],
            "idea": project["idea"],
            "constraints": project.get("constraints", {}),
            "selected_direction": selected_dict,
            "status": "started",
            "revision_count": 0,
            "errors": []
        }
        
        # Execute LangGraph AI Workflow
        final_state = run_brand_workflow(initial_state)
        
        # Update run status
        run["status"] = final_state.get("status", "completed")
        run["completed_at"] = "2026-09-25T20:00:00Z"
        
        return {
            "run_id": run["id"],
            "project_id": project_id,
            "status": run["status"],
            "revision_count": final_state.get("revision_count", 0),
            "message": "AI workflow execution completed successfully"
        }

    @staticmethod
    def get_workflow_status(project_id: str, run_id: str, user_id: str) -> Dict[str, Any]:
        run = RunService.get_run(run_id, project_id, user_id)
        artifacts = repository.get_artifacts_for_run(run_id)
        completed_stages = {a["stage"] for a in artifacts}
        
        stage_statuses = []
        for s in STAGES_LIST:
            status = "completed" if s in completed_stages else "pending"
            stage_statuses.append({
                "stage": s,
                "status": status,
                "artifacts_count": 1 if s in completed_stages else 0
            })
            
        current_stage = STAGES_LIST[len(completed_stages)] if len(completed_stages) < len(STAGES_LIST) else "completed"
        
        return {
            "run_id": run_id,
            "project_id": project_id,
            "status": run["status"],
            "current_stage": current_stage,
            "stages": stage_statuses
        }

    @staticmethod
    async def stream_workflow_events(project_id: str, run_id: str, user_id: str) -> AsyncGenerator[str, None]:
        """
        SSE Event Stream yielding real stage execution and revision events.
        """
        project = ProjectService.get_user_project(project_id, user_id)
        RunService.get_run(run_id, project_id, user_id)
        
        yield f"event: workflow_started\ndata: {json.dumps({'run_id': run_id, 'project_id': project_id})}\n\n"
        await asyncio.sleep(0.05)
        
        selections = repository.get_selections_for_project(project_id)
        selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}
        
        initial_state = {
            "project_id": project_id,
            "run_id": run_id,
            "idea": project["idea"],
            "constraints": project.get("constraints", {}),
            "selected_direction": selected_dict,
            "status": "started",
            "revision_count": 0,
        }
        
        for update in stream_brand_workflow(initial_state):
            stage = update.get("stage")
            if stage == "revise":
                yield f"event: revision_started\ndata: {json.dumps(update)}\n\n"
            else:
                yield f"event: stage_completed\ndata: {json.dumps(update)}\n\n"
            await asyncio.sleep(0.05)
            
        yield f"event: workflow_completed\ndata: {json.dumps({'run_id': run_id, 'status': 'completed'})}\n\n"

    @staticmethod
    def request_revision(project_id: str, user_id: str, target_stage: str, feedback: str) -> Dict[str, Any]:
        project = ProjectService.get_user_project(project_id, user_id)
        
        # Save user revision instruction as human selection
        repository.create_selection(
            project_id=project_id,
            direction_type="revision_request",
            selected_value={"target": target_stage, "feedback": feedback}
        )
        
        # Trigger workflow execution with revision instruction
        run = RunService.create_run(project_id, user_id)
        selections = repository.get_selections_for_project(project_id)
        selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}
        
        initial_state = {
            "project_id": project_id,
            "run_id": run["id"],
            "idea": project["idea"],
            "constraints": project.get("constraints", {}),
            "selected_direction": selected_dict,
            "revision_count": 1,
            "status": "revision_requested"
        }
        
        final_state = run_brand_workflow(initial_state)
        run["status"] = final_state.get("status", "completed")
        
        return {
            "status": "revision_completed",
            "project_id": project_id,
            "target_stage": target_stage,
            "new_run_id": run["id"],
            "message": f"Revision executed for stage '{target_stage}' with user instructions"
        }
