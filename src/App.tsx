import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { Task } from './types/task';
import { LocalStorageService } from './services/localStorage';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { MoonIcon, SunIcon, LogOutIcon } from 'lucide-react';

function TaskManagerContent() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      // Validate task data
      if (!taskData.title?.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Task title is required',
          variant: 'destructive',
        });
        return;
      }
      
      // Create task using localStorage service
      const newTask = LocalStorageService.addTask({
        title: taskData.title,
        description: taskData.description,
        completed: false
      });

      toast({
        title: 'Task Created!',
        description: `"${newTask.title}" has been added to your tasks.`,
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    try {
      if (!currentTask) {
        toast({
          title: 'Error',
          description: 'No task selected for editing',
          variant: 'destructive',
        });
        return;
      }

      // Validate task data
      if (!taskData.title?.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Task title is required',
          variant: 'destructive',
        });
        return;
      }
      
      // Update task using localStorage service
      const updatedTask = LocalStorageService.updateTask(currentTask.id, {
        title: taskData.title,
        description: taskData.description
      });

      if (updatedTask) {
        toast({
          title: 'Task Updated!',
          description: `"${updatedTask.title}" has been updated successfully.`,
        });
      } else {
        throw new Error('Task not found');
      }
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Partial<Task>) => {
    if (currentTask) {
      return handleUpdateTask(taskData);
    } else {
      return handleCreateTask(taskData);
    }
  };

  const handleOpenForm = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Personal Task Tracker</h1>
              {user && (
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.username}!
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
              >
                {isDarkMode ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <TaskList
          onOpenForm={handleOpenForm}
          onEditTask={handleEditTask}
        />
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        task={currentTask}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

function TaskManagerPage() {
  return (
    <ThemeProvider>
      <TaskManagerContent />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute />
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
export { TaskManagerPage };
