import { memo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { BalancePoint } from '@/types/dashboard.types';
import { formatCurrency } from '@/utils/formatters';

interface SaldoEvolutionChartProps {
  data: BalancePoint[];
}

export const SaldoEvolutionChart = memo(function SaldoEvolutionChart({ data }: SaldoEvolutionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Não há dados para o período selecionado</p>
      </div>
    );
  }

  // Se houver muitos pontos, reduzir para melhor visualização
  const displayData = data.length > 50 
    ? data.filter((_, index) => index % Math.ceil(data.length / 50) === 0)
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="dateLabel" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
          interval="preserveStartEnd"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}k`;
            }
            return `R$ ${value}`;
          }}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="saldo"
          stroke="#3b82f6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorSaldo)"
          name="Saldo"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

