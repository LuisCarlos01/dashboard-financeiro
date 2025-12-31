# Guia de Configuração do Vercel

## Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Passo 2: Login no Vercel

```bash
vercel login
```

## Passo 3: Criar/Linkar Projeto no Vercel

Na raiz do projeto, execute:

```bash
vercel link
```

Você será perguntado:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecione sua conta/organização
- **Link to existing project?** → `N` (se for novo projeto) ou `Y` (se já existe)
- **What's your project's name?** → `dashboard-financeiro` (ou o nome que preferir)
- **In which directory is your code located?** → `./` (raiz)

## Passo 4: Extrair IDs

Após o `vercel link`, será criado o arquivo `.vercel/project.json`. Execute:

```bash
# Windows PowerShell
Get-Content .vercel\project.json

# Windows CMD
type .vercel\project.json

# Linux/Mac
cat .vercel/project.json
```

Você verá algo assim:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

**Copie esses valores:**
- `orgId` → será o `VERCEL_ORG_ID`
- `projectId` → será o `VERCEL_PROJECT_ID`

## Passo 5: Adicionar Secrets no GitHub

1. Vá para: `https://github.com/SEU_USUARIO/Dashboard-financeiro/settings/secrets/actions`
2. Clique em **"New repository secret"** para cada um:

### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Secret:** (cole o token que você já criou)

### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Secret:** (cole o `orgId` do arquivo `.vercel/project.json`)

### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Secret:** (cole o `projectId` do arquivo `.vercel/project.json`)

## Passo 6: Verificar Configuração

Após adicionar os 3 secrets, você deve ter:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

## Passo 7: Testar o Deploy

1. Faça um commit e push para `main`:
   ```bash
   git add .
   git commit -m "chore: configura CI/CD com Vercel"
   git push origin main
   ```

2. Ou crie um Pull Request para testar o preview deploy

3. Vá para **Actions** no GitHub e acompanhe o pipeline

4. Se tudo estiver correto, você verá:
   - ✅ CI passando (lint + build)
   - ✅ Deploy preview/production sendo criado
   - ✅ URL do deploy disponível

## Troubleshooting

### Erro: "Project not found"
- Verifique se o `VERCEL_PROJECT_ID` está correto
- Certifique-se de que o projeto existe no Vercel

### Erro: "Invalid token"
- Verifique se o `VERCEL_TOKEN` está correto
- Certifique-se de que o token não expirou
- Gere um novo token se necessário

### Erro: "Organization not found"
- Verifique se o `VERCEL_ORG_ID` está correto
- Certifique-se de que você tem acesso à organização

## Próximos Passos

Após configurar, você pode:
- Configurar domínio custom no Vercel (opcional)
- Adicionar variáveis de ambiente no Vercel Dashboard
- Configurar branch protection rules no GitHub

