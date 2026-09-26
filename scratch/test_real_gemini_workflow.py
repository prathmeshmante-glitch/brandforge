import os
import sys
import json
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath("."))

from apps.api.ai.provider import get_ai_provider
from apps.api.ai.graph_interface import (
    discover_node,
    position_node,
    personality_node,
    naming_node,
    visual_node,
    critic_node,
    consistency_node,
    revision_planner_node,
    launch_node,
    run_brand_workflow
)
from apps.api.app.services.chat_service import ChatService
from apps.api.app.db.repository import repository

def test_full_pipeline():
    print("=" * 60)
    print("STARTING LIVE GEMINI 8-AGENT PIPELINE TEST")
    print("=" * 60)
    
    provider = get_ai_provider()
    print(f"Provider Active: {provider.__class__.__name__} (Model: {provider.model_name})")
    
    # 1. Initialize BrandState
    project_id = f"test-cleaning-{int(time.time())}"
    run_id = f"run-cleaning-{int(time.time())}"
    user_id = "test-user-e2e"
    idea = "An app where customers can book verified home-cleaning professionals, compare prices, schedule recurring cleaning, and pay through the app."
    
    repository.create_project(
        user_id=user_id,
        name="HomeCleaningApp",
        idea=idea,
        constraints={"target": "urban busy homeowners", "tone": "reliable, trustworthy"}
    )
    # Update project id to our test id
    proj = repository.list_projects_for_user(user_id)[-1]
    project_id = proj["id"]
    
    run = repository.create_brand_run(project_id=project_id)
    run_id = run["id"]
    
    state = {
        "project_id": project_id,
        "run_id": run_id,
        "idea": idea,
        "constraints": {"tone": "trustworthy", "model": "on-demand marketplace"},
        "selected_direction": {},
        "status": "started",
        "revision_count": 0,
        "errors": []
    }
    
    # STAGE 1: Discoverer
    print("\n--- STAGE 1: DISCOVERER ---")
    state = discover_node(state, provider)
    disc = state["discovery"]
    print(f"[OK] Discovery problem: {disc['problem'][:80]}...")
    print(f"[OK] Target users found: {len(disc['target_users'])} segments")
    assert disc["problem"], "Discovery problem must not be empty"
    assert "home" in disc["problem"].lower() or "clean" in disc["problem"].lower() or "service" in disc["problem"].lower(), "Discovery must be about cleaning"
    
    # STAGE 2: Positioner
    print("\n--- STAGE 2: POSITIONER ---")
    state = position_node(state, provider)
    pos = state["positioning"]
    print(f"[OK] Category: {pos.get('category')}")
    print(f"[OK] Value proposition: {pos.get('value_proposition')[:80]}...")
    print(f"[OK] Differentiators count: {len(pos.get('differentiators', []))}")
    assert pos.get("category"), "Positioning category required"
    
    # STAGE 3: Brand Strategist (Personality)
    print("\n--- STAGE 3: BRAND STRATEGIST ---")
    state = personality_node(state, provider)
    pers = state["personality"]
    print(f"[OK] Archetype: {pers.get('brand_archetype')}")
    print(f"[OK] Emotional goal: {pers.get('emotional_goal')}")
    print(f"[OK] Principles: {pers.get('principles')}")
    assert pers.get("brand_archetype"), "Archetype required"
    
    # STAGE 4: Naming Agent
    print("\n--- STAGE 4: NAMING AGENT ---")
    state = naming_node(state, provider)
    nam = state["naming"]
    print(f"[OK] Naming Territories: {len(nam.get('territories', []))}")
    candidates = []
    for t in nam.get("territories", []):
        for n in t.get("names", []):
            candidates.append(n["name"])
    print(f"[OK] Candidate Names Generated: {candidates}")
    assert len(candidates) >= 2, "Must generate candidate names"
    
    # HUMAN-IN-THE-LOOP: Select Name
    selected_name = candidates[0]
    print(f"\n--- HUMAN-IN-THE-LOOP SELECTION ---")
    print(f"[USER ACTION] Selected Brand Name: '{selected_name}'")
    state["selected_direction"] = {
        "name": selected_name,
        "preferred_name": selected_name,
        "chosen_territory": nam["territories"][0]["type"]
    }
    repository.create_selection(
        project_id=project_id,
        direction_type="name",
        selected_value={"name": selected_name}
    )
    
    # STAGE 5: Creative Director (Visual Identity)
    print("\n--- STAGE 5: CREATIVE DIRECTOR ---")
    state = visual_node(state, provider)
    vis = state["visual_direction"]
    v_dir = vis.get("visual_direction", {})
    l_dir = vis.get("logo_direction", {})
    print(f"[OK] Visual Mood: {v_dir.get('mood')}")
    print(f"[OK] Color Direction: {v_dir.get('color_direction')}")
    print(f"[OK] Typography: {v_dir.get('typography')}")
    print(f"[OK] Logo Concept: {l_dir.get('concept', '')[:80]}...")
    assert v_dir.get("color_direction"), "Colors required"
    
    # STAGE 6: Brand Battle (Critic)
    print("\n--- STAGE 6: BRAND BATTLE / CRITIC ---")
    state = critic_node(state, provider)
    crit = state["critique"]
    print(f"[OK] Genericity Checks: {crit.get('genericity_checks')}")
    print(f"[OK] Audience Mismatches: {crit.get('audience_mismatch')}")
    print(f"[OK] Critique Issues: {len(crit.get('issues', []))}")
    for issue in crit.get("issues", [])[:2]:
        prob = issue.get('problem') or issue.get('description') or ''
        print(f"     -> Target: {issue.get('target')} | Severity: {issue.get('severity')} | {prob[:60]}")
    assert crit.get("issues") is not None, "Critic issues required"
    
    # STAGE 7: Consistency Guardian
    print("\n--- STAGE 7: CONSISTENCY GUARDIAN ---")
    state = consistency_node(state, provider)
    cons = state["consistency"]
    print(f"[OK] Overall Consistency Score: {cons.get('overall_consistency')}/100")
    print(f"[OK] Checks performed: {len(cons.get('checks', []))}")
    for chk in cons.get("checks", []):
        print(f"     -> {chk.get('area')}: {chk.get('status')} ({chk.get('reason')[:60]})")
    print(f"[OK] Required Revisions: {cons.get('required_revisions', [])}")
    
    # STAGE: TARGETED REVISION TEST
    print("\n--- TARGETED REVISION TEST ---")
    target_stage = "naming"
    feedback = f"Ensure the name feels ultra-clean and modern for urban apartment owners."
    state["selected_direction"]["revision_request"] = {
        "target": target_stage,
        "feedback": feedback
    }
    state = revision_planner_node(state, provider)
    print(f"[OK] Revision executed. Status: {state.get('status')}")
    print(f"[OK] Revision count: {state.get('revision_count')}")
    
    # STAGE 8: Launch Agent
    print("\n--- STAGE 8: LAUNCH AGENT ---")
    state = launch_node(state, provider)
    launch = state["launch"]
    print(f"[OK] Final Brand Name: {launch.get('brand_name')}")
    print(f"[OK] Tagline: {launch.get('tagline')}")
    print(f"[OK] One-line pitch: {launch.get('one_line_pitch')}")
    print(f"[OK] Landing Headline: {launch.get('landing_page', {}).get('headline')}")
    print(f"[OK] CTA: {launch.get('landing_page', {}).get('cta')}")
    print(f"[OK] Social Post (Instagram): {launch.get('social', {}).get('instagram', '')[:80]}...")
    print(f"[OK] Launch Message: {launch.get('launch_message', '')[:80]}...")
    assert launch.get("brand_name"), "Brand name required"
    assert launch.get("tagline"), "Tagline required"
    
    print("\n" + "=" * 60)
    print("FULL 8-AGENT GEMINI PIPELINE TEST SUCCEEDED 100%!")
    print("=" * 60)

if __name__ == "__main__":
    test_full_pipeline()
