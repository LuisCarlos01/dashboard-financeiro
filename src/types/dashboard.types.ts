export interface MonthlySummary {
  month: string;        // "2025-01"
  monthLabel: string;   // "Jan/2025"
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface CategoryDistribution {
  categoria: string;
  total: number;
  porcentagem: number;
}

export interface BalancePoint {
  date: string;         // "2025-01-15"
  dateLabel: string;    // "15/01/2025"
  saldo: number;
}

export type PeriodFilterType = 'current-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'current-year' | 'this-week' | 'custom';

export interface PeriodFilter {
  type: PeriodFilterType;
  startDate?: string;
  endDate?: string;
}

