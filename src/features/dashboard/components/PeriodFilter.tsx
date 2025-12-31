import { useCallback } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import type { PeriodFilter as PeriodFilterType } from '@/types/dashboard.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PeriodFilterProps {
  value: PeriodFilterType;
  onChange: (filter: PeriodFilterType) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const handleQuickFilter = useCallback((type: PeriodFilterType['type']) => {
    const today = new Date();
    let startDate: string;
    let endDate: string;

    switch (type) {
      case 'current-month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-3-months':
        startDate = format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-6-months':
        startDate = format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    onChange({ type, startDate, endDate });
  }, [onChange]);

  const handleCustomDateChange = useCallback((field: 'startDate' | 'endDate', date: string) => {
    onChange({
      ...value,
      type: 'custom',
      [field]: date,
    });
  }, [value, onChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={value.type === 'current-month' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('current-month')}
          type="button"
        >
          Mês Atual
        </Button>
        <Button
          variant={value.type === 'last-3-months' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('last-3-months')}
          type="button"
        >
          Últimos 3 Meses
        </Button>
        <Button
          variant={value.type === 'last-6-months' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('last-6-months')}
          type="button"
        >
          Últimos 6 Meses
        </Button>
        <Button
          variant={value.type === 'custom' ? 'primary' : 'outline'}
          onClick={() => onChange({ type: 'custom', startDate: value.startDate, endDate: value.endDate })}
          type="button"
        >
          Personalizado
        </Button>
      </div>

      {value.type === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data Inicial"
            type="date"
            value={value.startDate || ''}
            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
          />
          <Input
            label="Data Final"
            type="date"
            value={value.endDate || ''}
            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

