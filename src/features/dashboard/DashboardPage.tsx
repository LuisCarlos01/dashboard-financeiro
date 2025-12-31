import { useMemo, useState, useCallback, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { useTransactions } from '@/contexts/TransactionContext';
import { dashboardService } from '@/services/dashboard.service';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { PeriodFilter } from './components/PeriodFilter';
import { PeriodSummary } from './components/PeriodSummary';
import { EntradasSaidasChart } from './components/EntradasSaidasChart';
import { CategoriaDistributionChart } from './components/CategoriaDistributionChart';
import { SaldoEvolutionChart } from './components/SaldoEvolutionChart';
import { ChartSkeleton } from '@/components/charts/ChartSkeleton';
import type { PeriodFilter as PeriodFilterType } from '@/types/dashboard.types';

export function DashboardPage() {
  const { transactions } = useTransactions();
  const [isCalculating, setIsCalculating] = useState(false);
  
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
      case 'this-week':
        start = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        end = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        break;
      case 'current-month':
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-month':
        const lastMonth = subMonths(today, 1);
        start = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
        end = format(endOfMonth(lastMonth), 'yyyy-MM-dd');
        break;
      case 'last-3-months':
        start = format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-6-months':
        start = format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'current-year':
        start = format(startOfYear(today), 'yyyy-MM-dd');
        end = format(endOfYear(today), 'yyyy-MM-dd');
        break;
      default:
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
    }

    return { startDate: start, endDate: end };
  }, [periodFilter]);

  // Mostrar loading quando filtro muda
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setIsCalculating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [periodFilter, transactions]);

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
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Analítico</h1>
        <p className="text-gray-600">Visualize suas finanças através de gráficos e análises</p>
      </header>

      <Card className="mb-6">
        <PeriodFilter value={periodFilter} onChange={setPeriodFilter} />
      </Card>

      <PeriodSummary startDate={startDate} endDate={endDate} />

      <section className="mb-6" aria-label="Gráfico de entradas e saídas">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Entradas vs Saídas</h2>
          {isCalculating ? (
            <ChartSkeleton />
          ) : (
            <EntradasSaidasChart data={monthlyData} />
          )}
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" aria-label="Análises detalhadas">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição por Categoria</h2>
          {isCalculating ? (
            <ChartSkeleton />
          ) : (
            <CategoriaDistributionChart data={categoryData} maxItems={8} />
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Evolução do Saldo</h2>
          {isCalculating ? (
            <ChartSkeleton />
          ) : (
            <SaldoEvolutionChart data={balanceData} />
          )}
        </Card>
      </section>
    </Container>
  );
}

