import React, { createContext, useContext, useEffect, useState } from 'react';
import { TOKEN } from '@/constants';
import { getUserFromToken, type JWTPayload } from '@/lib/jwt';

interface AuthContextType {
  user: JWTPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSalesUser: boolean;
  isCustomerUser: boolean;
  userCustomerId: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      const userData = getUserFromToken(token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token is invalid or expired
        logout();
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const login = (token: string) => {
    localStorage.setItem(TOKEN, token);
    refreshUser();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem('user');
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const isSalesUser = user?.role === 'sales';
  const isCustomerUser = user?.role === 'customer';
  const userCustomerId = user?.customer_id || null;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isSalesUser,
    isCustomerUser,
    userCustomerId,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
