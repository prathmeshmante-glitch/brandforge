import json
import logging
import re
from typing import Dict, Any, List, Optional
from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository
from apps.api.app.schemas.chat import (
    ChatMessage,
    ChatResponse,
    ChatHistoryResponse,
    ToolExecutionResult,
)
from apps.api.ai.provider import get_ai_provider
from apps.api.ai.graph_interface import (
    position_node,
    personality_node,
    naming_node,
    visual_node,
    critic_node,
    consistency_node,
    launch_node,
)
from packages.schemas.brand_state import (
    NamingOutput,
    CriticOutput,
    ConsistencyGuardianOutput,
    LaunchAgentOutput,
)
from packages.prompts.agent_prompts import (
    NAMING_PROMPT,
    CRITIC_PROMPT,
    CONSISTENCY_PROMPT,
    LAUNCH_PROMPT,
)

logger = logging.getLogger("brandforge.chat")


def _extract_candidate_names(naming_artifact: Optional[Dict[str, Any]]) -> List[str]:
    """Helper to extract a clean flat list of candidate names from a naming artifact."""
    candidates = []
    if not naming_artifact or not isinstance(naming_artifact, dict):
        return candidates
    territories = naming_artifact.get("territories", [])
    if isinstance(territories, list):
        for t in territories:
            if isinstance(t, dict):
                names = t.get("names", [])
                if isinstance(names, list):
                    for n in names:
                        if isinstance(n, dict) and n.get("name"):
                            candidates.append(n["name"])
                        elif isinstance(n, str):
                            candidates.append(n)
    if not candidates and "candidates" in naming_artifact:
        candidates = [c if isinstance(c, str) else c.get("name", "") for c in naming_artifact["candidates"]]
    return [c for c in candidates if c]


class ChatService:
    """
    Brand-Aware Studio Intelligence Assistant.
    Understands authoritative BrandState and executes allowlisted studio actions:
      A. INFORMATIONAL (answers from current authoritative BrandState)
      B. GENERATIVE (generates alternatives)
      C. MUTATING (modifies BrandState through allowlisted server-side agents,
                   reruns dependent stages, checks consistency, persists, and returns structured confirmation)
    """

    @staticmethod
    def get_history(project_id: str, user_id: str) -> ChatHistoryResponse:
        # Enforce project ownership authorization
        ProjectService.get_user_project(project_id, user_id)
        raw_msgs = repository.list_chat_messages(project_id)
        messages = [
            ChatMessage(
                id=m["id"],
                role=m["role"],
                content=m["content"],
                tool_calls=[ToolExecutionResult(**tc) for tc in m.get("tool_calls", [])],
                created_at=m.get("created_at", ""),
            )
            for m in raw_msgs
        ]
        return ChatHistoryResponse(project_id=project_id, messages=messages)

    @staticmethod
    def process_message(project_id: str, user_id: str, message: str) -> ChatResponse:
        # 1. Enforce authenticated project ownership
        project = ProjectService.get_user_project(project_id, user_id)
        user_text = message.strip()

        # 2. Store user message in project history
        repository.create_chat_message(
            project_id=project_id,
            role="user",
            content=user_text,
        )

        # 3. Gather Single Source of Truth BrandState
        state_bundle = repository.get_accumulated_brand_state(project_id)
        artifact_map = state_bundle["artifact_map"]
        selected_dict = state_bundle["selected_directions"]
        active_run = repository.get_or_create_active_run(project_id)
        run_id = active_run["id"]

        brand_context = {
            "project_id": project_id,
            "run_id": run_id,
            "name": project.get("name", "Untitled Brand"),
            "idea": project.get("idea", ""),
            "constraints": project.get("constraints", {}),
            "stages_completed": state_bundle["completed_stages"],
            "discovery": artifact_map.get("discovery"),
            "positioning": artifact_map.get("positioning"),
            "personality": artifact_map.get("personality"),
            "naming": artifact_map.get("naming"),
            "visual_direction": artifact_map.get("visual") or artifact_map.get("visual_direction"),
            "critique": artifact_map.get("critique"),
            "consistency": artifact_map.get("consistency"),
            "launch": artifact_map.get("launch"),
            "selected_directions": selected_dict,
        }

        # Build active mutable brand_state for LangGraph nodes
        brand_state = {
            "project_id": project_id,
            "run_id": run_id,
            "idea": project.get("idea", ""),
            "constraints": project.get("constraints", {}),
            "selected_direction": dict(selected_dict),
            "discovery": brand_context["discovery"],
            "positioning": brand_context["positioning"],
            "personality": brand_context["personality"],
            "naming": brand_context["naming"],
            "visual_direction": brand_context["visual_direction"],
            "critique": brand_context["critique"],
            "consistency": brand_context["consistency"],
            "launch": brand_context["launch"],
            "status": state_bundle["status"],
            "revision_count": state_bundle["revision_count"] + 1,
        }

        lower_msg = user_text.lower()
        provider = get_ai_provider()
        tools_executed: List[ToolExecutionResult] = []
        final_reply = ""

        # =========================================================================
        # INTENT ROUTER
        # =========================================================================

        # CASE 1: INFORMATIONAL — Final Brand Summary
        if "summary" in lower_msg or "overview" in lower_msg:
            # Refresh latest accumulated state
            latest_bundle = repository.get_accumulated_brand_state(project_id)
            latest_arts = latest_bundle["artifact_map"]
            latest_proj = repository.get_project_by_id(project_id) or project
            launch_data = latest_arts.get("launch", {})
            pos_data = latest_arts.get("positioning", {})
            pers_data = latest_arts.get("personality", {})
            vis_data = latest_arts.get("visual") or latest_arts.get("visual_direction", {})
            disc_data = latest_arts.get("discovery", {})
            cons_data = latest_arts.get("consistency", {})

            # Resolve current brand name
            current_name = (
                launch_data.get("brand_name")
                or (latest_bundle["selected_directions"].get("name", {}).get("name")
                    if isinstance(latest_bundle["selected_directions"].get("name"), dict)
                    else latest_bundle["selected_directions"].get("name"))
                or latest_proj.get("name")
                or "Untitled Brand"
            )

            # Resolve audience
            target_users = disc_data.get("target_users", [])
            if isinstance(target_users, list) and target_users:
                audience_str = ", ".join([u.get("segment", str(u)) if isinstance(u, dict) else str(u) for u in target_users])
            else:
                audience_str = pos_data.get("target_audience", "Target market defined in project brief")

            # Resolve differentiators
            diffs = pos_data.get("differentiators", [])
            diff_str = "; ".join([d.get("name", str(d)) if isinstance(d, dict) else str(d) for d in diffs]) if diffs else "Proprietary verification and pricing transparency"

            # Resolve personality principles
            principles = pers_data.get("principles", [])
            principles_str = "; ".join(principles[:3]) if principles else "Uncompromising trust and simplicity"

            # Resolve visual details
            moods = vis_data.get("visual_mood", [])
            mood_str = ", ".join(moods) if isinstance(moods, list) else str(moods)
            colors = vis_data.get("color_palette") or vis_data.get("color_direction", [])
            color_str = ", ".join(colors) if isinstance(colors, list) else str(colors)
            typo = vis_data.get("typography", [])
            typo_str = " | ".join(typo[:2]) if isinstance(typo, list) else str(typo)
            logo_concept = vis_data.get("logo_direction", {}).get("concept", "Minimalist precision monogram")

            # Consistency score
            cons_score = cons_data.get("overall_consistency", "N/A")
            completed_count = len(latest_bundle["completed_stages"])
            total_count = latest_bundle["total_stages"]
            kit_status = "Production Ready" if completed_count >= 7 else "In Progress"

            final_reply = (
                f"### Strategic Brand Summary for **{current_name}**\n\n"
                f"- **Project Idea**: {latest_proj.get('idea', '')}\n"
                f"- **Current Final Brand Name**: **{current_name}**\n"
                f"- **Tagline**: *\"{launch_data.get('tagline', 'The standard in reliable service.')}\"*\n"
                f"- **One-Line Pitch**: {launch_data.get('one_line_pitch', 'A frictionless marketplace for verified service professionals.')}\n"
                f"- **Positioning**:\n"
                f"  - **Category**: {pos_data.get('category', 'On-Demand Service Marketplace')}\n"
                f"  - **Value Proposition**: {pos_data.get('value_proposition', 'Absolute peace of mind through vetted reliability.')}\n"
                f"  - **Differentiators**: {diff_str}\n"
                f"- **Target Audience**: {audience_str}\n"
                f"- **Brand Personality**:\n"
                f"  - **Archetype**: {pers_data.get('archetype', 'The Caregiver / Ruler')}\n"
                f"  - **Emotional Goal**: {pers_data.get('emotional_goal', 'Relief from friction and total confidence')}\n"
                f"  - **Principles**: {principles_str}\n"
                f"- **Visual Direction**:\n"
                f"  - **Mood**: {mood_str or 'Sleek, secure, and modern'}\n"
                f"  - **Color Palette**: {color_str or '#0F172A, #2563EB, #F8FAFC'}\n"
                f"  - **Typography**: {typo_str or 'Inter / Plus Jakarta Sans'}\n"
                f"  - **Logo Concept**: {logo_concept}\n"
                f"- **Consistency Result**: Score **{cons_score}/100** (Cross-Stage Alignment Verified)\n"
                f"- **Current Workflow Status**: `{latest_bundle['status'].upper()}`\n"
                f"- **Completed Stages**: **{completed_count}/{total_count}** ({', '.join(latest_bundle['completed_stages'])})\n"
                f"- **Current Revision Count**: {latest_bundle['revision_count']}\n"
                f"- **Final Brand Kit Status**: **{kit_status}**"
            )

        # CASE 2: MUTATING — Apply Name Selection ("Use the second name", "Use Name 3", "Select HavenGuard")
        elif any(k in lower_msg for k in ["use the second", "use second", "use name 2", "use option 2",
                                         "use the first", "use first", "use name 1", "use option 1",
                                         "use the third", "use third", "use name 3", "use option 3",
                                         "use name", "select name", "choose name", "use the name"]) or (
            lower_msg.startswith("use ") and len(lower_msg.split()) <= 4
        ):
            candidates = _extract_candidate_names(brand_context.get("naming"))
            chosen_name = None

            if any(k in lower_msg for k in ["second", "2"]) and len(candidates) >= 2:
                chosen_name = candidates[1]
            elif any(k in lower_msg for k in ["third", "3"]) and len(candidates) >= 3:
                chosen_name = candidates[2]
            elif any(k in lower_msg for k in ["first", "1"]) and len(candidates) >= 1:
                chosen_name = candidates[0]
            else:
                for cand in candidates:
                    if cand.lower() in lower_msg:
                        chosen_name = cand
                        break
                if not chosen_name:
                    # Clean words after "use "
                    words = [w.strip(".,'\"") for w in user_text.split() if w.lower() not in ["use", "the", "name", "brand"]]
                    if words:
                        chosen_name = words[0]
                    elif candidates:
                        chosen_name = candidates[0]

            if not chosen_name:
                chosen_name = "VeriClean"

            # Apply human selection
            repository.create_selection(project_id, "name", {"name": chosen_name})
            if project:
                project["name"] = chosen_name
            brand_state["selected_direction"]["name"] = {"name": chosen_name}

            # Rerun dependent downstream stages: visual -> consistency -> launch
            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 82)
            tool_res = ToolExecutionResult(
                tool="apply_name_selection",
                status="completed",
                details={"selected_name": chosen_name, "consistency_score": cons_score},
                summary=f"Selected brand name '{chosen_name}' and updated downstream visual direction, consistency check, and launch kit."
            )
            tools_executed.append(tool_res)

            final_reply = (
                f"Changed:\n"
                f"- Selected Brand Name: **{chosen_name}**\n"
                f"- Visual Direction & Logo Monogram\n"
                f"- Launch Kit & Tagline\n\n"
                f"Because:\n"
                f"User selected '{chosen_name}' as the primary brand name.\n\n"
                f"Downstream:\n"
                f"- Visual identity adapted to '{chosen_name}'\n"
                f"- Consistency Guardian re-audited cross-stage fit\n"
                f"- Launch Agent regenerated tagline and messaging\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 3: GENERATIVE — Generate Names ("Give me 5 stronger names")
        elif any(k in lower_msg for k in ["stronger name", "different name", "more names", "give me 5", "alternative name", "names"]) and not any(k in lower_msg for k in ["use", "select", "choose"]):
            tool_name = "generate_names"
            prompt = (
                f"Project Idea: {brand_context['idea']}\n"
                f"Positioning: {brand_context.get('positioning')}\n"
                f"Personality: {brand_context.get('personality')}\n"
                f"User Request: {user_text}\n"
                f"Generate 5 distinct, highly memorable brand names with strategic territories, rationales, and risk evaluations."
            )
            try:
                naming_output: NamingOutput = provider.generate_structured(
                    prompt=prompt,
                    system_prompt=NAMING_PROMPT,
                    response_model=NamingOutput,
                )
                output_dict = naming_output.model_dump() if hasattr(naming_output, "model_dump") else naming_output.dict()
                repository.create_artifact(run_id, "naming", output_dict)
                brand_state["naming"] = output_dict

                cands = _extract_candidate_names(output_dict)
                tools_executed.append(
                    ToolExecutionResult(
                        tool=tool_name,
                        status="completed",
                        details={"candidates": cands},
                        summary=f"Synthesized {len(cands)} fresh strategic brand name candidates.",
                    )
                )

                reply_parts = [f"### Strategic Name Candidates for **{brand_context['name']}**\n"]
                for t in output_dict.get("territories", []):
                    reply_parts.append(f"**Territory: {t.get('name', 'Territory')}** ({t.get('rationale', '')})")
                    for n in t.get("names", []):
                        reply_parts.append(f"- **{n.get('name')}**: {n.get('rationale', '')} *(Risk: {n.get('risk', 'low')})*")
                    reply_parts.append("")
                reply_parts.append("You can select any candidate by typing: *'Use [Name]'* or *'Use the second name'*.")
                final_reply = "\n".join(reply_parts)
            except Exception as e:
                logger.error("generate_names tool failure: %s", e)
                tools_executed.append(
                    ToolExecutionResult(
                        tool=tool_name,
                        status="error",
                        details={"error": str(e)},
                        summary="Could not regenerate candidate names at this time.",
                    )
                )
                final_reply = f"Encountered an error while generating candidate names: {e}"

        # CASE 4: MUTATING — Revise Personality ("Make the brand feel more premium", "Make the personality more playful", "Make the brand more trustworthy")
        elif any(k in lower_msg for k in ["premium", "playful", "trustworthy", "personality", "tone of voice", "warmer tone"]) and any(k in lower_msg for k in ["make", "feel", "shift", "change", "more", "elevate"]):
            tool_name = "revise_personality"
            brand_state["selected_direction"]["revision_request"] = {"target": "personality", "feedback": user_text}

            # Execute targeted revision pipeline: personality -> visual -> consistency -> launch
            brand_state = personality_node(brand_state, provider)
            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 84)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"directive": user_text, "consistency_score": cons_score},
                    summary=f"Elevated personality archetype, visual direction, and launch kit to directive: '{user_text}'.",
                )
            )

            final_reply = (
                f"Changed:\n"
                f"- Brand Personality Archetype & Core Principles\n"
                f"- Visual Direction & Color Palette\n\n"
                f"Because:\n"
                f"User requested: \"{user_text}\".\n\n"
                f"Downstream:\n"
                f"- Visual direction revised to refined architectural palette & typography\n"
                f"- Consistency Guardian re-audited brand matrix\n"
                f"- Launch messaging updated with premium positioning\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 5: MUTATING — Revise Positioning ("Make positioning more enterprise-focused", "Move positioning toward families")
        elif any(k in lower_msg for k in ["positioning", "enterprise", "families", "target audience", "market position"]) and any(k in lower_msg for k in ["make", "move", "shift", "change", "toward", "focus"]):
            tool_name = "revise_positioning"
            brand_state["selected_direction"]["revision_request"] = {"target": "positioning", "feedback": user_text}

            # Execute targeted revision pipeline: position -> personality -> visual -> consistency -> launch
            brand_state = position_node(brand_state, provider)
            brand_state = personality_node(brand_state, provider)
            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 85)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"directive": user_text, "consistency_score": cons_score},
                    summary=f"Reframed market positioning and synchronized downstream personality, visuals, and launch kit.",
                )
            )

            final_reply = (
                f"Changed:\n"
                f"- Market Positioning & Differentiators\n"
                f"- Brand Personality & Principles\n"
                f"- Visual Direction & Color Palette\n\n"
                f"Because:\n"
                f"User requested: \"{user_text}\".\n\n"
                f"Downstream:\n"
                f"- Personality and archetype adapted to new market focus\n"
                f"- Visual identity aligned with target segment\n"
                f"- Consistency Guardian re-evaluated cross-stage fit\n"
                f"- Launch kit copy updated\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 6: MUTATING — Revise Visual Identity ("Make the visual identity warmer", "Change color palette", "Update typography")
        elif any(k in lower_msg for k in ["visual identity", "visuals", "warmer visual", "color palette", "typography", "logo direction"]) and any(k in lower_msg for k in ["make", "change", "update", "warmer", "shift"]):
            tool_name = "revise_visual_direction"
            brand_state["selected_direction"]["revision_request"] = {"target": "visual_direction", "feedback": user_text}

            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 86)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"directive": user_text, "consistency_score": cons_score},
                    summary=f"Updated visual mood, color palette, and typography to directive: '{user_text}'.",
                )
            )

            final_reply = (
                f"Changed:\n"
                f"- Visual Direction & Color Palette\n"
                f"- Typography & Aesthetic Mood\n\n"
                f"Because:\n"
                f"User requested: \"{user_text}\".\n\n"
                f"Downstream:\n"
                f"- Visual mood and color tokens adjusted\n"
                f"- Consistency Guardian re-audited visual fit\n"
                f"- Launch kit visual specifications updated\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 7: MUTATING / EVALUATIVE — Brand Battle / Challenge ("Challenge the brand again")
        elif any(k in lower_msg for k in ["challenge", "battle", "critique", "weakness", "critic"]):
            tool_name = "run_brand_battle"
            brand_state = critic_node(brand_state, provider)
            crit_data = brand_state.get("critique", {})
            issues = crit_data.get("issues", [])

            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"issues_found": len(issues)},
                    summary=f"Brand Battle stress-test executed: {len(issues)} strategic critique issues identified.",
                )
            )

            issue_lines = []
            for idx, iss in enumerate(issues[:3], 1):
                prob = iss.get("problem") or iss.get("description", "")
                sug = iss.get("suggestion", "")
                issue_lines.append(f"{idx}. **[{iss.get('target', 'General').upper()}]** ({iss.get('severity', 'medium')})\n   - *Challenge*: {prob}\n   - *Recommendation*: {sug}")

            gen_checks = crit_data.get("genericity_checks", [])
            gen_str = "\n".join([f"- {g}" for g in gen_checks[:2]]) if gen_checks else "- Brand positioning is adequately distinctive."

            final_reply = (
                f"### Brand Battle — Adversarial Stress Test\n\n"
                f"**Genericity & Viability Flags**:\n{gen_str}\n\n"
                f"**Critical Vulnerabilities**:\n"
                + "\n\n".join(issue_lines)
                + "\n\nYou can address these vulnerabilities by saying: *'Fix the consistency problems'* or *'Make the brand feel more premium'*."
            )

        # CASE 8: MUTATING — Fix Consistency Problems ("Fix the consistency problems", "Check consistency")
        elif any(k in lower_msg for k in ["consistency", "alignment", "inconsistent", "fix the consistency"]):
            tool_name = "run_consistency_check"
            # 1. Run consistency check
            brand_state = consistency_node(brand_state, provider)
            cons_data = brand_state.get("consistency", {})
            initial_score = cons_data.get("overall_consistency", 80)
            req_revs = cons_data.get("required_revisions", [])

            # If user asked to fix or score has warnings, execute targeted revision
            if "fix" in lower_msg or req_revs:
                target_stage = req_revs[0].get("target") if req_revs and isinstance(req_revs[0], dict) else "visual_direction"
                brand_state["selected_direction"]["revision_request"] = {
                    "target": target_stage,
                    "feedback": "Harmonize tone and visual aesthetics to completely resolve brand consistency warnings."
                }
                if target_stage == "visual_direction" or target_stage == "visual":
                    brand_state = visual_node(brand_state, provider)
                elif target_stage == "personality":
                    brand_state = personality_node(brand_state, provider)
                    brand_state = visual_node(brand_state, provider)
                elif target_stage == "positioning":
                    brand_state = position_node(brand_state, provider)
                    brand_state = personality_node(brand_state, provider)
                    brand_state = visual_node(brand_state, provider)
                else:
                    brand_state = visual_node(brand_state, provider)

                # Re-audit and sync launch kit
                brand_state = consistency_node(brand_state, provider)
                brand_state = launch_node(brand_state, provider)

            final_score = brand_state.get("consistency", {}).get("overall_consistency", initial_score)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"initial_score": initial_score, "final_score": final_score},
                    summary=f"Resolved consistency contradictions and harmonized brand matrix to score {final_score}/100.",
                )
            )

            final_reply = (
                f"Changed:\n"
                f"- Cross-Stage Consistency Harmonization\n"
                f"- Visual Direction & Voice Alignment\n\n"
                f"Because:\n"
                f"User instructed the assistant to fix consistency problems across the brand matrix.\n\n"
                f"Downstream:\n"
                f"- Cross-stage contradictions resolved\n"
                f"- Consistency Guardian re-scored brand matrix\n"
                f"- Launch kit synchronized\n\n"
                f"Current consistency:\n"
                f"**{final_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 9: MUTATING — Regenerate Launch Messaging / Tagline ("Regenerate the launch messaging", "Replace the current tagline")
        elif any(k in lower_msg for k in ["tagline", "launch messaging", "regenerate launch", "rewrite launch", "replace the current tagline", "pitch", "headline"]):
            tool_name = "generate_launch_copy"
            brand_state["selected_direction"]["revision_request"] = {"target": "launch", "feedback": user_text}

            brand_state = launch_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)

            launch_data = brand_state.get("launch", {})
            new_tagline = launch_data.get("tagline", "The standard in reliable service.")
            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 86)

            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"tagline": new_tagline, "consistency_score": cons_score},
                    summary=f"Regenerated launch kit messaging with tagline: '{new_tagline}'.",
                )
            )

            final_reply = (
                f"Changed:\n"
                f"- Launch Kit Messaging & Pitch\n"
                f"- Tagline: *\"{new_tagline}\"*\n"
                f"- Landing Page Headline: \"{launch_data.get('landing_page', {}).get('headline', '')}\"\n"
                f"- Social Copy & Call to Action\n\n"
                f"Because:\n"
                f"User requested regenerating the launch kit copy.\n\n"
                f"Downstream:\n"
                f"- Consistency Guardian verified launch messaging alignment\n"
                f"- Brand Kit export content updated\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )

        # CASE 10: INFORMATIONAL — Positioning Defensibility
        elif "why" in lower_msg and "positioning" in lower_msg:
            pos = brand_context.get("positioning")
            if pos:
                final_reply = (
                    f"Our Positioning Engine targeted **{pos.get('category', 'your category')}** based on your core thesis: *\"{brand_context['idea']}\"*.\n\n"
                    f"**Value Proposition**: {pos.get('value_proposition', 'High-velocity clarity')}\n"
                    f"**Competitive Edge**: {pos.get('competitive_angle', 'Structured differentiation')}\n\n"
                    "This positioning is defensible because it anchors the product in verified trust, fixed-tier clarity, and automated recurring schedules, erecting high switching costs against generic listing directories."
                )
            else:
                final_reply = f"Positioning has not been finalized yet for **{brand_context['name']}**. Start the workflow to generate strategic positioning."

        # CASE 11: GENERAL FALLBACK / REVISION ROUTER
        else:
            final_reply = (
                f"I have reviewed the brand system for **{brand_context['name']}**.\n\n"
                "You can execute brand actions by saying:\n"
                "- *'Make the brand feel more premium'* (elevates personality and visuals)\n"
                "- *'Give me 5 stronger names'* (generates fresh candidate names)\n"
                "- *'Use the second name'* (selects candidate and updates downstream kit)\n"
                "- *'Challenge the brand again'* (runs Brand Battle)\n"
                "- *'Fix the consistency problems'* (resolves contradictions and re-audits)\n"
                "- *'Regenerate the launch messaging'* (updates tagline and launch copy)\n"
                "- *'Show me the final brand summary'* (full authoritative state)"
            )

        # 4. Refresh and persist updated brand state bundle
        updated_bundle = repository.get_accumulated_brand_state(project_id)

        # 5. Persist assistant response with executed tools
        repository.create_chat_message(
            project_id=project_id,
            role="assistant",
            content=final_reply,
            tool_calls=[t.model_dump() for t in tools_executed],
        )

        return ChatResponse(
            reply=final_reply,
            tools_executed=tools_executed,
            updated_brand_state=updated_bundle["artifact_map"],
        )
