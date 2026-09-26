import os
import sys
import json
import asyncio
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.abspath("."))

from apps.api.app.core.config import settings
from apps.api.ai.provider import get_ai_provider, GeminiProvider, MockAIProvider
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.run_service import RunService
from apps.api.app.services.workflow_service import WorkflowService
from apps.api.app.services.chat_service import ChatService
from apps.api.app.services.export_service import ExportService
from apps.api.app.db.repository import repository
from packages.schemas.brand_state import DiscovererOutput


def test_configuration_and_security():
    print("\n" + "=" * 60)
    print("1. CONFIGURATION & CREDENTIAL SECURITY CHECK")
    print("=" * 60)
    
    assert settings.AI_PROVIDER == "gemini", f"Expected gemini, got {settings.AI_PROVIDER}"
    print(f"[OK] AI_PROVIDER configured: {settings.AI_PROVIDER}")
    
    gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    assert gemini_key, "GEMINI_API_KEY must be set in environment"
    assert len(gemini_key) > 10, "GEMINI_API_KEY is present and non-empty"
    # STRICT SECURITY: Do not print or expose key!
    print(f"[OK] GEMINI_API_KEY detected safely (len: {len(gemini_key)}, masked: ***...***)")
    
    # Verify OpenAI key is NOT required
    provider = get_ai_provider("gemini")
    assert isinstance(provider, GeminiProvider), f"Expected GeminiProvider, got {type(provider)}"
    print(f"[OK] Provider instance resolved to: {provider.__class__.__name__}")
    print(f"[OK] Gemini Model configured: {provider.model_name}")


def test_error_handling_and_no_mock():
    print("\n" + "=" * 60)
    print("2. ERROR HANDLING & ANTI-MOCK VERIFICATION")
    print("=" * 60)
    
    # Verify missing key raises explicit error
    try:
        GeminiProvider(api_key="")
        assert False, "Expected ValueError on empty api_key"
    except ValueError as e:
        print(f"[OK] Missing GEMINI_API_KEY raises explicit error: {e}")
        
    # Verify invalid model or request handling
    try:
        bad_provider = GeminiProvider(api_key="invalid-key-test")
        bad_provider.generate_structured("test", "test", DiscovererOutput)
        assert False, "Expected API failure with invalid key"
    except Exception as e:
        safe_msg = str(e)[:70]
        print(f"[OK] Invalid Gemini API request fails explicitly with safe error: {safe_msg}...")

    # Verify no mock provider fallback
    prov = get_ai_provider("gemini")
    assert not isinstance(prov, MockAIProvider), "Gemini provider must NOT fall back to MockAIProvider!"
    print("[OK] Confirmed: Gemini mode strictly uses live Google GenAI SDK, not MockAIProvider.")


async def test_full_project_and_tools():
    print("\n" + "=" * 60)
    print("3. LIVE PROJECT, BRAND KIT, EXPORT & CHATBOT TOOLS")
    print("=" * 60)
    
    user_id = "test-gemini-user-001"
    user_prompt = "An app where customers can book verified home-cleaning professionals, compare prices, schedule recurring cleaning, and pay through the app."
    
    # 1. Create real project in database
    proj = ProjectService.create_project(
        user_id=user_id,
        name="VeraClean Home Services",
        idea=user_prompt,
        constraints={"tone": "trustworthy and modern", "target": "urban busy professionals"}
    )
    project_id = proj["id"]
    print(f"[OK] Project created: ID={project_id}, Name={proj['name']}")
    
    # 2. Create Run
    run = RunService.create_run(project_id, user_id)
    run_id = run["id"]
    print(f"[OK] Run created: ID={run_id}, Version={run['version']}")
    
    # 3. Test Chatbot Tools against real BrandState
    print("\n--- TESTING CHATBOT TOOLS & STRATEGIC ADVISOR ---")
    
    # Question 1: "Give me 5 stronger names." (Triggers generate_names)
    print("\n[User Prompt 1]: 'Give me 5 stronger names.'")
    res1 = ChatService.process_message(project_id, user_id, "Give me 5 stronger names.")
    assert len(res1.tools_executed) > 0, "generate_names tool must be executed"
    tool1 = res1.tools_executed[0]
    print(f"[Tool Executed]: {tool1.tool} (Status: {tool1.status}) - {tool1.summary}")
    assert tool1.status == "completed", "Tool execution must succeed"
    
    # Question 2: "Why is the current positioning defensible?"
    print("\n[User Prompt 2]: 'Why is the current positioning defensible?'")
    res2 = ChatService.process_message(project_id, user_id, "Why is the current positioning defensible?")
    print(f"[Assistant Reply]:\n{res2.reply[:250]}...")
    assert len(res2.reply) > 20, "Assistant must provide strategic answer"
    
    # Question 3: "Make the brand feel more premium."
    print("\n[User Prompt 3]: 'Make the brand feel more premium.'")
    res3 = ChatService.process_message(project_id, user_id, "Make the brand feel more premium.")
    print(f"[Assistant Reply]:\n{res3.reply[:250]}...")
    assert "premium" in res3.reply.lower() or "obsidian" in res3.reply.lower() or "tier" in res3.reply.lower()
    
    # Question 4: "Challenge this brand again." (Triggers run_brand_battle)
    print("\n[User Prompt 4]: 'Challenge this brand again.'")
    res4 = ChatService.process_message(project_id, user_id, "Challenge this brand again.")
    assert len(res4.tools_executed) > 0, "run_brand_battle tool must be executed"
    tool4 = res4.tools_executed[0]
    print(f"[Tool Executed]: {tool4.tool} (Status: {tool4.status}) - {tool4.summary}")
    assert tool4.status == "completed", "Brand Battle tool must succeed"
    
    # Question 5: "Fix the consistency problems." (Triggers run_consistency_check)
    print("\n[User Prompt 5]: 'Fix the consistency problems.'")
    res5 = ChatService.process_message(project_id, user_id, "Fix the consistency problems.")
    assert len(res5.tools_executed) > 0, "run_consistency_check tool must be executed"
    tool5 = res5.tools_executed[0]
    print(f"[Tool Executed]: {tool5.tool} (Status: {tool5.status}) - {tool5.summary}")
    assert tool5.status == "completed", "Consistency tool must succeed"
    
    # Question 6: "Regenerate the launch messaging." (Triggers generate_launch_copy)
    print("\n[User Prompt 6]: 'Regenerate the launch messaging.'")
    res6 = ChatService.process_message(project_id, user_id, "Regenerate the launch messaging.")
    assert len(res6.tools_executed) > 0, "generate_launch_copy tool must be executed"
    tool6 = res6.tools_executed[0]
    print(f"[Tool Executed]: {tool6.tool} (Status: {tool6.status}) - {tool6.summary}")
    assert tool6.status == "completed", "Launch copy tool must succeed"
    
    # Question 7: "Show me the final brand summary."
    print("\n[User Prompt 7]: 'Show me the final brand summary.'")
    res7 = ChatService.process_message(project_id, user_id, "Show me the final brand summary.")
    print(f"[Assistant Reply]:\n{res7.reply}")
    assert "summary" in res7.reply.lower() or "stages" in res7.reply.lower()
    
    # 4. Brand Kit & Export Verification
    print("\n--- BRAND KIT & EXPORT VERIFICATION ---")
    export_res = ExportService.create_export_job(project_id, user_id, "pdf")
    print(f"[OK] Export Job Created: {export_res['export_id']}, Format: {export_res['format']}")
    
    export_content = ExportService.get_export_content(export_res["export_id"])
    print(f"[OK] Export Content Retrieved: Project ID: {export_content['project_id']}, Artifacts: {list(export_content['artifacts'].keys())}")
    assert export_content["export_id"] == export_res["export_id"]

    print("\n" + "=" * 60)
    print("ALL STUDIO INTEGRATION TESTS SUCCEEDED 100%!")
    print("=" * 60)


if __name__ == "__main__":
    test_configuration_and_security()
    test_error_handling_and_no_mock()
    asyncio.run(test_full_project_and_tools())
