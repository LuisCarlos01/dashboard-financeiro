import type { SessionData, User } from '@/types/auth.types';
import { generateUUID } from '@/utils/uuid';

const SESSION_KEY = 'financeiro:session';
const SESSION_DURATION_DAYS = 7;

export const sessionService = {
  /**
   * Cria uma nova sessão para o usuário
   */
  createSession(user: User): SessionData {
    const session: SessionData = {
      token: generateUUID(),
      user,
      expiresAt: Date.now() + (SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * Recupera a sessão ativa (se válida)
   */
  getSession(): SessionData | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;

    try {
      const session: SessionData = JSON.parse(data);

      // Verificar se sessão expirou
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      // JSON inválido
      this.clearSession();
      return null;
    }
  },

  /**
   * Verifica se existe uma sessão válida
   */
  isSessionValid(): boolean {
    return this.getSession() !== null;
  },

  /**
   * Limpa a sessão atual
   */
  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Renova a expiração da sessão atual
   */
  renewSession(): void {
    const session = this.getSession();
    if (session) {
      session.expiresAt = Date.now() + (SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  },
};

