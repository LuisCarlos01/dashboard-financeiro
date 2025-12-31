import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { MonthlySummary } from '@/types/dashboard.types';
import { formatCurrency } from '@/utils/formatters';
import { CustomTooltip } from '@/components/charts/CustomTooltip';
import { EmptyState } from '@/components/charts/EmptyState';

interface EntradasSaidasChartProps {
  data: MonthlySummary[];
}

export const EntradasSaidasChart = memo(function EntradasSaidasChart({ data }: EntradasSaidasChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Sem dados para exibir"
        message="Não há transações registradas para o período selecionado. Tente alterar o filtro ou adicione novas transações."
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        aria-label="Gráfico de Entradas vs Saídas por mês"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis 
          dataKey="monthLabel" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="#6b7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}k`;
            }
            return `R$ ${value}`;
          }}
        />
        <Tooltip
          content={<CustomTooltip formatter={(value, name) => [formatCurrency(value), name]} />}
        />
        <Legend />
        <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
        <Bar 
          dataKey="entradas" 
          fill="#059669" 
          name="Entradas" 
          radius={[4, 4, 0, 0]}
          aria-label="Entradas"
        />
        <Bar 
          dataKey="saidas" 
          fill="#dc2626" 
          name="Saídas" 
          radius={[4, 4, 0, 0]}
          aria-label="Saídas"
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

