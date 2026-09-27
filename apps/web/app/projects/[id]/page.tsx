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
  Play,
} from 'lucide-react';

import { DiscoveryView } from '../../../components/stage-views/DiscoveryView';
import { PositioningView } from '../../../components/stage-views/PositioningView';
import { PersonalityView } from '../../../components/stage-views/PersonalityView';
import { NamingView } from '../../../components/stage-views/NamingView';
import { VisualIdentityView } from '../../../components/stage-views/VisualIdentityView';
import { BrandBattleView } from '../../../components/stage-views/BrandBattleView';
import { ConsistencyView } from '../../../components/stage-views/ConsistencyView';
import { LaunchBrandKitView } from '../../../components/stage-views/LaunchBrandKitView';
import { BrandChatDrawer } from '../../../components/studio/BrandChatDrawer';
import { StudioErrorBoundary } from '../../../components/StudioErrorBoundary';
import { api } from '../../../lib/api';
import { ProtectedRoute } from '../../../lib/auth-guard';

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
  const projectId = (params?.id as string) || '';

  const [project, setProject] = useState<any>(null);
  const [activeStageId, setActiveStageId] = useState<string>('discover');
  const [brandState, setBrandState] = useState<any>({});

  const [stageStatuses, setStageStatuses] = useState<Record<string, 'pending' | 'running' | 'review' | 'complete'>>({
    discover: 'pending',
    position: 'pending',
    persona: 'pending',
    naming: 'pending',
    visualize: 'pending',
    critique: 'pending',
    consistency: 'pending',
    launch: 'pending',
  });

  const [isStartingPipeline, setIsStartingPipeline] = useState<boolean>(false);
  const [revisionInfo, setRevisionInfo] = useState<{ targetStage: string; reason: string; isExecuting: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Human-in-the-loop save state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavePayload, setLastSavePayload] = useState<any>(null);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Export status toast state
  const [exportNotice, setExportNotice] = useState<{ type: 'loading' | 'success' | 'error'; message: string } | null>(null);

  // Load real project details & existing brand kit artifacts
  useEffect(() => {
    async function loadProjectData() {
      if (!projectId) return;
      try {
        const proj = await api.getProject(projectId);
        setProject(proj);

        try {
          const kit = await api.getBrandKit(projectId);
          if (kit && kit.artifacts && Object.keys(kit.artifacts).length > 0) {
            const arts = kit.artifacts;
            setBrandState({
              ...arts,
              visual_direction: arts.visual || arts.visual_direction,
              selected_directions: {
                chosen_name: kit.brand_name || arts.launch?.brand_name || '',
                positioning_direction: arts.positioning?.directions?.[0]?.name || '',
              },
            });
            const updatedStatuses: Record<string, 'pending' | 'running' | 'review' | 'complete'> = {
              discover: arts.discovery ? 'complete' : 'pending',
              position: arts.positioning ? 'complete' : 'pending',
              persona: arts.personality ? 'complete' : 'pending',
              naming: arts.naming ? 'complete' : 'pending',
              visualize: arts.visual || arts.visual_direction ? 'complete' : 'pending',
              critique: arts.critique ? 'complete' : 'pending',
              consistency: arts.consistency ? 'complete' : 'pending',
              launch: arts.launch ? 'complete' : 'pending',
            };
            setStageStatuses(updatedStatuses);
            if (arts.launch) {
              setActiveStageId('launch');
            } else {
              const nextStage = STAGES.find((s) => updatedStatuses[s.id] !== 'complete');
              if (nextStage) setActiveStageId(nextStage.id);
            }
          }
        } catch (kitErr) {
          console.warn('No brand kit artifacts available yet for project:', kitErr);
        }
      } catch (err) {
        console.error('Failed to load project details:', err);
      }
    }
    loadProjectData();
  }, [projectId]);

  // Authenticated real-time polling for stage progress & brand kit artifacts
  useEffect(() => {
    if (!projectId) return;

    let isSubscribed = true;
    let pollInterval: NodeJS.Timeout | null = null;

    async function pollWorkflowStatus() {
      try {
        const kit = await api.getBrandKit(projectId);
        if (!isSubscribed) return;

        if (kit && kit.artifacts) {
          const arts = kit.artifacts;
          setBrandState((prev: any) => ({
            ...prev,
            ...arts,
            visual_direction: arts.visual || arts.visual_direction,
            selected_directions: {
              chosen_name: kit.brand_name || arts.launch?.brand_name || prev?.selected_directions?.chosen_name || '',
              positioning_direction: prev?.selected_directions?.positioning_direction || '',
            },
          }));

          const updatedStatuses: Record<string, 'pending' | 'running' | 'review' | 'complete'> = {
            discover: arts.discovery ? 'complete' : 'pending',
            position: arts.positioning ? 'complete' : 'pending',
            persona: arts.personality ? 'complete' : 'pending',
            naming: arts.naming ? 'complete' : 'pending',
            visualize: arts.visual || arts.visual_direction ? 'complete' : 'pending',
            critique: arts.critique ? 'complete' : 'pending',
            consistency: arts.consistency ? 'complete' : 'pending',
            launch: arts.launch ? 'complete' : 'pending',
          };

          // Mark currently executing stage as 'running' based on progress
          const stageSequence = ['discover', 'position', 'persona', 'naming', 'visualize', 'critique', 'consistency', 'launch'];
          const firstIncompleteIdx = stageSequence.findIndex((s) => updatedStatuses[s] !== 'complete');
          if (firstIncompleteIdx !== -1 && kit.status !== 'completed') {
            updatedStatuses[stageSequence[firstIncompleteIdx]] = 'running';
          }

          setStageStatuses(updatedStatuses);

          // If all stages are completed, stop polling
          if (firstIncompleteIdx === -1) {
            if (pollInterval) clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.warn('Authenticated polling status notice:', err);
      }
    }

    // Run immediately, then poll every 2.0s
    pollWorkflowStatus();
    pollInterval = setInterval(pollWorkflowStatus, 2000);

    return () => {
      isSubscribed = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [projectId]);

  const executeSaveSelection = async (selection: { direction_type: string; selected_value: any }) => {
    setSaveStatus('saving');
    setSaveError(null);
    setLastSavePayload(selection);

    try {
      await api.saveSelection(projectId, selection);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 3000);
    } catch (err: any) {
      console.error('Failed to persist selection:', err);
      setSaveStatus('error');
      setSaveError(err?.message || 'Save failed');
    }
  };

  const retryLastSave = () => {
    if (lastSavePayload) {
      executeSaveSelection(lastSavePayload);
    }
  };

  // Human Acceptance Action
  const handleAcceptStage = async (nextStageId: string) => {
    setIsLoading(true);
    setStageStatuses((prev) => ({ ...prev, [activeStageId]: 'complete', [nextStageId]: 'review' }));
    setActiveStageId(nextStageId);

    try {
      await executeSaveSelection({
        direction_type: activeStageId,
        selected_value: brandState.selected_directions || {},
      });
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
      const kit = await api.getBrandKit(projectId);
      if (kit && kit.artifacts) {
        const arts = kit.artifacts;
        setBrandState((prev: any) => ({
          ...prev,
          ...arts,
          visual_direction: arts.visual || arts.visual_direction,
        }));
      }
    } catch (e: any) {
      alert(`Revision notice: ${e?.message || 'Could not queue revision'}`);
    } finally {
      setIsLoading(false);
      setRevisionInfo(null);
    }
  };

  // Pipeline Execution Action
  const handleStartPipeline = async () => {
    try {
      setIsStartingPipeline(true);
      setStageStatuses({
        discover: 'running',
        position: 'pending',
        persona: 'pending',
        naming: 'pending',
        visualize: 'pending',
        critique: 'pending',
        consistency: 'pending',
        launch: 'pending',
      });
      setActiveStageId('discover');

      await api.startWorkflow(projectId);

      const kit = await api.getBrandKit(projectId);
      if (kit && kit.artifacts) {
        const arts = kit.artifacts;
        setBrandState({
          ...arts,
          visual_direction: arts.visual || arts.visual_direction,
          selected_directions: {
            chosen_name: kit.brand_name || arts.launch?.brand_name || '',
            positioning_direction: arts.positioning?.directions?.[0]?.name || '',
          },
        });
        setStageStatuses({
          discover: 'complete',
          position: 'complete',
          persona: 'complete',
          naming: 'complete',
          visualize: 'complete',
          critique: 'complete',
          consistency: 'complete',
          launch: 'complete',
        });
        setActiveStageId('launch');
      }
    } catch (err: any) {
      alert(`Workflow execution notice: ${err?.message || 'Workflow process encountered an issue'}`);
    } finally {
      setIsStartingPipeline(false);
    }
  };

  // Direct Selections
  const handleSelectDirection = async (directionName: string) => {
    const updatedDirections = {
      ...brandState.selected_directions,
      positioning_direction: directionName,
    };
    setBrandState((prev: any) => ({
      ...prev,
      selected_directions: updatedDirections,
    }));
    await executeSaveSelection({
      direction_type: 'positioning_direction',
      selected_value: updatedDirections,
    });
  };

  const handleSelectName = async (name: string) => {
    const updatedDirections = {
      ...brandState.selected_directions,
      chosen_name: name,
    };
    setBrandState((prev: any) => ({
      ...prev,
      selected_directions: updatedDirections,
    }));
    await executeSaveSelection({
      direction_type: 'chosen_name',
      selected_value: updatedDirections,
    });
  };

  // Real Brand Kit PDF Export Trigger
  const handleExportPDF = async () => {
    try {
      setIsLoading(true);
      setExportNotice({ type: 'loading', message: 'Generating ReportLab Brand Kit PDF...' });

      // Request real PDF generation
      const res = await api.exportBrandKit(projectId, 'pdf');

      if (res?.download_url) {
        const cleanName = (selectedName || 'BrandForge').replace(/[^a-zA-Z0-9_-]/g, '_');
        await api.downloadExportFile(res.download_url, `${cleanName}-Brand-Kit.pdf`);
        setExportNotice({ type: 'success', message: 'Brand Kit PDF downloaded successfully!' });
      } else {
        setExportNotice({ type: 'success', message: 'Brand Kit export generated successfully!' });
      }
      setTimeout(() => setExportNotice(null), 4000);
    } catch (e: any) {
      setExportNotice({ type: 'error', message: `Export failed: ${e?.message || 'Unable to generate PDF'}` });
      setTimeout(() => setExportNotice(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Real Brand Kit Share Trigger
  const handleOpenShare = async () => {
    setShowShareModal(true);
    setShareCopied(false);
    setIsGeneratingShare(true);

    try {
      const res = await api.createShareLink(projectId);
      if (res?.share_token) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(`${origin}/share/${res.share_token}`);
      }
    } catch (err: any) {
      console.error('Failed to create share link:', err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleCopyShareUrl = () => {
    if (shareUrl && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const currentStageIndex = STAGES.findIndex((s) => s.id === activeStageId);
  const activeStage = STAGES[currentStageIndex] || STAGES[0];
  const completedCount = Object.values(stageStatuses).filter((s) => s === 'complete').length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  const selectedName =
    brandState.selected_directions?.chosen_name ||
    brandState.launch?.brand_name ||
    project?.name ||
    'New Brand';

  return (
    <ProtectedRoute>
      <>
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
          {/* Visible Save Status Feedback */}
          {saveStatus === 'saving' && (
            <span className="live-status" style={{ color: 'var(--accent)' }}>
              <RefreshCw size={11} className="animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="live-status" style={{ color: 'var(--sage)' }}>
              <CircleCheck size={12} /> Saved ✓
            </span>
          )}
          {saveStatus === 'error' && (
            <button
              onClick={retryLastSave}
              className="live-status"
              style={{ color: '#ff857a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title={saveError || 'Save failed'}
            >
              <CircleAlert size={12} /> Save failed — Retry
            </button>
          )}
          {saveStatus === 'idle' && (
            <span className="live-status">
              <span /> Studio synced
            </span>
          )}

          <button className="header-action" onClick={handleOpenShare}>
            <Share2 size={13} style={{ marginRight: '4px' }} /> Share
          </button>
          <button className="header-action" onClick={handleExportPDF} disabled={isLoading}>
            <Download size={14} /> Export PDF
          </button>
          <div className="top-avatar">BF</div>
        </div>
      </header>

      {/* Export Notice Toast */}
      {exportNotice && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            background: exportNotice.type === 'error' ? 'rgba(40, 15, 15, 0.95)' : '#15161d',
            border: `1px solid ${exportNotice.type === 'error' ? 'rgba(255, 107, 94, 0.4)' : exportNotice.type === 'success' ? 'rgba(92, 225, 160, 0.4)' : 'var(--border-strong)'}`,
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            fontSize: '12px',
            color: exportNotice.type === 'error' ? '#ff857a' : exportNotice.type === 'success' ? '#82f7c0' : '#fff',
          }}
        >
          {exportNotice.type === 'loading' && <RefreshCw size={14} className="animate-spin" />}
          {exportNotice.type === 'success' && <CircleCheck size={14} />}
          {exportNotice.type === 'error' && <CircleAlert size={14} />}
          <span>{exportNotice.message}</span>
        </div>
      )}

      {/* Public Share Modal */}
      {showShareModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#15161d',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color="var(--accent)" />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: 0, fontWeight: 500 }}>
                  Share Brand Kit
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Create a public, read-only link to share this brand identity specification with stakeholders, clients, or investors. No login required.
            </p>

            {isGeneratingShare ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--subtle)' }}>
                <RefreshCw size={18} className="animate-spin" style={{ margin: '0 auto 8px', color: 'var(--accent)' }} />
                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>GENERATING PUBLIC TOKEN...</span>
              </div>
            ) : shareUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleCopyShareUrl}
                    className="button button-primary"
                    style={{ flex: 1, fontSize: '12px', justifyContent: 'center' }}
                  >
                    {shareCopied ? 'Copied to Clipboard ✓' : 'Copy Share Link'}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-outline"
                    style={{ fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    Open View ↗
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ color: '#ff857a', fontSize: '12px' }}>
                Failed to generate public share token. Please ensure the project exists.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Column Studio Layout */}
      <div className="studio-layout">
        {/* Left Column: Visual Workflow Pipeline */}
        <aside className="workflow-side">
          <div className="workflow-side-header">
            <span>BRAND WORLD / 01</span>
            <MoreHorizontal size={16} />
          </div>

          <h3>{selectedName}</h3>
          <p>{project?.idea || project?.description ? (project?.idea || project?.description).slice(0, 45) + '...' : 'AI Brand Studio'}</p>

          <div className="run-progress">
            <div>
              <span>{progressPercent}% complete</span>
              <span>0{completedCount} / 08</span>
            </div>
            <div className="progress-line">
              <span style={{ width: `${Math.max(progressPercent, 12)}%` }} />
            </div>
          </div>

          <button
            onClick={handleStartPipeline}
            disabled={isStartingPipeline}
            className="start-pipeline-btn"
            style={{
              width: '100%',
              padding: '10px 14px',
              marginTop: '12px',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #7c5cff 0%, #a855f7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isStartingPipeline ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(124, 92, 255, 0.35)',
              opacity: isStartingPipeline ? 0.7 : 1,
            }}
          >
            {isStartingPipeline ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Agents Orchestrating...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>{completedCount > 0 ? 'Rerun 8-Agent Pipeline' : 'Run 8-Agent Pipeline'}</span>
              </>
            )}
          </button>

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

          {/* Active Stage Content Rendering with Studio Error Boundary */}
          <StudioErrorBoundary
            key={activeStageId}
            stageName={activeStage.name}
            onRetry={() => {
              // Reload project artifacts
              api.getBrandKit(projectId).then((kit) => {
                if (kit && kit.artifacts) {
                  setBrandState((prev: any) => ({
                    ...prev,
                    ...kit.artifacts,
                    visual_direction: kit.artifacts.visual || kit.artifacts.visual_direction,
                  }));
                }
              }).catch(() => {});
            }}
            onPreviousStage={
              currentStageIndex > 0
                ? () => setActiveStageId(STAGES[currentStageIndex - 1].id)
                : undefined
            }
          >
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
          </StudioErrorBoundary>
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

    {/* Brand Intelligence Studio Assistant Drawer */}
      <BrandChatDrawer
        projectId={projectId}
        projectName={selectedName}
        onBrandStateUpdated={(updatedState) => {
          setBrandState((prev: any) => ({ ...prev, ...updatedState }));
        }}
      />
      </>
    </ProtectedRoute>
  );
}
