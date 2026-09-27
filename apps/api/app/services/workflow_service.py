import json
import asyncio
import logging
from typing import Dict, Any, AsyncGenerator, Optional
from fastapi import BackgroundTasks
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.db.repository import repository
from apps.api.ai.graph_interface import run_brand_workflow, run_targeted_revision_workflow

logger = logging.getLogger("brandforge.workflow")

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
        """
        Authoritative single background execution worker for initial pipeline run.
        """
        try:
            logger.info(f"Starting workflow job for run {run_id}, project {project_id}")
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
            if not status or status == "started":
                status = "completed"
            repository.update_brand_run_status(run_id, status)
            logger.info(f"Authoritative workflow run {run_id} for project {project_id} completed with status: {status}")
        except Exception as e:
            logger.error(f"Authoritative workflow run {run_id} failed: {e}", exc_info=True)
            repository.update_brand_run_status(run_id, "failed")

    @staticmethod
    def _execute_revision_job(project_id: str, run_id: str, target_stage: str, feedback: str):
        """
        Authoritative background execution worker for targeted revision run.
        """
        try:
            logger.info(f"Starting revision job for run {run_id}, project {project_id}, target: {target_stage}")
            repository.update_brand_run_status(run_id, "running")
            project = repository.get_project_by_id(project_id) or {}
            selections = repository.get_selections_for_project(project_id)
            selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}

            # Pull existing accumulated artifacts to use as base for the revision
            state_bundle = repository.get_accumulated_brand_state(project_id)
            existing_artifacts = state_bundle.get("artifact_map", {})

            initial_state = {
                "project_id": project_id,
                "run_id": run_id,
                "idea": project.get("idea", ""),
                "constraints": project.get("constraints", {}),
                "selected_direction": selected_dict,
                "revision_count": state_bundle.get("revision_count", 0) + 1,
                "status": "revision_started",
                **existing_artifacts,
            }

            final_state = run_targeted_revision_workflow(
                initial_state=initial_state,
                target_stage=target_stage,
                feedback=feedback
            )
            status = final_state.get("status", "completed")
            repository.update_brand_run_status(run_id, status)
            logger.info(f"Revision run {run_id} for stage {target_stage} finished with status: {status}")
        except Exception as e:
            logger.error(f"Revision run {run_id} failed: {e}", exc_info=True)
            repository.update_brand_run_status(run_id, "failed")

    @staticmethod
    def start_workflow(
        project_id: str,
        user_id: str,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> Dict[str, Any]:
        # Enforce project ownership authorization
        project = ProjectService.get_user_project(project_id, user_id)

        # Idempotency / Duplicate Execution Guard:
        # If an active run is already running for this project, return that run instead of duplicating
        existing_runs = repository.list_runs_for_project(project_id)
        running_run = next((r for r in existing_runs if r.get("status") == "running"), None)
        if running_run:
            logger.info(f"Project {project_id} already has active running run {running_run['id']}; returning existing run")
            return {
                "run_id": running_run["id"],
                "project_id": project_id,
                "status": "running",
                "revision_count": running_run.get("version", 1) - 1,
                "message": "AI workflow already running for this project"
            }

        run = RunService.create_run(project_id, user_id)
        run_id = run["id"]
        repository.update_brand_run_status(run_id, "running")

        idea = project.get("idea", "")
        constraints = project.get("constraints", {})

        if background_tasks is not None:
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
                "revision_count": run.get("version", 1) - 1,
                "message": "AI workflow started in background"
            }
        else:
            # Synchronous execution for test environments
            WorkflowService._execute_workflow_job(project_id, run_id, idea, constraints)
            updated_run = repository.get_brand_run_by_id(run_id) or run
            return {
                "run_id": run_id,
                "project_id": project_id,
                "status": updated_run.get("status", "completed"),
                "revision_count": run.get("version", 1) - 1,
                "message": "AI workflow execution completed"
            }

    @staticmethod
    def get_workflow_status(project_id: str, run_id: str, user_id: str) -> Dict[str, Any]:
        ProjectService.get_user_project(project_id, user_id)
        run = RunService.get_run(run_id, project_id, user_id)
        run_status = run.get("status", "running")

        # Get artifacts specifically for this run
        run_artifacts = repository.get_run_artifacts_map(run_id)
        completed_stages = set(run_artifacts.keys())

        # Also check accumulated state if this run is part of a revision
        state_bundle = repository.get_accumulated_brand_state(project_id, run_id=run_id)
        all_completed = set(state_bundle.get("completed_stages", []))

        stage_statuses = []
        for i, s in enumerate(STAGES_LIST):
            if s in completed_stages or (s in all_completed and run_status == "completed"):
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
        CRITICAL ARCHITECTURAL GUARANTEE:
        This endpoint DOES NOT run the AI graph. It strictly streams events
        produced by the authoritative background execution job.
        """
        ProjectService.get_user_project(project_id, user_id)
        RunService.get_run(run_id, project_id, user_id)
        
        yield f"event: workflow_started\ndata: {json.dumps({'run_id': run_id, 'project_id': project_id})}\n\n"
        await asyncio.sleep(0.1)

        sent_stages = set()
        max_duration_seconds = 300  # 5 minutes safety timeout
        elapsed = 0.0
        interval = 0.5

        while elapsed < max_duration_seconds:
            run = repository.get_brand_run_by_id(run_id)
            if not run:
                break
            
            run_status = run.get("status", "running")

            # Check for new artifacts persisted for this run
            artifacts = repository.get_artifacts_for_run(run_id)
            for a in artifacts:
                stage = a.get("stage", "")
                if stage in ("visualize", "visual_direction"):
                    stage = "visual"
                if stage and stage not in sent_stages:
                    sent_stages.add(stage)
                    event_data = {
                        "run_id": run_id,
                        "project_id": project_id,
                        "stage": stage,
                        "status": "completed",
                        "artifact": a.get("artifact_json", {})
                    }
                    yield f"event: stage_completed\ndata: {json.dumps(event_data)}\n\n"

            if run_status == "completed":
                yield f"event: workflow_completed\ndata: {json.dumps({'run_id': run_id, 'status': 'completed'})}\n\n"
                break
            elif run_status == "failed":
                yield f"event: workflow_failed\ndata: {json.dumps({'run_id': run_id, 'status': 'failed'})}\n\n"
                break

            await asyncio.sleep(interval)
            elapsed += interval

    @staticmethod
    def request_revision(
        project_id: str,
        user_id: str,
        target_stage: str,
        feedback: str,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> Dict[str, Any]:
        # Enforce project ownership authorization
        ProjectService.get_user_project(project_id, user_id)
        
        # Save user revision instruction as human selection
        repository.create_selection(
            project_id=project_id,
            direction_type="revision_request",
            selected_value={"target": target_stage, "feedback": feedback}
        )
        
        # Create a new revision run record
        run = RunService.create_run(project_id, user_id)
        run_id = run["id"]
        repository.update_brand_run_status(run_id, "running")

        if background_tasks is not None:
            background_tasks.add_task(
                WorkflowService._execute_revision_job,
                project_id,
                run_id,
                target_stage,
                feedback
            )
            return {
                "status": "revision_started",
                "project_id": project_id,
                "target_stage": target_stage,
                "new_run_id": run_id,
                "run_id": run_id,
                "message": f"Revision queued for stage '{target_stage}'"
            }
        else:
            # Synchronous execution for test environment
            WorkflowService._execute_revision_job(project_id, run_id, target_stage, feedback)
            return {
                "status": "revision_completed",
                "project_id": project_id,
                "target_stage": target_stage,
                "new_run_id": run_id,
                "run_id": run_id,
                "message": f"Revision executed for stage '{target_stage}' with user instructions"
            }
