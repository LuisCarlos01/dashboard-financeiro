# ADR-005 - Modelo de Dados: Valor Sempre Positivo + Tipo Define Sinal

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

O sistema precisa representar transações financeiras que podem ser entradas (receitas) ou saídas (despesas). A modelagem precisa prevenir erros de cálculo e tornar a lógica explícita e fácil de entender.

Questão central: como representar valores negativos? Armazenar valores negativos para saídas ou sempre valores positivos com um campo separado indicando o tipo?

## Decisão

Adotar modelo onde:

1. **Campo `valor` sempre armazena número positivo** (nunca negativo)
2. **Campo `tipo` define se é "Entrada" ou "Saída"** (enum `TransactionType`)
3. **Cálculos aplicam sinal baseado no tipo** na camada de serviços

Exemplo:
- Saída de R$ 100,00 → `{ valor: 100, tipo: "Saída" }`
- Entrada de R$ 500,00 → `{ valor: 500, tipo: "Entrada" }`

**Evidência no código:**
- [`src/types/transaction.types.ts`](src/types/transaction.types.ts) - Definição do tipo `Transaction`
- [`src/services/calculations.service.ts`](src/services/calculations.service.ts) - Cálculos aplicam lógica baseada em tipo
- [`README.md`](README.md) - Documentação do modelo (linhas 117-139)

## Alternativas Consideradas

1. **Valores Negativos para Saídas**
   - Exemplo: `{ valor: -100, tipo: "Saída" }`
   - Pros: Cálculo direto (soma simples), menos campos
   - Contras: Pode gerar confusão, valores negativos podem ser acidentalmente inseridos
   - **Não escolhida:** Menos explícito, maior chance de erros

2. **Dois Campos Separados (entrada/saida)**
   - Exemplo: `{ entrada: 500, saida: 100 }`
   - Pros: Muito explícito, impossível ter ambos simultaneamente
   - Contras: Estrutura mais complexa, validação adicional necessária
   - **Não escolhida:** Overhead desnecessário, tipo único é suficiente

3. **Valor com Sinal Explícito**
   - Exemplo: `{ valor: 100, sinal: "+" | "-" }`
   - Pros: Separação clara de valor e sinal
   - Contras: Redundante com tipo, mais campos para gerenciar
   - **Não escolhida:** Tipo já carrega essa informação

4. **Valor Absoluto + Flag Booleana**
   - Exemplo: `{ valor: 100, isEntrada: true }`
   - Pros: Booleano simples
   - Contras: Menos semântico que enum, pode gerar confusão com negação
   - **Não escolhida:** Enum é mais claro e type-safe

## Consequências

### ✅ Pontos Positivos

- **Prevenção de erros:** Impossível ter valores negativos acidentalmente no banco
- **Lógica explícita:** Fica claro que tipo define o sinal, não o valor
- **Cálculos simples:** Filtro por tipo + soma direta (sem tratamento de sinal)
- **Validação facilitada:** Validação de `valor > 0` é sempre verdadeira
- **Type-safe:** TypeScript garante que tipo é sempre "Entrada" ou "Saída"
- **Legibilidade:** Código mais fácil de ler e entender

### ⚠️ Limitações

- **Cálculos sempre precisam considerar tipo:** Não pode simplesmente somar valores diretamente
- **Duas informações para representar uma:** Precisa de valor + tipo para saber o impacto financeiro
- **Validação adicional:** Precisa garantir que tipo está presente e válido

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Integração com APIs externas:** Se APIs esperarem valores negativos para saídas
2. **Migração de dados:** Se precisar importar dados de sistemas que usam valores negativos
3. **Cálculos muito complexos:** Se a lógica de cálculo baseada em tipo se tornar muito verbosa
4. **Padrões da indústria:** Se descobrir que padrão da indústria financeira é diferente

**Nota:** A decisão atual está alinhada com boas práticas de modelagem de dados financeiros, onde valores absolutos são armazenados e a semântica (entrada/saída) é mantida separadamente.
