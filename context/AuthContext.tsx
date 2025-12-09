import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for password comparison
// In production, this would be a proper bcrypt comparison on a backend
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const AUTH_KEY = 'pourdecisions_authenticated';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      const { expiry } = JSON.parse(session);
      if (Date.now() < expiry) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // The password hash is set at build time via environment variable
    // For local development, you can set VITE_AUTH_PASSWORD in a .env file
    const expectedHash = import.meta.env.VITE_AUTH_PASSWORD_HASH;
    
    // If no hash is configured, accept any password (development mode)
    if (!expectedHash) {
      console.warn('No VITE_AUTH_PASSWORD_HASH configured. Authentication bypassed.');
      setIsAuthenticated(true);
      const session = { expiry: Date.now() + SESSION_DURATION };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return true;
    }

    // Hash the input and compare
    hashPassword(password).then(inputHash => {
      if (inputHash === expectedHash) {
        setIsAuthenticated(true);
        const session = { expiry: Date.now() + SESSION_DURATION };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      }
    });

    // For immediate feedback, do a sync check as well
    // This is a simplified version - the async hash is more secure
    const syncCheck = btoa(password); // Simple encoding for immediate feedback
    const expectedSimple = import.meta.env.VITE_AUTH_PASSWORD_SIMPLE;
    
    if (expectedSimple && syncCheck === expectedSimple) {
      setIsAuthenticated(true);
      const session = { expiry: Date.now() + SESSION_DURATION };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vermillion"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
