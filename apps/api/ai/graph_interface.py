"""
LangGraph Workflow Engine for BrandForge.
Defines graph nodes, state transitions, critique loops, targeted revision dependency chains,
database persistence, and execution endpoints.
"""

from typing import Dict, Any, Generator, Optional, Callable, List
from packages.schemas.brand_state import (
    BrandStateModel,
    DiscovererOutput,
    PositionerOutput,
    StrategistOutput,
    NamingOutput,
    CreativeDirectorOutput,
    CriticOutput,
    ConsistencyGuardianOutput,
    LaunchAgentOutput,
)
from packages.prompts.agent_prompts import (
    DISCOVERER_PROMPT,
    POSITIONER_PROMPT,
    STRATEGIST_PROMPT,
    NAMING_PROMPT,
    CREATIVE_PROMPT,
    CRITIC_PROMPT,
    CONSISTENCY_PROMPT,
    LAUNCH_PROMPT,
)
from apps.api.ai.provider import get_ai_provider, BaseAIProvider
from apps.api.app.db.repository import repository

MAX_REVISIONS = 3

# Try importing LangGraph; fallback gracefully if langgraph package is not installed
try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False
    END = "__END__"


class FallbackStateGraph:
    """Fallback state graph runner when langgraph is not installed in the environment."""
    def __init__(self, schema: Any):
        self.nodes: Dict[str, Callable] = {}
        self.entry_point: Optional[str] = None
        self.conditional_edges: Dict[str, tuple] = {}

    def add_node(self, name: str, func: Callable):
        self.nodes[name] = func

    def set_entry_point(self, name: str):
        self.entry_point = name

    def add_edge(self, source: str, target: str):
        pass

    def add_conditional_edges(self, source: str, condition_func: Callable, routing_map: Dict[str, str]):
        self.conditional_edges[source] = (condition_func, routing_map)

    def compile(self):
        return CompiledFallbackGraph(self)


class CompiledFallbackGraph:
    def __init__(self, graph: FallbackStateGraph):
        self.graph = graph

    def invoke(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        state = dict(initial_state)
        # Primary sequence
        sequence = ["discover", "position", "personality", "naming", "visualize", "critique", "consistency"]
        for step in sequence:
            if step in self.graph.nodes:
                state = self.graph.nodes[step](state)
                
        # Handle conditional revision check & targeted dependency chain
        if "consistency" in self.graph.conditional_edges:
            cond_func, routing_map = self.graph.conditional_edges["consistency"]
            decision = cond_func(state)
            if decision == "revise" and "revise" in self.graph.nodes:
                state = self.graph.nodes["revise"](state)
                # Re-evaluate consistency after revision
                if "consistency" in self.graph.nodes:
                    state = self.graph.nodes["consistency"](state)
                    
        if "launch" in self.graph.nodes:
            state = self.graph.nodes["launch"](state)
            
        return state

    def stream(self, initial_state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        state = dict(initial_state)
        sequence = ["discover", "position", "personality", "naming", "visualize", "critique", "consistency", "launch"]
        for step in sequence:
            if step in self.graph.nodes:
                state = self.graph.nodes[step](state)
                yield {step: state}


def _dump_model(obj: Any) -> Dict[str, Any]:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    elif hasattr(obj, "dict"):
        return obj.dict()
    elif isinstance(obj, dict):
        return obj
    return {"data": str(obj)}


def _persist_artifact(run_id: Optional[str], stage: str, artifact_obj: Any):
    """Utility helper to persist completed agent output JSON to database."""
    if run_id:
        artifact_json = _dump_model(artifact_obj)
        repository.create_artifact(run_id=run_id, stage=stage, artifact_json=artifact_json)


def discover_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 1: Discoverer."""
    ai_provider = provider or get_ai_provider()
    idea = state.get("idea", "")
    constraints = state.get("constraints", {})
    prompt = f"User Startup Idea: {idea}\nConstraints: {constraints}"
    
    output: DiscovererOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=DISCOVERER_PROMPT,
        response_model=DiscovererOutput
    )
    
    state["discovery"] = _dump_model(output)
    state["status"] = "discovery_completed"
    _persist_artifact(state.get("run_id"), "discovery", output)
    return state


def position_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 2: Positioner."""
    ai_provider = provider or get_ai_provider()
    discovery = state.get("discovery", {})
    selected = state.get("selected_direction", {})
    prompt = f"Idea: {state.get('idea')}\nDiscovery Context: {discovery}\nUser Directives / Decisions: {selected}"
    
    output: PositionerOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=POSITIONER_PROMPT,
        response_model=PositionerOutput
    )
    
    state["positioning"] = _dump_model(output)
    state["status"] = "positioning_completed"
    _persist_artifact(state.get("run_id"), "positioning", output)
    return state


def personality_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 3: Brand Strategist."""
    ai_provider = provider or get_ai_provider()
    discovery = state.get("discovery", {})
    positioning = state.get("positioning", {})
    selected = state.get("selected_direction", {})
    
    prompt = f"Discovery: {discovery}\nPositioning: {positioning}\nUser Decisions: {selected}"
    
    output: StrategistOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=STRATEGIST_PROMPT,
        response_model=StrategistOutput
    )
    
    state["personality"] = _dump_model(output)
    state["status"] = "personality_completed"
    _persist_artifact(state.get("run_id"), "personality", output)
    return state


def naming_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 4: Naming Agent."""
    ai_provider = provider or get_ai_provider()
    discovery = state.get("discovery", {})
    positioning = state.get("positioning", {})
    personality = state.get("personality", {})
    selected = state.get("selected_direction", {})
    
    prompt = (
        f"Idea: {state.get('idea')}\n"
        f"Positioning: {positioning}\n"
        f"Personality: {personality}\n"
        f"User Selections: {selected}"
    )
    
    output: NamingOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=NAMING_PROMPT,
        response_model=NamingOutput
    )
    
    state["naming"] = _dump_model(output)
    state["status"] = "naming_completed"
    _persist_artifact(state.get("run_id"), "naming", output)
    return state


def visual_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 5: Creative Director."""
    ai_provider = provider or get_ai_provider()
    positioning = state.get("positioning", {})
    personality = state.get("personality", {})
    naming = state.get("naming", {})
    selected = state.get("selected_direction", {})
    
    prompt = (
        f"Positioning: {positioning}\n"
        f"Personality: {personality}\n"
        f"Naming Territories: {naming}\n"
        f"User Direction: {selected}"
    )
    
    output: CreativeDirectorOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=CREATIVE_PROMPT,
        response_model=CreativeDirectorOutput
    )
    
    state["visual_direction"] = _dump_model(output)
    state["status"] = "visual_completed"
    _persist_artifact(state.get("run_id"), "visual", output)
    return state


def critic_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 6: Brand Battle / Critic."""
    ai_provider = provider or get_ai_provider()
    prompt = (
        f"BrandState to Evaluate:\n"
        f"Discovery: {state.get('discovery')}\n"
        f"Positioning: {state.get('positioning')}\n"
        f"Personality: {state.get('personality')}\n"
        f"Naming: {state.get('naming')}\n"
        f"Visual Direction: {state.get('visual_direction')}"
    )
    
    output: CriticOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=CRITIC_PROMPT,
        response_model=CriticOutput
    )
    
    state["critique"] = _dump_model(output)
    state["status"] = "critique_completed"
    _persist_artifact(state.get("run_id"), "critique", output)
    return state


def consistency_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 7: Consistency Guardian."""
    ai_provider = provider or get_ai_provider()
    prompt = (
        f"Brand State for Holistic Consistency Check:\n"
        f"Positioning: {state.get('positioning')}\n"
        f"Personality: {state.get('personality')}\n"
        f"Naming: {state.get('naming')}\n"
        f"Visuals: {state.get('visual_direction')}\n"
        f"Critic Concerns: {state.get('critique')}"
    )
    
    output: ConsistencyGuardianOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=CONSISTENCY_PROMPT,
        response_model=ConsistencyGuardianOutput
    )
    
    state["consistency"] = _dump_model(output)
    state["status"] = "consistency_completed"
    _persist_artifact(state.get("run_id"), "consistency", output)
    return state


def revision_planner_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """
    Targeted Revision Planner:
    Reads required_revisions target or critic issues, determines affected stage,
    and executes the required targeted dependency chain.
    """
    rev_count = state.get("revision_count", 0) + 1
    state["revision_count"] = rev_count
    
    consistency = state.get("consistency", {})
    required_revisions = consistency.get("required_revisions", [])
    
    # Identify target stage
    target = "naming"
    if required_revisions and isinstance(required_revisions, list):
        first_rev = required_revisions[0]
        if isinstance(first_rev, dict):
            target = first_rev.get("target", "naming")
        elif hasattr(first_rev, "target"):
            target = getattr(first_rev, "target")
            
    state["last_revision_target"] = target
    state["status"] = f"revising_{target}_iteration_{rev_count}"
    
    # Execute Targeted Dependency Chain
    if target == "positioning":
        state = position_node(state, provider)
        state = personality_node(state, provider)
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
    elif target == "personality":
        state = personality_node(state, provider)
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
    elif target == "naming":
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
    elif target == "visual_direction":
        state = visual_node(state, provider)
        state = critic_node(state, provider)
    elif target == "launch":
        state = launch_node(state, provider)
    else:
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        
    state["status"] = f"revision_{target}_completed"
    return state


def launch_node(state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute Agent 8: Launch Agent."""
    ai_provider = provider or get_ai_provider()
    selected = state.get("selected_direction", {})
    selected_name = selected.get("name") or selected.get("preferred_name")
    if not selected_name:
        naming = state.get("naming", {})
        territories = naming.get("territories", []) if isinstance(naming, dict) else []
        for t in territories:
            names = t.get("names", []) if isinstance(t, dict) else []
            if names and isinstance(names[0], dict) and names[0].get("name"):
                selected_name = names[0]["name"]
                break
    if not selected_name:
        selected_name = state.get("idea", "BrandForge Studio")
    
    prompt = (
        f"Approved Brand Name: {selected_name}\n"
        f"Positioning: {state.get('positioning')}\n"
        f"Personality: {state.get('personality')}\n"
        f"Visual Direction: {state.get('visual_direction')}\n"
        f"User Directive: {selected}"
    )
    
    output: LaunchAgentOutput = ai_provider.generate_structured(
        prompt=prompt,
        system_prompt=LAUNCH_PROMPT,
        response_model=LaunchAgentOutput
    )
    
    state["launch"] = _dump_model(output)
    state["status"] = "completed"
    _persist_artifact(state.get("run_id"), "launch", output)
    return state


def should_revise(state: Dict[str, Any]) -> str:
    """Conditional edge checking whether a critique revision loop is required."""
    consistency = state.get("consistency", {})
    score = consistency.get("overall_consistency", 100)
    required_revisions = consistency.get("required_revisions", [])
    rev_count = state.get("revision_count", 0)
    
    if (score < 80 or len(required_revisions) > 0) and rev_count < MAX_REVISIONS:
        return "revise"
    return "launch"


def build_brand_graph(provider: Optional[BaseAIProvider] = None):
    """Construct and compile the LangGraph StateGraph workflow."""
    if LANGGRAPH_AVAILABLE:
        builder = StateGraph(dict)
    else:
        builder = FallbackStateGraph(dict)
    
    # Define Nodes
    builder.add_node("discover", lambda s: discover_node(s, provider))
    builder.add_node("position", lambda s: position_node(s, provider))
    builder.add_node("personality", lambda s: personality_node(s, provider))
    builder.add_node("naming", lambda s: naming_node(s, provider))
    builder.add_node("visualize", lambda s: visual_node(s, provider))
    builder.add_node("critique", lambda s: critic_node(s, provider))
    builder.add_node("consistency", lambda s: consistency_node(s, provider))
    builder.add_node("revise", lambda s: revision_planner_node(s, provider))
    builder.add_node("launch", lambda s: launch_node(s, provider))
    
    # Define Edges
    builder.set_entry_point("discover")
    builder.add_edge("discover", "position")
    builder.add_edge("position", "personality")
    builder.add_edge("personality", "naming")
    builder.add_edge("naming", "visualize")
    builder.add_edge("visualize", "critique")
    builder.add_edge("critique", "consistency")
    
    # Conditional Revision Edge
    builder.add_conditional_edges(
        "consistency",
        should_revise,
        {
            "revise": "revise",
            "launch": "launch"
        }
    )
    builder.add_edge("revise", "consistency")
    builder.add_edge("launch", END)
    
    return builder.compile()


def run_brand_workflow(initial_state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Dict[str, Any]:
    """Execute full BrandForge graph workflow."""
    app = build_brand_graph(provider)
    final_state = app.invoke(initial_state)
    return final_state


def stream_brand_workflow(initial_state: Dict[str, Any], provider: Optional[BaseAIProvider] = None) -> Generator[Dict[str, Any], None, None]:
    """Stream LangGraph workflow state stage updates."""
    app = build_brand_graph(provider)
    for output in app.stream(initial_state):
        node_name = list(output.keys())[0]
        yield {
            "stage": node_name,
            "status": "completed",
            "project_id": initial_state.get("project_id", "")
        }


def run_targeted_revision_workflow(
    initial_state: Dict[str, Any],
    target_stage: str,
    feedback: str,
    provider: Optional[BaseAIProvider] = None
) -> Dict[str, Any]:
    """
    Executes a bounded, targeted revision workflow for the requested target_stage
    and its dependent downstream stages, persisting artifacts strictly with the new run_id.
    """
    state = dict(initial_state)
    target = target_stage.lower().strip()
    
    # Record feedback directive in state
    selected = state.setdefault("selected_direction", {})
    selected["last_revision"] = {"target": target, "feedback": feedback}
    
    # Normalize target name and execute downstream chain
    if target in ("discover", "discovery"):
        state = discover_node(state, provider)
        state = position_node(state, provider)
        state = personality_node(state, provider)
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)
    elif target in ("position", "positioning"):
        state = position_node(state, provider)
        state = personality_node(state, provider)
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)
    elif target in ("persona", "personality", "strategist"):
        state = personality_node(state, provider)
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)
    elif target in ("name", "naming"):
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)
    elif target in ("visual", "visualize", "visual_direction", "creative"):
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)
    elif target in ("launch",):
        state = launch_node(state, provider)
    else:
        state = naming_node(state, provider)
        state = visual_node(state, provider)
        state = critic_node(state, provider)
        state = consistency_node(state, provider)
        state = launch_node(state, provider)

    state["status"] = "completed"
    return state

