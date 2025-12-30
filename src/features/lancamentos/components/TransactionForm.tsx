import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useTransactions } from '@/contexts/TransactionContext';
import type { TransactionFormData } from '@/types/transaction.types';

const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros',
];

const FORMAS_PAGAMENTO = [
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'PIX',
  'Transferência',
  'Boleto',
];

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { addTransaction } = useTransactions();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    defaultValues: {
      data: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'Saída',
      valor: 0,
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    // Garante que valor é sempre positivo
    const transactionData: TransactionFormData = {
      ...data,
      valor: Math.abs(data.valor),
    };
    
    addTransaction(transactionData);
    reset({
      data: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'Saída',
      valor: 0,
      descricao: '',
      categoria: '',
      subcategoria: '',
      forma_pagamento: '',
      observacao: '',
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Data"
          type="date"
          {...register('data', { required: 'Data é obrigatória' })}
          error={errors.data?.message}
        />

        <Select
          label="Tipo"
          {...register('tipo', { required: 'Tipo é obrigatório' })}
          error={errors.tipo?.message}
          options={[
            { value: 'Entrada', label: 'Entrada' },
            { value: 'Saída', label: 'Saída' },
          ]}
        />
      </div>

      <Input
        label="Descrição"
        {...register('descricao', { 
          required: 'Descrição é obrigatória',
          minLength: { value: 3, message: 'Descrição deve ter pelo menos 3 caracteres' }
        })}
        error={errors.descricao?.message}
        placeholder="Ex: Compra no supermercado"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Categoria"
          {...register('categoria', { required: 'Categoria é obrigatória' })}
          error={errors.categoria?.message}
          options={CATEGORIAS.map(cat => ({ value: cat, label: cat }))}
        />

        <Input
          label="Subcategoria (opcional)"
          {...register('subcategoria')}
          placeholder="Ex: Supermercado"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Valor"
          type="number"
          step="0.01"
          min="0.01"
          {...register('valor', { 
            required: 'Valor é obrigatório',
            min: { value: 0.01, message: 'Valor deve ser maior que zero' }
          })}
          error={errors.valor?.message}
          placeholder="0.00"
        />

        <Select
          label="Forma de Pagamento (opcional)"
          {...register('forma_pagamento')}
          options={FORMAS_PAGAMENTO.map(fp => ({ value: fp, label: fp }))}
        />
      </div>

      <Input
        label="Observação (opcional)"
        {...register('observacao')}
        placeholder="Notas adicionais sobre esta transação"
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => reset()}>
          Limpar
        </Button>
        <Button type="submit" variant="success">
          Adicionar Lançamento
        </Button>
      </div>
    </form>
  );
}

