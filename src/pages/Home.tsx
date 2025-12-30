import { Container } from '@/components/layout/Container';
import { SummaryCards } from '@/components/SummaryCards';
import { Card } from '@/components/ui/Card';
import { TransactionForm } from '@/features/lancamentos/components/TransactionForm';

export function Home() {
  return (
    <Container>
      <SummaryCards />
      
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Novo Lançamento</h2>
        <TransactionForm />
      </Card>
    </Container>
  );
}

