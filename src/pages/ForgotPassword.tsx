import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ForgotPasswordForm {
  email: string;
}

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailValidated, setEmailValidated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError(null);
    setEmailValidated(false);

    try {
      // Validar email
      const isValid = authService.validateEmailForPasswordReset(data.email);
      
      if (isValid) {
        setEmailValidated(true);
      } else {
        // Por segurança, mostrar erro genérico mesmo se email não corresponder
        setError('Se o email informado estiver cadastrado, você receberá instruções.');
        // Mas ainda mostrar as instruções para não frustrar o usuário
        setEmailValidated(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Esqueci minha senha
          </h1>
          <p className="text-gray-600">
            Recupere o acesso ao seu dashboard
          </p>
        </div>

        {/* Card */}
        <Card>
          <div className="p-8">
            {!emailValidated ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido',
                      },
                    })}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Erro geral */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Botão Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Validando...' : 'Continuar'}
                </Button>

                {/* Botão Voltar */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBackToLogin}
                  className="w-full"
                  disabled={isLoading}
                >
                  Voltar para login
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Instruções */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Instruções para redefinir sua senha
                    </h3>
                    <p className="text-sm text-blue-800 mb-4">
                      Para redefinir sua senha, você precisa gerar um novo hash SHA-256 e atualizar o arquivo de configuração.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Passo 1: Gerar novo hash</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Execute o comando no terminal:
                      </p>
                      <code className="block bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                        npm run generate-hash
                      </code>
                      <p className="text-xs text-gray-500 mt-2">
                        Digite sua nova senha quando solicitado. O script gerará um hash SHA-256.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Passo 2: Atualizar configuração</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Abra o arquivo <code className="bg-gray-100 px-1 rounded">.env.local</code> na raiz do projeto e atualize:
                      </p>
                      <code className="block bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                        VITE_AUTH_PASSWORD_HASH=seu_novo_hash_aqui
                      </code>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Passo 3: Reiniciar aplicação</h4>
                      <p className="text-sm text-gray-600">
                        Se a aplicação estiver rodando, pare e inicie novamente para carregar as novas variáveis de ambiente.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Para mais detalhes, consulte a documentação em{' '}
                        <code className="bg-gray-100 px-1 rounded">docs/config-auth/SETUP_AUTH.md</code>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão Voltar */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBackToLogin}
                  className="w-full"
                >
                  Voltar para login
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

