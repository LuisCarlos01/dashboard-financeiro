import { Card } from './ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { useTransactions } from '@/contexts/TransactionContext';

export function SummaryCards() {
  const { summary } = useTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-l-4 border-entrada">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entradas</p>
            <p className="text-2xl font-bold text-entrada mt-1">
              {formatCurrency(summary.totalEntradas)}
            </p>
          </div>
          <div className="w-12 h-12 bg-entrada-light rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-entrada" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-saida">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Saídas</p>
            <p className="text-2xl font-bold text-saida mt-1">
              {formatCurrency(summary.totalSaidas)}
            </p>
          </div>
          <div className="w-12 h-12 bg-saida-light rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-saida" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        </div>
      </Card>

      <Card className={`border-l-4 ${summary.saldo >= 0 ? 'border-saldo' : 'border-saida'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
            <p className={`text-2xl font-bold mt-1 ${summary.saldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
              {formatCurrency(summary.saldo)}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${summary.saldo >= 0 ? 'bg-saldo-light' : 'bg-saida-light'}`}>
            <svg className={`w-6 h-6 ${summary.saldo >= 0 ? 'text-saldo' : 'text-saida'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}

