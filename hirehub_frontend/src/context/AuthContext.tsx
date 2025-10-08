import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userToken: null,
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
  
  const isAuthenticated = !!userToken;

  useEffect(() => {
    if (userToken) {
      localStorage.setItem('authToken', userToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [userToken]);

  const login = (token: string) => {
    setUserToken(token);
  };

  const logout = () => {
    setUserToken(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    userToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};