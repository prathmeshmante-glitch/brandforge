'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  FileText,
  WandSparkles,
  Palette,
  Settings2,
  ChevronRight,
  Search,
  Bell,
  ArrowRight,
  LayoutDashboard,
  Type,
  FolderPlus,
  LogOut,
  AlertCircle,
  RefreshCw,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { ProtectedRoute } from '../../lib/auth-guard';

function Logo() {
  return (
    <Link href="/" className="logo">
      <div className="brand-mark">
        <span />
      </div>
      <span>BRANDFORGE</span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await api.listProjects();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      console.error('Failed to load projects from BrandForge API:', err);
      setApiError(err?.message || 'Unable to connect to the BrandForge API studio service.');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDeleteProject = async (projectId: string) => {
    setIsDeleting(true);
    try {
      await api.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setDeletingProjectId(null);
    } catch (err: any) {
      alert(`Could not delete project: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProject = filteredProjects[0] || projects[0];

  return (
    <ProtectedRoute>
      <div className="app-shell">
        {/* Neo-Editorial Studio Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <Logo />
          </div>

          <div className="workspace-switch">
            <div className="workspace-avatar">BF</div>
            <div>
              <b>Studio Workspace</b>
              <span>AI Brand Intelligence</span>
            </div>
            <ChevronRight size={14} />
          </div>

          <div className="side-label">Workspace</div>
          <div className="side-links">
            {[
              ['Overview', LayoutDashboard],
              ['Projects', FileText],
              ['Brand runs', WandSparkles],
              ['Brand kits', Palette],
            ].map(([label, Icon]: any) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={activeTab === label ? 'active' : ''}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="side-label settings-label">Manage</div>
          <div className="side-links">
            <Link
              href="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                color: 'var(--muted)',
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Settings2 size={16} />
              Settings
            </Link>
          </div>

          <div className="sidebar-bottom">
            <div className="upgrade-card">
              <div className="upgrade-icon">
                <Sparkles size={15} />
              </div>
              <b>Build without limits</b>
              <p>8-agent AI workflow with structured state reasoning.</p>
              <Link
                href="/projects/new"
                style={{
                  color: '#b7a5ff',
                  fontSize: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Create brand <ArrowRight size={13} />
              </Link>
            </div>

            <div className="profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, flex: 1 }}>
                <div className="profile-avatar">
                  {(profile?.name || user?.user_metadata?.full_name || user?.email || 'BF').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <b style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {profile?.name || user?.user_metadata?.full_name || 'Studio Member'}
                  </b>
                  <span style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {profile?.email || user?.email || 'studio@brandforge.ai'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                title="Sign out of studio"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--subtle)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Studio Dashboard */}
        <main className="app-main">
          {/* Top Header Bar */}
          <div className="dash-top">
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <b>Brand worlds</b>
            </div>

            <div className="top-actions" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--subtle)' }} />
                <input
                  type="text"
                  placeholder="Search brand worlds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    padding: '6px 12px 6px 32px',
                    fontSize: '11px',
                    color: 'var(--text)',
                    outline: 'none',
                    width: '200px',
                  }}
                />
              </div>
              <button
                className="icon-button"
                aria-label="Notifications"
                onClick={() => setShowNotifications((prev) => !prev)}
                style={{ position: 'relative' }}
              >
                <Bell size={16} />
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: '40px',
                    width: '300px',
                    background: '#15161d',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                    zIndex: 50,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em' }}>
                      STUDIO NOTIFICATIONS
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={15} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>
                          Workflow Engine Active
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          8-agent AI graph connected with single-execution guarantees.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={15} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>
                          ReportLab PDF Generator Ready
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          Export real multi-page brand guidelines with vector covers.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="top-avatar">
                {(profile?.name || user?.user_metadata?.full_name || 'BF').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Dashboard Bento Content */}
          <div className="dashboard-content">
            <div className="welcome-row">
              <div>
                <div className="eyebrow small-eyebrow">YOUR BRAND WORLDS / 2026</div>
                <h2>
                  Ideas become <em>identities.</em>
                </h2>
                <p>A considered space for the brands you&apos;re making next.</p>
              </div>
              <Link href="/projects/new" className="button button-primary">
                <Plus size={16} /> New brand
              </Link>
            </div>

            {/* Error State with Retry Button */}
            {apiError ? (
              <div
                style={{
                  background: 'rgba(255, 107, 94, 0.08)',
                  border: '1px solid rgba(255, 107, 94, 0.3)',
                  borderRadius: '16px',
                  padding: '36px 24px',
                  textAlign: 'center',
                  maxWidth: '560px',
                  margin: '40px auto',
                }}
              >
                <AlertCircle size={36} style={{ color: '#ff857a', margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px', color: '#ffb3ac' }}>
                  Unable to Load Studio Projects
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 20px', lineHeight: 1.5 }}>
                  {apiError}
                </p>
                <button onClick={loadProjects} className="button button-primary" style={{ margin: '0 auto' }}>
                  <RefreshCw size={14} /> Retry Connection
                </button>
              </div>
            ) : isLoading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--subtle)' }}>
                <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
                <p style={{ font: '11px monospace' }}>INITIALIZING STUDIO WORLDS...</p>
              </div>
            ) : projects.length === 0 ? (
              /* True Empty State */
              <div
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: '1px dashed var(--border)',
                  borderRadius: '18px',
                  padding: '60px 20px',
                  textAlign: 'center',
                  maxWidth: '600px',
                  margin: '40px auto',
                }}
              >
                <FolderPlus size={36} style={{ color: 'var(--indigo)', margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: '0 0 8px' }}>
                  No brand worlds yet
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  Start with a rough concept to trigger the 8-stage AI BrandForge studio pipeline.
                </p>
                <Link href="/projects/new" className="button button-primary">
                  <Plus size={16} /> Start first brand world
                </Link>
              </div>
            ) : (
              <>
                {/* Bento Grid */}
                <section className="dashboard-bento">
                  {/* Feature Card: Active World */}
                  {featuredProject && (
                    <article className="world-card world-feature">
                      <div className="card-kicker">
                        <span>PROJECT / IN PROGRESS</span>
                        <span className="status-dot" /> {(featuredProject.current_stage || 'DISCOVER').toUpperCase()}
                      </div>
                      <div className="world-cover">
                        <div className="cover-word">{featuredProject.name || 'Brand Project'}</div>
                        <div className="cover-sub">
                          {featuredProject.description ? featuredProject.description.slice(0, 60) + '...' : 'Intelligent brand system.'}
                        </div>
                        <span className="cover-index">01</span>
                      </div>
                      <div className="world-card-footer">
                        <div>
                          <span>Current stage</span>
                          <b>{featuredProject.current_stage || 'Discovery'}</b>
                        </div>
                        <div>
                          <span>Updated</span>
                          <b>{new Date(featuredProject.updated_at || Date.now()).toLocaleDateString()}</b>
                        </div>
                        <Link href={`/projects/${featuredProject.id}`} className="button button-primary">
                          Open studio <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  )}

                  {/* Signal Card 1: AI Pipeline Status */}
                  <article className="signal-card signal-indigo">
                    <span className="card-kicker">AI STATUS</span>
                    <Sparkles size={22} />
                    <h3>
                      Consistency review
                      <br />
                      <em>ready when you are.</em>
                    </h3>
                    <span className="card-arrow">↗</span>
                  </article>

                  {/* Signal Card 2: Strategic Progress */}
                  <article className="signal-card signal-amber">
                    <span className="card-kicker">WORKFLOW ENGINE</span>
                    <div className="activity-icon">
                      <Type size={18} />
                    </div>
                    <h3>
                      8 AI Agents
                      <br />
                      <em>synchronized.</em>
                    </h3>
                    <p>Shared typed state & human gates</p>
                  </article>

                  {/* Recent Brand Worlds List */}
                  <article className="world-list">
                    <div className="card-kicker">
                      RECENT BRAND WORLDS <span>TOTAL {projects.length}</span>
                    </div>
                    {filteredProjects.slice(0, 4).map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="kit-row"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Link
                          href={`/projects/${p.id}`}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div className={`kit-swatch ${idx % 2 === 0 ? 'swatch-one' : 'swatch-two'}`} />
                          <div style={{ minWidth: 0 }}>
                            <b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.name || 'Untitled Brand'}
                            </b>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                              Stage: {p.current_stage || 'discover'} • {new Date(p.updated_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                        <Link href={`/projects/${p.id}`} style={{ color: 'var(--subtle)', padding: '6px' }}>
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    ))}
                  </article>
                </section>

                {/* All Projects Section */}
                <div style={{ marginTop: '48px' }}>
                  <div className="eyebrow small-eyebrow" style={{ marginBottom: '16px' }}>
                    ALL BRAND PROJECTS ({projects.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                          border: '1px solid var(--border)',
                          borderRadius: '14px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ font: '9px monospace', color: 'var(--subtle)' }}>
                              STAGE: {p.current_stage || 'discover'}
                            </span>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)' }} />
                          </div>
                          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 6px', color: '#fff' }}>
                            {p.name || 'Untitled Brand'}
                          </h4>
                          <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 16px' }}>
                            {p.description ? p.description.slice(0, 80) + '...' : 'No description provided.'}
                          </p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid var(--border)',
                            paddingTop: '12px',
                          }}
                        >
                          <button
                            onClick={() => setDeletingProjectId(p.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--subtle)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Delete brand project"
                          >
                            <Trash2 size={13} />
                          </button>
                          <Link
                            href={`/projects/${p.id}`}
                            className="button button-outline"
                            style={{ fontSize: '9px', padding: '0 12px', minHeight: '30px' }}
                          >
                            Open studio <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deletingProjectId && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.7)',
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
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                      }}
                    >
                      <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 8px' }}>
                        Delete Brand Project?
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
                        This permanently removes the project, all 8 AI agent outputs, run history, and exported brand assets.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          onClick={() => setDeletingProjectId(null)}
                          className="button button-outline"
                          disabled={isDeleting}
                          style={{ fontSize: '11px', padding: '6px 14px' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteProject(deletingProjectId)}
                          disabled={isDeleting}
                          style={{
                            background: 'rgba(255, 75, 75, 0.85)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '11px',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
