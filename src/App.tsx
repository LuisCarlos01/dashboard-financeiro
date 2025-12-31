import { useState } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { Transactions } from '@/pages/Transactions';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { Login } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'transactions' | 'dashboard'>('home');

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'home'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => setCurrentPage('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lançamentos
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </nav>

        <main>
          {currentPage === 'home' && <Home />}
          {currentPage === 'transactions' && <Transactions />}
          {currentPage === 'dashboard' && <DashboardPage />}
        </main>
      </div>
    </TransactionProvider>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'forgot-password'>('login');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Auth guard
  if (!isAuthenticated) {
    if (authPage === 'forgot-password') {
      return <ForgotPassword onBackToLogin={() => setAuthPage('login')} />;
    }
    return <Login onForgotPassword={() => setAuthPage('forgot-password')} />;
  }

  // Authenticated - show dashboard
  return <AppContent />;
}

export default App;

