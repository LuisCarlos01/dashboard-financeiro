import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { CategoryDistribution } from '@/types/dashboard.types';
import { formatCurrency } from '@/utils/formatters';
import { CustomTooltip } from '@/components/charts/CustomTooltip';
import { EmptyState } from '@/components/charts/EmptyState';

interface CategoriaDistributionChartProps {
  data: CategoryDistribution[];
  maxItems?: number;
}

// Paleta de 12 cores para categorias (consistente e acessível)
const CATEGORY_COLORS = [
  '#2563eb', // primary-600 (azul)
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#dc2626', // expense-600 (vermelho)
  '#ea580c', // warning-600 (laranja)
  '#ca8a04', // yellow-600
  '#16a34a', // success-600 (verde)
  '#059669', // income-600 (verde esmeralda)
  '#0891b2', // cyan-600
  '#0284c7', // info-600 (azul claro)
  '#6366f1', // indigo-600
  '#8b5cf6', // violet-500
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

  const useBarChart = chartData.length > 6;

  if (chartData.length === 0) {
    return (
      <EmptyState
        title="Sem gastos no período"
        message="Não há transações de saída registradas para o período selecionado. Tente alterar o filtro ou adicione novas transações."
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    );
  }

  if (useBarChart) {
    // Usar gráfico de barras horizontais quando há muitas categorias
    return (
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            aria-label="Distribuição de gastos por categoria"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
            <YAxis 
              type="category" 
              dataKey="categoria" 
              stroke="#6b7280"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip formatter={(value, name) => [formatCurrency(value), name]} />}
            />
            <Bar 
              dataKey="total" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              aria-label="Total por categoria"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700 mb-2">Detalhamento:</p>
          {chartData.map((item, index) => (
            <div key={item.categoria} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                />
                <span className="text-gray-700">{item.categoria}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{item.porcentagem.toFixed(1)}%</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart aria-label="Distribuição de gastos por categoria">
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
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip formatter={(value, name) => [formatCurrency(value), name]} />}
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

