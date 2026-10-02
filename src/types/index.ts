export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  subtasks?: Subtask[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details: string;
  timestamp: string;
}

export type ViewMode = 'kanban' | 'list' | 'calendar' | 'analytics';

export interface TaskFilterOptions {
  searchQuery: string;
  selectedProjectId: string; // 'all' or specific id
  statusFilter: string; // 'all' or specific status
  priorityFilter: string; // 'all' or specific priority
  tagFilter: string; // 'all' or specific tag
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}
