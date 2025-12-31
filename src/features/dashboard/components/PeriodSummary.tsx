import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import { useTransactions } from '@/contexts/TransactionContext';
import { calculationsService } from '@/services/calculations.service';
import { parseISO, isWithinInterval } from 'date-fns';

interface PeriodSummaryProps {
  startDate: string;
  endDate: string;
}

export function PeriodSummary({ startDate, endDate }: PeriodSummaryProps) {
  const { transactions } = useTransactions();

  const periodSummary = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const filtered = transactions.filter(t => {
      const date = parseISO(t.data);
      return isWithinInterval(date, { start, end });
    });

    return calculationsService.calculateSummary(filtered);
  }, [transactions, startDate, endDate]);

  const periodLabel = useMemo(() => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [startDate, endDate]);

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          Resumo do Período
        </h2>
        <p className="text-sm text-gray-500">{periodLabel}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-entrada">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entradas</p>
              <p className="text-2xl font-bold text-entrada mt-1">
                {formatCurrency(periodSummary.totalEntradas)}
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
                {formatCurrency(periodSummary.totalSaidas)}
              </p>
            </div>
            <div className="w-12 h-12 bg-saida-light rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-saida" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className={`border-l-4 ${periodSummary.saldo >= 0 ? 'border-saldo' : 'border-saida'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo do Período</p>
              <p className={`text-2xl font-bold mt-1 ${periodSummary.saldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
                {formatCurrency(periodSummary.saldo)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${periodSummary.saldo >= 0 ? 'bg-saldo-light' : 'bg-saida-light'}`}>
              <svg className={`w-6 h-6 ${periodSummary.saldo >= 0 ? 'text-saldo' : 'text-saida'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

