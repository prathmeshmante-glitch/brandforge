'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Folder,
  Layers,
  FileText,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StageStatusBadge } from '../../components/ui/Badge';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load projects:', err);
        // Fallback demo project if API not live
        setProjects([
          {
            id: 'demo-nexus-craft',
            name: 'NexusCraft AI',
            description: 'Autonomous developer tooling & AI workflow orchestration platform.',
            current_stage: 'visualize',
            updated_at: new Date().toISOString(),
            progress: 62,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          <Link href="/" className="flex items-center gap-2.5 group mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#080c14] rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Brand<span className="glow-text">Forge</span>
            </span>
          </Link>

          <nav className="space-y-1 text-xs font-medium">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-300 border border-indigo-500/20"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Studio Overview</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <Folder className="w-4 h-4" />
              <span>My Projects</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Brand Runs</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Exported Kits</span>
            </a>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Studio Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back to BrandForge</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your AI brand intelligence workflows and active brand kits.
            </p>
          </div>

          <Link href="/projects/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4" />
              <span>Create New Brand</span>
            </Button>
          </Link>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search brand projects..."
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-400" />
            <p className="text-xs">Loading studio projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Polished Empty State */
          <Card className="p-12 text-center max-w-lg mx-auto bg-slate-900/40 border-dashed border-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Brand Projects Yet</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Start by describing your startup, creator idea, community, or product to trigger the 8-stage AI workflow.
            </p>
            <Link href="/projects/new">
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4" />
                <span>Initialize First Brand</span>
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Card key={proj.id} hoverable className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StageStatusBadge status={proj.current_stage || 'running'} />
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(proj.updated_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                    {proj.name || 'Untitled Brand'}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Pipeline Progress</span>
                      <span>{proj.progress || 50}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${proj.progress || 50}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <Link href={`/projects/${proj.id}`}>
                    <Button variant="primary" size="sm">
                      <span>Open Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
