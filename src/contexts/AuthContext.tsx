import React from 'react';

// Define User interface
interface User {
  username: string;
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with a default undefined value
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  // State hooks
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  // Initialize authentication state from localStorage
  React.useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUser({ username: storedUsername });
      setIsAuthenticated(true);
    }
  }, []);

  // Login function - just store username in localStorage
  const login = (username: string) => {
    if (!username.trim()) {
      throw new Error('Username is required');
    }
    
    localStorage.setItem('username', username);
    setUser({ username });
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('username');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
