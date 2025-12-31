import { useCallback, useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import type { PeriodFilter as PeriodFilterType } from '@/types/dashboard.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PeriodFilterProps {
  value: PeriodFilterType;
  onChange: (filter: PeriodFilterType) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const [dateError, setDateError] = useState<string | null>(null);

  const handleQuickFilter = useCallback((type: PeriodFilterType['type']) => {
    const today = new Date();
    let startDate: string;
    let endDate: string;

    switch (type) {
      case 'this-week':
        startDate = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        endDate = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        break;
      case 'current-month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-month': {
        const lastMonth = subMonths(today, 1);
        startDate = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
        endDate = format(endOfMonth(lastMonth), 'yyyy-MM-dd');
        break;
      }
      case 'last-3-months':
        startDate = format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'last-6-months':
        startDate = format(startOfMonth(subMonths(today, 5)), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'current-year':
        startDate = format(startOfYear(today), 'yyyy-MM-dd');
        endDate = format(endOfYear(today), 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    setDateError(null);
    onChange({ type, startDate, endDate });
  }, [onChange]);

  const handleCustomDateChange = useCallback((field: 'startDate' | 'endDate', date: string) => {
    const newValue = {
      ...value,
      type: 'custom' as const,
      [field]: date,
    };

    // Validação: data inicial deve ser anterior à data final
    if (newValue.startDate && newValue.endDate) {
      const start = new Date(newValue.startDate);
      const end = new Date(newValue.endDate);
      
      if (start > end) {
        setDateError('A data inicial deve ser anterior à data final');
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }

    onChange(newValue);
  }, [value, onChange]);

  const getPeriodTooltip = useCallback((type: PeriodFilterType['type']) => {
    const today = new Date();
    let startDate: string;
    let endDate: string;

    switch (type) {
      case 'this-week':
        startDate = format(startOfWeek(today, { weekStartsOn: 1 }), 'dd/MM/yyyy');
        endDate = format(endOfWeek(today, { weekStartsOn: 1 }), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      case 'current-month':
        startDate = format(startOfMonth(today), 'dd/MM/yyyy');
        endDate = format(endOfMonth(today), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      case 'last-month': {
        const lastMonth = subMonths(today, 1);
        startDate = format(startOfMonth(lastMonth), 'dd/MM/yyyy');
        endDate = format(endOfMonth(lastMonth), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      }
      case 'last-3-months':
        startDate = format(startOfMonth(subMonths(today, 2)), 'dd/MM/yyyy');
        endDate = format(endOfMonth(today), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      case 'last-6-months':
        startDate = format(startOfMonth(subMonths(today, 5)), 'dd/MM/yyyy');
        endDate = format(endOfMonth(today), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      case 'current-year':
        startDate = format(startOfYear(today), 'dd/MM/yyyy');
        endDate = format(endOfYear(today), 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
      default:
        return '';
    }
  }, []);

  return (
    <div className="mb-6" role="region" aria-label="Filtros de período">
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Períodos rápidos">
        <Button
          variant={value.type === 'this-week' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('this-week')}
          type="button"
          title={getPeriodTooltip('this-week')}
          aria-pressed={value.type === 'this-week'}
          aria-label={`Esta Semana: ${getPeriodTooltip('this-week')}`}
        >
          Esta Semana
        </Button>
        <Button
          variant={value.type === 'current-month' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('current-month')}
          type="button"
          title={getPeriodTooltip('current-month')}
          aria-pressed={value.type === 'current-month'}
          aria-label={`Mês Atual: ${getPeriodTooltip('current-month')}`}
        >
          Mês Atual
        </Button>
        <Button
          variant={value.type === 'last-month' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('last-month')}
          type="button"
          title={getPeriodTooltip('last-month')}
          aria-pressed={value.type === 'last-month'}
          aria-label={`Mês Passado: ${getPeriodTooltip('last-month')}`}
        >
          Mês Passado
        </Button>
        <Button
          variant={value.type === 'last-3-months' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('last-3-months')}
          type="button"
          title={getPeriodTooltip('last-3-months')}
          aria-pressed={value.type === 'last-3-months'}
          aria-label={`Últimos 3 Meses: ${getPeriodTooltip('last-3-months')}`}
        >
          Últimos 3 Meses
        </Button>
        <Button
          variant={value.type === 'last-6-months' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('last-6-months')}
          type="button"
          title={getPeriodTooltip('last-6-months')}
          aria-pressed={value.type === 'last-6-months'}
          aria-label={`Últimos 6 Meses: ${getPeriodTooltip('last-6-months')}`}
        >
          Últimos 6 Meses
        </Button>
        <Button
          variant={value.type === 'current-year' ? 'primary' : 'outline'}
          onClick={() => handleQuickFilter('current-year')}
          type="button"
          title={getPeriodTooltip('current-year')}
          aria-pressed={value.type === 'current-year'}
          aria-label={`Ano Atual: ${getPeriodTooltip('current-year')}`}
        >
          Ano Atual
        </Button>
        <Button
          variant={value.type === 'custom' ? 'primary' : 'outline'}
          onClick={() => onChange({ type: 'custom', startDate: value.startDate, endDate: value.endDate })}
          type="button"
          aria-pressed={value.type === 'custom'}
          aria-label="Período personalizado"
        >
          Personalizado
        </Button>
      </div>

      {value.type === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="group" aria-label="Período personalizado">
          <div>
            <Input
              label="Data Inicial"
              type="date"
              value={value.startDate || ''}
              onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
              max={value.endDate || undefined}
              aria-required="true"
              aria-describedby={dateError ? 'date-error' : undefined}
            />
          </div>
          <div>
            <Input
              label="Data Final"
              type="date"
              value={value.endDate || ''}
              onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
              min={value.startDate || undefined}
              aria-required="true"
              aria-describedby={dateError ? 'date-error' : undefined}
            />
          </div>
          {dateError && (
            <div className="col-span-full">
              <p id="date-error" className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
                {dateError}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

