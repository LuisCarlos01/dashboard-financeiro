# ADR-003 - Persistência de Dados com LocalStorage

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

A aplicação precisa persistir dados de transações financeiras e sessões de autenticação entre recarregamentos da página. Como é uma aplicação frontend-only, não há banco de dados servidor disponível.

A solução precisa ser simples, funcionar offline, e não requerer configuração adicional.

## Decisão

Usar **LocalStorage do navegador** como camada única de persistência para:

1. **Transações financeiras:** Armazenadas em `financeiro:lancamentos`
2. **Sessões de autenticação:** Armazenadas em `financeiro:session`

Os dados são serializados como JSON e persistidos no LocalStorage. A camada de serviços (`storage.service.ts` e `session.service.ts`) abstrai o acesso ao LocalStorage, facilitando migração futura.

**Evidência no código:**
- [`src/services/storage.service.ts`](src/services/storage.service.ts) - CRUD de transações
- [`src/services/session.service.ts`](src/services/session.service.ts) - Gerenciamento de sessão

## Alternativas Consideradas

1. **IndexedDB**
   - Pros: Suporta mais dados (até GBs), estrutura de dados mais rica, transações
   - Contras: API mais complexa, overhead desnecessário para volumes pequenos
   - **Não escolhida:** Complexidade adicional sem benefício imediato

2. **SessionStorage**
   - Pros: Limpeza automática ao fechar aba
   - Contras: Dados perdidos ao fechar navegador, não adequado para persistência
   - **Não escolhida:** Precisamos persistência entre sessões

3. **Cookies**
   - Pros: Enviados automaticamente em requisições, podem ter expiração
   - Contras: Limite de tamanho (4KB), enviados em todas requisições (overhead)
   - **Não escolhida:** Limitado demais para armazenar transações

4. **Backend + Banco de Dados**
   - Pros: Persistência robusta, sincronização cross-device, backup automático
   - Contras: Requer infraestrutura, complexidade alta
   - **Não escolhida:** Incompatível com arquitetura frontend-only atual

5. **Cloud Storage (Firebase Firestore, Supabase)**
   - Pros: Sincronização automática, backup, multi-device
   - Contras: Dependência externa, custos, vendor lock-in
   - **Não escolhida:** Queremos simplicidade e controle total

## Consequências

### ✅ Pontos Positivos

- **Simplicidade máxima:** API nativa do navegador, zero configuração
- **Funciona offline:** Dados disponíveis mesmo sem internet
- **Performance local:** Acesso instantâneo, sem latência de rede
- **Sem custos:** Não requer serviços pagos ou infraestrutura
- **Abstração preparada:** Service layer facilita migração futura

### ⚠️ Limitações

- **Limitado ao navegador:** Dados não sincronizam entre dispositivos
- **Sem backup automático:** Dados perdidos se limpar cache/LocalStorage
- **Limite de tamanho:** ~5-10MB por domínio (suficiente para milhares de transações)
- **Editável pelo usuário:** Dados podem ser modificados via DevTools
- **Sem versionamento:** Não há histórico de mudanças ou rollback
- **Dependente do navegador:** Dados ficam presos ao navegador específico

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Necessidade de sincronização:** Quando precisar acessar dados de múltiplos dispositivos
2. **Volume de dados:** Se o limite do LocalStorage (~5-10MB) se tornar restritivo
3. **Backup crítico:** Se perder dados se tornar inaceitável
4. **Multi-usuário:** Se precisar suportar múltiplas contas simultâneas
5. **Migração para backend:** Ao adotar arquitetura full-stack (ver ADR-001)

**Nota:** O código já está preparado para migração através da abstração em `storage.service.ts`, que pode ser substituído por chamadas de API sem mudar componentes que o utilizam.
