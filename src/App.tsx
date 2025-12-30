import { useState } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { Transactions } from '@/pages/Transactions';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'transactions'>('home');

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
            </div>
          </div>
        </nav>

        <main>
          {currentPage === 'home' ? <Home /> : <Transactions />}
        </main>
      </div>
    </TransactionProvider>
  );
}

export default App;

