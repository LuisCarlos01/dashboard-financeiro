# ADR-007 - Princípios e Diretrizes Arquiteturais

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

Com três planos arquiteturais implementados (MVP Frontend, Autenticação Frontend-Only e Estratégia Backend), surge a necessidade de documentar **quais princípios de engenharia de software devem ser seguidos** no desenvolvimento contínuo do projeto.

A questão central é: como manter o código escalável, legível e de fácil manutenção sem cair em over-engineering ou rigidez excessiva?

O projeto precisa de diretrizes claras que:
- Documentem princípios já aplicados com sucesso
- Orientem decisões futuras de arquitetura
- Evitem complexidade desnecessária
- Facilitem evolução gradual (frontend-only → backend)

## Decisão

Adotar **"Progressive Architecture"** - arquitetura progressiva baseada em pragmatismo:

### Filosofia Central

1. **Começar simples** - Escolher a solução mais simples que atende requisitos atuais
2. **Preparar para crescimento** - Estruturar código para facilitar evolução (Service Layer, TypeScript strict)
3. **Refatorar quando necessário** - Não antes (YAGNI), não depois (dívida técnica)
4. **Preferir padrões nativos** - Context API > Zustand, `fetch` > axios

### Princípios Aplicados (Já Validados no Código)

#### ✅ Separation of Concerns
- UI Layer: Componentes não fazem cálculos nem acessam storage
- Business Layer: Services isolam lógica de negócio
- Data Layer: Persistência centralizada em `storageService`
- Migração para backend = trocar **1 arquivo** (`storage.service.ts`)

#### ✅ Dependency Direction
- Fluxo unidirecional: `UI → Context → Services → Storage`
- Sem dependências reversas
- Services não importam Context ou UI

#### ✅ Single Responsibility Principle
- `calculationsService` → apenas cálculos financeiros
- `storageService` → apenas CRUD de dados
- `TransactionContext` → apenas orquestração de estado
- Arquivos com ~40-70 linhas (alta coesão, baixo acoplamento)

#### ✅ TypeScript Strict Mode
- Contratos bem definidos (`transaction.types.ts`)
- Union types literais (`'Entrada' | 'Saída'`)
- Tipos derivados (`Omit<Transaction, 'id'>`)
- IntelliSense útil, refatorações seguras

#### ✅ YAGNI (You Ain't Gonna Need It)
- LocalStorage em vez de IndexedDB (50.000 transações = décadas)
- Context API em vez de Zustand (zero dependências)
- Frontend-only em vez de backend (MVP 2 dias vs 15 dias)

### Princípios Parciais (Aplicar com Pragmatismo)

#### 🟨 Clean Architecture (Adaptada)
- **Aplicar:** Camadas conceituais, isolamento de I/O, business logic isolada
- **Não aplicar:** Entities formais, Use Cases explícitos, camada de Adapters
- **Razão:** Service Layer já oferece isolamento suficiente

#### 🟨 DRY (Don't Repeat Yourself)
- **Aplicar:** Em utils, UI components base, services
- **Não aplicar:** Não abstrair antes de 3ª ocorrência
- **Preferir:** Duplicação controlada a acoplamento desnecessário

#### 🟨 Design Patterns
- **Usar:** Service Pattern, Provider Pattern, Facade Pattern, Custom Hooks
- **Considerar no futuro:** Adapter Pattern (quando múltiplas fontes de dados), Observer Pattern
- **Regra:** Só implementar quando pain point ficar evidente

### Princípios a NÃO Aplicar

#### ❌ DDD (Domain-Driven Design) Completo
- **Motivo:** Domínio simples (transações, categorias, cálculos)
- **Evitar:** Aggregates, Value Objects, Domain Events

#### ❌ Repository Pattern (Por Enquanto)
- **Motivo:** 1 fonte de dados (LocalStorage → API futuro)
- **Quando considerar:** Múltiplas fontes simultâneas

#### ❌ Abstrações Excessivas
- **Evitar:** Interfaces para tudo, inversão de dependência sem motivo
- **Usar:** Objetos literais em services (suficiente)

#### ❌ Microservices / Event Sourcing
- **Motivo:** Projeto single-user, complexidade injustificada

## Alternativas Consideradas

1. **Arquitetura Empresarial Completa**
   - Pros: Altamente escalável, separação máxima
   - Contras: Over-engineering para projeto pessoal, complexidade cognitiva alta
   - **Não escolhida:** Overhead de 10x para ganho de 0 no contexto atual

2. **Sem Diretrizes Formais**
   - Pros: Máxima flexibilidade, menos documentação
   - Contras: Decisões inconsistentes, refatorações caóticas
   - **Não escolhida:** Risco alto de dívida técnica descontrolada

3. **Seguir SOLID Rigidamente**
   - Pros: Padrão bem estabelecido, fácil explicar
   - Contras: Pode levar a abstrações desnecessárias
   - **Não escolhida:** SOLID é guia, não lei absoluta

4. **Clean Architecture Completa**
   - Pros: Desacoplamento máximo, testabilidade perfeita
   - Contras: Muitas camadas para projeto pequeno
   - **Não escolhida:** Versão adaptada é mais apropriada

## Consequências

### ✅ Pontos Positivos

- **Código previsível:** Padrões claros facilitam onboarding
- **Evolução gradual:** Arquitetura permite crescimento sem reescrita
- **Baixa complexidade:** Foco em simplicidade pragmática
- **Evita dívida técnica:** Diretrizes previnem decisões ruins
- **Facilita code review:** Critérios objetivos para avaliar código
- **Backend-ready:** Service Layer isolado permite migração suave

### ⚠️ Limitações

- **Requer disciplina:** Desenvolvedores precisam seguir diretrizes conscientemente
- **Não é automático:** Não há ferramenta que force todos os princípios
- **Pode gerar debates:** "Por que não usar pattern X?"
- **Precisa evolução:** Diretrizes podem precisar revisão conforme projeto cresce

### 📋 Regras Práticas de Implementação

#### Organização de Pastas
```
src/
├── components/     # Componentes compartilhados (ui/, layout/)
├── features/       # Features isoladas (lancamentos/, dashboard/)
├── services/       # Lógica de negócio global
├── contexts/       # Estado global
├── types/          # Tipos compartilhados
├── utils/          # Utilitários puros (sem side effects)
└── pages/          # Páginas (routing)
```

#### Limites Entre Camadas
- ✅ UI → Context → Services → Storage (permitido)
- ❌ Services → Context (dependência reversa - proibido)
- ❌ UI → Services (pular Context - proibido)

#### Limites de Complexidade
- Arquivo < 300 linhas → refatorar em módulos
- Função > 30 linhas → quebrar em subfunções
- Profundidade de aninhamento > 3 → extrair lógica
- Parâmetros > 4 → usar objeto de configuração

#### Checklist "Backend-Ready"
- [ ] Todo `localStorage.` apenas em `storage.service.ts`
- [ ] Lógica de negócio em services, não em UI
- [ ] `strict: true` em `tsconfig.json`
- [ ] Zero `any` no código
- [ ] Contratos TypeScript estáveis

#### Anti-patterns a Evitar
- ❌ Lógica de negócio em componentes (`.filter()`, `.reduce()` em UI)
- ❌ Acesso direto ao LocalStorage fora de services
- ❌ State duplicado (usar `useMemo` para derivar)
- ❌ Prop drilling excessivo (Context resolve)
- ❌ Over-engineering prematuro
- ❌ Dependências excessivas (> 15 libs para app simples)

### 🔍 Indicadores de Saúde do Projeto

**✅ Bom estado:**
- Build time < 5s
- Bundle size < 500KB
- Zero TypeScript errors/warnings
- Arquivos < 300 linhas em média

**🟨 Atenção:**
- Build time 5-15s → verificar imports circulares
- Bundle 500KB-1MB → analisar com `vite-bundle-visualizer`
- 1-5 TypeScript warnings → resolver gradualmente

**🔴 Refatoração necessária:**
- Build time > 15s
- Bundle > 1MB sem motivo
- > 10 TypeScript errors
- Arquivos > 500 linhas

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Crescimento de equipe:** > 3 desenvolvedores ativos
2. **Mudança de escopo:** Single-user → multi-user
3. **Complexidade crescente:** Projeto > 50 arquivos ou > 10.000 linhas
4. **Performance degradada:** Operações > 100ms consistentemente
5. **Dívida técnica acumulada:** Refatorações frequentes necessárias
6. **Migração para backend:** Ao implementar API REST

**Sinais de que NÃO é hora de mudar:**
- "E se no futuro..." (YAGNI)
- "Achei este pattern legal" (sem problema real)
- "Empresa X usa Y" (contexto diferente)

### 📈 Checklist Mensal de Manutenção

- [ ] Revisar `package.json` - remover dependências não usadas
- [ ] Buscar `TODO` no código - resolver ou documentar
- [ ] Revisar arquivos > 200 linhas - considerar quebra
- [ ] Verificar performance - operações críticas < 50ms
- [ ] Atualizar dependências (security updates)
- [ ] Reavaliar decisões arquiteturais (frontend-only ainda faz sentido?)

## Conclusão

A arquitetura atual demonstra **maturidade técnica** através de:
- Escolhas conscientes, não dogmáticas
- Pragmatismo sobre teoria acadêmica
- Preparação para evolução sem reescrita total
- Simplicidade apropriada ao contexto

**Filosofia final:** *"Make it work, make it right, make it fast"* - nesta ordem, sem pular etapas.

## Referências

- [ADR-001 - Arquitetura Frontend-Only](./ADR-001-arquitetura-frontend-only.md)
- [ADR-006 - Service Layer Abstraction](./ADR-006-service-layer-migracao-backend.md)
- [Plano MVP Dashboard](../../.cursor/plans/dashboard_financeiro_mvp_e70ee97e.plan.md)
- [Plano Autenticação Frontend](../../.cursor/plans/Trade-offs%20técnicos/autenticação_frontend_simples.plan.md)
- [Estratégia Backend](../../.cursor/plans/Trade-offs%20técnicos/estratégia_backend_decisão_arquitetural.plan.md)

