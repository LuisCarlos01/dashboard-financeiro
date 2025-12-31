import { Card } from './ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { useTransactions } from '@/contexts/TransactionContext';

export function SummaryCards() {
  const { summary } = useTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card variant="metric" borderAccent="income">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
              Total Entradas
            </p>
            <p className="text-2xl font-bold text-income-600 mt-1 font-currency">
              {formatCurrency(summary.totalEntradas)}
            </p>
          </div>
          <div className="w-12 h-12 bg-income-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6 text-income-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>Ícone de entradas</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </Card>

      <Card variant="metric" borderAccent="expense">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
              Total Saídas
            </p>
            <p className="text-2xl font-bold text-expense-600 mt-1 font-currency">
              {formatCurrency(summary.totalSaidas)}
            </p>
          </div>
          <div className="w-12 h-12 bg-expense-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6 text-expense-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>Ícone de saídas</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        </div>
      </Card>

      <Card variant="metric" borderAccent={summary.saldo >= 0 ? 'primary' : 'expense'}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
              Saldo Atual
            </p>
            <p className={`text-2xl font-bold mt-1 font-currency ${summary.saldo >= 0 ? 'text-primary-600' : 'text-expense-600'}`}>
              {formatCurrency(summary.saldo)}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${summary.saldo >= 0 ? 'bg-primary-100' : 'bg-expense-100'}`} aria-hidden="true">
            <svg className={`w-6 h-6 ${summary.saldo >= 0 ? 'text-primary-600' : 'text-expense-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>Ícone de saldo</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}

