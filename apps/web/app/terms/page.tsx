'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 13, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Logo />
          <div style={{ height: '18px', width: '1px', background: 'var(--border)' }} />
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--muted)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Back to BrandForge
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '60px 24px 80px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>
          <span className="eyebrow-line" /> SERVICE AGREEMENT
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', margin: '0 0 16px', fontWeight: 500, letterSpacing: '-0.04em' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '40px', lineHeight: 1.6 }}>
          Last updated: September 2026 • BrandForge AI Brand Intelligence Studio
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: 1.7, fontSize: '14px', color: '#c5c7d0' }}>
          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 12px', fontWeight: 500 }}>
              1. Ownership of Brand Intellectual Property
            </h2>
            <p>
              You own all intellectual property rights to the business concepts, brand names, visual guidelines, and strategy artifacts generated within your BrandForge studio account. BrandForge claims no ownership or royalty rights over brands conceived or forged using our service.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 12px', fontWeight: 500 }}>
              2. AI Assessments Are Not Legal Trademark Clearance
            </h2>
            <div
              style={{
                background: 'rgba(255, 107, 94, 0.08)',
                border: '1px solid rgba(255, 107, 94, 0.3)',
                borderRadius: '10px',
                padding: '16px',
                color: '#ffb3ac',
                fontSize: '13px',
              }}
            >
              <strong>Important Disclaimer:</strong> All naming assessments, phonetic risk ratings, domain availability projections, and competitive trademark reviews provided by the BrandForge Naming and Brand Battle agents are <strong>AI preliminary heuristic evaluations only</strong>. They do not constitute formal legal counsel, statutory trademark registration, or official clearance. You must consult a qualified trademark attorney before launching or commercially investing in brand marks.
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 12px', fontWeight: 500 }}>
              3. Studio Usage & Fair Use
            </h2>
            <p>
              Users agree not to use BrandForge to generate deceptive marks, unlawful material, or maliciously flood the studio workflow with automated bots. Rate limiting is enforced on all workflow and export endpoints to protect platform reliability.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 12px', fontWeight: 500 }}>
              4. Availability & Warranty
            </h2>
            <p>
              BrandForge is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis during public beta. While we strive for 99.9% uptime and zero data loss through multi-region cloud backups, we do not warrant that AI generations will be error-free or uninterrupted.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
