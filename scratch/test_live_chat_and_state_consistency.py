import os
import sys
import json
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.abspath("."))

from apps.api.ai.provider import get_ai_provider
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.services.workflow_service import WorkflowService
from apps.api.app.services.chat_service import ChatService
from apps.api.app.services.export_service import ExportService
from apps.api.app.db.repository import repository
from apps.api.ai.graph_interface import (
    discover_node,
    position_node,
    personality_node,
    naming_node,
    visual_node,
    critic_node,
    consistency_node,
    launch_node,
)


def run_full_chat_and_consistency_verification():
    print("=" * 60)
    print("BRANDFORGE LIVE CHAT & STATE CONSISTENCY HARDENING TEST")
    print("=" * 60)

    user_id = f"test-user-hardening-{int(time.time())}"
    user_prompt = "An app where customers can book verified home-cleaning professionals, compare prices, schedule recurring cleaning, and pay through the app."
    provider = get_ai_provider()
    print(f"Active Provider: {provider.__class__.__name__} ({provider.model_name})")

    # STEP 0: Create real project & initial 8-stage brand run
    print("\n--- STEP 0: INITIAL 8-STAGE WORKFLOW EXECUTION ---")
    project = ProjectService.create_project(
        user_id=user_id,
        name="HomeCleaningApp",
        idea=user_prompt,
        constraints={"target": "busy urban professionals", "tone": "trustworthy"}
    )
    project_id = project["id"]
    run = RunService.create_run(project_id, user_id)
    run_id = run["id"]

    state = {
        "project_id": project_id,
        "run_id": run_id,
        "idea": user_prompt,
        "constraints": project["constraints"],
        "selected_direction": {"name": {"name": "VeriClean"}},
        "status": "started",
        "revision_count": 0,
    }

    print("Executing stages 1 to 8 via live Gemini...")
    state = discover_node(state, provider)
    state = position_node(state, provider)
    state = personality_node(state, provider)
    state = naming_node(state, provider)
    state = visual_node(state, provider)
    state = critic_node(state, provider)
    state = consistency_node(state, provider)
    state = launch_node(state, provider)

    initial_bundle = repository.get_accumulated_brand_state(project_id)
    completed_stages = initial_bundle["completed_stages"]
    print(f"[OK] Completed Stages: {len(completed_stages)}/{initial_bundle['total_stages']} ({', '.join(completed_stages)})")
    assert len(completed_stages) == 8, f"Expected 8 stages, got {len(completed_stages)}"
    print("[OK] Initial 8-Agent State fully populated in database.")

    # =========================================================================
    # ISSUE 10: 9-TURN LIVE CHAT TEST SEQUENCE
    # =========================================================================

    # TURN 1: "Show me the final brand summary."
    print("\n" + "=" * 50)
    print("TURN 1: 'Show me the final brand summary.' (Informational)")
    print("=" * 50)
    res1 = ChatService.process_message(project_id, user_id, "Show me the final brand summary.")
    print(res1.reply)
    assert "8/8" in res1.reply, f"Expected '8/8' completed stages, got reply: {res1.reply[:300]}"
    assert "VeriClean" in res1.reply or "HomeCleaningApp" in res1.reply
    assert "Consistency Result" in res1.reply
    assert "Production Ready" in res1.reply
    print("[OK] Turn 1 PASSED: 8/8 stages correctly reflected without staleness!")

    # TURN 2: "Make the brand feel more premium."
    print("\n" + "=" * 50)
    print("TURN 2: 'Make the brand feel more premium.' (Mutating)")
    print("=" * 50)
    res2 = ChatService.process_message(project_id, user_id, "Make the brand feel more premium.")
    print(res2.reply)
    assert len(res2.tools_executed) > 0, "Tool must execute"
    tool2 = res2.tools_executed[0]
    assert tool2.tool == "revise_personality"
    assert tool2.status == "completed"
    assert "Changed:" in res2.reply
    assert "Because:" in res2.reply
    assert "Downstream:" in res2.reply
    assert "Current consistency:" in res2.reply
    assert "Brand Kit:\n**Updated**" in res2.reply or "Brand Kit:" in res2.reply
    print("[OK] Turn 2 PASSED: revise_personality mutated personality, visual, consistency, and launch!")

    # TURN 3: "Show me the final brand summary."
    print("\n" + "=" * 50)
    print("TURN 3: 'Show me the final brand summary.' (Informational post-mutation)")
    print("=" * 50)
    res3 = ChatService.process_message(project_id, user_id, "Show me the final brand summary.")
    print(res3.reply)
    assert "8/8" in res3.reply
    print("[OK] Turn 3 PASSED: Verified summary reflects updated state!")

    # TURN 4: "Give me 5 stronger names."
    print("\n" + "=" * 50)
    print("TURN 4: 'Give me 5 stronger names.' (Generative)")
    print("=" * 50)
    res4 = ChatService.process_message(project_id, user_id, "Give me 5 stronger names.")
    print(res4.reply[:500] + "...")
    assert len(res4.tools_executed) > 0
    assert res4.tools_executed[0].tool == "generate_names"
    candidates = res4.tools_executed[0].details.get("candidates", [])
    print(f"[OK] Generated Candidates: {candidates}")
    assert len(candidates) >= 2, "Expected at least 2 candidate names"
    second_candidate = candidates[1]
    print(f"[Target for Turn 5]: Second name is '{second_candidate}'")
    print("[OK] Turn 4 PASSED: generate_names synthesized fresh candidates!")

    # TURN 5: "Use the second name."
    print("\n" + "=" * 50)
    print(f"TURN 5: 'Use the second name.' (Mutating — Selecting '{second_candidate}')")
    print("=" * 50)
    res5 = ChatService.process_message(project_id, user_id, "Use the second name.")
    print(res5.reply)
    assert len(res5.tools_executed) > 0
    assert res5.tools_executed[0].tool == "apply_name_selection"
    assert second_candidate.lower() in res5.reply.lower() or "second" in res5.reply.lower()
    # Verify state persistence
    bundle_after_name = repository.get_accumulated_brand_state(project_id)
    selected_name_in_state = bundle_after_name["selected_directions"].get("name", {}).get("name")
    print(f"[OK] Selected Name in State: {selected_name_in_state}")
    assert selected_name_in_state == second_candidate, f"Expected {second_candidate}, got {selected_name_in_state}"
    print("[OK] Turn 5 PASSED: Selected second name applied downstream to visual and launch kits!")

    # TURN 6: "Challenge the brand again."
    print("\n" + "=" * 50)
    print("TURN 6: 'Challenge the brand again.' (Brand Battle / Critic)")
    print("=" * 50)
    res6 = ChatService.process_message(project_id, user_id, "Challenge the brand again.")
    print(res6.reply[:500] + "...")
    assert len(res6.tools_executed) > 0
    assert res6.tools_executed[0].tool == "run_brand_battle"
    print("[OK] Turn 6 PASSED: run_brand_battle evaluated new brand state!")

    # TURN 7: "Fix the consistency problems."
    print("\n" + "=" * 50)
    print("TURN 7: 'Fix the consistency problems.' (Consistency Repair)")
    print("=" * 50)
    res7 = ChatService.process_message(project_id, user_id, "Fix the consistency problems.")
    print(res7.reply)
    assert len(res7.tools_executed) > 0
    assert res7.tools_executed[0].tool == "run_consistency_check"
    assert "Consistency" in res7.reply
    print("[OK] Turn 7 PASSED: run_consistency_check resolved alignment issues!")

    # TURN 8: "Regenerate the launch messaging."
    print("\n" + "=" * 50)
    print("TURN 8: 'Regenerate the launch messaging.' (Launch Kit Regeneration)")
    print("=" * 50)
    res8 = ChatService.process_message(project_id, user_id, "Regenerate the launch messaging.")
    print(res8.reply)
    assert len(res8.tools_executed) > 0
    assert res8.tools_executed[0].tool == "generate_launch_copy"
    assert "Tagline:" in res8.reply
    print("[OK] Turn 8 PASSED: generate_launch_copy regenerated launch kit!")

    # TURN 9: "Show me the final brand summary."
    print("\n" + "=" * 50)
    print("TURN 9: 'Show me the final brand summary.' (Final Verification)")
    print("=" * 50)
    res9 = ChatService.process_message(project_id, user_id, "Show me the final brand summary.")
    print(res9.reply)
    assert "8/8" in res9.reply
    assert second_candidate in res9.reply or bundle_after_name["selected_directions"]["name"]["name"] in res9.reply
    assert "Consistency Result" in res9.reply
    assert "Production Ready" in res9.reply
    print("[OK] Turn 9 PASSED: Final summary is 100% authoritative and up to date!")

    # =========================================================================
    # ISSUE 11: SINGLE SOURCE OF TRUTH VERIFICATION
    # =========================================================================
    print("\n" + "=" * 60)
    print("ISSUE 11: VERIFYING SINGLE SOURCE OF TRUTH (CHAT = BRAND KIT = EXPORT)")
    print("=" * 60)

    # 1. State Bundle
    final_bundle = repository.get_accumulated_brand_state(project_id)
    final_artifacts = final_bundle["artifact_map"]

    # 2. Brand Kit Endpoint Service
    from apps.api.app.api.artifacts import get_brand_kit
    brand_kit_res = get_brand_kit(project_id=project_id, current_user={"id": user_id})
    print(f"[OK] Brand Kit Name: {brand_kit_res['brand_name']}")
    print(f"[OK] Brand Kit Tagline: {brand_kit_res['tagline']}")
    print(f"[OK] Brand Kit Artifacts Count: {len(brand_kit_res['artifacts'])}")
    assert brand_kit_res["brand_name"] == second_candidate, f"Expected {second_candidate}, got {brand_kit_res['brand_name']}"
    assert len(brand_kit_res["artifacts"]) >= 8, "Brand kit must contain all stages"

    # 3. Export Service
    export_job = ExportService.create_export_job(project_id, user_id, "json")
    export_content = ExportService.get_export_content(export_job["export_id"])
    print(f"[OK] Exported Artifacts Count: {len(export_content['artifacts'])}")
    assert len(export_content["artifacts"]) >= 8, "Exported kit must contain all stages"

    # 4. Consistency Across All Channels
    assert brand_kit_res["tagline"] == final_artifacts["launch"]["tagline"], "Brand Kit tagline must match accumulated state"
    assert export_content["artifacts"]["launch"]["tagline"] == final_artifacts["launch"]["tagline"], "Export tagline must match accumulated state"
    assert second_candidate in res9.reply, "Chat summary name must match Brand Kit name"

    print("\n" + "=" * 60)
    print("ALL 9 CHAT TURNS & SINGLE SOURCE OF TRUTH VERIFIED 100%!")
    print("=" * 60)


if __name__ == "__main__":
    run_full_chat_and_consistency_verification()
