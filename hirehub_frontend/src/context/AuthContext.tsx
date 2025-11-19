import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  usuario: string;
  tipo: 'CANDIDATO' | 'EMPRESA';
}

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userToken: null,
  user: null,
  login: () => {}, 
  logout: () => {}, 
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const isAuthenticated = !!userToken;

  useEffect(() => {
    if (userToken) {
      localStorage.setItem('authToken', userToken);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, [userToken]);

  const login = (token: string) => {
    setUserToken(token);
    
    // Extraer información del usuario del token
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const userData: User = {
          id: payload.id,
          usuario: payload.usuario,
          tipo: payload.tipo
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    userToken,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};