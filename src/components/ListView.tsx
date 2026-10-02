import React from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Edit2,
  Trash2,
  CheckSquare,
  Plus,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useTasks } from '../context/TaskContext';

interface ListViewProps {
  onEditTask: (task: Task) => void;
}

export const ListView: React.FC<ListViewProps> = ({ onEditTask }) => {
  const { filteredTasks, updateTask, deleteTask, toggleTaskStatus, projects, filters, setFilters, setIsCreateModalOpen } = useTasks();

  const handleSort = (field: 'dueDate' | 'priority' | 'createdAt' | 'title') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const priorityColors: Record<TaskPriority, string> = {
    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    medium: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    low: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  };

  const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-slate-800 text-slate-300 border-slate-700',
    in_progress: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    in_review: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    done: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Task Registry</h3>
          <p className="text-xs text-slate-400">
            Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} matching current filters
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-slate-400 mb-3">No tasks match your selected filters</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Create a new task
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10">Done</th>
                <th
                  onClick={() => handleSort('title')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Task Title <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Workspace</th>
                <th className="py-3 px-4">Status</th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Priority <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dueDate')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Due Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Checklist</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const isCompleted = task.status === 'done';
                const todayStr = new Date().toISOString().split('T')[0];
                const isOverdue = !isCompleted && task.dueDate && task.dueDate < todayStr;
                const isDueToday = !isCompleted && task.dueDate === todayStr;

                const totalSub = task.subtasks?.length || 0;
                const compSub = task.subtasks?.filter((s) => s.completed).length || 0;

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCompleted ? 'opacity-60 bg-slate-900/40' : ''
                    }`}
                  >
                    {/* Done toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                        )}
                      </button>
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="cursor-pointer" onClick={() => onEditTask(task)}>
                        <p
                          className={`font-medium hover:text-indigo-400 transition-colors ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700 font-mono"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Workspace */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {project ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded border bg-slate-900 cursor-pointer focus:outline-none ${
                          statusColors[task.status]
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="done">Done</option>
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {task.dueDate ? (
                        <div
                          className={`flex items-center gap-1 font-mono text-[11px] ${
                            isOverdue
                              ? 'text-rose-400 font-bold'
                              : isDueToday
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-300'
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{task.dueDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Checklist info */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {totalSub > 0 ? (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-indigo-400" />
                          {compSub}/{totalSub}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
