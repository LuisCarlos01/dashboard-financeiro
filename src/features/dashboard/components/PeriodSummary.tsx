import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import { useTransactions } from '@/contexts/TransactionContext';
import { calculationsService } from '@/services/calculations.service';
import { parseISO, isWithinInterval, subMonths } from 'date-fns';

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

  // Calcular período anterior para comparação
  const previousPeriodSummary = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevEnd = subMonths(start, 1);
    const prevStart = new Date(prevEnd.getTime() - daysDiff * 24 * 60 * 60 * 1000);

    const filtered = transactions.filter(t => {
      const date = parseISO(t.data);
      return isWithinInterval(date, { start: prevStart, end: prevEnd });
    });

    return calculationsService.calculateSummary(filtered);
  }, [transactions, startDate, endDate]);

  const periodLabel = useMemo(() => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [startDate, endDate]);

  // Calcular variações percentuais
  const entradaVariation = previousPeriodSummary.totalEntradas > 0
    ? ((periodSummary.totalEntradas - previousPeriodSummary.totalEntradas) / previousPeriodSummary.totalEntradas) * 100
    : 0;
  
  const saidaVariation = previousPeriodSummary.totalSaidas > 0
    ? ((periodSummary.totalSaidas - previousPeriodSummary.totalSaidas) / previousPeriodSummary.totalSaidas) * 100
    : 0;

  const saldoVariation = previousPeriodSummary.saldo !== 0
    ? ((periodSummary.saldo - previousPeriodSummary.saldo) / Math.abs(previousPeriodSummary.saldo)) * 100
    : 0;

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-1">
            Resumo do Período
          </h2>
          <p className="text-sm text-neutral-600">{periodLabel}</p>
        </div>
        <Badge variant="default">{periodLabel}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="metric" borderAccent="income">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
                Total Entradas
              </p>
              <p className="text-2xl font-bold text-income-600 mt-1 font-currency">
                {formatCurrency(periodSummary.totalEntradas)}
              </p>
              {previousPeriodSummary.totalEntradas > 0 && (
                <div className={`trend-indicator mt-2 ${entradaVariation >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {entradaVariation >= 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Aumento</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Redução</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  <span className="text-xs">{Math.abs(entradaVariation).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-income-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4" aria-hidden="true">
              <svg className="w-6 h-6 text-income-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <title>Ícone de entradas</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card variant="metric" borderAccent="expense">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
                Total Saídas
              </p>
              <p className="text-2xl font-bold text-expense-600 mt-1 font-currency">
                {formatCurrency(periodSummary.totalSaidas)}
              </p>
              {previousPeriodSummary.totalSaidas > 0 && (
                <div className={`trend-indicator mt-2 ${saidaVariation <= 0 ? 'trend-up' : 'trend-down'}`}>
                  {saidaVariation <= 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Redução</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Aumento</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  <span className="text-xs">{Math.abs(saidaVariation).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-expense-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4" aria-hidden="true">
              <svg className="w-6 h-6 text-expense-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <title>Ícone de saídas</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card variant="metric" borderAccent={periodSummary.saldo >= 0 ? 'primary' : 'expense'}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1">
                Saldo do Período
              </p>
              <p className={`text-2xl font-bold mt-1 font-currency ${periodSummary.saldo >= 0 ? 'text-primary-600' : 'text-expense-600'}`}>
                {formatCurrency(periodSummary.saldo)}
              </p>
              {previousPeriodSummary.saldo !== 0 && (
                <div className={`trend-indicator mt-2 ${saldoVariation >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {saldoVariation >= 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Aumento</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <title>Redução</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  <span className="text-xs">{Math.abs(saldoVariation).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-4 ${periodSummary.saldo >= 0 ? 'bg-primary-100' : 'bg-expense-100'}`} aria-hidden="true">
              <svg className={`w-6 h-6 ${periodSummary.saldo >= 0 ? 'text-primary-600' : 'text-expense-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <title>Ícone de saldo</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

