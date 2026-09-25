import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Target,
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
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const pipelineStages = [
    { name: 'Idea', desc: 'Raw prompt or napkin sketch', icon: BrainCircuit, color: 'text-slate-400' },
    { name: 'Discover', desc: 'Core problem & target audience', icon: Compass, color: 'text-indigo-400' },
    { name: 'Position', desc: 'Strategic market differentiation', icon: Target, color: 'text-indigo-400' },
    { name: 'Personality', desc: 'Archetype, tone & principles', icon: Sparkles, color: 'text-purple-400' },
    { name: 'Naming', desc: 'Territory candidates & risk audit', icon: Tag, color: 'text-cyan-400' },
    { name: 'Visualize', desc: 'Swatches, typography & mood', icon: Palette, color: 'text-emerald-400' },
    { name: 'Brand Battle', desc: 'Adversarial market critic', icon: Swords, color: 'text-rose-400' },
    { name: 'Consistency', desc: 'Cross-stage coherence matrix', icon: ShieldCheck, color: 'text-emerald-400' },
    { name: 'Launch', desc: 'PDF kit, landing copy & social', icon: Rocket, color: 'text-indigo-400' },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI BRAND INTELLIGENCE STUDIO</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            From rough idea <br />
            to <span className="glow-text">launch-ready brand.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            BrandForge transforms unstructured product concepts into coherent brand systems through staged AI reasoning, market critique, consistency validation, and human decision control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/projects/new">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#pipeline">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <span>See How It Works</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section id="pipeline" className="py-20 border-b border-slate-800/80 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-3">
              The BrandForge Engine
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Structured 8-Stage AI Reasoning Pipeline
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              No one-prompt wrappers. Every stage is handled by a specialized agent with input validation, human decision gates, and dependency rerun loops.
            </p>
          </div>

          {/* Visual Interactive Pipeline Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={idx} className="relative group">
                  <div className="bg-[#131c31] border border-slate-800 rounded-xl p-3.5 h-full flex flex-col justify-between group-hover:border-indigo-500/50 group-hover:shadow-glow-indigo transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-500">0{idx}</span>
                        <Icon className={`w-4 h-4 ${stage.color}`} />
                      </div>
                      <h4 className="font-bold text-xs text-white mb-1">{stage.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">{stage.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
                      <span>Stage 0{idx}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why BrandForge Section */}
      <section id="features" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Built for Serious Creators & Founders
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Why BrandForge is Different
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Structured Reasoning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shared typed state (`BrandState`) guarantees every agent builds directly upon previously validated strategic decisions.
              </p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Human-in-the-Loop</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accept, select options, or request targeted revisions at every stage. Never lose control to a black-box generator.
              </p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Swords className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Brand Battle Critic</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adversarial AI critic tests your brand against market genericity, positioning weakness, and target demographic friction.
              </p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Consistency Guardian</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated matrix verifies cross-stage alignment between Name, Tagline, Archetype, Color Palette, and Launch Copy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#080c14] to-[#0f172a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to forge your brand identity?
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
            Transform your rough idea into a launch-ready brand kit in under 5 minutes with our 8-agent AI workflow.
          </p>
          <Link href="/projects/new">
            <Button variant="primary" size="lg">
              <span>Initialize Brand Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 BrandForge AI Intelligence Studio. Powered by LangGraph & FastAPI.</p>
      </footer>
    </div>
  );
}
