import type { Transaction, TransactionFilters, TransactionSummary } from '@/types/transaction.types';

export const calculationsService = {
  calculateSummary(transactions: Transaction[]): TransactionSummary {
    const totalEntradas = transactions
      .filter(t => t.tipo === 'Entrada')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalSaidas = transactions
      .filter(t => t.tipo === 'Saída')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
    };
  },

  filterTransactions(
    transactions: Transaction[],
    filters: TransactionFilters
  ): Transaction[] {
    return transactions.filter(t => {
      if (filters.dataInicio && t.data < filters.dataInicio) return false;
      if (filters.dataFim && t.data > filters.dataFim) return false;
      if (filters.tipo && t.tipo !== filters.tipo) return false;
      if (filters.categoria && t.categoria !== filters.categoria) return false;
      return true;
    });
  },

  sortByDate(transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] {
    return [...transactions].sort((a, b) => {
      const comparison = a.data.localeCompare(b.data);
      return order === 'asc' ? comparison : -comparison;
    });
  },

  sortByValue(transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] {
    return [...transactions].sort((a, b) => {
      const comparison = a.valor - b.valor;
      return order === 'asc' ? comparison : -comparison;
    });
  }
};

