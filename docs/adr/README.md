# Architecture Decision Records (ADRs)

Este diretório contém os **Architecture Decision Records** (ADRs) do projeto Dashboard Financeiro. Os ADRs documentam as decisões arquiteturais estratégicas tomadas durante o desenvolvimento do projeto.

## 📋 O que são ADRs?

ADRs são documentos que capturam uma decisão arquitetural importante, incluindo:
- **Contexto:** Por que a decisão foi necessária
- **Decisão:** O que foi escolhido
- **Alternativas:** Outras opções consideradas e por que não foram escolhidas
- **Consequências:** Impactos positivos, limitações e quando revisar

## 📚 Índice dos ADRs

### [ADR-001 - Arquitetura Frontend-Only sem Backend](./ADR-001-arquitetura-frontend-only.md)
**Status:** Aceito | **Data:** 30/12/2025

Decisão de construir uma aplicação SPA completamente frontend-only, sem backend, API REST ou banco de dados servidor. Adequado para uso pessoal, com caminho claro para migração futura.

**Decisão:** Aplicação roda exclusivamente no navegador, servida como arquivos estáticos.

---

### [ADR-002 - Autenticação Frontend com SHA-256 e Env Vars](./ADR-002-autenticacao-frontend-sha256.md)
**Status:** Aceito | **Data:** 30/12/2025

Implementação de autenticação frontend-only usando hash SHA-256 (Web Crypto API), variáveis de ambiente para credenciais e session tokens no LocalStorage.

**Decisão:** Autenticação validada no cliente com hash SHA-256, adequada para uso pessoal.

---

### [ADR-003 - Persistência de Dados com LocalStorage](./ADR-003-persistencia-localstorage.md)
**Status:** Aceito | **Data:** 30/12/2025

Uso do LocalStorage do navegador como camada única de persistência para transações financeiras e sessões de autenticação.

**Decisão:** Dados persistidos no LocalStorage do navegador, sem sincronização cross-device.

---

### [ADR-004 - Gerenciamento de Estado Global com Context API](./ADR-004-gerenciamento-estado-context-api.md)
**Status:** Aceito | **Data:** 30/12/2025

Adoção do React Context API nativo para gerenciamento de estado global, evitando dependências externas como Redux ou Zustand.

**Decisão:** Dois contextos especializados (AuthContext e TransactionContext) com hooks customizados.

---

### [ADR-005 - Modelo de Dados: Valor Sempre Positivo + Tipo Define Sinal](./ADR-005-modelo-dados-valor-positivo.md)
**Status:** Aceito | **Data:** 30/12/2025

Modelagem onde o campo `valor` sempre armazena números positivos, e o campo `tipo` ("Entrada" ou "Saída") define o sinal nos cálculos.

**Decisão:** Valores sempre positivos, tipo define se é entrada ou saída, cálculos aplicam sinal na camada de serviços.

---

### [ADR-006 - Service Layer Abstraction para Migração Futura](./ADR-006-service-layer-migracao-backend.md)
**Status:** Aceito | **Data:** 30/12/2025

Organização do código com camada de serviços abstraída que isola persistência e autenticação, facilitando migração futura para backend.

**Decisão:** Serviços isolados que podem ser substituídos (LocalStorage → API) sem mudar componentes.

---

### [ADR-007 - Princípios e Diretrizes Arquiteturais](./ADR-007-principios-diretrizes-arquiteturais.md)
**Status:** Aceito | **Data:** 30/12/2025

Definição de princípios de engenharia de software e diretrizes arquiteturais a serem seguidos no desenvolvimento contínuo do projeto, baseados em "Progressive Architecture".

**Decisão:** Arquitetura progressiva - começar simples, preparar para crescimento, refatorar quando necessário, evitar over-engineering.

---

## 🎯 Como Usar Esta Documentação

### Para Desenvolvedores Novos
1. Leia os ADRs na ordem numérica (001 → 006) para entender a evolução arquitetural
2. Consulte ADRs específicos quando precisar entender decisões relacionadas ao seu trabalho
3. Use os ADRs como referência ao propor mudanças arquiteturais

### Para Decisões Futuras
1. Consulte ADRs existentes antes de tomar decisões arquiteturais
2. Se uma decisão contradizer um ADR existente, considere criar um novo ADR documentando a mudança
3. Use o formato dos ADRs existentes como template para novos registros

## 🔄 Status dos ADRs

- **Aceito:** Decisão implementada e ativa no projeto
- **Proposto:** Decisão em discussão, ainda não implementada
- **Depreciado:** Decisão substituída por outra (deve referenciar novo ADR)
- **Rejeitado:** Decisão considerada mas não adotada

## 📝 Convenções

- **Numeração:** ADRs são numerados sequencialmente (001, 002, 003...)
- **Nomenclatura:** `ADR-XXX-titulo-kebab-case.md`
- **Formato:** Markdown com estrutura padronizada
- **Data:** Data aproximada da decisão (quando conhecida)

## 🔗 Relacionamentos Entre ADRs

- **ADR-001** (Frontend-Only) → **ADR-002** (Auth Frontend) → **ADR-003** (LocalStorage)
- **ADR-001** (Frontend-Only) → **ADR-006** (Service Layer) → Migração futura
- **ADR-003** (LocalStorage) → **ADR-006** (Service Layer) → Abstração para migração
- **ADR-004** (Context API) → Independente, mas complementa arquitetura geral
- **ADR-007** (Princípios Arquiteturais) → Fundamenta e conecta todos os ADRs anteriores

## 📖 Referências

- [Documentação de Autenticação](../config-auth/SETUP_AUTH.md)
- [Quick Start Guide](../quickstart/QUICKSTART.md)
- [README Principal](../../README.md)

---

**Última atualização:** 30/12/2025  
**Total de ADRs:** 7
