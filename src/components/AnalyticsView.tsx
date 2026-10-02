import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const AnalyticsView: React.FC = () => {
  const { tasks, projects, activities } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const inReviewTasks = tasks.filter((t) => t.status === 'in_review').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < todayStr).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority breakdown
  const urgentCount = tasks.filter((t) => t.priority === 'urgent').length;
  const highCount = tasks.filter((t) => t.priority === 'high').length;
  const mediumCount = tasks.filter((t) => t.priority === 'medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'low').length;

  return (
    <div className="space-y-6">
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{completionRate}%</span>
            <span className="text-xs text-emerald-400 font-medium">
              {completedTasks}/{totalTasks} finished
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{inProgressTasks + inReviewTasks}</span>
            <span className="text-xs text-slate-400 font-medium">in progress or review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {todoTasks} items waiting in backlog
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              overdueTasks > 0
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${overdueTasks > 0 ? 'text-rose-400' : 'text-white'}`}>
              {overdueTasks}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {overdueTasks === 0 ? 'All deadlines clear' : 'Needs attention'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {urgentCount} total urgent priority tasks
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Workspaces</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{projects.length}</span>
            <span className="text-xs text-indigo-400 font-medium">Active project hubs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Average {(totalTasks / Math.max(1, projects.length)).toFixed(1)} tasks per project
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Velocity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Workspace Workload & Progress
          </h3>

          {projects.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No projects available</p>
          ) : (
            <div className="space-y-4">
              {projects.map((proj) => {
                const pTasks = tasks.filter((t) => t.projectId === proj.id);
                const pDone = pTasks.filter((t) => t.status === 'done').length;
                const pRate = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

                return (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-slate-200">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: proj.color }}
                        />
                        {proj.name}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {pDone}/{pTasks.length} ({pRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pRate}%`,
                          backgroundColor: proj.color || '#6366f1',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority & Status Distributions */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              Priority Distribution
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/60 border border-rose-500/20 p-3 rounded-lg">
                <span className="text-[11px] font-semibold uppercase text-rose-300">Urgent</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{urgentCount}</p>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (urgentCount / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 border border-amber-500/20 p-3 rounded-lg">
                <span className="text-[11px] font-semibold uppercase text-amber-300">High</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{highCount}</p>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (highCount / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 border border-sky-500/20 p-3 rounded-lg">
                <span className="text-[11px] font-semibold uppercase text-sky-300">Medium</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{mediumCount}</p>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (mediumCount / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-lg">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Low</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{lowCount}</p>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (lowCount / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Workflow health:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High throughput
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Stream */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-indigo-400" />
          Recent Team & Workspace Event Stream
        </h3>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No logged activity events yet</p>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between text-xs p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-slate-200">{act.details}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-4">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                  {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
