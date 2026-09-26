import os
import sys
import asyncio
import json

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.abspath("."))

from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.services.workflow_service import WorkflowService


async def test_sse_streaming():
    print("Testing SSE Workflow Stream...")
    user_id = "sse-test-user"
    proj = ProjectService.create_project(
        user_id=user_id,
        name="SSE Clean Test",
        idea="Eco-friendly mobile car detailing on demand."
    )
    run = RunService.create_run(proj["id"], user_id)
    
    events_received = []
    # Stream events from workflow
    async for event_chunk in WorkflowService.stream_workflow_events(proj["id"], run["id"], user_id):
        # Each event_chunk has format: event: <event_name>\ndata: <json>\n\n
        for line in event_chunk.strip().split("\n"):
            if line.startswith("event: "):
                event_name = line.replace("event: ", "").strip()
                events_received.append(event_name)
                print(f"[SSE Event Received]: {event_name}")
                
    print(f"Total SSE Events: {len(events_received)}")
    print(f"Events Sequence: {events_received}")
    assert "workflow_started" in events_received, "Must receive workflow_started"
    assert "workflow_completed" in events_received, "Must receive workflow_completed"
    assert "stage_completed" in events_received, "Must receive stage_completed"
    print("[OK] Real SSE Stream verified successfully!")

if __name__ == "__main__":
    asyncio.run(test_sse_streaming())
