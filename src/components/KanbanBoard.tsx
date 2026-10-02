import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Sparkles, Inbox } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { useTasks } from '../context/TaskContext';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask }) => {
  const { filteredTasks, updateTask, setIsCreateModalOpen, setDefaultStatusForNewTask, projects, filters } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns: {
    id: TaskStatus;
    title: string;
    icon: React.ReactNode;
    colorClass: string;
    badgeClass: string;
  }[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Inbox className="w-4 h-4 text-slate-400" />,
      colorClass: 'border-t-slate-500',
      badgeClass: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-sky-400" />,
      colorClass: 'border-t-sky-500',
      badgeClass: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
    },
    {
      id: 'in_review',
      title: 'In Review',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      colorClass: 'border-t-amber-500',
      badgeClass: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'done',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      colorClass: 'border-t-emerald-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      await updateTask(taskId, { status });
    }
    setDraggedTaskId(null);
  };

  const activeProject = projects.find((p) => p.id === filters.selectedProjectId);

  return (
    <div className="space-y-4">
      {/* Board Header Context info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {activeProject ? (
              <>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeProject.color || '#6366f1' }}
                />
                {activeProject.name}
              </>
            ) : (
              'All Active Workspaces'
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeProject?.description || 'Drag and drop cards across columns to update workflow status in real time.'}
          </p>
        </div>

        <button
          onClick={() => {
            setDefaultStatusForNewTask('todo');
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {/* 4 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col border-t-4 ${column.colorClass} min-h-[500px] transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {column.title}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${column.badgeClass}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setDefaultStatusForNewTask(column.id);
                    setIsCreateModalOpen(true);
                  }}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title={`Add task to ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-400 mb-2">No tasks in {column.title}</p>
                    <button
                      onClick={() => {
                        setDefaultStatusForNewTask(column.id);
                        setIsCreateModalOpen(true);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add one
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TaskCard task={task} onEdit={onEditTask} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
