import { formatCurrency } from '@/utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey?: string;
  }>;
  label?: string;
  formatter?: (value: number, name: string) => [string, string];
}

export function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-md shadow-lg p-3 min-w-[180px]">
      {label && (
        <p className="font-semibold text-neutral-900 mb-2 border-b border-neutral-100 pb-2 text-sm">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const [formattedValue, formattedName] = formatter
            ? formatter(entry.value, entry.name)
            : [formatCurrency(entry.value), entry.name];

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-neutral-600">{formattedName}:</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 font-currency">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

