import { format } from 'date-fns';
import type { Task } from '../types/task';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from "./ui/badge";
import { 
  CheckIcon, 
  EditIcon, 
  TrashIcon, 
  CalendarIcon, 
  TagIcon, 
  FlagIcon,
  ClockIcon,
  StarIcon,
  SparklesIcon
} from 'lucide-react';

function getPriorityColor(priority?: string) {
  switch (priority) {
    case 'High': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
    case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg';
    case 'Low': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
  }
}

function getPriorityIcon(priority?: string) {
  switch (priority) {
    case 'High': return <StarIcon className="h-3 w-3 mr-1" />;
    case 'Medium': return <FlagIcon className="h-3 w-3 mr-1" />;
    case 'Low': return <ClockIcon className="h-3 w-3 mr-1" />;
    default: return <FlagIcon className="h-3 w-3 mr-1" />;
  }
}

function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const formattedCreatedAt = format(new Date(task.createdAt), 'PPP p');
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'PPP') : undefined;
  const overdue = isOverdue(task.dueDate);

  return (
    <Card className={`w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      task.completed 
        ? 'opacity-75 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900' 
        : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'
    } border-2 ${task.completed ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg font-bold ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'
            } flex items-center gap-2`}>
              {task.completed && <SparklesIcon className="h-4 w-4 text-green-500" />}
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={task.completed ? 'default' : 'secondary'} className="font-semibold">
              {task.completed ? '✅ Completed' : '⏳ Pending'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task.id)}
              className={`h-10 w-10 p-0 rounded-full transition-all duration-200 ${
                task.completed 
                  ? 'bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900 dark:hover:bg-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              title={task.completed ? 'Mark as pending' : 'Mark as completed'}
            >
              <CheckIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {task.description && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-400">
            <p className={`text-sm ${
              task.completed ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
            }`}>
              📝 {task.description}
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Priority */}
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getPriorityColor(task.priority)} shadow-md`}>
            {getPriorityIcon(task.priority)}
            {task.priority || 'Medium'}
          </span>
          
          {/* Due Date */}
          {formattedDueDate && (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
              overdue 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            }`}>
              <CalendarIcon className="h-3 w-3 mr-1" />
              {overdue ? '⚠️ Overdue: ' : '📅 Due: '}{formattedDueDate}
            </span>
          )}
          
          {/* Tags */}
          {task.tags && task.tags.length > 0 && task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
              <TagIcon className="h-3 w-3 mr-1" />
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Created: {formattedCreatedAt}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-9 w-9 p-0 rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:border-blue-700 dark:text-blue-400 transition-all duration-200"
              title="Edit task"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-9 w-9 p-0 rounded-full bg-red-50 hover:bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:border-red-700 dark:text-red-400 transition-all duration-200"
              title="Delete task"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
