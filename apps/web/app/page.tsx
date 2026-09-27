'use client';

import React, { useState } from 'react';
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
  Layers,
  FileText,
  Share2,
  Menu,
  X,
  HelpCircle,
  Check,
  ChevronDown,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What makes BrandForge different from ChatGPT or Claude?',
      a: 'Generic AI outputs isolated text snippets without cross-stage validation or visual grounding. BrandForge operates as a stateful 8-agent studio: every decision is stored in structured BrandState, stress-tested by an Adversarial Critic for market clichés, validated by a Consistency Guardian, and compiled into a real, vector PDF brand kit.',
    },
    {
      q: 'Can I trademark the names suggested by the Naming Agent?',
      a: 'All naming assessments, risk scores, and domain indicators are preliminary AI heuristic evaluations. They do not constitute formal legal clearance or trademark registration. We recommend conducting a formal trademark search with an IP attorney prior to commercial deployment.',
    },
    {
      q: 'Who owns the generated brand assets and identity?',
      a: 'You own 100% of the brand names, positioning strategies, palettes, typography guidelines, and launch copy created in your BrandForge studio account.',
    },
    {
      q: 'What format are exported brand kits?',
      a: 'BrandForge exports real, multi-page vector PDF documents generated via our server-side ReportLab engine, covering Cover, Brand Strategy, Positioning Thesis, Archetype & Tone, Naming Territories, Color Swatches, Brand Battle Critique, and GTM Launch Copy.',
    },
    {
      q: 'How does BrandForge protect my confidential startup idea?',
      a: 'Your concepts are stored in Supabase PostgreSQL with strict Row-Level Security (RLS) tenant isolation. We process agent workflows via enterprise API tiers with strict zero-training terms—your proprietary data is never used to train public foundation models.',
    },
  ];

  return (
    <main className="landing-shell">
      {/* Top Navigation */}
      <header className="landing-nav">
        <Logo />
        <nav>
          <a href="#how">AI Pipeline</a>
          <a href="#studio">Capabilities</a>
          <a href="#example">Real Example</a>
          <a href="#pricing">Beta Access</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{ fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.05em' }}>
            Sign in
          </Link>
          <Link href="/projects/new" className="button button-primary">
            Start building <ArrowRight size={14} />
          </Link>
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              display: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 11, 14, 0.98)',
            zIndex: 90,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '16px', color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            AI Pipeline
          </a>
          <a
            href="#studio"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '16px', color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            Studio Capabilities
          </a>
          <a
            href="#example"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '16px', color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            Real Example
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '16px', color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            Beta Access
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '16px', color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            FAQ
          </a>
          <hr style={{ borderColor: 'var(--border)', margin: '10px 0' }} />
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '14px', color: 'var(--muted)', textDecoration: 'none' }}
          >
            Studio Dashboard
          </Link>
          <Link
            href="/projects/new"
            onClick={() => setMobileMenuOpen(false)}
            className="button button-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            Start building <ArrowRight size={14} />
          </Link>
        </div>
      )}

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

      {/* Section: Studio Capabilities (Fixes dead #studio anchor) */}
      <section id="studio" style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="eyebrow-line" /> THE STUDIO EXPERIENCE
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, letterSpacing: '-0.04em', margin: 0 }}>
            An interactive workbench, <em>not a chat box.</em>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.6 }}>
            BrandForge brings agency-grade creative direction into a single, focused 3-column workspace.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <Layers size={22} color="var(--accent)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 8px' }}>
              3-Column Visual Workflow
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              See where you are in the 8-stage sequence at a glance. Review AI synthesis, compare candidate angles, and execute human approvals side-by-side.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <FileText size={22} color="var(--sage)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 8px' }}>
              Vector PDF Brand Book Exports
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Generate complete, multi-page vector PDF guidelines with custom typography and color specs ready to send to designers, developers, and investors.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <Share2 size={22} color="var(--indigo)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 8px' }}>
              Instant Read-Only Sharing
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Publish verified brand kits to a clean, public URL. Stakeholders can inspect the complete identity without needing an account or editing access.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Real Example */}
      <section id="example" style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 34px' }}>
        <div
          style={{
            background: 'radial-gradient(ellipse 65% 85% at 50% 20%, rgba(124, 92, 255, 0.12), transparent 70%), #15161cdd',
            border: '1px solid var(--border-strong)',
            borderRadius: '20px',
            padding: '48px 36px',
          }}
        >
          <div className="eyebrow" style={{ marginBottom: '12px' }}>
            <span className="eyebrow-line" /> THE JOURNEY IN ACTION
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 500, margin: '0 0 32px' }}>
            How a rough idea becomes an identity.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Step 1: Input */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ font: '9px monospace', color: 'var(--accent)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
                01 / ROUGH FOUNDER INPUT
              </span>
              <p style={{ fontSize: '13px', color: '#fff', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                &ldquo;An AI platform that helps independent coffee roasters trace ethical beans, calculate roast curves, and connect with boutique cafes.&rdquo;
              </p>
            </div>

            {/* Step 2: Reasoning */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ font: '9px monospace', color: 'var(--amber)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
                02 / AGENT REASONING & CRITIQUE
              </span>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                Positioner cuts generic SaaS framing. Critic flags commodity coffee clichés like &ldquo;BeanSync&rdquo;. Consistency Guardian ensures rustic craft values match the modern web typography.
              </p>
            </div>

            {/* Step 3: Output */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ font: '9px monospace', color: 'var(--sage)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
                03 / FINAL BRAND SYSTEM
              </span>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 4px' }}>
                OriginCraft
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Tagline: <em>Roast with provenance.</em>
                <br />
                Archetype: The Master Craftsman.
                <br />
                Consistency Score: 94/100.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why BrandForge Comparison */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="eyebrow-line" /> THE ARCHITECTURAL DIFFERENCE
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 500, margin: 0 }}>
            Generic AI vs BrandForge Studio
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 107, 94, 0.04)', border: '1px solid rgba(255, 107, 94, 0.2)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffb3ac', margin: '0 0 16px' }}>
              Generic Prompting
            </h3>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
              <li>Single giant unstructured prompt output</li>
              <li>Names chosen without checking trademark heuristics</li>
              <li>No adversary to challenge clichés or weak positioning</li>
              <li>Visuals disconnected from brand strategy</li>
              <li>Raw markdown text with no exportable PDF deliverables</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(124, 92, 255, 0.06)', border: '1px solid rgba(124, 92, 255, 0.3)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#b7a5ff', margin: '0 0 16px' }}>
              BrandForge Intelligence Studio
            </h3>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#e0dcf8', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
              <li>8 specialized agents connected through typed BrandState</li>
              <li>Phonetic and territory-grounded naming explorations</li>
              <li>Adversarial critic testing assumptions before public launch</li>
              <li>6-point consistency verification across all visual/verbal marks</li>
              <li>Real vector PDF brand kit with typography and palette specs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section: Private Beta Pricing */}
      <section id="pricing" style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 34px', textAlign: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '48px 32px',
          }}
        >
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="eyebrow-line" /> PRIVATE BETA ACCESS
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 500, margin: '0 0 12px' }}>
            Free During Founder Beta
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            We are collaborating with early founders, teams, and creators to forge standout brands. No credit card required.
          </p>

          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '32px' }}>
            {[
              'Unlimited brand project creation',
              'Full 8-agent AI workflow execution',
              'Human-in-the-loop decision checkpoints',
              'Targeted stage revisions',
              'Multi-page ReportLab vector PDF exports',
              'Public read-only share links',
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#fff' }}>
                <Check size={15} color="var(--sage)" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div>
            <Link href="/signup" className="button button-primary" style={{ padding: '12px 28px', fontSize: '13px' }}>
              Claim Your Beta Studio Access <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section: FAQ */}
      <section id="faq" style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="eyebrow-line" /> CLARITY & ANSWERS
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 500, margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontFamily: 'Georgia, serif',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    color="var(--muted)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ borderTop: '1px solid var(--border)', padding: '40px 34px', background: 'rgba(10, 11, 14, 0.95)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <Logo />
            <p style={{ fontSize: '11px', color: 'var(--subtle)', marginTop: '8px' }}>
              AI Brand Intelligence Studio for modern founders and creators.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
            <Link href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              Terms
            </Link>
            <Link href="/security" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              Security
            </Link>
            <Link href="/contact" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              Contact
            </Link>
            <Link href="/dashboard" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Studio
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
