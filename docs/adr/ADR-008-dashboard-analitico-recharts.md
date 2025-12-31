# ADR-008 - Dashboard Analítico com Recharts

- **Status:** Aceito
- **Data:** 31/12/2025

## Contexto

Com o MVP do dashboard financeiro funcionando (lançamentos, categorias, cálculos de resumo), surge a necessidade de **visualizar os dados através de gráficos** para facilitar análise e tomada de decisões financeiras.

O projeto precisa de:
1. **Visualização temporal:** entradas vs saídas ao longo do tempo (mensal)
2. **Análise de gastos:** distribuição por categoria
3. **Evolução patrimonial:** saldo acumulado ao longo do tempo
4. **Filtros de período:** permitir análise de intervalos específicos

A questão central é: como implementar gráficos mantendo a arquitetura frontend-only, respeitando o Service Layer, e sem introduzir complexidade desnecessária?

## Decisão

Implementar **Dashboard Analítico** usando **Recharts** como biblioteca de gráficos, com agregação de dados isolada em service layer.

### Arquitetura

```
TransactionContext (fonte de dados)
         ↓
dashboard.service.ts (agregações)
         ↓
DashboardPage (orquestração + memoização)
         ↓
Chart Components (apresentação pura)
```

### Componentes Implementados

1. **`dashboard.service.ts`** - Service layer para agregações
   - `getMonthlySummary()` - agrupa transações por mês
   - `getCategoryDistribution()` - calcula distribuição de gastos por categoria
   - `getBalanceEvolution()` - calcula saldo acumulado ao longo do tempo

2. **`dashboard.types.ts`** - Tipos TypeScript
   - `MonthlySummary`, `CategoryDistribution`, `BalancePoint`, `PeriodFilter`

3. **`PeriodFilter`** - Componente de filtro de período
   - Filtros rápidos: mês atual, últimos 3/6 meses
   - Modo customizado com date pickers

4. **Componentes de Gráficos** (React.memo aplicado)
   - `EntradasSaidasChart` - gráfico de barras (entradas vs saídas)
   - `CategoriaDistributionChart` - gráfico de pizza (gastos por categoria)
   - `SaldoEvolutionChart` - gráfico de área (evolução do saldo)

5. **`DashboardPage`** - Página principal
   - Integra todos os componentes
   - Usa `useMemo` para cálculos de agregação
   - Gerencia estado do filtro de período

**Evidência no código:**
- [`src/services/dashboard.service.ts`](../../src/services/dashboard.service.ts) - Agregações de dados
- [`src/types/dashboard.types.ts`](../../src/types/dashboard.types.ts) - Tipos do dashboard
- [`src/features/dashboard/`](../../src/features/dashboard/) - Componentes do dashboard
- [`src/App.tsx`](../../src/App.tsx) - Integração na navegação

## Alternativas Consideradas

### 1. Chart.js + react-chartjs-2

- **Pros:** Biblioteca mais madura, comunidade grande, documentação extensa
- **Contras:** 
  - Wrapper `react-chartjs-2` adiciona camada de abstração
  - API imperativa menos idiomática no React
  - Tipagem TypeScript menos robusta
  - Bundle size maior sem tree-shaking adequado
- **Não escolhida:** Recharts oferece melhor integração com React e TypeScript

### 2. Victory Charts

- **Pros:** API React nativa, altamente customizável
- **Contras:** 
  - Bundle size significativamente maior
  - Performance inferior com muitos pontos de dados
  - Curva de aprendizado maior
- **Não escolhida:** Overhead desnecessário para necessidades atuais

### 3. D3.js Puro

- **Pros:** Controle total, máxima flexibilidade, performance excelente
- **Contras:**
  - Curva de aprendizado muito alta
  - Muito código boilerplate
  - Manipulação direta do DOM (anti-pattern no React)
  - Tempo de desenvolvimento elevado
- **Não escolhida:** Over-engineering para escopo atual

### 4. Nivo Charts

- **Pros:** Design bonito out-of-the-box, API declarativa
- **Contras:**
  - Bundle size maior
  - Menos flexível para customizações
  - Documentação menos completa
- **Não escolhida:** Recharts atende necessidades com melhor custo-benefício

### 5. Implementar Gráficos com Canvas/SVG Puro

- **Pros:** Zero dependências, bundle size mínimo
- **Contras:**
  - Tempo de desenvolvimento muito alto
  - Manutenção complexa
  - Acessibilidade e responsividade manual
  - Reinventar a roda
- **Não escolhida:** Viola princípio YAGNI

## Justificativa da Escolha: Recharts

### ✅ Vantagens

1. **API Declarativa React-Native**
   ```tsx
   <BarChart data={data}>
     <Bar dataKey="entradas" fill="#10b981" />
     <Bar dataKey="saidas" fill="#ef4444" />
   </BarChart>
   ```

2. **TypeScript First-Class**
   - Tipagem nativa sem necessidade de `@types` externos
   - IntelliSense completo
   - Type safety em props e dados

3. **Bundle Size Otimizado**
   - Tree-shaking eficiente
   - Componentes importados individualmente
   - ~50KB gzipped (vs Chart.js ~150KB)

4. **Integração com React Hooks**
   - Funciona perfeitamente com `useMemo`, `useCallback`, `React.memo`
   - Re-renders otimizados automaticamente

5. **Manutenção Ativa**
   - Comunidade React forte
   - Atualizações regulares
   - Bem documentado

## Consequências

### ✅ Pontos Positivos

- **Separation of Concerns mantida:** Lógica de agregação isolada no service
- **Performance otimizada:** `React.memo`, `useMemo`, `useCallback` aplicados
- **Type-safe:** Todos os tipos definidos, zero `any`
- **Manutenível:** Componentes focados, responsabilidades claras
- **Escalável:** Fácil adicionar novos gráficos ou métricas
- **Preparado para backend:** Service pode ser substituído por API calls
- **Responsivo:** Recharts ResponsiveContainer adapta a diferentes telas
- **Acessível:** Recharts cuida de tooltips, legends, ARIA labels

### ⚠️ Limitações

- **Dependência externa:** Adiciona ~50KB ao bundle
- **Customização visual limitada:** Estilos precisam seguir API do Recharts
- **Performance com dados massivos:** Pode precisar otimização adicional (já implementada: redução de pontos no gráfico de saldo)
- **Interatividade limitada:** Funcionalidades avançadas (drill-down, zoom) requerem implementação custom

### 📋 Trade-offs Aceitos

1. **Bundle size vs Produtividade**
   - Aceito: +50KB no bundle
   - Ganho: Desenvolvimento 10x mais rápido que implementação própria

2. **Flexibilidade vs Simplicidade**
   - Aceito: API do Recharts com customizações limitadas
   - Ganho: Código mais simples e fácil de manter

3. **Dados no cliente vs Performance**
   - Aceito: Agregações no frontend (atual)
   - Preparado: Service Layer permite migrar para backend quando necessário

## Implementação Técnica

### Service Layer (Agregações)

```typescript
// dashboard.service.ts
export const dashboardService = {
  getMonthlySummary(transactions, startDate, endDate): MonthlySummary[] {
    // Agrupa por mês, calcula entradas/saídas
  },
  
  getCategoryDistribution(transactions, startDate, endDate): CategoryDistribution[] {
    // Filtra saídas, agrupa por categoria, calcula porcentagens
  },
  
  getBalanceEvolution(transactions, startDate, endDate): BalancePoint[] {
    // Ordena por data, calcula saldo acumulado
  }
};
```

### Memoização (Performance)

```typescript
// DashboardPage.tsx
const monthlyData = useMemo(
  () => dashboardService.getMonthlySummary(transactions, startDate, endDate),
  [transactions, startDate, endDate]
);
```

### Componentes Puros (Apresentação)

```typescript
// EntradasSaidasChart.tsx
export const EntradasSaidasChart = memo(function EntradasSaidasChart({ data }) {
  return <BarChart data={data}>...</BarChart>;
});
```

## Conformidade Arquitetural

### ✅ Aderência aos ADRs Existentes

- **ADR-001 (Frontend-Only):** Dashboard roda inteiramente no cliente
- **ADR-004 (Context API):** Usa `useTransactions()`, não duplica estado
- **ADR-005 (Modelo de Dados):** Respeita `valor` positivo + `tipo`
- **ADR-006 (Service Layer):** Agregações isoladas, preparado para API
- **ADR-007 (Princípios):** 
  - ✅ YAGNI: Apenas 3 gráficos essenciais
  - ✅ Separation of Concerns: UI não faz cálculos
  - ✅ Single Responsibility: Cada componente tem papel único

### Fluxo de Dependências Respeitado

```
UI (DashboardPage, Charts)
    ↓
Context API (TransactionContext)
    ↓
Services (dashboard.service.ts)
    ↓
Types (dashboard.types.ts)
```

**Sem violações:**
- ❌ Nenhum cálculo financeiro em componentes
- ❌ Nenhum acesso a `localStorage` fora de services
- ❌ Nenhum estado duplicado

## Evolução Futura

### Possíveis Melhorias (quando necessário)

1. **Gráficos adicionais:**
   - Comparação ano a ano
   - Projeção de tendências
   - Metas vs realizado

2. **Interatividade:**
   - Drill-down em categorias
   - Zoom em intervalos
   - Export de gráficos (PNG/PDF)

3. **Performance:**
   - Virtualização para grandes volumes
   - Web Workers para agregações pesadas
   - Cache de agregações

4. **Customização:**
   - Temas personalizados
   - Dashboard configurável (drag-and-drop)
   - Widgets customizáveis

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Performance degradada:** Agregações > 100ms consistentemente
2. **Bundle size crítico:** App > 1MB e gráficos são gargalo
3. **Necessidades avançadas:** Interatividade que Recharts não suporta
4. **Migração para backend:** Agregações movidas para API (manter Recharts para visualização)
5. **Mudança de stack:** Se projeto migrar para framework diferente (Vue, Angular, etc.)

**Nota:** A estrutura atual (Service Layer isolado) facilita substituir Recharts sem impactar lógica de negócio.

## Métricas de Sucesso

### Implementação Concluída

- ✅ 3 tipos de gráficos funcionais
- ✅ Filtros de período (rápidos + customizado)
- ✅ Performance < 100ms para agregações
- ✅ Zero erros TypeScript
- ✅ Zero erros de lint
- ✅ Componentes memoizados
- ✅ Service Layer isolado
- ✅ Integrado na navegação

### Objetivos Atingidos

- **Visualização clara:** Usuário consegue entender finanças rapidamente
- **Performance aceitável:** Sem lags ou travamentos
- **Código limpo:** Fácil adicionar novos gráficos
- **Preparado para escala:** Pode migrar agregações para backend sem refatoração de UI

## Referências

- [Recharts Documentation](https://recharts.org/)
- [ADR-006 - Service Layer Abstraction](./ADR-006-service-layer-migracao-backend.md)
- [ADR-007 - Princípios Arquiteturais](./ADR-007-principios-diretrizes-arquiteturais.md)
- [React Performance Optimization](https://react.dev/reference/react/memo)

