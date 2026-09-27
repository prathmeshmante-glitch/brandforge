'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

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

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <span className="eyebrow-line" /> FOUNDER SUPPORT
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', margin: '0 0 16px', fontWeight: 500, letterSpacing: '-0.04em' }}>
          Connect with the Studio Team
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '40px', lineHeight: 1.6 }}>
          Have feedback on the 8-agent AI pipeline or questions about enterprise deployment? We respond directly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {/* Direct Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Mail size={16} color="var(--accent)" />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', margin: 0, fontWeight: 500, color: '#fff' }}>
                  General Inquiries & Feedback
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>
                For product questions, studio suggestions, or beta feedback:
              </p>
              <a
                href="mailto:support@brandforge.ai"
                style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontFamily: 'monospace' }}
              >
                support@brandforge.ai
              </a>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={16} color="var(--sage)" />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', margin: 0, fontWeight: 500, color: '#fff' }}>
                  Security & Responsible Disclosure
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>
                To report vulnerability or request data governance review:
              </p>
              <a
                href="mailto:security@brandforge.ai"
                style={{ fontSize: '13px', color: 'var(--sage)', textDecoration: 'none', fontFamily: 'monospace' }}
              >
                security@brandforge.ai
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={36} color="var(--sage)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 6px', fontWeight: 500 }}>
                  Message Received
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Thank you for reaching out. Our engineering team reviews inquiries promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                    MESSAGE / INQUIRY
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your brand development?"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '12px',
                      resize: 'none',
                    }}
                  />
                </div>

                <button type="submit" className="button button-primary" style={{ width: '100%', marginTop: '6px' }}>
                  Send Message <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
