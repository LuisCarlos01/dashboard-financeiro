# ADR-006 - Service Layer Abstraction para Migração Futura

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

Embora o projeto seja frontend-only atualmente, há consciência de que pode precisar migrar para uma arquitetura com backend no futuro (ver ADR-001). A migração deve ser facilitada sem requerer refatoração massiva de componentes e lógica de apresentação.

A questão é: como organizar o código para que a migração seja simples e isolada?

## Decisão

Adotar uma **camada de serviços abstraída** que:

1. **Isola toda lógica de persistência e autenticação** em módulos de serviço
2. **Expõe interfaces simples** que podem ser implementadas localmente (LocalStorage) ou remotamente (API)
3. **Componentes e contextos dependem apenas dos serviços**, não de implementação específica

Estrutura:
- `src/services/auth.service.ts` - Autenticação (atualmente env vars, futuro API)
- `src/services/storage.service.ts` - CRUD de transações (atualmente LocalStorage, futuro API)
- `src/services/session.service.ts` - Gerenciamento de sessão (atualmente LocalStorage, futuro cookies/tokens)
- `src/services/calculations.service.ts` - Lógica de cálculos (pode permanecer no frontend)

**Evidência no código:**
- [`src/services/auth.service.ts`](src/services/auth.service.ts) - Comentários indicando migração futura (linhas 50-64)
- [`src/services/storage.service.ts`](src/services/storage.service.ts) - Interface que pode ser substituída por fetch()
- [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) - Usa apenas `authService`, não LocalStorage diretamente
- [`src/contexts/TransactionContext.tsx`](src/contexts/TransactionContext.tsx) - Usa apenas `storageService`, não LocalStorage diretamente

## Alternativas Consideradas

1. **Acesso Direto ao LocalStorage nos Componentes**
   - Pros: Máxima simplicidade, menos camadas
   - Contras: Migração requer mudanças em todos componentes, alto acoplamento
   - **Não escolhida:** Tornaria migração muito trabalhosa

2. **Abstração com Interfaces TypeScript**
   - Pros: Type-safe, contrato explícito, fácil mockar em testes
   - Contras: Mais boilerplate, complexidade adicional
   - **Não escolhida:** Objetos de serviço simples são suficientes

3. **Repository Pattern**
   - Pros: Padrão bem estabelecido, muito desacoplado
   - Contras: Overhead de abstração para projeto pequeno
   - **Não escolhida:** Service layer simples atende necessidades

4. **Sem Preparação para Migração**
   - Pros: Código mais simples inicialmente
   - Contras: Refatoração massiva quando precisar migrar
   - **Não escolhida:** Custo futuro muito alto

## Consequências

### ✅ Pontos Positivos

- **Migração isolada:** Apenas arquivos de serviço precisam mudar na migração
- **Componentes intactos:** Zero mudanças em componentes, páginas ou contextos
- **Testabilidade:** Fácil mockar serviços para testes
- **Clareza de responsabilidades:** Separação clara entre apresentação e persistência
- **Documentação implícita:** Comentários no código indicam caminho de migração

### ⚠️ Limitações

- **Abstração inicial:** Pode parecer overhead para projeto pequeno
- **Não garante compatibilidade perfeita:** Migração ainda requer ajustes (ex: tratamento de erros de rede)
- **Pode criar falsa sensação:** Desenvolvedores podem pensar que migração é trivial quando não é

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Migração para backend iniciada:** Ao começar implementação real do backend
2. **Necessidade de testes:** Se precisar mockar serviços para testes unitários
3. **Múltiplas fontes de dados:** Se precisar suportar LocalStorage + API simultaneamente
4. **Cache complexo:** Se precisar de estratégia de cache mais sofisticada

**Nota:** A migração real ainda requer:
- Tratamento de erros de rede
- Loading states para operações assíncronas
- Validação server-side adicional
- Autenticação real com JWT/tokens

Mas a estrutura atual minimiza o trabalho necessário, focando mudanças apenas na camada de serviços.
