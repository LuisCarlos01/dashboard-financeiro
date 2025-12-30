export type TransactionType = 'Entrada' | 'Saída';

export interface Transaction {
  id: string;
  data: string; // ISO Date string (YYYY-MM-DD)
  descricao: string;
  categoria: string;
  subcategoria?: string;
  tipo: TransactionType;
  valor: number; // Sempre positivo
  forma_pagamento?: string;
  observacao?: string;
}

export type TransactionFormData = Omit<Transaction, 'id'>;

export interface TransactionFilters {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TransactionType;
  categoria?: string;
}

export interface TransactionSummary {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
}

