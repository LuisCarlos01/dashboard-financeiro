# 🔐 Configuração de Autenticação

Este documento descreve como configurar a autenticação frontend-only do Dashboard Financeiro.

## 📋 Visão Geral

O sistema implementa autenticação frontend usando:
- **Auth Context + Session Token** pattern
- Hash SHA-256 para senhas
- Session token com expiração (7 dias)
- LocalStorage para persistência

## 🚀 Setup Rápido (3 minutos)

### Passo 1: Criar arquivo `.env.local`

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# Autenticação
VITE_AUTH_EMAIL=seu@email.com
VITE_AUTH_PASSWORD_HASH=seu_hash_aqui
VITE_AUTH_USER_NAME=Seu Nome
```

### Passo 2: Gerar Hash da Senha

Você precisa gerar um hash SHA-256 da sua senha. Existem duas formas:

#### Opção A: Usando o script fornecido (Recomendado)

```bash
# Instalar dependência (se ainda não tiver)
npm install -D tsx

# Gerar hash interativamente
npm run generate-hash

# OU passar senha como argumento
npm run generate-hash "sua_senha_aqui"
```

O script irá:
1. ✅ Gerar o hash SHA-256
2. ✅ Exibir instruções de configuração
3. ✅ Mostrar o valor completo para copiar

#### Opção B: Online (alternativa rápida)

1. Acesse: https://emn178.github.io/online-tools/sha256.html
2. Digite sua senha
3. Copie o hash gerado (resultado em hexadecimal)

### Passo 3: Atualizar `.env.local`

Cole o hash gerado no arquivo `.env.local`:

```bash
VITE_AUTH_EMAIL=seu@email.com
VITE_AUTH_PASSWORD_HASH=abc123def456...  # ← Cole o hash aqui
VITE_AUTH_USER_NAME=Seu Nome
```

### Passo 4: Iniciar aplicação

```bash
npm run dev
```

A tela de login será exibida. Use o email e senha que você configurou.

## ✅ Exemplo Completo

Arquivo `.env.local` configurado:

```bash
# Autenticação
VITE_AUTH_EMAIL=joao@example.com
VITE_AUTH_PASSWORD_HASH=5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
VITE_AUTH_USER_NAME=João Silva
```

**Login:**
- Email: `joao@example.com`
- Senha: `password` (hash acima corresponde a esta senha)

## 🔧 Solução de Problemas

### Erro: "Credenciais não configuradas"

**Causa:** Variáveis de ambiente não foram carregadas.

**Solução:**
1. Verifique se o arquivo se chama exatamente `.env.local`
2. Reinicie o servidor de desenvolvimento (`npm run dev`)
3. Confirme que as variáveis começam com `VITE_`

### Erro: "Email ou senha inválidos"

**Causa:** Hash da senha não corresponde ou email incorreto.

**Solução:**
1. Verifique o email no `.env.local`
2. Gere um novo hash usando `npm run generate-hash`
3. Certifique-se de copiar o hash completo (64 caracteres)

### Session expira muito rápido

**Solução:** A sessão dura 7 dias por padrão. Para mudar:

```typescript
// src/services/session.service.ts
const SESSION_DURATION_DAYS = 30; // Alterar aqui
```

## 🔒 Segurança

### Para Uso Pessoal (Atual)

✅ **Adequado:**
- Uso em dispositivo pessoal confiável
- Único usuário
- Dados financeiros pessoais

⚠️ **Limitações:**
- Token em LocalStorage vulnerável a XSS
- Hash visível no bundle (DevTools)
- Sem rate limiting real

### Para Produção Multi-usuário (Futuro)

Para uso em produção com múltiplos usuários, será necessário:

1. ✅ Backend com autenticação JWT
2. ✅ Senhas hashadas no servidor (bcrypt/argon2)
3. ✅ HTTPS obrigatório
4. ✅ Rate limiting
5. ✅ Tokens com refresh

**Nota:** O código já está preparado para migração. Apenas o `auth.service.ts` precisará ser alterado.

## 📚 Arquivos Relevantes

```
src/
├── types/auth.types.ts          # Tipos TypeScript
├── utils/crypto.utils.ts        # Hash SHA-256
├── services/
│   ├── auth.service.ts          # Verificação de credenciais
│   └── session.service.ts       # Gerenciamento de sessão
├── contexts/AuthContext.tsx     # Estado global de auth
└── pages/Login.tsx              # Interface de login

scripts/
└── generate-password-hash.ts    # Gerador de hash

env.example                      # Template de variáveis
```

## 🎯 Recursos

- ✅ Login com email/senha
- ✅ Sessão persistente (7 dias)
- ✅ Auto-login após refresh
- ✅ Logout limpa sessão
- ✅ Validação de formulário
- ✅ Loading states
- ✅ Mensagens de erro
- ✅ UI responsiva

## 💡 Dicas

1. **Troque a senha padrão:** O hash no `env.example` é da senha "password" (público)
2. **Não commite `.env.local`:** Este arquivo está no `.gitignore` por segurança
3. **Use senhas fortes:** Mínimo 8 caracteres, com letras, números e símbolos
4. **Backup de dados:** Use o export de dados regularmente (quando implementado)

## 🚀 Próximos Passos

Após configurar a autenticação:

1. ✅ Testar login/logout
2. ✅ Verificar persistência (refresh da página)
3. ✅ Criar suas primeiras transações
4. ✅ Explorar o dashboard

---

**Dúvidas?** Consulte o [README.md](README.md) principal ou a [documentação do plano](.cursor/plans/Trade-offs%20técnicos/autenticação_frontend_simples.plan.md).

