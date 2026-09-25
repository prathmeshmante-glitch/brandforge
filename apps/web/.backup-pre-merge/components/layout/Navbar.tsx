import React from 'react';
import Link from 'next/link';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080c14]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080c14] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            Brand<span className="glow-text">Forge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#pipeline" className="hover:text-slate-100 transition-colors">
            AI Workflow
          </Link>
          <Link href="#features" className="hover:text-slate-100 transition-colors">
            Features
          </Link>
          <Link href="#battle" className="hover:text-slate-100 transition-colors">
            Brand Battle
          </Link>
          <Link href="/dashboard" className="hover:text-slate-100 transition-colors">
            Studio Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button variant="primary" size="sm">
              <span>Start Building</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
