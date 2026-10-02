import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Task, Project, ActivityLog, ViewMode, TaskFilterOptions, TaskStatus } from '../types';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  activities: ActivityLog[];
  loading: boolean;
  filters: TaskFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  createTask: (data: Partial<Task> & { title: string; projectId: string }) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string, targetStatus?: TaskStatus) => Promise<void>;
  createProject: (data: { name: string; description?: string; color: string; icon?: string }) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  seedDemoDataIfEmpty: () => Promise<void>;
  activeTaskForEdit: Task | null;
  setActiveTaskForEdit: (task: Task | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  defaultStatusForNewTask: TaskStatus;
  setDefaultStatusForNewTask: (status: TaskStatus) => void;
  filteredTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_FILTERS: TaskFilterOptions = {
  searchQuery: '',
  selectedProjectId: 'all',
  statusFilter: 'all',
  priorityFilter: 'all',
  tagFilter: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilterOptions>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const [activeTaskForEdit, setActiveTaskForEdit] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState<TaskStatus>('todo');

  // Real-time synchronization
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setProjects([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Projects query
    const projectsPath = 'projects';
    const projectsQuery = query(collection(db, projectsPath), where('userId', '==', user.uid));
    const unsubscribeProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const loadedProjects: Project[] = [];
        snapshot.forEach((docSnap) => {
          loadedProjects.push({ ...docSnap.data(), id: docSnap.id } as Project);
        });
        setProjects(loadedProjects);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, projectsPath);
      }
    );

    // Tasks query
    const tasksPath = 'tasks';
    const tasksQuery = query(collection(db, tasksPath), where('userId', '==', user.uid));
    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loadedTasks: Task[] = [];
        snapshot.forEach((docSnap) => {
          loadedTasks.push({ ...docSnap.data(), id: docSnap.id } as Task);
        });
        setTasks(loadedTasks);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, tasksPath);
      }
    );

    // Activities query
    const activitiesPath = 'activities';
    const activitiesQuery = query(collection(db, activitiesPath), where('userId', '==', user.uid));
    const unsubscribeActivities = onSnapshot(
      activitiesQuery,
      (snapshot) => {
        const loadedActivities: ActivityLog[] = [];
        snapshot.forEach((docSnap) => {
          loadedActivities.push({ ...docSnap.data(), id: docSnap.id } as ActivityLog);
        });
        loadedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(loadedActivities.slice(0, 30));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, activitiesPath);
      }
    );

    return () => {
      unsubscribeProjects();
      unsubscribeTasks();
      unsubscribeActivities();
    };
  }, [user]);

  // Log activity helper
  const logActivity = async (action: string, details: string, entityType?: string, entityId?: string) => {
    if (!user) return;
    try {
      const actId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAct: ActivityLog = {
        id: actId,
        userId: user.uid,
        action,
        details,
        entityType,
        entityId,
        timestamp: new Date().toISOString(),
      };
      await setDoc(doc(db, 'activities', actId), newAct);
    } catch (err) {
      console.warn('Could not record activity log:', err);
    }
  };

  // Seed sample data for empty new users
  const seedDemoDataIfEmpty = async () => {
    if (!user || projects.length > 0 || tasks.length > 0) return;

    try {
      const p1Id = `proj_${Date.now()}_1`;
      const p2Id = `proj_${Date.now()}_2`;
      const p3Id = `proj_${Date.now()}_3`;

      const now = new Date().toISOString();
      const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const in8Days = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const p1: Project = {
        id: p1Id,
        userId: user.uid,
        name: 'Product Design & UX',
        description: 'Design system, interactive prototypes, and usability testing',
        color: '#6366f1',
        icon: 'Palette',
        createdAt: now,
        updatedAt: now,
      };

      const p2: Project = {
        id: p2Id,
        userId: user.uid,
        name: 'Core Engineering Sprint',
        description: 'Authentication architecture, state sync, and performance optimizations',
        color: '#10b981',
        icon: 'Code',
        createdAt: now,
        updatedAt: now,
      };

      const p3: Project = {
        id: p3Id,
        userId: user.uid,
        name: 'Growth & Launch',
        description: 'Customer onboarding docs, launch checklist, and marketing assets',
        color: '#f59e0b',
        icon: 'Rocket',
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'projects', p1Id), p1);
      await setDoc(doc(db, 'projects', p2Id), p2);
      await setDoc(doc(db, 'projects', p3Id), p3);

      const demoTasks: Task[] = [
        {
          id: `task_${Date.now()}_1`,
          userId: user.uid,
          projectId: p1Id,
          title: 'Audit accessibility & color contrast',
          description: 'Ensure all primary buttons and badges meet WCAG AA contrast standards across dark and light modes.',
          status: 'done',
          priority: 'medium',
          dueDate: in2Days,
          tags: ['Design', 'Accessibility'],
          subtasks: [
            { id: 'st1', title: 'Check WCAG contrast on primary red and blue badges', completed: true },
            { id: 'st2', title: 'Verify focus ring visibility on keyboard tab', completed: true },
          ],
          completedAt: now,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: `task_${Date.now()}_2`,
          userId: user.uid,
          projectId: p2Id,
          title: 'Implement real-time Firestore listeners',
          description: 'Connect onSnapshot with optimistic state updates and error boundary triggers.',
          status: 'in_progress',
          priority: 'urgent',
          dueDate: in2Days,
          tags: ['Backend', 'Firebase'],
          subtasks: [
            { id: 'st3', title: 'Configure security rules with strict validation', completed: true },
            { id: 'st4', title: 'Hook onSnapshot for active project tasks', completed: true },
            { id: 'st5', title: 'Add offline sync fallback and toast notifications', completed: false },
          ],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: `task_${Date.now()}_3`,
          userId: user.uid,
          projectId: p1Id,
          title: 'Refine interactive Kanban board interactions',
          description: 'Enable smooth drag-and-drop column transitions and quick task creation shortcuts.',
          status: 'in_review',
          priority: 'high',
          dueDate: in5Days,
          tags: ['Frontend', 'UI'],
          subtasks: [
            { id: 'st6', title: 'Status badge transitions', completed: true },
            { id: 'st7', title: 'Column count tags and empty state placeholders', completed: true },
          ],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: `task_${Date.now()}_4`,
          userId: user.uid,
          projectId: p3Id,
          title: 'Prepare product launch checklist & changelog',
          description: 'Compile release notes, walkthrough GIF assets, and quick-start keyboard shortcut guide.',
          status: 'todo',
          priority: 'medium',
          dueDate: in8Days,
          tags: ['Docs', 'Marketing'],
          subtasks: [
            { id: 'st8', title: 'Draft keyboard shortcut cheat sheet', completed: false },
            { id: 'st9', title: 'Review mobile responsive layout', completed: false },
          ],
          createdAt: now,
          updatedAt: now,
        },
      ];

      for (const t of demoTasks) {
        await setDoc(doc(db, 'tasks', t.id), t);
      }

      await logActivity('system_seed', 'Created starter workspace with sample projects and tasks');
    } catch (err) {
      console.error('Failed to seed starter data:', err);
    }
  };

  const createTask = async (data: Partial<Task> & { title: string; projectId: string }) => {
    if (!user) throw new Error('You must be signed in to create a task');
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newTask: Task = {
      id: taskId,
      userId: user.uid,
      projectId: data.projectId,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || '',
      tags: data.tags || [],
      subtasks: data.subtasks || [],
      completedAt: data.status === 'done' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'tasks', taskId), newTask);
      await logActivity('task_created', `Created task: "${newTask.title}"`, 'task', taskId);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `tasks/${taskId}`);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) throw new Error('You must be signed in to update a task');
    const now = new Date().toISOString();
    const taskDocRef = doc(db, 'tasks', taskId);

    const payload: Partial<Task> = {
      ...updates,
      updatedAt: now,
    };

    if (updates.status === 'done' && !updates.completedAt) {
      payload.completedAt = now;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else if (updates.status && updates.status !== 'done') {
      payload.completedAt = '';
    }

    try {
      await updateDoc(taskDocRef, payload as any);
      await logActivity('task_updated', `Updated task details`, 'task', taskId);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) throw new Error('You must be signed in to delete a task');
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      await logActivity('task_deleted', `Deleted task`, 'task', taskId);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  const toggleTaskStatus = async (taskId: string, targetStatus?: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let nextStatus: TaskStatus;
    if (targetStatus) {
      nextStatus = targetStatus;
    } else {
      nextStatus = task.status === 'done' ? 'todo' : 'done';
    }

    await updateTask(taskId, { status: nextStatus });
  };

  const createProject = async (data: { name: string; description?: string; color: string; icon?: string }) => {
    if (!user) throw new Error('You must be signed in to create a project');
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newProject: Project = {
      id: projectId,
      userId: user.uid,
      name: data.name.trim(),
      description: data.description?.trim() || '',
      color: data.color || '#6366f1',
      icon: data.icon || 'Folder',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'projects', projectId), newProject);
      await logActivity('project_created', `Created project: "${newProject.name}"`, 'project', projectId);
      return projectId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${projectId}`);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!user) throw new Error('You must be signed in to update a project');
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'projects', projectId), { ...updates, updatedAt: now });
      await logActivity('project_updated', `Updated project properties`, 'project', projectId);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) throw new Error('You must be signed in to delete a project');
    try {
      // Delete project document
      await deleteDoc(doc(db, 'projects', projectId));
      // Delete or reassign tasks
      const tasksInProject = tasks.filter((t) => t.projectId === projectId);
      for (const t of tasksInProject) {
        await deleteDoc(doc(db, 'tasks', t.id));
      }
      await logActivity('project_deleted', `Deleted project and its tasks`, 'project', projectId);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Project filter
      if (filters.selectedProjectId !== 'all' && task.projectId !== filters.selectedProjectId) {
        return false;
      }
      // Status filter
      if (filters.statusFilter !== 'all' && task.status !== filters.statusFilter) {
        return false;
      }
      // Priority filter
      if (filters.priorityFilter !== 'all' && task.priority !== filters.priorityFilter) {
        return false;
      }
      // Tag filter
      if (filters.tagFilter !== 'all' && (!task.tags || !task.tags.includes(filters.tagFilter))) {
        return false;
      }
      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = task.description?.toLowerCase().includes(q) || false;
        const inTags = task.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!inTitle && !inDesc && !inTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        const dA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return filters.sortOrder === 'asc' ? dA - dB : dB - dA;
      }
      if (filters.sortBy === 'priority') {
        const order: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        const pA = order[a.priority] || 0;
        const pB = order[b.priority] || 0;
        return filters.sortOrder === 'asc' ? pB - pA : pA - pB;
      }
      if (filters.sortBy === 'title') {
        return filters.sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      // Default: createdAt
      const cA = new Date(a.createdAt).getTime();
      const cB = new Date(b.createdAt).getTime();
      return filters.sortOrder === 'asc' ? cA - cB : cB - cA;
    });
  }, [tasks, filters]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        activities,
        loading,
        filters,
        setFilters,
        viewMode,
        setViewMode,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        createProject,
        updateProject,
        deleteProject,
        seedDemoDataIfEmpty,
        activeTaskForEdit,
        setActiveTaskForEdit,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isProjectModalOpen,
        setIsProjectModalOpen,
        defaultStatusForNewTask,
        setDefaultStatusForNewTask,
        filteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
