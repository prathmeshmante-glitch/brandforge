import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock, Mail, Github } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Brand<span className="glow-text">Forge</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your AI Brand Studio projects and guidelines.
          </p>
        </div>

        <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = '/dashboard';
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  defaultValue="demo@brandforge.ai"
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#" className="text-[11px] text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  defaultValue="••••••••••••"
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <Button variant="primary" size="md" className="w-full mt-2" type="submit">
              <span>Sign In to Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[10px] font-mono uppercase text-slate-500">Or continue with</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => (window.location.href = '/dashboard')}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.8-.7-1.4-1.6-1.7-2.7z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
              />
            </svg>
            <span>Google Workspace OAuth</span>
          </Button>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          Protected by Supabase Auth with RLS tenant isolation.
        </p>
      </div>
    </div>
  );
}
