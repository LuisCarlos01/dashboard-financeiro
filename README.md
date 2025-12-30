# Dashboard Financeiro

Aplicação web moderna (PWA/SPA responsiva) para controle financeiro pessoal, desenvolvida com React + TypeScript + Vite.

## 🎯 Funcionalidades

- ✅ **Autenticação frontend-only** com session token
- ✅ Cadastro de lançamentos financeiros (Entrada/Saída)
- ✅ Listagem com filtros avançados (data, tipo, categoria)
- ✅ Ordenação por data e valor
- ✅ Cards de resumo financeiro (Total Entradas, Total Saídas, Saldo)
- ✅ Persistência local (LocalStorage)
- ✅ Interface responsiva e moderna

## 🔐 Autenticação

O sistema implementa autenticação frontend-only adequada para uso pessoal. **Configuração obrigatória antes de usar:**

1. Copie o arquivo de exemplo:
   ```bash
   cp env.example .env.local
   ```

2. Gere um hash para sua senha:
   ```bash
   npm run generate-hash
   ```

3. Configure suas credenciais no `.env.local`:
   ```bash
   VITE_AUTH_EMAIL=seu@email.com
   VITE_AUTH_PASSWORD_HASH=hash_gerado_aqui
   VITE_AUTH_USER_NAME=Seu Nome
   ```

4. Inicie a aplicação:
   ```bash
   npm run dev
   ```

📖 **Documentação completa:** [SETUP_AUTH.md](SETUP_AUTH.md)

**Recursos:**
- Login com email/senha
- Sessão persistente (7 dias)
- Auto-login após refresh
- Hash SHA-256 via Web Crypto API
- Arquitetura preparada para migração futura para backend

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização utilitária
- **React Hook Form** - Gerenciamento de formulários
- **date-fns** - Manipulação de datas
- **Context API** - Gerenciamento de estado

## 📦 Instalação e Início Rápido

### Início Rápido (5 minutos)

```bash
# 1. Instalar dependências
npm install

# 2. Gerar hash de senha
npm run generate-hash

# 3. Criar .env.local (copiar env.example)
cp env.example .env.local

# 4. Configurar credenciais no .env.local

# 5. Iniciar aplicação
npm run dev
```

📖 **Guia completo:** [QUICKSTART.md](QUICKSTART.md)

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Lint (verificar código)
npm run lint

# Gerar hash de senha
npm run generate-hash
```

## 🏗️ Estrutura do Projeto

```
src/
 ├─ components/          # Componentes reutilizáveis
 │   ├─ ui/            # Componentes básicos (Button, Input, Card)
 │   └─ layout/        # Header, Container
 ├─ features/          # Módulos de funcionalidade
 │   └─ lancamentos/   # Feature de lançamentos
 ├─ services/          # Lógica de negócio e persistência
 ├─ types/             # Tipos TypeScript globais
 ├─ utils/             # Utilitários (formatters, validators)
 ├─ contexts/          # Context API
 └─ pages/             # Páginas principais
```

## 📊 Modelo de Dados

O modelo de dados segue a estrutura validada:

```typescript
interface Transaction {
  id: string;
  data: string; // ISO Date (YYYY-MM-DD)
  descricao: string;
  categoria: string;
  subcategoria?: string;
  tipo: "Entrada" | "Saída";
  valor: number; // Sempre positivo
  forma_pagamento?: string;
  observacao?: string;
}
```

**Regras de Negócio:**
- `valor` é sempre positivo
- `tipo` define se é entrada ou saída
- Cálculos financeiros ocorrem apenas na camada de serviços
- Nenhum cálculo é armazenado na base de dados

## 🎨 Categorias Padrão

- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Compras
- Salário
- Freelance
- Investimentos
- Outros

## 🚀 CI/CD e Deploy

Este projeto possui pipelines automatizados de CI/CD configurados com GitHub Actions e deploy no Vercel.

### Pipelines

**CI Pipeline (`.github/workflows/ci.yml`):**
- Executa em todos os Pull Requests e pushes para `main`/`develop`
- Validações: ESLint → TypeCheck → Build
- Bloqueia merge se qualquer validação falhar

**CD Pipeline (`.github/workflows/cd.yml`):**
- **Preview Deploy**: Cria ambiente de preview no Vercel para cada PR
- **Production Deploy**: Deploy automático em produção quando código é mergeado em `main`
- Executa apenas após CI passar com sucesso

### Configuração para Deploy

**Pré-requisitos:**
1. Criar projeto no Vercel (via [dashboard](https://vercel.com) ou CLI)
2. Obter credenciais do Vercel:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   cat .vercel/project.json  # Extrair VERCEL_ORG_ID e VERCEL_PROJECT_ID
   ```
3. Adicionar secrets no GitHub:
   - `VERCEL_TOKEN` - Token de deploy (gerar em [Vercel Settings](https://vercel.com/account/tokens))
   - `VERCEL_ORG_ID` - ID da organização
   - `VERCEL_PROJECT_ID` - ID do projeto
   
   **Como adicionar:** `Settings → Secrets and variables → Actions → New repository secret`

### Branch Protection

**Configuração recomendada para `main`:**
- ✅ Require pull request before merging (1 approval)
- ✅ Require status checks to pass (`CI`, `Build`)
- ✅ Require branches to be up to date
- ✅ Do not allow bypassing

**Como configurar:** `Settings → Branches → Add rule → Branch name pattern: main`

### Commits Semânticos

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

**Exemplos:**
- `feat(transactions): adiciona filtro por categoria`
- `fix(header): corrige responsividade em mobile`
- `chore(deps): atualiza React para 18.3.0`

### Workflow de Desenvolvimento

1. Criar feature branch: `git checkout -b feat/nova-funcionalidade`
2. Fazer commits semânticos
3. Abrir Pull Request para `main`
4. CI roda automaticamente (lint + build)
5. Preview deploy criado no Vercel (URL disponível no PR)
6. Code review + aprovação
7. Merge → deploy automático em produção

### Dependabot

O projeto está configurado com Dependabot para atualizações automáticas de dependências:
- Verifica updates semanalmente (segundas-feiras)
- Cria PRs automáticos para atualizações de segurança
- Agrupa dependências de desenvolvimento em um único PR
- Limita a 5 PRs abertos simultaneamente

## 🔮 Próximos Passos

- [ ] Dashboard analítico com gráficos (Recharts/Chart.js)
- [ ] PWA com Service Worker
- [ ] Migração para backend (API REST)
- [ ] Integração com Power BI
- [ ] Exportação de dados (CSV/JSON)
- [ ] Adicionar testes automatizados (Vitest + React Testing Library)
- [ ] Lighthouse CI para auditoria de performance
- [ ] CodeQL para análise de segurança

## 📝 Licença

Este projeto é de uso pessoal.

