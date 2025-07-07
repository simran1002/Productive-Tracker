import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { TaskManagerPage } from '../../App';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const username = localStorage.getItem('username');
    const authorized = !!username || isAuthenticated;
    
    console.log('ProtectedRoute - Checking auth:', { 
      path: location.pathname,
      hasUsername: !!username, 
      isAuthenticated, 
      authorized 
    });
    
    setIsAuthorized(authorized);
    setHasChecked(true);
  }, [isAuthenticated, location.pathname]);
  
  if (!hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    console.log('Not authorized, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  console.log('User is authorized, rendering protected content');
  return <TaskManagerPage />;
};

export default ProtectedRoute;
