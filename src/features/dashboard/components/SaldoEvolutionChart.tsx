import { memo, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import type { BalancePoint } from '@/types/dashboard.types';
import { formatCurrency } from '@/utils/formatters';
import { CustomTooltip } from '@/components/charts/CustomTooltip';
import { EmptyState } from '@/components/charts/EmptyState';

interface SaldoEvolutionChartProps {
  data: BalancePoint[];
}

export const SaldoEvolutionChart = memo(function SaldoEvolutionChart({ data }: SaldoEvolutionChartProps) {
  // Se houver muitos pontos, reduzir para melhor visualização
  const displayData = useMemo(() => {
    if (data.length > 50) {
      return data.filter((_, index) => index % Math.ceil(data.length / 50) === 0);
    }
    return data;
  }, [data]);

  const minSaldo = useMemo(() => Math.min(...displayData.map(d => d.saldo)), [displayData]);
  const maxSaldo = useMemo(() => Math.max(...displayData.map(d => d.saldo)), [displayData]);

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sem dados para exibir"
        message="Não há transações registradas para o período selecionado. Tente alterar o filtro ou adicione novas transações."
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
    );
  }
  const initialSaldo = displayData[0]?.saldo ?? 0;
  const finalSaldo = displayData[displayData.length - 1]?.saldo ?? 0;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart 
          data={displayData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          aria-label="Evolução do saldo acumulado ao longo do tempo"
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="dateLabel" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
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
          <Area
            type="monotone"
            dataKey="saldo"
            stroke="#2563eb"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorBalance)"
            name="Saldo"
            dot={false}
            activeDot={{ r: 4, fill: '#2563eb' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Saldo Inicial:</span>
          <span className={`font-semibold ${initialSaldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
            {formatCurrency(initialSaldo)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Saldo Final:</span>
          <span className={`font-semibold ${finalSaldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
            {formatCurrency(finalSaldo)}
          </span>
        </div>
        {minSaldo !== maxSaldo && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Mínimo:</span>
              <span className={`font-semibold ${minSaldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
                {formatCurrency(minSaldo)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Máximo:</span>
              <span className={`font-semibold ${maxSaldo >= 0 ? 'text-saldo' : 'text-saida'}`}>
                {formatCurrency(maxSaldo)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

