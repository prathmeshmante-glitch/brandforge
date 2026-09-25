// Shared TypeScript interfaces for BrandForge

export interface UserSegment {
  segment: string;
  needs: string[];
  pain_points: string[];
}

export interface DiscovererInput {
  idea: string;
  constraints?: Record<string, any>;
  optional_target_users?: string;
  optional_context?: string;
}

export interface DiscovererOutput {
  problem: string;
  target_users: UserSegment[];
  context: string;
  goals: string[];
  constraints: string[];
  assumptions: string[];
  open_questions: string[];
}

export interface PositionerOutput {
  category: string;
  core_problem: string;
  value_proposition: string;
  differentiators: string[];
  competitive_angle: string;
  positioning_statement: string;
  proof_points: string[];
}

export interface PersonalityTrait {
  trait: string;
  reason: string;
}

export interface ToneGuide {
  do: string[];
  avoid: string[];
}

export interface StrategistOutput {
  personality: PersonalityTrait[];
  principles: string[];
  tone: ToneGuide;
  brand_archetype: string;
  emotional_goal: string;
}

export interface NameOption {
  name: string;
  rationale: string;
  strengths: string[];
  risks: string[];
}

export interface NamingTerritory {
  type: string;
  description: string;
  names: NameOption[];
}

export interface NamingOutput {
  territories: NamingTerritory[];
}

export interface VisualDirection {
  mood: string[];
  color_direction: string[];
  typography: string[];
  composition: string[];
  shape_language: string[];
  imagery: string[];
  symbol_concepts: string[];
  avoid: string[];
}

export interface LogoDirection {
  concept: string;
  rationale: string;
}

export interface CreativeDirectorOutput {
  visual_direction: VisualDirection;
  logo_direction: LogoDirection;
}

export interface CritiqueIssue {
  target: 'positioning' | 'personality' | 'naming' | 'visual_direction' | 'launch';
  area: string;
  severity: 'low' | 'medium' | 'high';
  problem: string;
  evidence: string;
  suggestion: string;
}

export interface CriticOutput {
  issues: CritiqueIssue[];
  genericity_checks: string[];
  audience_mismatch: string[];
  contradictions: string[];
  revised_options: Record<string, any>[];
}

export interface ConsistencyCheck {
  area: string;
  status: 'pass' | 'warning' | 'fail';
  reason: string;
}

export interface ConsistencyRevisionTarget {
  target: 'positioning' | 'personality' | 'naming' | 'visual_direction' | 'launch';
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ConsistencyGuardianOutput {
  overall_consistency: number;
  checks: ConsistencyCheck[];
  required_revisions: ConsistencyRevisionTarget[];
}

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  cta: string;
}

export interface SocialCopy {
  instagram: string;
  linkedin: string;
}

export interface LaunchAgentOutput {
  brand_name: string;
  tagline: string;
  one_line_pitch: string;
  landing_page: LandingPageCopy;
  social: SocialCopy;
  brand_voice_samples: string[];
  launch_message: string;
}

export interface BrandState {
  project_id: string;
  idea: string;
  constraints?: Record<string, any>;
  discovery?: DiscovererOutput;
  positioning?: PositionerOutput;
  personality?: StrategistOutput;
  naming?: NamingOutput;
  visual_direction?: CreativeDirectorOutput;
  critique?: CriticOutput;
  consistency?: ConsistencyGuardianOutput;
  launch?: LaunchAgentOutput;
  selected_direction?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'needs_revision';
  revision_count: number;
  errors: string[];
}
