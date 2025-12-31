# 🚀 Quick Start - Dashboard Financeiro

Guia rápido para começar a usar o Dashboard Financeiro em **menos de 5 minutos**.

## ⚡ Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Autenticação

**Gerar hash de senha:**

```bash
npm run generate-hash
```

Digite sua senha quando solicitado. O script irá exibir um hash SHA-256.

**Criar arquivo `.env.local`:**

```bash
# Windows PowerShell
Copy-Item env.example .env.local

# Linux/Mac
cp env.example .env.local
```

**Editar `.env.local` com suas credenciais:**

```bash
VITE_AUTH_EMAIL=seu@email.com
VITE_AUTH_PASSWORD_HASH=cole_o_hash_gerado_aqui
VITE_AUTH_USER_NAME=Seu Nome
```

### 3. Iniciar Aplicação

```bash
npm run dev
```

Acesse: http://localhost:5173

### 4. Fazer Login

Use o email e senha que você configurou no `.env.local`.

---

## ✅ Pronto!

Agora você pode:
- ✅ Cadastrar lançamentos financeiros
- ✅ Visualizar resumo (Entradas, Saídas, Saldo)
- ✅ Filtrar e ordenar transações
- ✅ Ver seus dados mesmo após refresh (sessão persistente)

---

## 📚 Documentação Completa

- **Autenticação detalhada:** [SETUP_AUTH.md](../config-auth/SETUP_AUTH.md)
- **README principal:** [README.md](../../README.md)
- **Deploy na Vercel:** [SETUP_VERCEL.md](../config-vercel/SETUP_VERCEL.md)

---

## 🐛 Problemas Comuns

### "Credenciais não configuradas"

✅ **Solução:** Certifique-se que criou o `.env.local` e reiniciou o servidor (`npm run dev`).

### "Email ou senha inválidos"

✅ **Solução:** Verifique se o hash foi copiado corretamente (64 caracteres hexadecimais).

### Build falha no TypeScript

✅ **Solução:** Execute `npm run lint` para verificar erros de código.

---

## 💡 Dicas

1. **Senha de exemplo:** O hash `5e88...1542d8` no `env.example` corresponde à senha `password`
2. **Sessão:** Dura 7 dias. Você não precisa fazer login sempre.
3. **Logout:** Clique no botão "Sair" no canto superior direito.

---

## 🎯 Próximos Passos

1. Explore a interface
2. Crie suas primeiras transações
3. Configure categorias personalizadas (futuro)
4. Exporte seus dados (futuro)

**Bom uso! 🎉**

