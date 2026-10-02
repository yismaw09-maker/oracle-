/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { AuthHero } from './components/AuthHero';
import { Task } from './types';
import {
  CheckSquare,
  Filter,
  X,
  AlertCircle,
  LogIn,
  SlidersHorizontal,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const {
    tasks,
    projects,
    loading: tasksLoading,
    viewMode,
    filters,
    setFilters,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isProjectModalOpen,
    setIsProjectModalOpen,
    activeTaskForEdit,
    setActiveTaskForEdit,
    seedDemoDataIfEmpty,
  } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Automatically check if user has empty data on initial login and seed helpful tasks
  useEffect(() => {
    if (user && !tasksLoading && tasks.length === 0 && projects.length === 0) {
      seedDemoDataIfEmpty();
    }
  }, [user, tasksLoading, tasks.length, projects.length]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse mb-4 shadow-xl shadow-indigo-500/20">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading TaskFlow workspace...</p>
      </div>
    );
  }

  // If user is not authenticated and has not clicked explore demo
  if (!user && !demoMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />
        <AuthHero onExploreDemo={() => setDemoMode(true)} />
      </div>
    );
  }

  const hasActiveFilters =
    filters.searchQuery ||
    filters.selectedProjectId !== 'all' ||
    filters.statusFilter !== 'all' ||
    filters.priorityFilter !== 'all' ||
    filters.tagFilter !== 'all';

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      selectedProjectId: 'all',
      statusFilter: 'all',
      priorityFilter: 'all',
      tagFilter: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Demo Mode Notice Banner if unauthenticated preview */}
      {!user && demoMode && (
        <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900 border-b border-indigo-500/30 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>
              <strong>Preview Mode:</strong> You are exploring TaskFlow in preview mode. Sign in with Google to enable real-time cloud database synchronization.
            </span>
          </div>
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-900 font-semibold rounded-md hover:bg-slate-100 transition-colors shrink-0 ml-4"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600" />
            Sign In with Google
          </button>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Center Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-400 pl-1">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                Active Filters:
              </span>

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                  Search: "{filters.searchQuery}"
                  <button
                    onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.selectedProjectId !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                  Project: {projects.find((p) => p.id === filters.selectedProjectId)?.name || 'Project'}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, selectedProjectId: 'all' }))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.priorityFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700 uppercase font-semibold">
                  Priority: {filters.priorityFilter}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, priorityFilter: 'all' }))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700 uppercase font-semibold">
                  Status: {filters.statusFilter}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, statusFilter: 'all' }))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.tagFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                  Tag: #{filters.tagFilter}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, tagFilter: 'all' }))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium ml-auto pr-1"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Current View Switcher */}
          {viewMode === 'kanban' && (
            <KanbanBoard onEditTask={(task) => setActiveTaskForEdit(task)} />
          )}

          {viewMode === 'list' && (
            <ListView onEditTask={(task) => setActiveTaskForEdit(task)} />
          )}

          {viewMode === 'calendar' && (
            <CalendarView onEditTask={(task) => setActiveTaskForEdit(task)} />
          )}

          {viewMode === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen || activeTaskForEdit !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setActiveTaskForEdit(null);
        }}
        taskToEdit={activeTaskForEdit}
      />

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <DashboardContent />
      </TaskProvider>
    </AuthProvider>
  );
}
