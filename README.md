# Dashboard Financeiro

Aplicação web moderna (PWA/SPA responsiva) para controle financeiro pessoal, desenvolvida com React + TypeScript + Vite.

## 🎯 Funcionalidades

- ✅ Cadastro de lançamentos financeiros (Entrada/Saída)
- ✅ Listagem com filtros avançados (data, tipo, categoria)
- ✅ Ordenação por data e valor
- ✅ Cards de resumo financeiro (Total Entradas, Total Saídas, Saldo)
- ✅ Persistência local (LocalStorage)
- ✅ Interface responsiva e moderna

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização utilitária
- **React Hook Form** - Gerenciamento de formulários
- **date-fns** - Manipulação de datas
- **Context API** - Gerenciamento de estado

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
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

## 🔮 Próximos Passos

- [ ] Dashboard analítico com gráficos (Recharts/Chart.js)
- [ ] PWA com Service Worker
- [ ] Migração para backend (API REST)
- [ ] Integração com Power BI
- [ ] Exportação de dados (CSV/JSON)

## 📝 Licença

Este projeto é de uso pessoal.

