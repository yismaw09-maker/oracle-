import React from 'react';
import {
  CheckSquare,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Calendar,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthHeroProps {
  onExploreDemo: () => void;
}

export const AuthHero: React.FC<AuthHeroProps> = ({ onExploreDemo }) => {
  const { signInWithGoogle, error, clearError } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen React Task Management & Productivity
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Ship faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">TaskFlow</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            An agile task management dashboard featuring integrated user authentication, real-time Firestore sync, dynamic Kanban boards, checklists, and productivity analytics.
          </p>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 text-left flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="underline hover:text-white ml-2">
                Dismiss
              </button>
            </div>
          )}

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={signInWithGoogle}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-lg shadow-white/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Preview Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-800/80 text-left">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <LayoutGrid className="w-5 h-5 text-indigo-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Kanban Boards</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop workflows</p>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <Calendar className="w-5 h-5 text-purple-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Calendar Timeline</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Deadlines & schedules</p>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <BarChart3 className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Velocity Insights</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Productivity metrics</p>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-sky-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Secure Firestore</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero-trust security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
