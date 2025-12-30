# ADR-001 - Arquitetura Frontend-Only sem Backend

- **Status:** Aceito
- **Data:** 30/12/2025

## Contexto

O Dashboard Financeiro foi projetado como uma aplicação web pessoal para controle financeiro. A necessidade inicial era criar uma solução simples, rápida de desenvolver e que funcionasse imediatamente sem a complexidade de configurar servidores, bancos de dados ou APIs.

O projeto precisa rodar localmente ou ser deployado como uma SPA estática, sem dependências de infraestrutura backend.

## Decisão

Adotar uma arquitetura **frontend-only**, onde toda a lógica de negócio, autenticação e persistência de dados roda exclusivamente no navegador do cliente.

A aplicação é uma SPA (Single Page Application) construída com React + TypeScript + Vite, que pode ser servida como arquivos estáticos. Não há backend, API REST ou banco de dados servidor.

## Alternativas Consideradas

1. **Arquitetura Full-Stack com Backend**
   - Pros: Segurança robusta, multi-usuário, sincronização cross-device
   - Contras: Complexidade alta, necessidade de infraestrutura, tempo de desenvolvimento maior
   - **Não escolhida:** Overhead desnecessário para uso pessoal inicial

2. **Backend-as-a-Service (Firebase/Supabase)**
   - Pros: Autenticação pronta, sincronização automática, escalável
   - Contras: Dependência de serviço externo, custos potenciais, vendor lock-in
   - **Não escolhida:** Queremos controle total e simplicidade inicial

3. **Arquitetura Híbrida (Frontend + API simples)**
   - Pros: Balanceamento entre simplicidade e funcionalidades
   - Contras: Ainda requer servidor e manutenção
   - **Não escolhida:** Complexidade adicional sem necessidade imediata

## Consequências

### ✅ Pontos Positivos

- **Simplicidade máxima:** Zero configuração de servidor, banco de dados ou API
- **Deploy trivial:** Pode ser hospedado em qualquer CDN (Vercel, Netlify, GitHub Pages)
- **Performance:** Sem latência de rede para operações locais
- **Custo zero:** Não requer servidor ou serviços pagos
- **Desenvolvimento rápido:** Foco apenas no frontend acelera implementação
- **Offline-first:** Funciona completamente offline após carregamento inicial

### ⚠️ Limitações

- **Segurança limitada:** Credenciais e dados sensíveis ficam no cliente
- **Sem sincronização:** Dados ficam presos ao navegador/dispositivo
- **Sem backup automático:** Depende do usuário fazer export manual
- **Escalabilidade limitada:** Não suporta múltiplos usuários simultâneos
- **Sem validação server-side:** Regras de negócio podem ser contornadas via DevTools

### 🔁 Quando Revisar Esta Decisão

Esta decisão deve ser revisitada quando:

1. **Necessidade de multi-usuário:** Se o sistema precisar suportar múltiplas pessoas
2. **Sincronização cross-device:** Quando o usuário precisar acessar dados de diferentes dispositivos
3. **Segurança crítica:** Se os dados financeiros se tornarem mais sensíveis ou regulados
4. **Escala de dados:** Quando o volume de transações tornar LocalStorage inviável
5. **Integrações externas:** Se precisar conectar com bancos, APIs financeiras ou serviços externos

**Nota:** O código já está preparado para migração futura através da camada de serviços abstraída (ver ADR-006).

