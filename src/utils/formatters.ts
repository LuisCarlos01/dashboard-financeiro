import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  try {
    // Se já está no formato YYYY-MM-DD, usa parseISO
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    }
    // Caso contrário, tenta criar uma data diretamente
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateString; // Retorna a string original em caso de erro
  }
};

export const formatDateInput = (dateString: string): string => {
  // Converte de YYYY-MM-DD para input[type="date"]
  return dateString;
};

export const parseDateInput = (dateString: string): string => {
  // Garante formato YYYY-MM-DD
  return dateString;
};

