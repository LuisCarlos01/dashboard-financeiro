import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategoryDistribution } from '@/types/dashboard.types';
import { formatCurrency } from '@/utils/formatters';

interface CategoriaDistributionChartProps {
  data: CategoryDistribution[];
  maxItems?: number;
}

const COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
];

export const CategoriaDistributionChart = memo(function CategoriaDistributionChart({ 
  data, 
  maxItems = 10 
}: CategoriaDistributionChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const limited = data.slice(0, maxItems);
    const othersTotal = data.slice(maxItems).reduce((sum, item) => sum + item.total, 0);
    
    const result = [...limited];
    if (othersTotal > 0) {
      result.push({
        categoria: 'Outros',
        total: othersTotal,
        porcentagem: data.slice(maxItems).reduce((sum, item) => sum + item.porcentagem, 0),
      });
    }
    
    return result;
  }, [data, maxItems]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Não há dados de saídas para o período selecionado</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ categoria, porcentagem }) => 
            porcentagem > 5 ? `${categoria} (${porcentagem.toFixed(1)}%)` : ''
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="total"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => {
            const item = chartData.find(d => d.categoria === value);
            return item ? `${value} (${item.porcentagem.toFixed(1)}%)` : value;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

