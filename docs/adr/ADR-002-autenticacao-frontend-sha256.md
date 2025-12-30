# ADR-002 - Autenticação Frontend com SHA-256 e Env Vars

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

Mesmo sendo uma aplicação frontend-only para uso pessoal, ainda é necessário proteger o acesso aos dados financeiros. A solução precisa ser simples de implementar, não requerer backend, mas oferecer uma camada básica de segurança.

O sistema precisa validar credenciais e manter uma sessão persistente para evitar login repetido a cada acesso.

## Decisão

Implementar autenticação **frontend-only** usando:

1. **Hash SHA-256** para senhas (via Web Crypto API nativa)
2. **Variáveis de ambiente** (`VITE_AUTH_EMAIL`, `VITE_AUTH_PASSWORD_HASH`) para armazenar credenciais
3. **Session Token UUID** armazenado no LocalStorage com expiração de 7 dias
4. **Context API** para gerenciar estado de autenticação globalmente

A validação ocorre comparando o hash da senha informada com o hash armazenado nas variáveis de ambiente. O token de sessão é gerado localmente e não é validado por nenhum servidor.

**Evidência no código:**
- [`src/services/auth.service.ts`](src/services/auth.service.ts) - Verificação de credenciais
- [`src/services/session.service.ts`](src/services/session.service.ts) - Gerenciamento de sessão
- [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) - Estado global de auth
- [`src/utils/crypto.utils.ts`](src/utils/crypto.utils.ts) - Funções de hash

## Alternativas Consideradas

1. **Autenticação JWT com Backend**
   - Pros: Segurança robusta, padrão da indústria, tokens assinados
   - Contras: Requer backend, complexidade adicional
   - **Não escolhida:** Incompatível com arquitetura frontend-only atual

2. **Sem Autenticação**
   - Pros: Máxima simplicidade, zero configuração
   - Contras: Dados financeiros completamente desprotegidos
   - **Não escolhida:** Risco de segurança inaceitável mesmo para uso pessoal

3. **Autenticação com Bibliotecas Externas (Auth0, Firebase Auth)**
   - Pros: Solução pronta, segura, bem testada
   - Contras: Dependência externa, custos potenciais, vendor lock-in
   - **Não escolhida:** Queremos controle total e simplicidade

4. **Hash mais forte (bcrypt, argon2)**
   - Pros: Mais seguro contra ataques de força bruta
   - Contras: Requer bibliotecas externas, não disponível nativamente no browser
   - **Não escolhida:** SHA-256 é suficiente para uso pessoal e usa API nativa

## Consequências

### ✅ Pontos Positivos

- **Implementação simples:** Usa apenas APIs nativas do navegador (Web Crypto API)
- **Zero dependências externas:** Não requer bibliotecas de autenticação
- **Sessão persistente:** Usuário não precisa fazer login a cada acesso (7 dias)
- **Preparado para migração:** Código abstraído permite trocar apenas `auth.service.ts` no futuro
- **Adequado para uso pessoal:** Oferece proteção básica suficiente para dados pessoais

### ⚠️ Limitações

- **Hash visível no bundle:** O hash da senha fica exposto no código JavaScript compilado
- **Token editável:** Session token no LocalStorage pode ser modificado via DevTools
- **Sem rate limiting real:** Tentativas de login não são limitadas efetivamente
- **Vulnerável a XSS:** Se houver XSS, token pode ser roubado do LocalStorage
- **Não multi-usuário:** Suporta apenas um conjunto de credenciais por instalação

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Migração para backend:** Ao adotar arquitetura full-stack (ver ADR-001)
2. **Necessidade de multi-usuário:** Se precisar suportar múltiplas contas
3. **Segurança crítica:** Se os dados se tornarem mais sensíveis ou regulados
4. **Ataques reais:** Se houver evidência de tentativas de acesso não autorizado
5. **Integração com serviços externos:** Se precisar autenticar com APIs de terceiros

**Nota:** O código já possui comentários indicando como migrar para backend (ver [`src/services/auth.service.ts`](src/services/auth.service.ts), linhas 50-64).
