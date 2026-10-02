import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  BarChart3,
  LogOut,
  User,
  SlidersHorizontal,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { ViewMode } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, userProfile, signInWithGoogle, signOut } = useAuth();
  const {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    setIsCreateModalOpen,
    seedDemoDataIfEmpty,
    tasks,
    projects,
  } = useTasks();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const viewModes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'kanban', label: 'Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'list', label: 'List', icon: <List className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const completedCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-3">
        {/* Left: Brand & Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">TaskFlow</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {tasks.length > 0 ? `${completedCount}/${tasks.length} tasks completed` : 'Focus & ship'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & View Switcher */}
        <div className="flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="relative w-full max-w-xs hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, tags..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-800/80 border border-slate-700/80 text-sm rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 p-0.5 rounded-lg">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === mode.id
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {mode.icon}
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions & User Authentication */}
        <div className="flex items-center gap-3">
          {user && tasks.length === 0 && projects.length === 0 && (
            <button
              onClick={seedDemoDataIfEmpty}
              className="hidden lg:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Starter Kit
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-700 hover:border-slate-500 transition-colors focus:outline-none"
                >
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                      {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-2.5">
                      <p className="text-sm font-semibold text-white truncate">
                        {userProfile?.displayName || user.displayName || 'TaskFlow User'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-slate-400 flex justify-between">
                        <span>Workspace Projects:</span>
                        <span className="font-semibold text-white">{projects.length}</span>
                      </div>
                      <div className="px-4 py-2 text-xs text-slate-400 flex justify-between">
                        <span>Active Tasks:</span>
                        <span className="font-semibold text-white">{tasks.length}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800/80 hover:text-rose-300 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
