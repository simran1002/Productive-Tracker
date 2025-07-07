export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  priority?: TaskPriority;
  dueDate?: string; // ISO string
  tags?: string[];
}
