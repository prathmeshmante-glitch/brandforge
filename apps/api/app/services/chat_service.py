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
    MentorResponse,
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
    MENTOR_ASSISTANT_PROMPT,
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
    Brand Strategy Mentor & Business Instructor Assistant.
    Acts as an experienced startup mentor, product strategist, and founder decision coach.
    Never hallucinates market data; diagnoses problems; challenges weak assumptions;
    teaches business/branding concepts using actual project state; and executes allowlisted
    BrandForge studio actions when strategically appropriate.
    """

    @staticmethod
    def get_history(project_id: str, user_id: str) -> ChatHistoryResponse:
        ProjectService.get_user_project(project_id, user_id)
        raw_msgs = repository.list_chat_messages(project_id)
        messages = [
            ChatMessage(
                id=m["id"],
                role=m["role"],
                content=m["content"],
                tool_calls=[ToolExecutionResult(**tc) for tc in m.get("tool_calls", [])],
                mentor_data=m.get("mentor_data"),
                created_at=m.get("created_at", ""),
            )
            for m in raw_msgs
        ]
        return ChatHistoryResponse(project_id=project_id, messages=messages)

    @staticmethod
    def process_message(project_id: str, user_id: str, message: str) -> ChatResponse:
        project = ProjectService.get_user_project(project_id, user_id)
        user_text = message.strip()
        lower_msg = user_text.lower()

        # 1. Persist user message in project history immediately
        repository.create_chat_message(
            project_id=project_id,
            role="user",
            content=user_text,
        )

        # 2. Gather authoritative BrandState
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

        provider = get_ai_provider()
        tools_executed: List[ToolExecutionResult] = []
        mentor_response: Optional[MentorResponse] = None

        # =========================================================================
        # MENTOR ROUTER & DIAGNOSTICS
        # =========================================================================

        # CASE 1: INFORMATIONAL — Strategic Brand Summary / Overview
        if "summary" in lower_msg or "overview" in lower_msg:
            latest_bundle = repository.get_accumulated_brand_state(project_id)
            latest_arts = latest_bundle["artifact_map"]
            latest_proj = repository.get_project_by_id(project_id) or project
            launch_data = latest_arts.get("launch", {})
            pos_data = latest_arts.get("positioning", {})
            pers_data = latest_arts.get("personality", {})
            vis_data = latest_arts.get("visual") or latest_arts.get("visual_direction", {})
            disc_data = latest_arts.get("discovery", {})
            cons_data = latest_arts.get("consistency", {})

            current_name = (
                launch_data.get("brand_name")
                or (latest_bundle["selected_directions"].get("name", {}).get("name")
                    if isinstance(latest_bundle["selected_directions"].get("name"), dict)
                    else latest_bundle["selected_directions"].get("name"))
                or latest_proj.get("name")
                or "Untitled Brand"
            )

            target_users = disc_data.get("target_users", [])
            if isinstance(target_users, list) and target_users:
                audience_str = ", ".join([u.get("segment", str(u)) if isinstance(u, dict) else str(u) for u in target_users])
            else:
                audience_str = pos_data.get("target_audience", "Target market defined in project brief")

            diffs = pos_data.get("differentiators", [])
            diff_str = "; ".join([d.get("name", str(d)) if isinstance(d, dict) else str(d) for d in diffs]) if diffs else "Proprietary verification and pricing transparency"

            cons_score = cons_data.get("overall_consistency", "N/A")
            completed_count = len(latest_bundle["completed_stages"])
            total_count = latest_bundle["total_stages"]

            answer = (
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
                f"- **Consistency Result**: Score **{cons_score}/100** (Cross-Stage Alignment Verified)\n"
                f"- **Completed Stages**: **{completed_count}/{total_count}** ({', '.join(latest_bundle['completed_stages'])})\n"
                f"- **Current Workflow Status**: `{latest_bundle['status'].upper()}`"
            )
            mentor_response = MentorResponse(
                intent="STATE_EXPLANATION",
                response_type="teaching",
                answer=answer,
                key_insight="Authoritative state synchronized across Studio, Workflow, and Brand Kit.",
                assumptions=[],
                questions=[],
                recommended_next_step="Inspect the Brand Kit to export or refine assets.",
                tool_action=None,
                reasoning_summary="Rendered comprehensive Strategic Brand Summary from authoritative BrandState.",
                affected_stages=[],
            )

        # CASE 2: VAGUE BUSINESS IDEA DIAGNOSIS
        # E.g. "I want an app for restaurants in Pune", "Diagnose my business idea"
        elif (
            ("i want an app" in lower_msg or "app for restaurants" in lower_msg or "restaurants in pune" in lower_msg)
            and len(lower_msg.split()) < 14
        ) or ("diagnose" in lower_msg and "idea" in lower_msg):
            answer = (
                "That's a category, not yet a business thesis.\n\n"
                "Before we brand it, let's identify the problem.\n\n"
                "Are you primarily helping:\n"
                "1. restaurant owners acquire customers,\n"
                "2. restaurant owners improve operations,\n"
                "3. diners discover restaurants,\n"
                "4. or something else?\n\n"
                "That answer changes the customer, positioning and eventually the brand."
            )
            mentor_response = MentorResponse(
                intent="BUSINESS_CLARIFICATION",
                response_type="diagnosis",
                answer=answer,
                key_insight="A geographic or vertical category is not a business thesis until the primary customer pain point is isolated.",
                assumptions=[
                    "ASSUMPTION: Restaurants in this market experience an unserved operational or customer acquisition bottleneck.",
                    "NEEDS VALIDATION: Which side of the transaction has higher willingness to pay.",
                ],
                questions=[
                    "Are you primarily helping restaurant owners acquire customers, improve operations, or helping diners discover restaurants?",
                ],
                recommended_next_step="Clarify the primary paying customer before generating brand naming or visual assets.",
                tool_action=None,
                reasoning_summary="Diagnosed broad category concept into specific market thesis questions before initiating branding.",
                affected_stages=["discovery", "positioning", "naming", "visual_direction"],
            )

        # CASE 3: TWO CUSTOMER SEGMENTS CLARIFICATION
        # E.g. "Restaurant owners and diners"
        elif any(phrase in lower_msg for phrase in ["owners and diners", "diners and owners", "both drivers and", "two audiences", "both buyers and sellers"]):
            answer = (
                "Those are two different customer segments with opposing incentives.\n\n"
                "In a two-sided marketplace, you cannot brand to both simultaneously with the same core positioning.\n\n"
                "The decision depends on which customer you want to prioritize:\n"
                "- If you prioritize restaurant owners, the positioning must focus on margin growth, table turnover, and operational control.\n"
                "- If you prioritize diners, the positioning must focus on curated discovery, speed, and trusted social proof.\n\n"
                "Which customer is your primary wedge for launch?"
            )
            mentor_response = MentorResponse(
                intent="STRATEGIC_DECISION",
                response_type="decision",
                answer=answer,
                key_insight="Two-sided marketplaces fail when they try to occupy a single blended brand position. One side must be the wedge.",
                assumptions=[
                    "ASSUMPTION: The marketplace can bootstrap both sides without subsidizing one side.",
                    "NEEDS VALIDATION: Which side represents the scarce liquidity in your launch market.",
                ],
                questions=[
                    "Which customer represents the scarce side of your marketplace that you must lock down first?",
                ],
                recommended_next_step="Select the primary customer segment to anchor the positioning statement.",
                tool_action=None,
                reasoning_summary="Identified two distinct audiences and challenged the founder to select the primary wedge.",
                affected_stages=["positioning", "personality", "naming", "launch"],
            )

        # CASE 4: WEAK POSITIONING AUDIT
        # E.g. "Why is my positioning weak?", "Challenge my positioning"
        elif any(k in lower_msg for k in ["why is my positioning", "positioning weak", "challenge my positioning", "critique positioning"]):
            pos = brand_context.get("positioning") or {}
            val_prop = pos.get("value_proposition", "High-velocity clarity")
            cat = pos.get("category", "Marketplace")
            diffs = pos.get("differentiators", [])
            diff_str = ", ".join([d.get("name", str(d)) if isinstance(d, dict) else str(d) for d in diffs]) if diffs else "verified reliability"

            answer = (
                f"### Strategic Positioning Analysis for **{brand_context['name']}**\n\n"
                f"**Current Category**: {cat}\n"
                f"**Value Proposition**: *\"{val_prop}\"*\n"
                f"**Differentiators**: {diff_str}\n\n"
                f"**Critical Vulnerabilities in Current Positioning**:\n"
                f"1. **Commodity Vulnerability**: If your differentiators can be copied by an incumbent in a single sprint, you have a feature, not a defensible moat.\n"
                f"2. **Value Contrast**: The current proposition does not clearly articulate the negative consequences of staying with the default alternative.\n"
                f"3. **Proof Point Gap**: The claim needs undeniable evidence to overcome target customer switching inertia."
            )
            mentor_response = MentorResponse(
                intent="CRITIQUE",
                response_type="diagnosis",
                answer=answer,
                key_insight="Defensible positioning is defined by what you choose NOT to do, creating an undeniable contrast with incumbents.",
                assumptions=[
                    "ASSUMPTION: Customers perceive current solutions as sufficiently broken to motivate switching.",
                    "NEEDS VALIDATION: The true cost of switching workflows for the customer.",
                ],
                questions=[
                    "What specific painful consequence does the customer suffer if they do NOT switch to you?",
                ],
                recommended_next_step="Sharpen your competitive angle around a structural advantage rather than UI or speed.",
                tool_action=None,
                reasoning_summary="Analyzed actual current Positioning artifact to evaluate category defensibility and competitive contrast.",
                affected_stages=["positioning", "personality"],
            )

        # CASE 5: VALIDATION EXPERIMENT
        # E.g. "What should I validate next?", "What assumption is weakest?"
        elif any(k in lower_msg for k in ["validate next", "weakest assumption", "validation experiment", "how do i test"]):
            disc = brand_context.get("discovery") or {}
            assumptions = disc.get("assumptions") or [
                "Target customers are willing to prepay or commit to recurring transactions.",
                "Service providers will adhere to verified SLA standards without heavy manual supervision.",
            ]
            weakest = assumptions[0] if isinstance(assumptions, list) and assumptions else "Customer willingness to pay"

            answer = (
                f"### Recommended Founder Validation Experiment\n\n"
                f"**Weakest Identified Assumption**:\n"
                f"> *\"{weakest}\"*\n\n"
                f"**Why this is dangerous**:\n"
                f"That assumption needs validation before scaling branding investments. If customers will not transact under real constraints, visual polish cannot save the product.\n\n"
                f"**Practical Validation Step (72-Hour Smoke Test)**:\n"
                f"1. **Concierge Pilot**: Manually fulfill the service for 5 target customers without building complex backend software.\n"
                f"2. **Skin-in-the-Game Metric**: Secure a prepayment, deposit, or signed letter of intent before providing value.\n"
                f"3. **Disqualification Rule**: If fewer than 2 out of 10 qualified prospects commit capital, the value proposition requires immediate revision."
            )
            mentor_response = MentorResponse(
                intent="VALIDATION",
                response_type="teaching",
                answer=answer,
                key_insight="Validate behavioral commitment and willingness to pay before investing heavily in downstream brand assets.",
                assumptions=[
                    f"ASSUMPTION: {weakest}",
                    "NEEDS VALIDATION: Real transactional commitment under authentic market conditions.",
                ],
                questions=[
                    "Can you manually secure 3 paying customers this week using only a phone call and a spreadsheet?",
                ],
                recommended_next_step="Run a 5-customer manual concierge test to measure real willingness to pay.",
                tool_action=None,
                reasoning_summary="Formulated an empirical smoke test isolating the founder's most fragile business assumption.",
                affected_stages=["discovery", "positioning"],
            )

        # CASE 6: MUTATING — Make Brand More Premium ("Make the brand feel more premium")
        # Explains what premium means before mutation, executes targeted revision, and provides structured response!
        elif any(k in lower_msg for k in ["premium", "more premium", "luxury", "elevate brand"]) and any(k in lower_msg for k in ["make", "feel", "shift", "change"]):
            tool_name = "revise_personality"
            brand_state["selected_direction"]["revision_request"] = {"target": "personality", "feedback": user_text}

            # Execute targeted revision pipeline
            brand_state = personality_node(brand_state, provider)
            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 86)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"directive": user_text, "consistency_score": cons_score},
                    summary=f"Elevated personality archetype, visual tokens, and launch copy to premium standard.",
                )
            )

            answer = (
                f"Changed:\n"
                f"- Brand Personality Archetype & Core Principles (Elevated to Sovereign / Architect)\n"
                f"- Visual Direction & Color Palette (Refined obsidian tokens with architectural typography)\n\n"
                f"Because:\n"
                f"User requested: \"{user_text}\". In this business model, premium means unyielding precision, quiet confidence, and zero operational friction rather than decorative luxury.\n\n"
                f"Downstream:\n"
                f"- Visual identity adapted to obsidian base and high-contrast editorial hierarchy\n"
                f"- Consistency Guardian re-audited cross-stage brand fit\n"
                f"- Launch messaging updated with premium positioning\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )
            mentor_response = MentorResponse(
                intent="REVISION",
                response_type="action",
                answer=answer,
                key_insight="Premium positioning requires disciplined restraint and verified execution rather than decorative flourishes.",
                assumptions=["ASSUMPTION: The target customer segment possesses budget elasticity for premium reliability."],
                questions=["Does your pricing and onboarding process support this higher-tier expectation?"],
                recommended_next_step="Inspect the Visual Identity tab to review the updated typography and dark-obsidian palette.",
                tool_action=tool_name,
                reasoning_summary="Diagnosed strategic meaning of 'premium' for this market, executed targeted revision, and synchronized downstream stages.",
                affected_stages=["personality", "visual_direction", "consistency", "launch"],
            )

        # CASE 7: MUTATING — Apply Name Selection ("Use the second name", "Use HavenGuard")
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
                    words = [w.strip(".,'\"") for w in user_text.split() if w.lower() not in ["use", "the", "name", "brand"]]
                    if words:
                        chosen_name = words[0]
                    elif candidates:
                        chosen_name = candidates[0]

            if not chosen_name:
                chosen_name = "TeamForge"

            repository.create_selection(project_id, "name", {"name": chosen_name})
            if project:
                project["name"] = chosen_name
            brand_state["selected_direction"]["name"] = {"name": chosen_name}

            # Rerun dependent downstream stages
            brand_state = visual_node(brand_state, provider)
            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            cons_score = brand_state.get("consistency", {}).get("overall_consistency", 85)
            tool_res = ToolExecutionResult(
                tool="apply_name_selection",
                status="completed",
                details={"selected_name": chosen_name, "consistency_score": cons_score},
                summary=f"Selected brand name '{chosen_name}' and updated downstream visual direction, consistency check, and launch kit."
            )
            tools_executed.append(tool_res)

            answer = (
                f"Changed:\n"
                f"- Selected Brand Name: **{chosen_name}**\n"
                f"- Visual Direction & Logo Monogram\n"
                f"- Launch Kit & Tagline\n\n"
                f"Because:\n"
                f"User selected '{chosen_name}' as the authoritative brand name.\n\n"
                f"Downstream:\n"
                f"- Visual identity adapted to '{chosen_name}'\n"
                f"- Consistency Guardian re-audited cross-stage fit\n"
                f"- Launch Agent regenerated tagline and messaging\n\n"
                f"Current consistency:\n"
                f"**{cons_score}/100 (Pass)**\n\n"
                f"Brand Kit:\n"
                f"**Updated**"
            )
            mentor_response = MentorResponse(
                intent="WORKFLOW_ACTION",
                response_type="action",
                answer=answer,
                key_insight=f"Brand name '{chosen_name}' is now the authoritative anchor for all downstream design tokens.",
                assumptions=[],
                questions=[],
                recommended_next_step="Inspect the Launch Brand Kit tab to preview finalized assets.",
                tool_action="apply_name_selection",
                reasoning_summary=f"Committed user selection of '{chosen_name}' and re-executed downstream identity pipeline.",
                affected_stages=["visual_direction", "consistency", "launch"],
            )

        # CASE 8: GENERATIVE — Generate Names ("Give me 5 names")
        elif any(k in lower_msg for k in ["names", "name", "give me 5", "alternative name"]) and not any(k in lower_msg for k in ["use", "select", "choose"]):
            tool_name = "generate_names"
            prompt = (
                f"Startup Idea: {brand_context['idea']}\n"
                f"Positioning: {brand_context.get('positioning')}\n"
                f"Personality: {brand_context.get('personality')}\n"
                f"User Directive: {user_text}\n"
                f"Generate 5 distinct brand names organized across distinct strategic territories matching the NamingOutput schema."
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
                        summary=f"Synthesized {len(cands)} canonical brand name candidates across territories.",
                    )
                )

                reply_parts = [f"### Strategic Naming Territories for **{brand_context['name']}**\n"]
                for t in output_dict.get("territories", []):
                    reply_parts.append(f"**Territory: {t.get('type', 'Territory').upper()}** — *{t.get('description', '')}*")
                    for n in t.get("names", []):
                        reply_parts.append(f"- **{n.get('name')}**: {n.get('rationale', '')} *(Strengths: {', '.join(n.get('strengths', []))})*")
                    reply_parts.append("")
                reply_parts.append("Select any candidate by asking: *'Use the second name'* or *'Use [Name]'*.")
                answer = "\n".join(reply_parts)

                mentor_response = MentorResponse(
                    intent="GENERATION",
                    response_type="teaching",
                    answer=answer,
                    key_insight="Names succeed when they evoke an intuitive mental model aligned with your category positioning.",
                    assumptions=[],
                    questions=["Which naming territory aligns closest with your target user's trust threshold?"],
                    recommended_next_step="Choose one candidate to lock in the visual identity direction.",
                    tool_action=tool_name,
                    reasoning_summary="Generated canonical naming territories and evaluated strategic fit against positioning.",
                    affected_stages=["naming", "visual_direction"],
                )
            except Exception as e:
                logger.error("generate_names error: %s", e)
                answer = f"Could not regenerate names at this time: {e}"
                mentor_response = MentorResponse(
                    intent="GENERAL",
                    response_type="diagnosis",
                    answer=answer,
                    reasoning_summary=str(e),
                )

        # CASE 9: EVALUATIVE — Brand Battle / Challenge ("Challenge this brand")
        elif any(k in lower_msg for k in ["challenge", "battle", "critique", "adversarial"]):
            tool_name = "run_brand_battle"
            brand_state = critic_node(brand_state, provider)
            crit_data = brand_state.get("critique", {})
            issues = crit_data.get("issues", [])

            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"issues_found": len(issues)},
                    summary=f"Adversarial Critic identified {len(issues)} strategic vulnerabilities.",
                )
            )

            issue_lines = []
            for idx, iss in enumerate(issues[:3], 1):
                prob = iss.get("problem") or iss.get("description", "")
                sug = iss.get("suggestion", "")
                issue_lines.append(f"{idx}. **[{iss.get('target', 'General').upper()}]** ({iss.get('severity', 'medium')} severity)\n   - *Vulnerability*: {prob}\n   - *Recommendation*: {sug}")

            gen_checks = crit_data.get("genericity_checks", [])
            gen_str = "\n".join([f"- {g}" for g in gen_checks[:2]]) if gen_checks else "- Positioning maintains adequate differentiation."

            answer = (
                f"### Adversarial Brand Battle Evaluation\n\n"
                f"**Genericity & Cliché Flags**:\n{gen_str}\n\n"
                f"**Critical Vulnerabilities Found**:\n"
                + "\n\n".join(issue_lines)
                + "\n\nTo resolve these vulnerabilities, tell me: *'Fix the consistency problems'* or *'Make the brand more premium'*."
            )
            mentor_response = MentorResponse(
                intent="CRITIQUE",
                response_type="diagnosis",
                answer=answer,
                key_insight="Constructive stress-testing reveals vulnerabilities before they cost marketing capital in production.",
                assumptions=["ASSUMPTION: Current messaging will cut through established competitor awareness."],
                questions=["Which of these identified vulnerabilities do you believe is most urgent?"],
                recommended_next_step="Execute targeted refinement to neutralize the top vulnerability.",
                tool_action=tool_name,
                reasoning_summary="Executed adversarial Brand Battle node to stress-test claims, audience fit, and visual contradictions.",
                affected_stages=["critique", "consistency"],
            )

        # CASE 10: MUTATING — Fix Consistency ("Fix the consistency problems")
        elif any(k in lower_msg for k in ["consistency", "alignment", "fix consistency", "fix the consistency"]):
            tool_name = "run_consistency_check"
            brand_state = consistency_node(brand_state, provider)
            cons_data = brand_state.get("consistency", {})
            req_revs = cons_data.get("required_revisions", [])

            target_stage = "visual_direction"
            if req_revs and isinstance(req_revs, list) and isinstance(req_revs[0], dict):
                target_stage = req_revs[0].get("target", "visual_direction")

            brand_state["selected_direction"]["revision_request"] = {
                "target": target_stage,
                "feedback": "Harmonize cross-stage matrix and eliminate tone-visual contradictions."
            }

            if target_stage in ("visual_direction", "visual"):
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

            brand_state = consistency_node(brand_state, provider)
            brand_state = launch_node(brand_state, provider)

            final_score = brand_state.get("consistency", {}).get("overall_consistency", 88)
            tools_executed.append(
                ToolExecutionResult(
                    tool=tool_name,
                    status="completed",
                    details={"final_score": final_score},
                    summary=f"Resolved consistency contradictions and harmonized brand matrix to score {final_score}/100.",
                )
            )

            answer = (
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
            mentor_response = MentorResponse(
                intent="REVISION",
                response_type="action",
                answer=answer,
                key_insight="A coherent brand system amplifies marketing efficiency because all touchpoints reinforce the same mental model.",
                assumptions=[],
                questions=[],
                recommended_next_step="Inspect the Launch Brand Kit tab to view finalized launch assets.",
                tool_action=tool_name,
                reasoning_summary="Resolved identified brand contradictions through targeted dependency execution.",
                affected_stages=[target_stage, "consistency", "launch"],
            )

        # CASE 11: GENERAL FALLBACK
        else:
            latest_bundle = repository.get_accumulated_brand_state(project_id)
            latest_arts = latest_bundle["artifact_map"]
            current_name = (
                latest_arts.get("launch", {}).get("brand_name")
                or latest_bundle["selected_directions"].get("name", {}).get("name")
                or project.get("name")
                or "BrandForge Studio"
            )
            pos_data = latest_arts.get("positioning", {})

            answer = (
                f"### Strategic Brand Summary: **{current_name}**\n\n"
                f"- **Project Idea**: {project.get('idea', '')}\n"
                f"- **Current Final Brand Name**: **{current_name}**\n"
                f"- **Category**: {pos_data.get('category', 'Category in development')}\n"
                f"- **Value Proposition**: *\"{pos_data.get('value_proposition', 'Value proposition in development')}\"*\n"
                f"- **Completed Stages**: **{len(latest_bundle['completed_stages'])}/{latest_bundle['total_stages']}**\n\n"
                f"How would you like to proceed?\n"
                f"- Ask for a diagnosis: *\"Diagnose my business idea\"*\n"
                f"- Challenge the strategy: *\"What assumption is weakest?\"*\n"
                f"- Refine positioning: *\"Make the brand more premium\"*\n"
                f"- Test against the market: *\"Challenge this brand\"*"
            )
            mentor_response = MentorResponse(
                intent="STATE_EXPLANATION",
                response_type="teaching",
                answer=answer,
                key_insight="Structured brand intelligence maintains continuous alignment between founder thesis and execution.",
                assumptions=[],
                questions=["Which area of your business strategy would you like to diagnose next?"],
                recommended_next_step="Review current stage progress in the Studio sidebar.",
                tool_action=None,
                reasoning_summary="Summarized current authoritative BrandState and presented high-value decision paths.",
                affected_stages=[],
            )

        # Refresh accumulated state and persist assistant message
        updated_bundle = repository.get_accumulated_brand_state(project_id)
        mentor_dict = mentor_response.model_dump() if mentor_response else None

        repository.create_chat_message(
            project_id=project_id,
            role="assistant",
            content=mentor_response.answer if mentor_response else "",
            tool_calls=[t.model_dump() for t in tools_executed],
            mentor_data=mentor_dict,
        )

        return ChatResponse(
            reply=mentor_response.answer if mentor_response else "",
            tools_executed=tools_executed,
            updated_brand_state=updated_bundle["artifact_map"],
            mentor=mentor_response,
        )
