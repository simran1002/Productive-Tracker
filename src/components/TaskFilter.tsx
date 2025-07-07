import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ListIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ZapIcon
} from 'lucide-react';

interface TaskFilterProps {
  currentFilter: 'all' | 'completed' | 'pending';
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void;
  counts: {
    all: number;
    completed: number;
    pending: number;
  };
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ 
  currentFilter, 
  onFilterChange, 
  counts 
}) => {
  const filters = [
    { 
      key: 'all' as const, 
      label: 'All Tasks', 
      count: counts.all,
      icon: <ListIcon className="h-4 w-4" />,
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
    },
    { 
      key: 'pending' as const, 
      label: 'Pending', 
      count: counts.pending,
      icon: <ClockIcon className="h-4 w-4" />,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
    },
    { 
      key: 'completed' as const, 
      label: 'Completed', 
      count: counts.completed,
      icon: <CheckCircleIcon className="h-4 w-4" />,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-2 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? 'default' : 'ghost'}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
              currentFilter === filter.key 
                ? `bg-gradient-to-r ${filter.gradient} text-white shadow-lg hover:shadow-xl transform hover:scale-105` 
                : `hover:bg-gradient-to-r ${filter.bgGradient} hover:shadow-md`
            }`}
          >
            {filter.icon}
            {filter.label}
            <Badge 
              variant={currentFilter === filter.key ? 'secondary' : 'default'} 
              className={`ml-2 font-bold ${
                currentFilter === filter.key 
                  ? 'bg-white/20 text-white border-white/30' 
                  : ''
              }`}
            >
              {filter.count}
            </Badge>
            {currentFilter === filter.key && (
              <ZapIcon className="h-4 w-4 animate-pulse" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}; 