'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Target,
  Sparkles,
  Tag,
  Palette,
  Swords,
  ShieldCheck,
  Rocket,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const stages = [
  { number: '01', name: 'Discover', icon: Compass, status: 'complete', caption: 'Understanding the real problem' },
  { number: '02', name: 'Position', icon: Target, status: 'complete', caption: 'Finding your sharpest angle' },
  { number: '03', name: 'Personality', icon: Sparkles, status: 'complete', caption: 'Defining how it should feel' },
  { number: '04', name: 'Naming', icon: Tag, status: 'review', caption: 'Names that earn their place' },
  { number: '05', name: 'Visualize', icon: Palette, status: 'pending', caption: 'Giving the idea a shape' },
  { number: '06', name: 'Brand Battle', icon: Swords, status: 'pending', caption: 'Challenge before the market does' },
  { number: '07', name: 'Consistency', icon: ShieldCheck, status: 'pending', caption: 'Checking the system holds' },
  { number: '08', name: 'Launch', icon: Rocket, status: 'pending', caption: 'Opening the brand book' },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo">
      <div className="brand-mark">
        <span />
      </div>
      {!compact && <span>BRANDFORGE</span>}
    </Link>
  );
}

function WorkflowVisual() {
  return (
    <div className="workflow-visual">
      <div className="workflow-grid" />
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-amber" />
      <div className="workflow-line line-a" />
      <div className="workflow-line line-b" />
      <div className="workflow-core">
        <span className="core-ring" />
        <Sparkles size={18} />
        <span>YOUR IDEA</span>
        <b>→</b>
      </div>
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        return (
          <div key={stage.name} className={`flow-node node-${i + 1}`}>
            <div className="flow-icon">
              <Icon size={14} />
            </div>
            <div>
              <span>{stage.number}</span>
              <strong>{stage.name}</strong>
            </div>
            <i />
          </div>
        );
      })}
      <div className="flow-caption">
        <span className="pulse-dot" /> 8 specialized agents, one coherent brand system
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <Logo />
        <nav>
          <a href="#how">AI Pipeline</a>
          <a href="#studio">Studio Capabilities</a>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{ fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.05em' }}>
            Sign in
          </Link>
          <Link href="/projects/new" className="button button-primary">
            Start building <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> AI BRAND INTELLIGENCE STUDIO
          </div>
          <h1>
            From rough idea
            <br />
            <em>to launch-ready</em> brand.
          </h1>
          <p>
            Turn an unstructured idea into a coherent brand system through structured AI reasoning, human decisions, critique, and consistency.
          </p>
          <div className="hero-actions">
            <Link href="/projects/new" className="button button-primary">
              Start building <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard" className="button button-ghost">
              <span className="play-icon">→</span> Open studio dashboard
            </Link>
          </div>
          <div className="hero-note">
            <span className="note-rule" /> Designed for the leap between an idea and its moment.
          </div>
        </div>

        <WorkflowVisual />
      </section>

      {/* Structured AI Architecture Breakdown */}
      <section id="how" style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="eyebrow-line" /> STRUCTURED PIPELINE
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, letterSpacing: '-0.04em', margin: 0 }}>
            No one-prompt wrappers. <em>Real agent reasoning.</em>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Every stage is governed by a dedicated AI specialist with shared typed state, explicit human decision gates, and dependency rerun loops.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ color: 'var(--indigo)', marginBottom: '16px' }}>
              <BrainCircuit size={24} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 8px', color: '#fff' }}>Structured State</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Shared typed <code style={{ color: '#b4a5ff', fontSize: '11px' }}>BrandState</code> prevents context drift across Discover, Position, Persona, Naming, and Visual identity.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ color: 'var(--amber)', marginBottom: '16px' }}>
              <Sliders size={24} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 8px', color: '#fff' }}>Human-in-the-Loop</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Select directions, reject options, and trigger targeted revisions. The user steers the brand at every checkpoint.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ color: 'var(--coral)', marginBottom: '16px' }}>
              <Swords size={24} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 8px', color: '#fff' }}>Brand Battle Critic</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Adversarial critique agent tests genericity, weak differentiation, and audience friction before release.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ color: 'var(--sage)', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 8px', color: '#fff' }}>Consistency Guardian</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Automated 6-point matrix validates alignment between Name, Tagline, Archetype, Colors, and Launch Copy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>BRANDFORGE / STUDIO EDITION</span>
        <div>
          <span>Structured thinking</span>
          <span>Human judgment</span>
          <span>Brand coherence</span>
        </div>
      </footer>
    </main>
  );
}
