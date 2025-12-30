# ADR-004 - Gerenciamento de Estado Global com Context API

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

A aplicação precisa gerenciar estado global em duas áreas principais:

1. **Autenticação:** Estado do usuário logado, sessão ativa
2. **Transações:** Lista de transações financeiras, cálculos de resumo

O estado precisa ser acessível em múltiplos componentes sem prop drilling excessivo. A solução deve ser simples, sem adicionar complexidade desnecessária ao projeto.

## Decisão

Usar **React Context API** nativo para gerenciamento de estado global, criando dois contextos especializados:

1. **AuthContext:** Gerencia autenticação e sessão do usuário
2. **TransactionContext:** Gerencia transações financeiras e cálculos

Cada contexto expõe um hook customizado (`useAuth`, `useTransactions`) para facilitar consumo nos componentes.

**Evidência no código:**
- [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) - Estado de autenticação
- [`src/contexts/TransactionContext.tsx`](src/contexts/TransactionContext.tsx) - Estado de transações
- [`src/App.tsx`](src/App.tsx) - Uso dos contextos

## Alternativas Consideradas

1. **Redux / Redux Toolkit**
   - Pros: Padrão da indústria, DevTools poderoso, middleware para side effects
   - Contras: Boilerplate significativo, curva de aprendizado, complexidade para projeto pequeno
   - **Não escolhida:** Overhead desnecessário para escala atual do projeto

2. **Zustand**
   - Pros: API simples, menos boilerplate que Redux, performático
   - Contras: Dependência externa adicional, não nativo do React
   - **Não escolhida:** Context API já atende necessidades sem dependências

3. **Jotai / Recoil**
   - Pros: Atomic state management, otimizações automáticas
   - Contras: Dependências externas, conceitos mais complexos
   - **Não escolhida:** Complexidade adicional sem necessidade

4. **State Management por Props (Lifting State Up)**
   - Pros: Zero dependências, padrão React nativo
   - Contras: Prop drilling excessivo, difícil manutenção em escala
   - **Não escolhida:** Context API resolve prop drilling mantendo simplicidade

5. **Bibliotecas de State Management Leves (Valtio, MobX)**
   - Pros: APIs modernas, reatividade automática
   - Contras: Dependências externas, conceitos adicionais
   - **Não escolhida:** Context API é suficiente e nativo

## Consequências

### ✅ Pontos Positivos

- **Zero dependências:** Usa apenas React nativo, sem bibliotecas externas
- **Simplicidade:** API direta e fácil de entender
- **Sem boilerplate excessivo:** Menos código que Redux/Zustand
- **Separação clara:** Cada contexto tem responsabilidade única
- **Hooks customizados:** `useAuth` e `useTransactions` facilitam consumo
- **Type-safe:** TypeScript garante tipagem correta

### ⚠️ Limitações

- **Re-renders potenciais:** Mudanças no contexto podem causar re-renders em todos consumidores
- **Sem middleware:** Não há sistema nativo para side effects complexos
- **Sem DevTools avançado:** Não há ferramentas de debug como Redux DevTools
- **Escalabilidade limitada:** Pode ficar complexo com muitos contextos aninhados
- **Performance:** Para estados muito grandes ou atualizações frequentes, pode precisar otimização manual

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Problemas de performance:** Se re-renders excessivos começarem a impactar UX
2. **Estado muito complexo:** Se o estado global crescer significativamente e ficar difícil gerenciar
3. **Side effects complexos:** Se precisar de middleware para lógica assíncrona complexa
4. **Time de desenvolvimento maior:** Se múltiplos desenvolvedores trabalharem e precisarem de padrões mais rígidos
5. **Migração para Redux:** Se o projeto crescer e precisar de ferramentas mais robustas

**Nota:** A estrutura atual já usa `useMemo` e `useCallback` para otimizações básicas. Se necessário, pode-se migrar para Zustand ou Redux mantendo a mesma interface dos hooks.
