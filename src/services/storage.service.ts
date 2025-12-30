import type { Transaction, TransactionFormData } from '@/types/transaction.types';
import { generateUUID } from '@/utils/uuid';

const STORAGE_KEY = 'financeiro:lancamentos';

export const storageService = {
  getAll(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  create(transaction: TransactionFormData): Transaction {
    const transactions = this.getAll();
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
    };
    transactions.push(newTransaction);
    this.save(transactions);
    return newTransaction;
  },

  update(id: string, data: Partial<Transaction>): Transaction | null {
    const transactions = this.getAll();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    transactions[index] = { ...transactions[index], ...data };
    this.save(transactions);
    return transactions[index];
  },

  delete(id: string): boolean {
    const transactions = this.getAll();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    this.save(filtered);
    return true;
  }
};

