import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';

interface CalendarViewProps {
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onEditTask }) => {
  const { filteredTasks, setIsCreateModalOpen, setDefaultStatusForNewTask, projects } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    calendarCells.push({
      dateStr: '',
      dayNum,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dateStr: formattedDate,
      dayNum: d,
      isCurrentMonth: true,
      isToday: formattedDate === todayStr,
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const totalSlots = Math.ceil(calendarCells.length / 7) * 7;
  let nextDayCounter = 1;
  while (calendarCells.length < totalSlots) {
    calendarCells.push({
      dateStr: '',
      dayNum: nextDayCounter++,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Schedule overview by due date</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => {
              setDefaultStatusForNewTask('todo');
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-800/40 text-center text-xs font-semibold text-slate-400 py-2.5">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-800">
        {calendarCells.map((cell, idx) => {
          const dayTasks = cell.dateStr
            ? filteredTasks.filter((t) => t.dueDate === cell.dateStr)
            : [];

          return (
            <div
              key={idx}
              className={`min-h-[105px] p-2 transition-colors flex flex-col justify-between ${
                !cell.isCurrentMonth
                  ? 'bg-slate-950/40 text-slate-400'
                  : cell.isToday
                  ? 'bg-indigo-950/20'
                  : 'bg-slate-900/60 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-mono font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                    cell.isToday
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : cell.isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {cell.isCurrentMonth && (
                  <button
                    onClick={() => {
                      setDefaultStatusForNewTask('todo');
                      setIsCreateModalOpen(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-white text-slate-400 p-0.5 rounded transition-opacity"
                    title="Add task on this day"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Task badges for this day */}
              <div className="space-y-1 flex-1 overflow-y-auto max-h-24 scrollbar-none">
                {dayTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  return (
                    <button
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`w-full text-left px-1.5 py-1 rounded text-[10px] font-medium border truncate transition-all block ${
                        task.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 line-through'
                          : task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-semibold'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`}
                      title={task.title}
                    >
                      <div className="flex items-center gap-1 truncate">
                        {project && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="truncate">{task.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
