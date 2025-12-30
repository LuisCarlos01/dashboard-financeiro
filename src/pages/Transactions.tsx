import { Container } from '@/components/layout/Container';
import { TransactionList } from '@/features/lancamentos/components/TransactionList';

export function Transactions() {
  return (
    <Container>
      <TransactionList />
    </Container>
  );
}

