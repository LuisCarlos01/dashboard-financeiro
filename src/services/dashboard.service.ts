import type { Transaction } from '@/types/transaction.types';
import type { MonthlySummary, CategoryDistribution, BalancePoint } from '@/types/dashboard.types';
import { format, parseISO, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dashboardService = {
  /**
   * Agrupa transações por mês
   */
  groupByMonth(transactions: Transaction[]): Map<string, Transaction[]> {
    const grouped = new Map<string, Transaction[]>();
    
    transactions.forEach(transaction => {
      const date = parseISO(transaction.data);
      const monthKey = format(date, 'yyyy-MM');
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(transaction);
    });
    
    return grouped;
  },

  /**
   * Retorna resumo mensal de entradas e saídas
   */
  getMonthlySummary(
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): MonthlySummary[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Filtrar transações no intervalo
    const filtered = transactions.filter(t => {
      const date = parseISO(t.data);
      return isWithinInterval(date, { start, end });
    });
    
    // Gerar todos os meses no intervalo
    const months = eachMonthOfInterval({ start, end });
    
    // Agrupar transações por mês
    const grouped = this.groupByMonth(filtered);
    
    // Calcular resumo para cada mês
    return months.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const monthTransactions = grouped.get(monthKey) || [];
      
      const entradas = monthTransactions
        .filter(t => t.tipo === 'Entrada')
        .reduce((sum, t) => sum + t.valor, 0);
      
      const saidas = monthTransactions
        .filter(t => t.tipo === 'Saída')
        .reduce((sum, t) => sum + t.valor, 0);
      
      return {
        month: monthKey,
        monthLabel: format(month, 'MMM/yyyy', { locale: ptBR }),
        entradas,
        saidas,
        saldo: entradas - saidas,
      };
    });
  },

  /**
   * Retorna distribuição de gastos por categoria (apenas saídas)
   */
  getCategoryDistribution(
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): CategoryDistribution[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Filtrar apenas saídas no intervalo
    const saidas = transactions.filter(t => {
      if (t.tipo !== 'Saída') return false;
      const date = parseISO(t.data);
      return isWithinInterval(date, { start, end });
    });
    
    // Agrupar por categoria
    const categoryMap = new Map<string, number>();
    
    saidas.forEach(transaction => {
      const categoria = transaction.categoria || 'Sem categoria';
      const current = categoryMap.get(categoria) || 0;
      categoryMap.set(categoria, current + transaction.valor);
    });
    
    // Calcular total para porcentagem
    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
    
    // Converter para array e calcular porcentagens
    const distribution: CategoryDistribution[] = Array.from(categoryMap.entries())
      .map(([categoria, totalCategoria]) => ({
        categoria,
        total: totalCategoria,
        porcentagem: total > 0 ? (totalCategoria / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total); // Ordenar por total decrescente
    
    return distribution;
  },

  /**
   * Retorna evolução do saldo acumulado ao longo do tempo
   */
  getBalanceEvolution(
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): BalancePoint[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Filtrar transações no intervalo e ordenar por data
    const filtered = transactions
      .filter(t => {
        const date = parseISO(t.data);
        return isWithinInterval(date, { start, end });
      })
      .sort((a, b) => a.data.localeCompare(b.data));
    
    // Calcular saldo acumulado
    let saldoAcumulado = 0;
    const balancePoints: BalancePoint[] = [];
    
    filtered.forEach(transaction => {
      if (transaction.tipo === 'Entrada') {
        saldoAcumulado += transaction.valor;
      } else {
        saldoAcumulado -= transaction.valor;
      }
      
      balancePoints.push({
        date: transaction.data,
        dateLabel: format(parseISO(transaction.data), 'dd/MM/yyyy', { locale: ptBR }),
        saldo: saldoAcumulado,
      });
    });
    
    // Se não houver transações, retornar ponto inicial
    if (balancePoints.length === 0) {
      return [{
        date: startDate,
        dateLabel: format(start, 'dd/MM/yyyy', { locale: ptBR }),
        saldo: 0,
      }];
    }
    
    return balancePoints;
  },
};

