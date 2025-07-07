import type { Task, TaskPriority } from '../types/task';

const TASKS_STORAGE_KEY = 'tasks';

export interface LocalStorageTask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

export class LocalStorageService {
  // Get all tasks from localStorage
  static getTasks(): LocalStorageTask[] {
    try {
      const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  }

  // Save tasks to localStorage
  static saveTasks(tasks: LocalStorageTask[]): void {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  // Add a new task
  static addTask(task: Omit<LocalStorageTask, 'id' | 'createdAt'>): LocalStorageTask {
    const tasks = this.getTasks();
    const newTask: LocalStorageTask = {
      ...task,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
      priority: task.priority || 'Medium',
      tags: task.tags || [],
    };
    if (!newTask.dueDate) delete newTask.dueDate;
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  // Update an existing task
  static updateTask(id: number, updates: Partial<LocalStorageTask>): LocalStorageTask | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  // Delete a task
  static deleteTask(id: number): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      return false; // Task not found
    }
    
    this.saveTasks(filteredTasks);
    return true;
  }

  // Toggle task completion status
  static toggleTaskCompletion(id: number): LocalStorageTask | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  // Get tasks by filter
  static getTasksByFilter(filter: 'all' | 'completed' | 'pending'): LocalStorageTask[] {
    const tasks = this.getTasks();
    
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }

  // Get task counts for each filter
  static getTaskCounts(): { all: number; completed: number; pending: number } {
    const tasks = this.getTasks();
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    
    return {
      all: tasks.length,
      completed,
      pending
    };
  }

  // Clear all tasks (for testing/reset)
  static clearAllTasks(): void {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  }
} 