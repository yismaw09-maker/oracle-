import React from 'react';
import {
  Folder,
  FolderPlus,
  Layers,
  Clock,
  AlertCircle,
  CheckCircle2,
  Tag,
  Flame,
  Activity,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    projects,
    tasks,
    filters,
    setFilters,
    setIsProjectModalOpen,
    activities,
  } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'done').length;
  const urgentTasks = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done').length;

  // Extract unique tags
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || []))).slice(0, 8);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Quick Filters */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview
            </p>

            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  selectedProjectId: 'all',
                  statusFilter: 'all',
                  priorityFilter: 'all',
                }));
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filters.selectedProjectId === 'all' &&
                filters.statusFilter === 'all' &&
                filters.priorityFilter === 'all'
                  ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>All Tasks</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {totalTasks}
              </span>
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  priorityFilter: prev.priorityFilter === 'urgent' ? 'all' : 'urgent',
                }));
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filters.priorityFilter === 'urgent'
                  ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Urgent & High</span>
              </div>
              {urgentTasks > 0 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {urgentTasks}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  statusFilter: prev.statusFilter === 'done' ? 'all' : 'done',
                }));
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filters.statusFilter === 'done'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completed</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {completedTasks}
              </span>
            </button>
          </div>

          {/* Projects Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Workspaces
              </p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                title="New Project"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="px-3 py-4 text-center border border-dashed border-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">No projects yet</p>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Create First Project
                </button>
              </div>
            ) : (
              projects.map((proj) => {
                const count = tasks.filter((t) => t.projectId === proj.id).length;
                const isSelected = filters.selectedProjectId === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        selectedProjectId: isSelected ? 'all' : proj.id,
                      }));
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color || '#6366f1' }}
                      />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-mono">
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Tag Filter Cloud */}
          {allTags.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5 px-3">
                {allTags.map((tag) => {
                  const isActive = filters.tagFilter === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          tagFilter: isActive ? 'all' : tag,
                        }))
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Productivity Metric Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-800/80 to-slate-800/30 border border-slate-700/60 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Velocity Progress
              </span>
              <span className="text-xs font-bold font-mono text-indigo-400">
                {completionRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 flex justify-between">
              <span>{completedTasks} completed</span>
              <span>{totalTasks - completedTasks} remaining</span>
            </p>
          </div>

          {/* Recent Activity Mini-Feed */}
          {activities.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                Live Feed
              </p>
              <div className="space-y-2 px-3">
                {activities.slice(0, 3).map((act) => (
                  <div key={act.id} className="text-[11px] text-slate-400 border-l border-slate-700 pl-2 py-0.5">
                    <p className="text-slate-200 line-clamp-1">{act.details}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
