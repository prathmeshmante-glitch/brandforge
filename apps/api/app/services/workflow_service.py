import json
import asyncio
import logging
from typing import Dict, Any, AsyncGenerator, Optional
from fastapi import BackgroundTasks
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.db.repository import repository
from apps.api.ai.graph_interface import run_brand_workflow, stream_brand_workflow

logger = logging.getLogger(__name__)

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
    def _execute_workflow_job(project_id: str, run_id: str, idea: str, constraints: Dict[str, Any]):
        try:
            repository.update_brand_run_status(run_id, "running")
            selections = repository.get_selections_for_project(project_id)
            selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}

            initial_state = {
                "project_id": project_id,
                "run_id": run_id,
                "idea": idea,
                "constraints": constraints,
                "selected_direction": selected_dict,
                "status": "started",
                "revision_count": 0,
                "errors": []
            }

            final_state = run_brand_workflow(initial_state)
            status = final_state.get("status", "completed")
            repository.update_brand_run_status(run_id, status)
            logger.info(f"Workflow run {run_id} for project {project_id} completed with status: {status}")
        except Exception as e:
            logger.error(f"Workflow run {run_id} failed with error: {e}", exc_info=True)
            repository.update_brand_run_status(run_id, "failed")

    @staticmethod
    def start_workflow(
        project_id: str,
        user_id: str,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> Dict[str, Any]:
        # Enforce project ownership authorization
        project = ProjectService.get_user_project(project_id, user_id)
        run = RunService.create_run(project_id, user_id)
        run_id = run["id"]
        repository.update_brand_run_status(run_id, "running")

        idea = project.get("idea", "")
        constraints = project.get("constraints", {})

        if background_tasks:
            background_tasks.add_task(
                WorkflowService._execute_workflow_job,
                project_id,
                run_id,
                idea,
                constraints
            )
            return {
                "run_id": run_id,
                "project_id": project_id,
                "status": "running",
                "revision_count": 0,
                "message": "AI workflow started in background"
            }
        else:
            # Synchronous execution for test environments or when background_tasks is None
            WorkflowService._execute_workflow_job(project_id, run_id, idea, constraints)
            updated_run = repository.get_brand_run_by_id(run_id) or run
            return {
                "run_id": run_id,
                "project_id": project_id,
                "status": updated_run.get("status", "completed"),
                "revision_count": 0,
                "message": "AI workflow execution completed"
            }

    @staticmethod
    def get_workflow_status(project_id: str, run_id: str, user_id: str) -> Dict[str, Any]:
        run = RunService.get_run(run_id, project_id, user_id)
        run_status = run.get("status", "running")
        state_bundle = repository.get_accumulated_brand_state(project_id)
        completed_stages = set(state_bundle["completed_stages"])
        
        stage_statuses = []
        for i, s in enumerate(STAGES_LIST):
            if s in completed_stages:
                stage_status = "completed"
            elif run_status == "running" and len(completed_stages) == i:
                stage_status = "running"
            elif run_status == "failed" and len(completed_stages) == i:
                stage_status = "failed"
            else:
                stage_status = "waiting"

            stage_statuses.append({
                "stage": s,
                "status": stage_status,
                "artifacts_count": 1 if s in completed_stages else 0
            })
            
        current_stage = (
            STAGES_LIST[len(completed_stages)]
            if len(completed_stages) < len(STAGES_LIST)
            else "completed"
        )
        
        overall_status = "completed" if len(completed_stages) == len(STAGES_LIST) else run_status

        return {
            "run_id": run_id,
            "project_id": project_id,
            "status": overall_status,
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
        run_status = final_state.get("status", "completed")
        repository.update_brand_run_status(run["id"], run_status)
        
        return {
            "status": "revision_completed",
            "project_id": project_id,
            "target_stage": target_stage,
            "new_run_id": run["id"],
            "message": f"Revision executed for stage '{target_stage}' with user instructions"
        }
