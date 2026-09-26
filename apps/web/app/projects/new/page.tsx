'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { ProtectedRoute } from '../../../lib/auth-guard';

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

export default function NewBrandPage() {
  const router = useRouter();
  const [ideaText, setIdeaText] = useState(
    'An app where customers can book verified home-cleaning professionals, compare prices, schedule recurring cleaning, and pay through the app.'
  );
  const [targetAudience, setTargetAudience] = useState('Busy urban households');
  const [category, setCategory] = useState('Home services');
  const [selectedChips, setSelectedChips] = useState<string[]>(['Consumer', 'Marketplace']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableChips = ['Consumer', 'Marketplace', 'Mobile app', 'Dev Tools', 'B2B SaaS', 'Creator Studio'];

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleStartBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Derive a concise initial project name
      const derivedName =
        ideaText.split('.')[0].trim().slice(0, 28) || 'New Brand World';

      // 1. Create project via backend API
      const newProj = await api.createProject({
        name: derivedName,
        idea: ideaText,
        constraints: {
          target_audience: targetAudience || undefined,
          category: category || undefined,
          tags: selectedChips,
        },
      });

      const projId = newProj.id;

      // 2. Start the AI workflow
      try {
        await api.startWorkflow(projId);
      } catch (workflowErr) {
        console.warn('Workflow start notice:', workflowErr);
      }

      // 3. Navigate into the Studio
      router.push(`/projects/${projId}`);
    } catch (err: any) {
      console.error('Failed to create brand project:', err);
      setErrorMsg(err.message || 'Failed to initialize project on backend.');
      // Graceful fallback to demo studio if backend is currently unreachable
      setTimeout(() => {
        router.push('/projects/demo-nexus-craft');
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="new-brand-shell">
      {/* Simple Header */}
      <header className="simple-header">
        <Link href="/dashboard" className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to worlds
        </Link>
        <Logo />
      </header>

      {/* Main Creation Grid */}
      <div className="new-brand-content">
        {/* Left Column: Editorial Guidance */}
        <div className="new-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> NEW BRAND WORLD
          </div>
          <h1>
            Start with the
            <br />
            <em>rough idea.</em>
          </h1>
          <p>
            Don&apos;t polish it yet. The more unfiltered your starting point, the more useful the thinking becomes.
          </p>
          <div className="new-note">
            <Sparkles size={15} />
            <span>Messy first drafts make better brands.</span>
          </div>
        </div>

        {/* Center: The Idea Form */}
        <form onSubmit={handleStartBranding} className="idea-form">
          <label>
            What are you building? <span>REQUIRED</span>
          </label>
          <textarea
            required
            rows={5}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="Tell us what you are making, who it's for, and the core problem it solves..."
          />

          <div className="chip-label">
            Add a little context <span>OPTIONAL</span>
          </div>
          <div className="chip-row">
            {availableChips.map((chip) => {
              const active = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  style={{
                    background: active ? 'rgba(124, 92, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: active ? 'var(--indigo)' : 'var(--border)',
                    color: active ? '#cbbdff' : 'var(--muted)',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {chip}
                </button>
              );
            })}
          </div>

          <div className="optional-fields">
            <div>
              <label>Who is it for?</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Busy urban households, tech founders"
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Home services, Developer Tools"
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: 'var(--coral)', fontSize: '11px', font: '10px monospace' }}>
              Notice: {errorMsg} (Routing to studio workspace...)
            </div>
          )}

          <div className="form-footer">
            <span>
              <span className="save-dot" /> Ready for AI synthesis
            </span>
            <button type="submit" className="button button-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Sparkles size={14} className="animate-spin" /> Initializing...
                </>
              ) : (
                <>
                  Start branding <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Sidebar: Pipeline Preview */}
        <div className="new-sidebar">
          <span className="side-label">THE BRAND FORGE</span>
          {[
            { title: '8 AI agents', desc: 'Each sees the idea from a different angle.' },
            { title: 'Structured reasoning', desc: 'Ideas become decisions, not just output.' },
            { title: 'Your judgment', desc: 'You steer the direction at every step.' },
            { title: 'Consistency validation', desc: 'Every choice gets checked as a system.' },
          ].map((item, i) => (
            <div className={`mini-step ${i === 0 ? 'active' : ''}`} key={item.title}>
              <span>0{i + 1}</span>
              <div>
                <b>{item.title}</b>
                <small>{item.desc}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
