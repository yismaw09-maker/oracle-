import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Tag,
  CheckSquare,
  AlertCircle,
  Folder,
  Layers,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Subtask } from '../types';
import { useTasks } from '../context/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const {
    projects,
    createTask,
    updateTask,
    deleteTask,
    defaultStatusForNewTask,
    setIsProjectModalOpen,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatusForNewTask);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync state with taskToEdit
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setProjectId(taskToEdit.projectId);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || '');
      setTags(taskToEdit.tags || []);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setStatus(defaultStatusForNewTask);
      setPriority('medium');
      setDueDate('');
      setTags([]);
      setSubtasks([]);
    }
    setError(null);
  }, [taskToEdit, isOpen, defaultStatusForNewTask, projects]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSub: Subtask = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, newSub]);
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (subId: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }
    if (!projectId) {
      setError('Please select or create a workspace project first');
      return;
    }

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          projectId,
          status,
          priority,
          dueDate,
          tags,
          subtasks,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          projectId,
          status,
          priority,
          dueDate,
          tags,
          subtasks,
        });
      }
      onClose();
    } catch (err: unknown) {
      console.error('Task save error:', err);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (taskToEdit) {
      if (confirm('Are you sure you want to delete this task?')) {
        await deleteTask(taskToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">
              {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth token refresh flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Project & Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Workspace Project <span className="text-rose-400">*</span>
              </label>
              {projects.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(true)}
                  className="w-full py-2 px-3 bg-slate-800 border border-dashed border-indigo-500/40 rounded-xl text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create First Project
                </button>
              ) : (
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Status & Due Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Workflow Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add key context, links, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Checklist / Subtasks Section */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Checklist / Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>

            <div className="space-y-2 mb-3">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-800/70 rounded-lg border border-slate-700/50"
                >
                  <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-700 border-slate-600"
                    />
                    <span
                      className={`text-xs ${
                        sub.completed ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tags & Labels
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-md"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type tag and press Enter (e.g. Design, Frontend)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Actions footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {taskToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/25 transition-all"
              >
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
