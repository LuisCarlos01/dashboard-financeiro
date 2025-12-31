import { useMemo, useState, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useTransactions } from '@/contexts/TransactionContext';
import { dashboardService } from '@/services/dashboard.service';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { PeriodFilter } from './components/PeriodFilter';
import { EntradasSaidasChart } from './components/EntradasSaidasChart';
import { CategoriaDistributionChart } from './components/CategoriaDistributionChart';
import { SaldoEvolutionChart } from './components/SaldoEvolutionChart';
import type { PeriodFilter as PeriodFilterType } from '@/types/dashboard.types';

export function DashboardPage() {
  const { transactions } = useTransactions();
  
  // Inicializar filtro com mês atual
  const getInitialFilter = useCallback((): PeriodFilterType => {
    const today = new Date();
    return {
      type: 'current-month',
      startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
    };
  }, []);

  const [periodFilter, setPeriodFilter] = useState<PeriodFilterType>(getInitialFilter);

  // Calcular datas do filtro
  const { startDate, endDate } = useMemo(() => {
    if (periodFilter.type === 'custom' && periodFilter.startDate && periodFilter.endDate) {
      return {
        startDate: periodFilter.startDate,
        endDate: periodFilter.endDate,
      };
    }

    const today = new Date();
    let start: string;
    let end: string;

    switch (periodFilter.type) {
      case 'current-month':
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-3-months':
        start = format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-6-months':
        start = format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      default:
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
    }

    return { startDate: start, endDate: end };
  }, [periodFilter]);

  // Agregações memoizadas
  const monthlyData = useMemo(
    () => dashboardService.getMonthlySummary(transactions, startDate, endDate),
    [transactions, startDate, endDate]
  );

  const categoryData = useMemo(
    () => dashboardService.getCategoryDistribution(transactions, startDate, endDate),
    [transactions, startDate, endDate]
  );

  const balanceData = useMemo(
    () => dashboardService.getBalanceEvolution(transactions, startDate, endDate),
    [transactions, startDate, endDate]
  );

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Analítico</h1>
        <p className="text-gray-600">Visualize suas finanças através de gráficos e análises</p>
      </div>

      <Card className="mb-6">
        <PeriodFilter value={periodFilter} onChange={setPeriodFilter} />
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Entradas vs Saídas</h2>
        <EntradasSaidasChart data={monthlyData} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição por Categoria</h2>
          <CategoriaDistributionChart data={categoryData} maxItems={8} />
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Evolução do Saldo</h2>
          <SaldoEvolutionChart data={balanceData} />
        </Card>
      </div>
    </Container>
  );
}

