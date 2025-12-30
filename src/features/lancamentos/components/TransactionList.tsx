import { useState, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { calculationsService } from '@/services/calculations.service';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { TransactionFilters } from '@/types/transaction.types';

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

type SortField = 'data' | 'valor';
type SortOrder = 'asc' | 'desc';

export function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSorted = useMemo(() => {
    let result = calculationsService.filterTransactions(transactions, filters);
    
    if (sortField === 'data') {
      result = calculationsService.sortByDate(result, sortOrder);
    } else if (sortField === 'valor') {
      result = calculationsService.sortByValue(result, sortOrder);
    }
    
    return result;
  }, [transactions, filters, sortField, sortOrder]);

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      deleteTransaction(id);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Listagem de Lançamentos</h2>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Data Início"
            type="date"
            value={filters.dataInicio || ''}
            onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
          />
          <Input
            label="Data Fim"
            type="date"
            value={filters.dataFim || ''}
            onChange={(e) => handleFilterChange('dataFim', e.target.value)}
          />
          <Select
            label="Tipo"
            value={filters.tipo || ''}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            options={[
              { value: 'Entrada', label: 'Entrada' },
              { value: 'Saída', label: 'Saída' },
            ]}
          />
          <Select
            label="Categoria"
            value={filters.categoria || ''}
            onChange={(e) => handleFilterChange('categoria', e.target.value)}
            options={CATEGORIAS.map(cat => ({ value: cat, label: cat }))}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredAndSorted.length} lançamento(s) encontrado(s)
          </p>
          <Button variant="secondary" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhum lançamento encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('data')}
                >
                  Data {sortField === 'data' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('valor')}
                >
                  Valor {sortField === 'valor' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSorted.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.data)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.descricao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.categoria}
                    {transaction.subcategoria && (
                      <span className="text-xs text-gray-400"> / {transaction.subcategoria}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.tipo === 'Entrada'
                          ? 'bg-entrada-light text-entrada'
                          : 'bg-saida-light text-saida'
                      }`}
                    >
                      {transaction.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        transaction.tipo === 'Entrada' ? 'text-entrada' : 'text-saida'
                      }
                    >
                      {transaction.tipo === 'Entrada' ? '+' : '-'}
                      {formatCurrency(transaction.valor)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-xs py-1 px-2"
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

