import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  CheckSquare,
  Clock,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useTasks } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask, toggleTaskStatus, projects } = useTasks();
  const [showMenu, setShowMenu] = React.useState(false);

  const project = projects.find((p) => p.id === task.projectId);

  const priorityConfig: Record<TaskPriority, { label: string; badgeClass: string }> = {
    urgent: { label: 'Urgent', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    high: { label: 'High', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    medium: { label: 'Medium', badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    low: { label: 'Low', badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/30' },
  };

  const statusNext: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in_progress',
    in_progress: 'in_review',
    in_review: 'done',
    done: null,
  };

  const statusPrev: Record<TaskStatus, TaskStatus | null> = {
    todo: null,
    in_progress: 'todo',
    in_review: 'in_progress',
    done: 'in_review',
  };

  // Due date calculations
  const isCompleted = task.status === 'done';
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate && task.dueDate < todayStr;
  const isDueToday = !isCompleted && task.dueDate === todayStr;

  // Subtasks progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      className={`group relative bg-slate-800/90 hover:bg-slate-800 border rounded-xl p-4 transition-all duration-150 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-slate-800 opacity-75'
          : isOverdue
          ? 'border-rose-500/40 hover:border-rose-500/60'
          : 'border-slate-700/70 hover:border-slate-600'
      }`}
    >
      {/* Top Header: Project indicator + Priority Badge + Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 truncate">
          {project && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/50 truncate max-w-[130px]">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: project.color || '#6366f1' }}
              />
              <span className="truncate">{project.name}</span>
            </span>
          )}

          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
              priorityConfig[task.priority].badgeClass
            }`}
          >
            {priorityConfig[task.priority].label}
          </span>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-30 text-xs text-slate-300"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 hover:text-white"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                Edit Task
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  deleteTask(task.id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-rose-400 hover:text-rose-300 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Quick Checkbox */}
      <div className="flex items-start gap-2.5 mb-2">
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-400" />
          )}
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <h4
            className={`text-sm font-medium leading-snug cursor-pointer hover:text-indigo-300 transition-colors ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Subtasks Progress Bar if present */}
      {totalSubtasks > 0 && (
        <div className="mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              Subtasks
            </span>
            <span className="font-mono text-slate-300 font-medium">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-slate-700/40 text-slate-300 px-2 py-0.5 rounded border border-slate-600/30 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due Date & Stage Move Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-rose-400'
                : isDueToday
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
            title={isOverdue ? 'Overdue!' : isDueToday ? 'Due today!' : 'Target due date'}
          >
            {isOverdue ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span className="font-mono text-[11px]">
              {task.dueDate}
              {isDueToday && ' (Today)'}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> No due date
          </span>
        )}

        {/* Quick Shift buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {statusPrev[task.status] && (
            <button
              onClick={() => updateTask(task.id, { status: statusPrev[task.status]! })}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title={`Move back to ${statusPrev[task.status]}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {statusNext[task.status] && (
            <button
              onClick={() => updateTask(task.id, { status: statusNext[task.status]! })}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title={`Move next to ${statusNext[task.status]}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
