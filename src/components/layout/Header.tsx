import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h1>
            <p className="text-sm text-gray-600 mt-1">Controle suas finanças pessoais</p>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="text-sm"
              >
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

