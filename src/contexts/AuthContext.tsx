import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { sessionService } from '@/services/session.service';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão existente no mount
  useEffect(() => {
    const session = sessionService.getSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Verificar credenciais
    const userData = await authService.verifyCredentials(credentials);

    // Calcular duração da sessão: 365 dias se "Lembrar-me" marcado, senão 7 dias padrão
    const durationDays = credentials.rememberMe ? 365 : 7;

    // Criar sessão
    const session = sessionService.createSession(userData, durationDays);

    // Atualizar estado
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    sessionService.clearSession();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para consumir o contexto de autenticação
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

