'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Compass,
  Target,
  Tag,
  Palette,
  Swords,
  ShieldCheck,
  Rocket,
  Sliders,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [ideaText, setIdeaText] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [goals, setGoals] = useState('');
  const [constraints, setConstraints] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsLoading(true);
    try {
      // Derive a project name from the idea text
      const derivedName = ideaText.split('.')[0].slice(0, 30) || 'New Brand Project';

      // 1. Create project via API
      const newProj = await api.createProject({
        name: derivedName,
        description: ideaText,
        initial_prompt: ideaText,
        target_audience: targetAudience || undefined,
        industry: industry || undefined,
        goals: goals ? goals.split(',').map((g) => g.trim()) : undefined,
        constraints: constraints ? constraints.split(',').map((c) => c.trim()) : undefined,
      });

      const projId = newProj.id;

      // 2. Start workflow
      await api.startWorkflow(projId);

      // 3. Navigate to Main Brand Studio workspace
      router.push(`/projects/${projId}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      // Fallback demo redirect
      const fallbackId = 'demo-nexus-craft';
      router.push(`/projects/${fallbackId}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0b0f19] px-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-sm tracking-tight text-white">
            Brand<span className="glow-text">Forge</span> Studio Initialization
          </span>
        </div>

        <div className="w-20" />
      </header>

      {/* Content Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Workflow Initialization</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Start with the rough idea.
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Tell us about your startup, product, creator idea, community, or project. Our 8 specialized AI agents will parse your raw prompt into a structured brand system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Idea Textarea */}
          <Card className="p-6 bg-[#0f172a] border-indigo-500/30 shadow-xl shadow-indigo-500/5">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
              Unstructured Brand Concept / Pitch
            </label>
            <textarea
              required
              rows={5}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Tell us about your startup, product, creator idea, community, or project... (e.g., An autonomous developer tooling platform that orchestration AI agents to write, test, and deploy web apps.)"
              className="w-full bg-[#080c14] border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed placeholder:text-slate-600"
            />
          </Card>

          {/* Optional Strategic Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-slate-900/60">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Audience <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Senior engineers, tech founders, startup CTOs"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </Card>

            <Card className="p-4 bg-slate-900/60">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Industry / Category <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Developer Tools, Artificial Intelligence, SaaS"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </Card>

            <Card className="p-4 bg-slate-900/60">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand Goals <span className="text-slate-500 font-normal">(Optional, comma separated)</span>
              </label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Establish technical authority, viral Github adoption"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </Card>

            <Card className="p-4 bg-slate-900/60">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Constraints <span className="text-slate-500 font-normal">(Optional, comma separated)</span>
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Avoid overly corporate jargon, keep color palette modern dark"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </Card>
          </div>

          {/* AI Pipeline Architecture Visual Preview */}
          <Card className="p-5 bg-[#0b0f19] border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Automated Pipeline Trigger Sequence
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                01 Discover
              </div>
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                02 Position
              </div>
              <div className="p-2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                03 Persona
              </div>
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                04 Naming
              </div>
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                05 Visual
              </div>
              <div className="p-2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                06 Battle
              </div>
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                07 Check
              </div>
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                08 Launch
              </div>
            </div>
          </Card>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Build My Brand</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
