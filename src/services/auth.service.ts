import type { LoginCredentials, User } from '@/types/auth.types';
import { verifyHash } from '@/utils/crypto.utils';
import { generateUUID } from '@/utils/uuid';

/**
 * Verifica credenciais contra as variáveis de ambiente
 * 
 * FASE 1 (Atual): Verificação local com env vars
 * FASE 2 (Futuro): Substituir por fetch('/api/auth/login')
 */
export const authService = {
  /**
   * Valida credenciais do usuário
   * @throws Error se credenciais inválidas
   */
  async verifyCredentials(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;

    // Obter credenciais das variáveis de ambiente
    const validEmail = import.meta.env.VITE_AUTH_EMAIL;
    const validPasswordHash = import.meta.env.VITE_AUTH_PASSWORD_HASH;
    const userName = import.meta.env.VITE_AUTH_USER_NAME || 'Usuário';

    // Validar se variáveis de ambiente estão configuradas
    if (!validEmail || !validPasswordHash) {
      throw new Error(
        'Credenciais não configuradas. Configure VITE_AUTH_EMAIL e VITE_AUTH_PASSWORD_HASH no .env.local'
      );
    }

    // Verificar email
    if (email !== validEmail) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha (hash)
    const isPasswordValid = await verifyHash(password, validPasswordHash);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    // Retornar dados do usuário
    return {
      id: generateUUID(), // Em produção, viria do backend
      email: validEmail,
      name: userName,
    };
  },

  /**
   * Valida email para reset de senha
   * @param email Email a ser validado
   * @returns true se email corresponde ao configurado, false caso contrário
   * @throws Error genérico se email não corresponder (por segurança, não revela emails válidos)
   */
  validateEmailForPasswordReset(email: string): boolean {
    const validEmail = import.meta.env.VITE_AUTH_EMAIL;

    if (!validEmail) {
      throw new Error(
        'Credenciais não configuradas. Configure VITE_AUTH_EMAIL no .env.local'
      );
    }

    // Retorna true apenas se email corresponder exatamente
    return email.toLowerCase().trim() === validEmail.toLowerCase().trim();
  },

  /**
   * PLACEHOLDER para migração futura
   * Quando houver backend, substituir verifyCredentials() por:
   * 
   * async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
   *   const res = await fetch('/api/auth/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify(credentials),
   *   });
   *   
   *   if (!res.ok) throw new Error('Login falhou');
   *   return res.json();
   * }
   */
};

