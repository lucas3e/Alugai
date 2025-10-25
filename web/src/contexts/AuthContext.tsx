import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { Usuario, LoginRequest, RegisterRequest } from '../types';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => void;
  updateUser: (user: Usuario) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(data: LoginRequest) {
    try {
      const response = await authService.login(data);
      setUser(response.usuario);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(data: RegisterRequest) {
    try {
      const response = await authService.register(data);
      setUser(response.usuario);
    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    authService.logout();
    setUser(null);
  }

  function updateUser(updatedUser: Usuario) {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
