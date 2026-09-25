'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  MoreHorizontal,
  CircleCheck,
  CircleAlert,
  WandSparkles,
  Compass,
  Target,
  Type,
  Palette,
  Swords,
  Layers3,
  Rocket,
  RefreshCw,
} from 'lucide-react';

import { DiscoveryView } from '../../../components/stage-views/DiscoveryView';
import { PositioningView } from '../../../components/stage-views/PositioningView';
import { PersonalityView } from '../../../components/stage-views/PersonalityView';
import { NamingView } from '../../../components/stage-views/NamingView';
import { VisualIdentityView } from '../../../components/stage-views/VisualIdentityView';
import { BrandBattleView } from '../../../components/stage-views/BrandBattleView';
import { ConsistencyView } from '../../../components/stage-views/ConsistencyView';
import { LaunchBrandKitView } from '../../../components/stage-views/LaunchBrandKitView';
import { api } from '../../../lib/api';

const STAGES = [
  { id: 'discover', number: '01', name: 'Discover', agent: 'Discoverer', icon: Compass, title: 'Understand the real problem.', caption: 'Understanding the real problem' },
  { id: 'position', number: '02', name: 'Position', agent: 'Positioner', icon: Target, title: 'Finding your sharpest angle.', caption: 'Finding your sharpest angle' },
  { id: 'persona', number: '03', name: 'Personality', agent: 'Brand Strategist', icon: Sparkles, title: 'Defining how it should feel.', caption: 'Defining how it should feel' },
  { id: 'naming', number: '04', name: 'Naming', agent: 'Naming Agent', icon: Type, title: 'Find a name with gravity.', caption: 'Names that earn their place' },
  { id: 'visualize', number: '05', name: 'Visualize', agent: 'Creative Director', icon: Palette, title: 'Giving the idea a shape.', caption: 'Giving the idea a shape' },
  { id: 'critique', number: '06', name: 'Brand Battle', agent: 'Critic Agent', icon: Swords, title: 'Challenge before the market does.', caption: 'Challenge before the market does' },
  { id: 'consistency', number: '07', name: 'Consistency', agent: 'Consistency Guardian', icon: Layers3, title: 'Checking the system holds.', caption: 'Checking the system holds' },
  { id: 'launch', number: '08', name: 'Launch', agent: 'Launch Agent', icon: Rocket, title: 'Opening the brand book.', caption: 'Opening the brand book' },
];

export default function ProjectStudioPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || 'demo-nexus-craft';

  const [project, setProject] = useState<any>(null);
  const [activeStageId, setActiveStageId] = useState<string>('naming');
  const [brandState, setBrandState] = useState<any>({
    discovery: {
      core_problem: 'Developers and founders waste critical velocity wrestling with disjointed AI wrapper scripts.',
      target_audience: 'Senior Full-Stack Engineers & Autonomous AI Founders.',
      user_context: 'Fast-paced production environments utilizing monorepos and type-safe systems.',
      goals: ['Establish technical authority', 'Accelerate brand launch', 'Achieve viral Github adoption'],
      assumptions: ['High demand for typed agent orchestration', 'Preference for dark obsidian editorial UX'],
      open_questions: ['What pricing tier structure fits devtool adoption?'],
    },
    positioning: {
      directions: [
        {
          name: 'Progressive Utility',
          positioning_statement: 'The premier autonomous AI brand intelligence studio engineered for high-velocity software creators.',
          core_problem: 'Fragmented AI wrappers produce generic, inconsistent brand output.',
          value_proposition: 'End-to-end 8-stage typed reasoning from napkin sketch to verified guidelines.',
          differentiator: 'Strict structured outputs & LangGraph execution with human decision gates.',
          competitive_angle: 'Zero black-box mystery.',
          proof_points: ['100% typed Pydantic state', 'Deterministic error recovery'],
        },
        {
          name: 'Developer Velocity Platform',
          positioning_statement: 'Accelerating product launch by 10x with intelligent agent orchestration.',
          core_problem: 'Repetitive boilerplate and indecision drain launch momentum.',
          value_proposition: 'High-speed automated brand synthesis with cross-stage consistency audit.',
          differentiator: 'Seamless local IDE and API integration.',
          competitive_angle: 'Engineered for serious builders.',
          proof_points: ['Instant CLI triggers', 'Multi-model fallback support'],
        },
      ],
    },
    personality: {
      archetype: 'Creator / Visionary',
      traits: ['Technical', 'Authoritative', 'Minimalist', 'Precision-Driven'],
      tone: ['Direct', 'Architectural', 'Refined', 'Confident'],
      emotional_goal: 'Empowered engineering clarity and trust',
      brand_principles: ['Code over fluff', 'Architectural transparency', 'Zero generic filler'],
      avoid_traits: ['Hype-heavy AI marketing', 'Childish graphics', 'Corporate bureaucracy'],
    },
    naming: {
      territories: ['Progressive Utility', 'Human Connection', 'Care & Craft'],
      suggestions: [
        {
          name: 'Morrow',
          territory: 'Progressive Utility',
          rationale: 'A warm, forward-looking name that signals a better tomorrow without feeling overly literal.',
          strengths: ['Memorable', 'Optimistic'],
          risks: ['Slightly soft for a pure devtool position'],
          domain_assessment: 'Available (.studio, .dev)',
          trademark_assessment: 'Clear in Class 42',
        },
        {
          name: 'NexusCraft',
          territory: 'Care & Craft',
          rationale: 'Combines network nexus point with precision engineering craftsmanship.',
          strengths: ['High memorability', 'Reflects structural intelligence'],
          risks: ['Nexus is used across broader SaaS categories'],
          domain_assessment: 'Medium Risk (.io active)',
          trademark_assessment: 'Clear in Class 42',
        },
        {
          name: 'BrandForge',
          territory: 'Progressive Utility',
          rationale: 'Evokes industrial-strength craftsmanship for brand intelligence systems.',
          strengths: ['Action-oriented', 'Strong visual metaphor'],
          risks: ['Forge requires strong visual grounding'],
          domain_assessment: 'Available (.ai, .so)',
          trademark_assessment: 'Clear in Class 42',
        },
      ],
    },
    visual_direction: {
      visual_mood: 'Neo-Editorial Dark Obsidian & High-Tech Precision',
      color_palette: [
        { hex: '#0a0a0c', name: 'Dark Obsidian', role: 'Canvas', usage: 'Primary app canvas' },
        { hex: '#7c5cff', name: 'Electric Indigo', role: 'Primary Accent', usage: 'CTAs, focus rings, and active states' },
        { hex: '#f5a524', name: 'Amber Signal', role: 'Review Accent', usage: 'Human decision review signals' },
        { hex: '#7ccb9a', name: 'Sage Verification', role: 'Pass Accent', usage: 'Verified consistency checks' },
      ],
      typography: {
        header_font: 'Editorial Serif (Georgia / Canela)',
        body_font: 'Inter Sans / Modern System UI',
      },
      composition: 'Clean bento grid alignment with generous dark whitespace.',
      shape_language: 'Precision rounded corners (14px) with subtle 1px translucent borders.',
      logo_direction: 'Diamond 45-degree spark mark with refined wordmark.',
    },
    critique: {
      overall_assessment: 'Strong positioning with high audience fit and distinctive naming territories.',
      genericity_score: 'Low (2/10)',
      audience_fit: 'High (9/10)',
      differentiation_rating: 'Strong',
      positioning_strength: 'Solid',
      personality_consistency: 'Consistent',
      visual_strategy_fit: 'High',
      critique_items: [
        {
          category: 'Naming Nuance',
          severity: 'Medium',
          finding: 'Morrow suffix may feel slightly soft for a developer infrastructure tool.',
          explanation: 'Ensure landing page copy grounds the name in high-velocity technical capabilities.',
        },
        {
          category: 'Differentiation Angle',
          severity: 'Low',
          finding: 'Target audience expects immediate technical benchmark validation.',
          explanation: 'Highlight LangGraph state orchestration and deterministic schema checks.',
        },
      ],
      key_weaknesses: ['Requires immediate developer benchmark data on landing page.'],
      recommended_revisions: ['Emphasize structured AI reasoning rather than automated generation.'],
    },
    consistency: {
      overall_consistency_score: 96,
      checks: [
        { relationship: 'Name ↔ Positioning', status: 'PASS', details: 'Selected name aligns with progressive utility positioning.' },
        { relationship: 'Name ↔ Personality', status: 'PASS', details: 'Matches Creator/Visionary archetype.' },
        { relationship: 'Tagline ↔ Personality', status: 'PASS', details: 'Direct, technical, and confident.' },
        { relationship: 'Visual ↔ Audience', status: 'PASS', details: 'Dark obsidian aesthetic tailored to serious creators.' },
        { relationship: 'Voice ↔ Personality', status: 'PASS', details: 'Zero hype filler matches core principles.' },
        { relationship: 'Launch Message ↔ Strategy', status: 'PASS', details: 'Reflects core product value prop.' },
      ],
    },
    launch: {
      tagline: 'From rough idea to launch-ready brand.',
      one_line_pitch: 'An AI brand intelligence studio for turning unstructured ideas into coherent, launch-ready brand systems.',
      landing_page_copy: {
        headline: 'From rough idea to launch-ready brand.',
        subheadline: 'Turn an unstructured idea into a coherent brand system through structured AI reasoning, human decisions, critique, and consistency.',
        cta: 'Start building',
      },
      social_posts: [
        { platform: 'Twitter / X', content: 'Say goodbye to one-prompt AI wrappers. Introducing BrandForge — 8 specialized AI agents working together to forge your brand identity. 🚀' },
        { platform: 'LinkedIn', content: 'We are thrilled to announce BrandForge: An AI Brand Intelligence Studio powered by structured LangGraph state and human decision gates.' },
      ],
    },
    selected_directions: {
      positioning_direction: 'Progressive Utility',
      chosen_name: 'Morrow',
    },
  });

  const [stageStatuses, setStageStatuses] = useState<Record<string, 'pending' | 'running' | 'review' | 'complete'>>({
    discover: 'complete',
    position: 'complete',
    persona: 'complete',
    naming: 'review',
    visualize: 'pending',
    critique: 'pending',
    consistency: 'pending',
    launch: 'pending',
  });

  const [revisionInfo, setRevisionInfo] = useState<{ targetStage: string; reason: string; isExecuting: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load project details
  useEffect(() => {
    async function loadProjectData() {
      try {
        const proj = await api.getProject(projectId);
        setProject(proj);
      } catch (err) {
        console.warn('Backend API connection notice, using studio state:', err);
        setProject({
          id: projectId,
          name: 'Morrow',
          description: 'Home care, made human. An app where customers can book verified home-cleaning professionals.',
        });
      }
    }
    loadProjectData();
  }, [projectId]);

  // Connect SSE Stream if backend is running
  useEffect(() => {
    if (!projectId) return;

    let eventSource: EventSource | null = null;
    try {
      const baseUrl = api.getBaseUrl();
      const streamUrl = `${baseUrl}/api/projects/${projectId}/workflow/stream`;
      eventSource = new EventSource(streamUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSSEEvent(data);
        } catch (e) {
          console.error('Error parsing SSE event data:', e);
        }
      };

      eventSource.onerror = () => {
        // SSE silently reconnects or fails gracefully
      };
    } catch (e) {
      console.warn('SSE initialization notice:', e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [projectId]);

  const handleSSEEvent = (data: any) => {
    const { event, stage, state, target_stage, feedback } = data;

    if (state) {
      setBrandState((prev: any) => ({ ...prev, ...state }));
    }

    if (event === 'stage_started' && stage) {
      setStageStatuses((prev) => ({ ...prev, [stage]: 'running' }));
      setActiveStageId(stage);
    } else if (event === 'stage_completed' && stage) {
      setStageStatuses((prev) => ({ ...prev, [stage]: 'complete' }));
    } else if (event === 'revision_started') {
      setRevisionInfo({
        targetStage: target_stage || 'position',
        reason: feedback || 'Targeted refinement requested.',
        isExecuting: true,
      });
      if (target_stage) {
        setStageStatuses((prev) => ({ ...prev, [target_stage]: 'review' }));
        setActiveStageId(target_stage);
      }
    } else if (event === 'revision_completed') {
      setRevisionInfo((prev) => (prev ? { ...prev, isExecuting: false } : null));
    } else if (event === 'workflow_completed') {
      setStageStatuses((prev) => ({ ...prev, launch: 'complete' }));
      setActiveStageId('launch');
    }
  };

  // Human Acceptance Action
  const handleAcceptStage = async (nextStageId: string) => {
    setIsLoading(true);
    setStageStatuses((prev) => ({ ...prev, [activeStageId]: 'complete', [nextStageId]: 'review' }));
    setActiveStageId(nextStageId);

    try {
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
    setStageStatuses((prev) => ({ ...prev, [targetStage]: 'review' }));
    setActiveStageId(targetStage);

    try {
      await api.requestRevision(projectId, { target_stage: targetStage, feedback });
    } catch (e) {
      console.warn('Revision trigger notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Selections
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
      alert('Export trigger submitted. Check backend artifacts.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStageIndex = STAGES.findIndex((s) => s.id === activeStageId);
  const activeStage = STAGES[currentStageIndex] || STAGES[3];
  const completedCount = Object.values(stageStatuses).filter((s) => s === 'complete').length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  const selectedName =
    brandState.selected_directions?.chosen_name ||
    project?.name ||
    'Morrow';

  return (
    <div className="studio-shell">
      {/* Studio Header */}
      <header className="studio-header">
        <div className="studio-brand">
          <Link href="/" className="logo">
            <div className="brand-mark">
              <span />
            </div>
          </Link>
          <span className="header-divider" />
          <Link href="/dashboard" className="project-switcher" style={{ textDecoration: 'none' }}>
            {selectedName} <ChevronRight size={14} />
          </Link>
        </div>

        <div className="studio-header-actions">
          <span className="live-status">
            <span /> Saved to studio
          </span>
          <button
            className="header-action"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Studio URL copied to clipboard.');
              }
            }}
          >
            <Share2 size={13} style={{ marginRight: '4px' }} /> Share
          </button>
          <button className="header-action" onClick={handleExportPDF} disabled={isLoading}>
            <Download size={14} /> Export
          </button>
          <div className="top-avatar">BF</div>
        </div>
      </header>

      {/* 3-Column Studio Layout */}
      <div className="studio-layout">
        {/* Left Column: Visual Workflow Pipeline */}
        <aside className="workflow-side">
          <div className="workflow-side-header">
            <span>BRAND WORLD / 01</span>
            <MoreHorizontal size={16} />
          </div>

          <h3>{selectedName}</h3>
          <p>{project?.description ? project.description.slice(0, 40) + '...' : 'Home care, made human.'}</p>

          <div className="run-progress">
            <div>
              <span>{progressPercent}% complete</span>
              <span>0{completedCount} / 08</span>
            </div>
            <div className="progress-line">
              <span style={{ width: `${Math.max(progressPercent, 12)}%` }} />
            </div>
          </div>

          {/* 8-Stage Interactive List */}
          <div className="stage-list">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const status = stageStatuses[stage.id] || 'pending';
              const isSelected = activeStageId === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`stage-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className={`stage-number ${status}`}>
                    {status === 'running' ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Icon size={14} />
                    )}
                  </div>
                  <div>
                    <b>
                      {stage.number} <span>{stage.name}</span>
                    </b>
                    <small>
                      {status === 'complete'
                        ? 'Completed'
                        : status === 'review'
                        ? 'Needs your review'
                        : status === 'running'
                        ? 'Agent executing...'
                        : 'Waiting'}
                    </small>
                  </div>
                  {status === 'complete' ? (
                    <CircleCheck className="stage-check" size={14} />
                  ) : status === 'review' ? (
                    <span className="review-dot" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="workflow-footer">
            <div className="agent-badge">
              <Sparkles size={15} />
              <span>
                <b>BrandForge agents</b>
                <small>Working as a system</small>
              </span>
              <span className="green-text">●</span>
            </div>
          </div>
        </aside>

        {/* Center Column: Studio Main Workspace */}
        <main className="studio-main">
          {/* Stage Top Navigation Bar */}
          <div className="stage-top">
            <div>
              <div className="eyebrow small-eyebrow">
                {activeStage.number} / {activeStage.name.toUpperCase()}
              </div>
              <h1>{activeStage.title}</h1>
              <p>{activeStage.caption}</p>
            </div>

            <div className="stage-nav">
              <button
                disabled={currentStageIndex === 0}
                onClick={() => setActiveStageId(STAGES[currentStageIndex - 1].id)}
              >
                ← Previous
              </button>
              <span>
                {activeStage.number} <i>/</i> 08
              </span>
              <button
                disabled={currentStageIndex === STAGES.length - 1}
                onClick={() => setActiveStageId(STAGES[currentStageIndex + 1].id)}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Decision Synthesis Banner */}
          <div className="decision-banner">
            <div className="banner-icon">
              <WandSparkles size={16} />
            </div>
            <div>
              <b>{activeStage.agent.toUpperCase()} / SYNTHESIS COMPLETE</b>
              <span>
                Structured AI reasoning verified. Your human judgment is the next required input.
              </span>
            </div>
            <time>just now</time>
          </div>

          {/* Revision Banner if Active */}
          {revisionInfo?.isExecuting && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(124, 92, 255, 0.1)',
                border: '1px solid rgba(124, 92, 255, 0.3)',
                borderRadius: '10px',
                marginBottom: '24px',
                color: '#b4a5ff',
                font: '11px monospace',
              }}
            >
              <RefreshCw size={14} className="animate-spin" />
              <span>RERUN IN PROGRESS: {revisionInfo.reason}</span>
            </div>
          )}

          {/* Active Stage Content Rendering */}
          {activeStageId === 'discover' && (
            <DiscoveryView
              discoveryData={brandState.discovery}
              onAccept={() => handleAcceptStage('position')}
              onRequestRevision={(fb) => handleRequestRevision('discover', fb)}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'position' && (
            <PositioningView
              positioningData={brandState.positioning}
              selectedDirection={brandState.selected_directions?.positioning_direction}
              onSelectDirection={handleSelectDirection}
              onAccept={() => handleAcceptStage('persona')}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'persona' && (
            <PersonalityView
              personalityData={brandState.personality}
              onAccept={() => handleAcceptStage('naming')}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'naming' && (
            <NamingView
              namingData={brandState.naming}
              selectedName={brandState.selected_directions?.chosen_name}
              onSelectName={handleSelectName}
              onAccept={() => handleAcceptStage('visualize')}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'visualize' && (
            <VisualIdentityView
              visualData={brandState.visual_direction}
              brandName={selectedName}
              onAccept={() => handleAcceptStage('critique')}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'critique' && (
            <BrandBattleView
              critiqueData={brandState.critique}
              onAccept={() => handleAcceptStage('consistency')}
              onRequestRevision={(fb) => handleRequestRevision('position', fb)}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'consistency' && (
            <ConsistencyView
              consistencyData={brandState.consistency}
              onAccept={() => handleAcceptStage('launch')}
              onRequestRevision={(fb) => handleRequestRevision('naming', fb)}
              isLoading={isLoading}
            />
          )}

          {activeStageId === 'launch' && (
            <LaunchBrandKitView
              launchData={brandState.launch}
              brandState={brandState}
              onExportPDF={handleExportPDF}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Right Column: AI Context Panel */}
        <aside className="context-side">
          <div className="context-head">
            <span>AI CONTEXT</span>
            <MoreHorizontal size={16} />
          </div>

          <div className="context-agent">
            <div className="agent-avatar">
              <Sparkles size={16} />
            </div>
            <div>
              <span>CURRENT AGENT</span>
              <b>{activeStage.agent}</b>
              <small>{activeStage.caption}</small>
            </div>
          </div>

          <div className="context-section">
            <span>WHAT IT KNOWS</span>
            <p>
              {brandState.discovery?.core_problem ||
                'Audience values warmth, trust, and dependable service without category clichés.'}
            </p>
          </div>

          <div className="context-section">
            <span>WHAT IT GENERATED</span>
            <div className="context-tags">
              {activeStageId === 'naming' && (
                <>
                  <b>3 territories</b>
                  <b>9 candidates</b>
                </>
              )}
              {activeStageId === 'position' && (
                <>
                  <b>2 directions</b>
                  <b>Value propositions</b>
                </>
              )}
              {activeStageId === 'persona' && (
                <>
                  <b>{brandState.personality?.archetype || 'Archetype'}</b>
                  <b>4 voice traits</b>
                </>
              )}
              {activeStageId === 'visualize' && (
                <>
                  <b>4 swatches</b>
                  <b>2 fonts</b>
                </>
              )}
              {activeStageId === 'critique' && (
                <>
                  <b>Genericity 2/10</b>
                  <b>Audience 9/10</b>
                </>
              )}
              {activeStageId === 'consistency' && (
                <>
                  <b>96% score</b>
                  <b>6 checks PASS</b>
                </>
              )}
              {activeStageId === 'launch' && (
                <>
                  <b>Complete Kit</b>
                  <b>PDF Ready</b>
                </>
              )}
              {activeStageId === 'discover' && (
                <>
                  <b>Audience Matrix</b>
                  <b>Goals</b>
                </>
              )}
            </div>
          </div>

          <div className="context-section">
            <span>USER DECISIONS</span>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#c0b7dd', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>
                <span style={{ color: 'var(--subtle)', font: '8px monospace' }}>POSITION: </span>
                <b>{brandState.selected_directions?.positioning_direction || 'Pending'}</b>
              </div>
              <div>
                <span style={{ color: 'var(--subtle)', font: '8px monospace' }}>NAME: </span>
                <b style={{ color: '#fff' }}>{brandState.selected_directions?.chosen_name || 'Pending'}</b>
              </div>
            </div>
          </div>

          <div className="revision-card">
            <CircleAlert size={15} />
            <div>
              <b>Revision status</b>
              <span>
                {revisionInfo?.isExecuting
                  ? 'Executing targeted rerun...'
                  : 'Waiting for your signal'}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
