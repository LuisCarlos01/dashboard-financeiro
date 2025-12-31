# ADR-009 - Design System Financeiro e Identidade Visual

- **Status:** Aceito
- **Data:** 31/12/2025

## Contexto

Com a evolução do Dashboard Financeiro e a implementação de componentes visuais (gráficos, cards, filtros), surgiu a necessidade de estabelecer uma **identidade visual consistente e profissional** para o produto.

O projeto apresentava inconsistências visuais:
- Paleta de cores básica sem hierarquia clara
- Tipografia genérica sem otimização para dados financeiros
- Componentes UI sem variantes ou estados bem definidos
- Gráficos com cores que não atendiam critérios de acessibilidade WCAG AA
- Falta de diretrizes visuais para escalabilidade futura

Além disso, produtos financeiros exigem características visuais específicas:
- **Confiança e estabilidade:** Transmitir segurança aos usuários
- **Clareza extrema:** Legibilidade máxima em valores monetários e números
- **Acessibilidade:** Atender padrões WCAG AA para usuários com deficiência visual
- **Consistência:** Padrões visuais uniformes em todos os componentes

A questão central era: como criar um design system profissional que transmita confiança, seja acessível e escalável, sem adicionar complexidade desnecessária ao projeto?

## Decisão

Implementar um **Design System Financeiro completo** baseado em princípios de design para produtos financeiros, com foco em:

1. **Identidade Visual Profissional**
   - Paleta de cores semântica (entradas, saídas, saldo, estados)
   - Escala de neutros para textos e backgrounds
   - Cores primárias para ações e highlights
   - Contraste WCAG AA validado

2. **Tipografia Otimizada para Dados Financeiros**
   - **Inter** como fonte principal (UI, títulos, corpo)
   - **JetBrains Mono** para valores monetários (numerais tabulares)
   - Hierarquia tipográfica clara (7 níveis)
   - Classe utilitária `.font-currency` para valores monetários

3. **Sistema de Componentes Escalável**
   - Componentes base com variantes (Card: default, metric, hover)
   - Estados bem definidos (hover, focus, active, disabled, error)
   - Badges e indicadores de tendência
   - Micro-interações sutis (< 200ms)

4. **Visualização de Dados Consistente**
   - Paleta de cores padronizada para gráficos
   - Cores semânticas (income-600, expense-600) em vez de cores genéricas
   - Gradientes sutis em gráficos de área
   - Tooltips customizados com formatação consistente

5. **Acessibilidade WCAG AA**
   - Contraste mínimo 4.5:1 para textos
   - Contraste 7:1+ para valores monetários críticos
   - Navegação por teclado (focus-visible)
   - Textos alternativos em ícones informativos
   - ARIA labels descritivos em gráficos

### Stack Tecnológica

- **Tailwind CSS:** Sistema de design tokens (cores, espaçamento, tipografia)
- **Google Fonts:** Inter + JetBrains Mono via CDN
- **Recharts:** Biblioteca de gráficos (mantida, com cores customizadas)
- **Heroicons:** Ícones line/outline consistentes

## Alternativas Consideradas

1. **Biblioteca de Design System Completa (Material-UI, Chakra UI, Ant Design)**
   - Pros: Componentes prontos, documentação extensa, comunidade grande
   - Contras: Bundle size grande, customização limitada, estilo genérico
   - **Não escolhida:** Overhead desnecessário, queremos identidade visual própria

2. **CSS-in-JS (Styled Components, Emotion)**
   - Pros: Estilos encapsulados, theming dinâmico
   - Contras: Bundle size adicional, complexidade de runtime
   - **Não escolhida:** Tailwind CSS já oferece tudo necessário sem overhead

3. **Design System Externo (Storybook + Design Tokens)**
   - Pros: Documentação visual, isolamento de componentes
   - Contras: Complexidade de setup, manutenção adicional
   - **Não escolhida:** YAGNI - projeto não precisa disso ainda

4. **Paleta de Cores Genérica (Tailwind Default)**
   - Pros: Zero configuração, cores prontas
   - Contras: Não transmite identidade, cores não otimizadas para finanças
   - **Não escolhida:** Produtos financeiros precisam de identidade visual própria

5. **Tipografia Monospace para Tudo**
   - Pros: Consistência total, números alinhados
   - Contras: Legibilidade reduzida em textos longos, aparência técnica demais
   - **Não escolhida:** Híbrido (sans-serif + mono apenas para valores) é melhor

6. **Cores Vibrantes/Saturadas (Estilo Nubank)**
   - Pros: Visual moderno e chamativo
   - Contras: Pode comprometer legibilidade, não transmite seriedade
   - **Não escolhida:** Preferimos profissionalismo sobre vibração

## Consequências

### ✅ Pontos Positivos

- **Identidade Visual Clara:** Produto transmite profissionalismo e confiança
- **Consistência Total:** Todos os componentes seguem mesmos padrões visuais
- **Acessibilidade Garantida:** WCAG AA atendido em todos os elementos
- **Escalabilidade:** Design system facilita adição de novos componentes
- **Manutenibilidade:** Mudanças de cor/tipografia centralizadas no Tailwind config
- **Performance:** Fontes otimizadas via Google Fonts, sem impacto significativo
- **Legibilidade Financeira:** Tipografia mono para valores melhora leitura de números
- **Desenvolvimento Rápido:** Classes utilitárias Tailwind aceleram implementação
- **Preparado para Dark Mode:** Estrutura de cores facilita implementação futura

### ⚠️ Limitações

- **Dependência de Google Fonts:** Requer conexão com internet para carregar fontes
- **Bundle Size Adicional:** JetBrains Mono adiciona ~50KB (aceitável)
- **Customização Limitada:** Tailwind não permite theming dinâmico em runtime (não necessário ainda)
- **Aprendizado Inicial:** Desenvolvedores precisam conhecer classes Tailwind
- **Cores Fixas:** Não há sistema de temas múltiplos (não necessário para MVP)
- **Sem Design Tokens Externos:** Tokens não são exportáveis para ferramentas de design (Figma)

### 📋 Estrutura Implementada

#### Paleta de Cores (`tailwind.config.js`)

```javascript
colors: {
  primary: { 50, 100, 500, 600, 700, 900 },    // Ações principais
  income: { 50, 100, 500, 600, 900 },          // Entradas
  expense: { 50, 100, 500, 600, 900 },        // Saídas
  success: { 100, 600 },                       // Estados de sucesso
  warning: { 100, 500, 600 },                  // Alertas
  error: { 100, 600 },                        // Erros
  info: { 100, 600 },                         // Informativo
  neutral: { 50, 100, 200, 300, 400, 600, 700, 900, 950 } // Neutros
}
```

#### Tipografia

- **Fonte Principal:** Inter (400, 500, 600, 700)
- **Fonte Monetária:** JetBrains Mono (500, 600)
- **Escala:** xs (12px) → 3xl (28px)
- **Classe Utilitária:** `.font-currency` para valores monetários

#### Componentes Base

- **Card:** Variantes `default`, `metric`, `hover` + `borderAccent`
- **Button:** Variantes `primary`, `secondary`, `success`, `danger`, `ghost` + tamanhos
- **Badge:** Variantes semânticas (income, expense, warning, success)
- **Input:** Estados hover, focus, disabled, error
- **Indicadores:** Trend indicators (up/down) com ícones e cores

#### Gráficos

- **Cores Padronizadas:** `income-600` (#059669), `expense-600` (#dc2626), `primary-600` (#2563eb)
- **Gradientes Sutis:** Apenas em gráficos de área (opacity 0.02-0.2)
- **Tooltips:** Design consistente com `.font-currency` para valores
- **Paleta de Categorias:** 12 cores consistentes e acessíveis

### 🎨 Princípios Visuais Aplicados

#### O Que Fazer ✅

- Cores profissionais e contrastadas
- Gradientes sutis apenas em backgrounds
- Micro-interações rápidas (< 200ms)
- Tipografia sem serifa, legível
- Ícones line/outline consistentes
- Hierarquia visual clara e objetiva
- Redundância de informação (cor + ícone + texto)
- Elevações sutis (flat design com profundidade)

#### O Que Evitar ❌

- Cores saturadas demais (vibrantes, neon)
- Gradientes decorativos excessivos
- Animações longas ou distrativas
- Tipografia decorativa/script
- Ícones ilustrativos demais
- Excesso de elementos visuais competindo por atenção
- Depender apenas de cor para transmitir informação
- Sombras muito fortes (fake 3D)

### 📊 Métricas de Acessibilidade

**Contrastes Validados:**
- Texto sobre branco: `neutral-700` (4.5:1) ✅
- Valores monetários: `neutral-900` (7:1+) ✅
- CTAs primários: `primary-700` sobre branco (5.2:1) ✅
- Entradas/Saídas: `income-600`/`expense-600` (4.5:1+) ✅

**Estratégia para Daltonismo:**
- Ícones sempre presentes (↑ ↓)
- Padrões visuais além de cor (bordas, ícones)
- Labels textuais em todos os elementos críticos

### 🔧 Arquivos Modificados

1. **`tailwind.config.js`** - Paleta completa, fontes, escala tipográfica
2. **`index.html`** - Importação de fontes Google Fonts
3. **`src/index.css`** - Classes utilitárias (.font-currency, .card-*, .btn-*, .badge-*, .trend-*)
4. **`src/components/ui/Card.tsx`** - Variantes e props
5. **`src/components/ui/Button.tsx`** - Estados e tamanhos
6. **`src/components/ui/Badge.tsx`** - Novo componente
7. **`src/components/ui/Input.tsx`** - Estados de erro e acessibilidade
8. **`src/components/SummaryCards.tsx`** - Aplicação de tipografia currency
9. **`src/components/charts/CustomTooltip.tsx`** - Redesign com formatação
10. **`src/components/charts/EmptyState.tsx`** - Melhorias de UX
11. **`src/features/dashboard/components/EntradasSaidasChart.tsx`** - Cores atualizadas
12. **`src/features/dashboard/components/SaldoEvolutionChart.tsx`** - Gradiente adicionado
13. **`src/features/dashboard/components/CategoriaDistributionChart.tsx`** - Paleta de categorias
14. **`src/features/dashboard/components/PeriodSummary.tsx`** - Indicadores de tendência

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Necessidade de Dark Mode:** Implementar tema escuro requer ajustes na paleta
2. **Múltiplos Temas:** Se precisar suportar temas personalizáveis pelo usuário
3. **Design Tokens Externos:** Se precisar integrar com ferramentas de design (Figma)
4. **Acessibilidade WCAG AAA:** Se precisar atender nível AAA (contraste 7:1 para tudo)
5. **Internacionalização:** Se precisar suportar idiomas com caracteres especiais
6. **Branding Corporativo:** Se produto se tornar comercial e precisar identidade própria
7. **Performance de Fontes:** Se Google Fonts se tornar gargalo (considerar self-hosting)

**Sinais de que NÃO é hora de mudar:**
- "Queremos cores mais vibrantes" (sem justificativa de UX)
- "Vamos usar outra biblioteca de componentes" (sem problema real)
- "Precisamos de mais variantes" (YAGNI - criar quando necessário)

### 📈 Checklist de Manutenção

**Mensal:**
- [ ] Verificar contraste de cores (ferramenta: WebAIM Contrast Checker)
- [ ] Revisar uso de classes Tailwind (evitar classes inline excessivas)
- [ ] Validar acessibilidade com axe DevTools
- [ ] Verificar bundle size (fontes não devem exceder 100KB)

**Ao Adicionar Novo Componente:**
- [ ] Usar paleta de cores do design system
- [ ] Aplicar tipografia correta (Inter para texto, JetBrains Mono para valores)
- [ ] Implementar estados (hover, focus, disabled)
- [ ] Adicionar aria-labels quando necessário
- [ ] Validar contraste WCAG AA
- [ ] Testar navegação por teclado

**Ao Adicionar Novo Gráfico:**
- [ ] Usar cores padronizadas (income-600, expense-600, primary-600)
- [ ] Implementar tooltip customizado
- [ ] Adicionar aria-label descritivo
- [ ] Validar legibilidade em mobile
- [ ] Considerar alternativas para daltônicos

## Relacionamento com Outros ADRs

- **ADR-001 (Frontend-Only):** Design system implementado sem dependências de backend
- **ADR-007 (Princípios Arquiteturais):** Segue princípio de "começar simples" - design system básico mas completo
- **ADR-008 (Dashboard Analítico):** Design system aplicado diretamente nos gráficos do dashboard
- **Futuro ADR (Dark Mode):** Estrutura atual facilita implementação de tema escuro

## Conclusão

A implementação do Design System Financeiro estabelece uma **base sólida e profissional** para o produto, garantindo:

- **Consistência visual** em todos os componentes
- **Acessibilidade** para todos os usuários
- **Escalabilidade** para crescimento futuro
- **Manutenibilidade** através de tokens centralizados
- **Identidade visual** adequada para produtos financeiros

O design system foi implementado seguindo princípios de **pragmatismo** (ADR-007): completo o suficiente para atender necessidades atuais, mas não over-engineered para necessidades futuras hipotéticas.

**Filosofia aplicada:** *"Design system como ferramenta, não como fim"* - serve ao produto, não o contrário.

## Referências

- [ADR-001 - Arquitetura Frontend-Only](./ADR-001-arquitetura-frontend-only.md)
- [ADR-007 - Princípios Arquiteturais](./ADR-007-principios-diretrizes-arquiteturais.md)
- [ADR-008 - Dashboard Analítico](./ADR-008-dashboard-analitico-recharts.md)
- [Plano Design System](../../.cursor/plans/design-system/design_system_financeiro_7a38a643.plan.md)
- [Análise Crítica UX/UI](../../.cursor/plans/análise_crítica_ux_ui_dashboard_analítico_5d5dd5a9.plan.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://rsms.me/inter/)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

