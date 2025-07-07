import React, { useState, useEffect } from 'react';
import type { Task, TaskPriority } from '../types/task';
import { LocalStorageService } from '../services/localStorage';
import { TaskCard } from './TaskCard';
import { TaskFilter } from './TaskFilter';
import { Button } from './ui/button';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useToast } from './ui/use-toast';

const PRIORITY_OPTIONS: (TaskPriority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

interface TaskListProps {
  onOpenForm: () => void;
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onOpenForm, onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [taskCounts, setTaskCounts] = useState({ all: 0, completed: 0, pending: 0 });
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [tagFilter, setTagFilter] = useState<string>('');
  const { toast } = useToast();

  // Load tasks from localStorage
  const loadTasks = () => {
    const allTasks = LocalStorageService.getTasks();
    setTasks(allTasks);
    setTaskCounts(LocalStorageService.getTaskCounts());
  };

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  // Get filtered tasks
  const getFilteredTasks = () => {
    let filtered = LocalStorageService.getTasksByFilter(filter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(s) ||
        (task.description && task.description.toLowerCase().includes(s))
      );
    }
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    if (tagFilter) {
      filtered = filtered.filter(task => task.tags && task.tags.includes(tagFilter));
    }
    return filtered;
  };

  // Handle task completion toggle
  const handleToggleComplete = (taskId: number) => {
    const updatedTask = LocalStorageService.toggleTaskCompletion(taskId);
    if (updatedTask) {
      loadTasks(); // Reload tasks to update UI
      toast({
        title: updatedTask.completed ? 'Task Completed!' : 'Task Marked as Pending',
        description: `"${updatedTask.title}" has been ${updatedTask.completed ? 'completed' : 'marked as pending'}.`,
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: number) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete && window.confirm(`Are you sure you want to delete "${taskToDelete.title}"?`)) {
      const deleted = LocalStorageService.deleteTask(taskId);
      if (deleted) {
        loadTasks(); // Reload tasks to update UI
        toast({
          title: 'Task Deleted',
          description: `"${taskToDelete.title}" has been deleted.`,
        });
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'completed' | 'pending') => {
    setFilter(newFilter);
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-3">
              <TargetIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <SparklesIcon className="h-8 w-8" />
                My Task Tracker
              </h1>
              <p className="text-blue-100 flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                {filteredTasks.length} of {taskCounts.all} tasks • {taskCounts.completed} completed
              </p>
            </div>
          </div>
          <Button 
            onClick={onOpenForm} 
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-200 shadow-lg hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Search tasks by title or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Priority Filter */}
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as TaskPriority | 'All')}
                className="pl-10 pr-8 py-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none cursor-pointer"
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === 'All' ? '🎯 All Priorities' : `⭐ ${opt}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tag Filter */}
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={tagFilter}
                onChange={e => setTagFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">🏷️ All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <TaskFilter 
        currentFilter={filter} 
        onFilterChange={handleFilterChange}
        counts={taskCounts}
      />

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-6 mb-4 inline-block">
                  <SparklesIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  {filter === 'all' 
                    ? 'Start your productivity journey by creating your first task!' 
                    : `You don't have any ${filter} tasks at the moment.`
                  }
                </p>
                {filter === 'all' && (
                  <Button 
                    onClick={onOpenForm}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={onEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
