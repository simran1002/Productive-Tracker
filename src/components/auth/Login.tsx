import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  UserIcon, 
  SparklesIcon, 
  TargetIcon, 
  ZapIcon,
  CheckCircleIcon
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('Username is required');
      }

      login(username);
      navigate('/tasks', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8 text-white">
          <div className="bg-white/20 rounded-full p-4 mb-4 inline-block backdrop-blur-sm">
            <TargetIcon className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <SparklesIcon className="h-8 w-8" />
            Task Tracker
          </h1>
          <p className="text-blue-100 text-lg">Your Personal Productivity Hub</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 mb-4 inline-block mx-auto">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome Back!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your username to start organizing your tasks
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200 text-red-700">
                <AlertDescription className="flex items-center gap-2">
                  <ZapIcon className="h-4 w-4" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-blue-500" />
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="✨ Enter your username..."
                  disabled={isLoading}
                  className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg py-3"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Getting Started...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    Start Tracking Tasks
                  </div>
                )}
              </Button>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-green-500" />
                    Enter any username to get started with your personal task tracker!
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <TargetIcon className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Organize Tasks</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <CheckCircleIcon className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Track Progress</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <SparklesIcon className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Stay Productive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
