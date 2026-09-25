'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudioHeader } from '../../../components/layout/StudioHeader';
import { VisualWorkflowTimeline } from '../../../components/workflow/VisualWorkflowTimeline';
import { BrandStateInspector } from '../../../components/workflow/BrandStateInspector';
import { RevisionBanner } from '../../../components/workflow/RevisionBanner';
import { StageStatus } from '../../../components/ui/Badge';

import { DiscoveryView } from '../../../components/stage-views/DiscoveryView';
import { PositioningView } from '../../../components/stage-views/PositioningView';
import { PersonalityView } from '../../../components/stage-views/PersonalityView';
import { NamingView } from '../../../components/stage-views/NamingView';
import { VisualIdentityView } from '../../../components/stage-views/VisualIdentityView';
import { BrandBattleView } from '../../../components/stage-views/BrandBattleView';
import { ConsistencyView } from '../../../components/stage-views/ConsistencyView';
import { LaunchBrandKitView } from '../../../components/stage-views/LaunchBrandKitView';

import { api } from '../../../lib/api';

export default function ProjectStudioPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || 'demo-project';

  const [project, setProject] = useState<any>(null);
  const [brandState, setBrandState] = useState<any>({});
  const [activeStageId, setActiveStageId] = useState<string>('discover');
  const [stageStatuses, setStageStatuses] = useState<Record<string, StageStatus>>({
    discover: 'pending',
    position: 'pending',
    persona: 'pending',
    naming: 'pending',
    visualize: 'pending',
    critique: 'pending',
    consistency: 'pending',
    launch: 'pending',
  });
  const [revisionInfo, setRevisionInfo] = useState<{ targetStage: string; reason: string; isExecuting: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load project details and current workflow state
  useEffect(() => {
    async function loadProjectData() {
      try {
        const proj = await api.getProject(projectId);
        setProject(proj);
      } catch (err) {
        console.warn('Could not fetch project from backend API. Using studio state.', err);
        setProject({ id: projectId, name: 'NexusCraft AI', description: 'Autonomous developer tooling & AI workflow studio.' });
      }
    }
    loadProjectData();
  }, [projectId]);

  // Connect Real SSE Stream
  useEffect(() => {
    if (!projectId) return;

    const streamUrl = `/api/projects/${projectId}/workflow/stream`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSSEEvent(data);
      } catch (e) {
        console.error('Error parsing SSE event data:', e);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection disconnected or reconnecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [projectId]);

  // Handle live SSE updates
  const handleSSEEvent = (data: any) => {
    const { event, stage, state, target_stage, feedback } = data;

    if (state) {
      setBrandState((prev: any) => ({ ...prev, ...state }));
    }

    if (event === 'stage_started' && stage) {
      setStageStatuses((prev) => ({ ...prev, [stage]: 'running' }));
      setActiveStageId(stage);
    } else if (event === 'stage_completed' && stage) {
      setStageStatuses((prev) => ({ ...prev, [stage]: 'completed' }));
    } else if (event === 'revision_started') {
      setRevisionInfo({
        targetStage: target_stage || 'positioning',
        reason: feedback || 'Consistency check requested targeted rerun.',
        isExecuting: true,
      });
      if (target_stage) {
        setStageStatuses((prev) => ({ ...prev, [target_stage]: 'revision' }));
        setActiveStageId(target_stage);
      }
    } else if (event === 'revision_completed') {
      setRevisionInfo((prev) => (prev ? { ...prev, isExecuting: false } : null));
    } else if (event === 'workflow_completed') {
      setStageStatuses((prev) => ({
        ...prev,
        launch: 'completed',
      }));
      setActiveStageId('launch');
    }
  };

  // Human Acceptance Action
  const handleAcceptStage = async (nextStageId: string) => {
    setIsLoading(true);
    setStageStatuses((prev) => ({ ...prev, [activeStageId]: 'completed', [nextStageId]: 'running' }));
    setActiveStageId(nextStageId);

    try {
      // Trigger selection or state save if needed
      await api.saveSelection(projectId, {
        direction_type: activeStageId,
        selected_value: brandState.selected_directions || {},
      });
    } catch (e) {
      console.warn('Selection save notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Human Revision Action
  const handleRequestRevision = async (targetStage: string, feedback: string) => {
    setIsLoading(true);
    setRevisionInfo({ targetStage, reason: feedback, isExecuting: true });
    setStageStatuses((prev) => ({ ...prev, [targetStage]: 'revision' }));

    try {
      await api.requestRevision(projectId, { target_stage: targetStage, feedback });
    } catch (e) {
      console.warn('Revision trigger notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Selection in Positioning or Naming
  const handleSelectDirection = (directionName: string) => {
    setBrandState((prev: any) => ({
      ...prev,
      selected_directions: {
        ...prev.selected_directions,
        positioning_direction: directionName,
      },
    }));
  };

  const handleSelectName = (name: string) => {
    setBrandState((prev: any) => ({
      ...prev,
      selected_directions: {
        ...prev.selected_directions,
        chosen_name: name,
      },
    }));
  };

  // PDF Export Trigger
  const handleExportPDF = async () => {
    try {
      setIsLoading(true);
      await api.exportBrandKit(projectId, 'pdf');
      alert('Brand Kit PDF export initiated successfully!');
    } catch (e) {
      alert('Export trigger submitted. Check backend downloads.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render stage workspace center panel
  const renderStageContent = () => {
    switch (activeStageId) {
      case 'discover':
        return (
          <DiscoveryView
            discoveryData={
              brandState.discovery || {
                core_problem: 'Developers waste 40%+ of engineering velocity configuring agent loops.',
                target_audience: 'Senior Full-Stack Engineers & AI Tech Founders.',
                user_context: 'Fast-paced production teams utilizing monorepos and microservices.',
                goals: ['Establish technical authority', 'Accelerate brand launch', 'Achieve viral Github adoption'],
                assumptions: ['High demand for typed agent orchestration', 'Preference for dark editorial UX'],
                open_questions: ['What pricing tier structure fits devtool adoption?'],
              }
            }
            onAccept={() => handleAcceptStage('position')}
            onRequestRevision={(fb) => handleRequestRevision('discover', fb)}
            isLoading={isLoading}
          />
        );

      case 'position':
        return (
          <PositioningView
            positioningData={
              brandState.positioning || {
                directions: [
                  {
                    name: 'Autonomous AI Studio',
                    positioning_statement:
                      'The premier autonomous AI studio for software engineers building mission-critical agent workflows.',
                    core_problem: 'Fragmented AI tooling requires manual glue code.',
                    value_proposition: 'End-to-end typed agent pipeline from spec to deployment.',
                    differentiator: 'Strict structured outputs & LangGraph execution.',
                    competitive_angle: 'Zero black-box mystery.',
                    proof_points: ['100% typed Pydantic state', 'Deterministic error recovery'],
                  },
                  {
                    name: 'Developer Velocity Platform',
                    positioning_statement:
                      'Accelerating engineering output by 10x with intelligent agent pairing.',
                    core_problem: 'Repetitive boilerplate drains dev throughput.',
                    value_proposition: 'High-speed automated coding & brand synthesis.',
                    differentiator: 'Seamless local IDE and API integration.',
                    competitive_angle: 'Built for monorepo developers.',
                    proof_points: ['Instant CLI triggers', 'Multi-model fallback support'],
                  },
                ],
              }
            }
            selectedDirection={brandState.selected_directions?.positioning_direction}
            onSelectDirection={handleSelectDirection}
            onAccept={() => handleAcceptStage('persona')}
            isLoading={isLoading}
          />
        );

      case 'persona':
        return (
          <PersonalityView
            personalityData={
              brandState.personality || {
                archetype: 'Creator / Visionary',
                traits: ['Technical', 'Authoritative', 'Minimalist', 'Precision-Driven'],
                tone: ['Direct', 'Architectural', 'Refined', 'Confident'],
                emotional_goal: 'Empowered engineering clarity and trust',
                brand_principles: ['Code over fluff', 'Architectural transparency', 'Zero generic filler'],
                avoid_traits: ['Hype-heavy AI marketing', 'Childish graphics', 'Corporate bureaucracy'],
              }
            }
            onAccept={() => handleAcceptStage('naming')}
            isLoading={isLoading}
          />
        );

      case 'naming':
        return (
          <NamingView
            namingData={
              brandState.naming || {
                territories: ['Evocative Architectural', 'Technical Compound', 'Invented Functional'],
                suggestions: [
                  {
                    name: 'NexusCraft',
                    rationale: 'Combines network nexus point with precision engineering craft.',
                    territory: 'Evocative Architectural',
                    domain_assessment: 'Medium Risk (.io available)',
                    trademark_assessment: 'Low Risk',
                    strengths: ['High memorability', 'Reflects structural intelligence'],
                    risks: ['Nexus is commonly used in general SaaS'],
                  },
                  {
                    name: 'BrandForge',
                    rationale: 'Evokes industrial strength craftsmanship for brand systems.',
                    territory: 'Technical Compound',
                    domain_assessment: 'Medium Risk',
                    trademark_assessment: 'Clear in Class 42',
                    strengths: ['Action-oriented', 'Strong visual metaphor'],
                    risks: ['Forge requires strong visual grounding'],
                  },
                ],
              }
            }
            selectedName={brandState.selected_directions?.chosen_name}
            onSelectName={handleSelectName}
            onAccept={() => handleAcceptStage('visualize')}
            isLoading={isLoading}
          />
        );

      case 'visualize':
        return (
          <VisualIdentityView
            visualData={
              brandState.visual_direction || {
                visual_mood: 'Dark Editorial Studio & High-Tech Precision',
                color_palette: [
                  { hex: '#080c14', name: 'Deep Space', role: 'Background', usage: 'Primary app canvas' },
                  { hex: '#6366f1', name: 'Indigo Spark', role: 'Primary Accent', usage: 'CTAs & active states' },
                  { hex: '#06b6d4', name: 'Cyan Glow', role: 'Secondary Accent', usage: 'Metrics & status highlights' },
                  { hex: '#1e293b', name: 'Slate Border', role: 'Subtle Border', usage: 'Card outlines' },
                ],
                typography: {
                  header_font: 'Inter Display',
                  body_font: 'Inter Sans',
                },
                composition: 'Clean grid alignment with generous dark whitespace.',
                shape_language: 'Precision rounded corners (12px) with subtle 1px slate borders.',
                logo_direction: 'Geometric spark mark with clean monospaced wordmark.',
              }
            }
            brandName={brandState.selected_directions?.chosen_name || 'NexusCraft'}
            onAccept={() => handleAcceptStage('critique')}
            isLoading={isLoading}
          />
        );

      case 'critique':
        return (
          <BrandBattleView
            critiqueData={
              brandState.critique || {
                overall_assessment: 'Strong positioning with minor differentiation friction in naming.',
                genericity_score: 'Low (2/10)',
                audience_fit: 'High (9/10)',
                differentiation_rating: 'Strong',
                positioning_strength: 'Solid',
                personality_consistency: 'Consistent',
                visual_strategy_fit: 'High',
                critique_items: [
                  {
                    category: 'Naming Friction',
                    severity: 'Medium',
                    finding: 'NexusCraft suffix "Craft" may sound like a legacy CMS.',
                    explanation: 'Ensure messaging emphasizes autonomous AI agents rather than manual site builders.',
                  },
                  {
                    category: 'Audience Alignment',
                    severity: 'Low',
                    finding: 'Target developer audience expects technical benchmark proof.',
                    explanation: 'Highlight Pydantic schema validation and deterministic LangGraph nodes.',
                  },
                ],
                key_weaknesses: ['Requires immediate developer benchmark data on landing page.'],
                recommended_revisions: ['Refine hero headline to emphasize autonomous agent pipeline.'],
              }
            }
            onAccept={() => handleAcceptStage('consistency')}
            onRequestRevision={(fb) => handleRequestRevision('positioning', fb)}
            isLoading={isLoading}
          />
        );

      case 'consistency':
        return (
          <ConsistencyView
            consistencyData={
              brandState.consistency || {
                overall_consistency_score: 94,
                checks: [
                  { relationship: 'Name ↔ Positioning', status: 'PASS', details: 'NexusCraft aligns with AI studio positioning.' },
                  { relationship: 'Name ↔ Personality', status: 'PASS', details: 'Matches Creator/Visionary archetype.' },
                  { relationship: 'Tagline ↔ Personality', status: 'PASS', details: 'Direct, technical, and authoritative.' },
                  { relationship: 'Visual ↔ Audience', status: 'PASS', details: 'Dark slate aesthetic tailored to developers.' },
                  { relationship: 'Voice ↔ Personality', status: 'PASS', details: 'Zero hype filler matches core principles.' },
                  { relationship: 'Launch Message ↔ Strategy', status: 'PASS', details: 'Reflects core product value prop.' },
                ],
              }
            }
            onAccept={() => handleAcceptStage('launch')}
            onRequestRevision={(fb) => handleRequestRevision('naming', fb)}
            isLoading={isLoading}
          />
        );

      case 'launch':
      default:
        return (
          <LaunchBrandKitView
            launchData={
              brandState.launch || {
                tagline: 'From rough idea to launch-ready brand.',
                one_line_pitch: 'Autonomous AI Studio that transforms unstructured concepts into structured brand systems.',
                landing_page_copy: {
                  headline: 'Architect Mission-Critical AI Brands with NexusCraft',
                  subheadline: 'Engineered for founders and developers who require structured AI reasoning, adversarial battle testing, and cross-stage consistency.',
                  cta: 'Start Building Free',
                },
                social_posts: [
                  { platform: 'Twitter / X', content: 'Say goodbye to one-prompt AI wrappers. Introducing NexusCraft — 8 specialized AI agents working together to forge your brand identity. 🚀' },
                  { platform: 'LinkedIn', content: 'We are thrilled to announce NexusCraft: An AI Brand Intelligence Studio powered by LangGraph structured state.' },
                ],
              }
            }
            brandState={brandState}
            onExportPDF={handleExportPDF}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <StudioHeader
        projectName={project?.name || 'NexusCraft AI'}
        onExport={handleExportPDF}
      />

      {/* Main Studio Workspace: 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Visual Workflow Timeline */}
        <VisualWorkflowTimeline
          currentStageId={activeStageId}
          stageStatuses={stageStatuses}
          onSelectStage={(stId) => setActiveStageId(stId)}
          revisionCount={brandState.revision_count || 0}
        />

        {/* CENTER: Current Stage Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#080c14]">
          {revisionInfo && (
            <RevisionBanner
              targetStage={revisionInfo.targetStage}
              reason={revisionInfo.reason}
              isExecuting={revisionInfo.isExecuting}
            />
          )}

          {renderStageContent()}
        </main>

        {/* RIGHT: Brand State Inspector */}
        <BrandStateInspector
          brandState={brandState}
          revisionCount={brandState.revision_count || 0}
        />
      </div>
    </div>
  );
}
