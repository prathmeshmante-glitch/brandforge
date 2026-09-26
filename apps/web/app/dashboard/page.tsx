'use client';

import React, { useEffect, useState } from 'react';
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
  CircleAlert,
  ArrowRight,
  LayoutDashboard,
  Type,
  FolderPlus,
  LogOut,
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
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.listProjects();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.warn('Backend API connection notice:', err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((p) =>
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
          <button onClick={() => alert('Studio Settings: Supabase auth & tenant isolation active.')}>
            <Settings2 size={16} />
            Settings
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={15} />
            </div>
            <b>Build without limits</b>
            <p>8-agent AI workflow with structured state reasoning.</p>
            <Link href="/projects/new" style={{ color: '#b7a5ff', fontSize: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

          <div className="top-actions">
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
            <button className="icon-button" aria-label="Notifications" onClick={() => alert('All AI agents operating normally.')}>
              <CircleAlert size={16} />
            </button>
            <div className="top-avatar">BF</div>
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

          {isLoading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--subtle)' }}>
              <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
              <p style={{ font: '11px monospace' }}>INITIALIZING STUDIO WORLDS...</p>
            </div>
          ) : projects.length === 0 ? (
            /* Empty State */
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
                      <div className="cover-word">{featuredProject.name || 'NexusCraft'}</div>
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
                    <Link
                      key={p.id || idx}
                      href={`/projects/${p.id}`}
                      className="kit-row"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className={`kit-swatch ${idx % 2 === 0 ? 'swatch-one' : 'swatch-two'}`} />
                      <div>
                        <b>{p.name || 'Untitled Brand'}</b>
                        <span>
                          Stage: {p.current_stage || 'discover'} • {new Date(p.updated_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <ChevronRight size={15} />
                    </Link>
                  ))}
                </article>
              </section>

              {/* Additional Projects Section (if more than 1) */}
              {projects.length > 1 && (
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
                            <span style={{ font: '9px monospace', color: 'var(--subtle)' }}>STAGE: {p.current_stage || 'discover'}</span>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)' }} />
                          </div>
                          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 6px', color: '#fff' }}>
                            {p.name || 'Untitled Brand'}
                          </h4>
                          <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 16px' }}>
                            {p.description ? p.description.slice(0, 80) + '...' : 'No description provided.'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                          <Link href={`/projects/${p.id}`} className="button button-outline" style={{ fontSize: '9px', padding: '0 12px', minHeight: '30px' }}>
                            Open studio <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
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
