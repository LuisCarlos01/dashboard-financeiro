import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type { Transaction, TransactionFormData, TransactionSummary } from '@/types/transaction.types';
import { storageService } from '@/services/storage.service';
import { calculationsService } from '@/services/calculations.service';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (data: TransactionFormData) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  summary: TransactionSummary;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    storageService.getAll()
  );

  const summary = useMemo(() => 
    calculationsService.calculateSummary(transactions),
    [transactions]
  );

  const addTransaction = useCallback((data: TransactionFormData) => {
    const newTransaction = storageService.create(data);
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    const success = storageService.delete(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    const updated = storageService.update(id, data);
    if (updated) {
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
    }
  }, []);

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    summary,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}

