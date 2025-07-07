import React, { useState, useEffect } from 'react';
import type { Task, TaskPriority } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  XIcon, 
  PlusIcon, 
  EditIcon, 
  StarIcon, 
  CalendarIcon, 
  TagIcon,
  SparklesIcon
} from 'lucide-react';

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High'];

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  task?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
      setTags(task.tags ? task.tags.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setTags('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Task title is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      await onSubmit(taskData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setTags('');
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setTags('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto max-h-screen">
      <Card className="w-full max-w-md bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 shadow-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {isEditing ? <EditIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-blue-500" />
                Title *
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="✨ Enter an amazing task title..."
                disabled={isSubmitting}
                required
                className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-green-500" />
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="📝 Add some details about your task (optional)"
                disabled={isSubmitting}
                rows={3}
                className="border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>⭐ {opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-pink-500" />
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="🏷️ e.g. work, personal, urgent"
                disabled={isSubmitting}
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isSubmitting 
                  ? (isEditing ? '🔄 Updating...' : '✨ Creating...') 
                  : (isEditing ? '💾 Update Task' : '🚀 Create Task')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
