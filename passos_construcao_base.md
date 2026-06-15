# SIGAH — Passos para Construção da Base do Projeto

> Baseado no documento **"SIGAH — Arquitetura Frontend · v3"**
> Stack: Next.js 14 (App Router) · Tailwind CSS · shadcn/ui · TypeScript

---

## Princípios Fundamentais (observar durante toda a construção)

- O **frontend exibe, coleta e encaminha** — nunca decide. Lógica de negócio é do backend.
- Nunca hardcode um `programId` dentro de componentes. Usar `useProgram()` + `FeatureGate`.
- Nunca duplicar uma página por programa. Novo programa = nova config no backend.
- Validação client-side (formato) ≠ validação de negócio (elegibilidade).
- Permissões de navegação no frontend; operações de permissão no backend.

---

## Etapa 1 — Tipagem do Domínio (`types/`) ✅

Criar os contratos TypeScript que serão usados em toda a aplicação.

### Passo 1.1 · `types/program.ts`
- [x] Definir interface `ProgramUIConfig` — objeto leve de configuração visual por programa
  - Campos: `id`, `name`, `slug`, `theme` (cores, logo), `enabledSections` (feature flags de UI), `formType` (family | property), `labels` (rótulos customizáveis)
- [x] Definir tipo `ProgramId` (string branding)

### Passo 1.2 · `types/family.ts`
- [x] Definir interface `FamilyMember` — nome, CPF, parentesco, data de nascimento, etc.
- [x] Definir interface `FamilyRegistration` — dados completos do cadastro familiar
  - Composição social, renda, endereço, documentos, status de integração CadÚnico

### Passo 1.3 · `types/api.ts`
- [x] Definir tipos genéricos de resposta da API: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`
- [x] Definir enums de status: `RegistrationStatus`, `ProcessStage`, `AuditAction`

---

## Etapa 2 — Contextos de Aplicação (`contexts/`)

Criar os providers React que distribuem estado global.

### Passo 2.1 · `contexts/ProgramContext.tsx`
- [x] Criar `ProgramProvider` — recebe `ProgramUIConfig` e distribui via Context
- [x] Criar hook `useProgram()` — retorna a config do programa ativo
  - Lança erro se usado fora do provider
- [x] Incluir feature flags de UI acessíveis via `useProgram().enabledSections`

### Passo 2.2 · `contexts/UserContext.tsx`
- [x] Criar `UserProvider` — gerencia dados do usuário autenticado
- [x] Criar hook `useUser()` — retorna perfil, permissões e status de autenticação
- [x] Criar hook `usePermissions()` — atalho para checagem de permissões por ação/recurso

---

## Etapa 3 — Cliente API (`lib/api/`)

Criar a camada de comunicação com o backend.

### Passo 3.1 · `lib/api/client.ts`
- [x] Criar instância base do fetch/axios com base URL configurável
- [x] Interceptor de autenticação (token JWT no header)
- [x] Tratamento centralizado de erros (`ApiError`)

### Passo 3.2 · `lib/api/programs.ts`
- [x] Função `fetchProgramConfig(programId): Promise<ProgramUIConfig>`
  - Cache stale-while-revalidate (⚠ atenção ao risco 1 do documento)
- [x] Função `fetchPrograms(): Promise<ProgramUIConfig[]>`

### Passo 3.3 · `lib/api/families.ts`
- [x] Funções CRUD para cadastros familiares
- [x] Função de consulta de status de integração CadÚnico

---

## Etapa 4 — Hooks Utilitários (`lib/hooks/`)

### Passo 4.1 · `lib/hooks/useProgram.ts`
- [x] Reexportar o hook de `contexts/ProgramContext` (ponto central de importação)

### Passo 4.2 · `lib/hooks/usePermissions.ts`
- [x] Hook que combina `useUser()` + `useProgram()` para checar permissões contextuais

---

## Etapa 5 — Validações e Formatadores (`lib/validations/` e `lib/formatters/`)

### Passo 5.1 · `lib/validations/`
- [x] Criar validações de formato: CPF, telefone, CEP, e-mail
- [x] **Apenas formato** — sem lógica de elegibilidade (é responsabilidade do backend)

### Passo 5.2 · `lib/formatters/`
- [x] Formatadores de CPF, moeda (BRL), data, telefone
- [x] Formatador de status/etapa processual para exibição

---

## Etapa 6 — Estrutura de Rotas (`app/`)

Montar o roteamento dinâmico por programa conforme a árvore definida no documento.

### Passo 6.1 · `app/page.tsx` (Landing / Seleção de Programa)
- [ ] Tela de entrada que lista programas disponíveis
- [ ] Redireciona para `/{programId}/dashboard` ao selecionar

### Passo 6.2 · `app/auth/`
- [ ] `app/auth/login/page.tsx` — tela de login
- [ ] `app/auth/recuperar/page.tsx` — recuperação de acesso

### Passo 6.3 · `app/[programId]/layout.tsx` ⭐ (Layout raiz por programa)
- [ ] Buscar `ProgramUIConfig` do backend via `fetchProgramConfig(programId)`
- [ ] Usar cache `stale-while-revalidate` do Next.js (⚠ Risco 1 — latência)
- [ ] Envolver children com `<ProgramProvider config={...}>` e `<UserProvider>`
- [ ] Proteger rotas autenticadas (redirecionar para `/auth/login` se não autenticado)

### Passo 6.4 · Páginas dentro de `app/[programId]/`
- [ ] `dashboard/page.tsx` — painel principal do programa
- [ ] `cadastro/page.tsx` — listagem de cadastros
- [ ] `cadastro/[familiaId]/page.tsx` — detalhes de um cadastro
- [ ] `classificacao/page.tsx` — exibe lista e status vindos da API
- [ ] `sorteio/page.tsx`
- [ ] `suplencia/page.tsx`
- [ ] `convocacao/page.tsx`
- [ ] `[candidatoId]/page.tsx` — detalhes de candidato
- [ ] `empreendimentos/page.tsx`
- [ ] `unidades/page.tsx`
- [ ] `auditoria/logs/page.tsx`
- [ ] `relatorios/page.tsx`

---

## Etapa 7 — Componentes de Domínio (`components/`)

### Passo 7.1 · `components/forms/` — Formulários Modulares
- [ ] `FamilyForm.tsx` — cadastro orientado à família
  - Seções condicionais controladas por feature flags do programa
  - Usar React Hook Form (⚠ Risco 3 — performance / re-renderização)
- [ ] `PropertyForm.tsx` — cadastro orientado ao imóvel
  - Ativado/desativado por programa via `useProgram()`

### Passo 7.2 · `components/display/` — Exibição de Dados da API
- [ ] `ScoringPanel.tsx` — recebe pontuação **já calculada** pelo backend e exibe
- [ ] `QuotaDisplay.tsx` — exibe distribuição de cotas
- [ ] `DeadlineStatus.tsx` — exibe indicador de prazos processuais
- [ ] `IntegrationStatus.tsx` — exibe status de integração com bases externas (CadÚnico)

### Passo 7.3 · `components/timeline/`
- [ ] `ProcessTimeline.tsx` — linha do tempo do processo do candidato
- [ ] `AuditLog.tsx` — histórico de ações/auditoria

### Passo 7.4 · `components/layout/FeatureGate.tsx` ⭐
- [ ] Componente que mostra/oculta children com base em feature flags do programa
- [ ] Props: `feature: string`, `fallback?: ReactNode`
- [ ] Usa `useProgram()` para ler `enabledSections`
- [ ] ⚠ Risco 2: FeatureGate **não é proteção real** — backend valida independentemente

### Passo 7.5 · `components/ui/`
- [ ] `DocumentUpload.tsx` — upload de documentos com preview
- [ ] `ConsentBanner.tsx` — banner LGPD para coleta de aceite (RF 040)

---

## Etapa 8 — Tema e Estilização

### Passo 8.1 · Configuração do Tailwind com CSS vars
- [ ] Definir variáveis de tema no `globals.css` (cores, fontes, espaçamentos)
- [ ] Configurar tema dinâmico por programa (cores aplicadas via `ProgramUIConfig.theme`)

### Passo 8.2 · Componentes shadcn/ui
- [ ] Garantir que os primitivos do shadcn estão configurados e acessíveis
- [ ] Verificar que `components.json` aponta para o diretório correto

---

## Resumo da Árvore Final Esperada

```
sigah-frontend/
├── app/
│   ├── [programId]/
│   │   ├── layout.tsx               ← ProgramProvider + UserProvider
│   │   ├── dashboard/page.tsx
│   │   ├── cadastro/
│   │   │   ├── page.tsx
│   │   │   └── [familiaId]/page.tsx
│   │   ├── classificacao/page.tsx
│   │   ├── sorteio/page.tsx
│   │   ├── suplencia/page.tsx
│   │   ├── convocacao/page.tsx
│   │   ├── [candidatoId]/page.tsx
│   │   ├── empreendimentos/
│   │   ├── unidades/
│   │   ├── auditoria/logs/page.tsx
│   │   └── relatorios/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── recuperar/page.tsx
│   └── page.tsx                     ← landing / seleção de programa
├── components/
│   ├── forms/    (FamilyForm, PropertyForm)
│   ├── display/  (ScoringPanel, QuotaDisplay, DeadlineStatus, IntegrationStatus)
│   ├── timeline/ (ProcessTimeline, AuditLog)
│   ├── layout/   (FeatureGate)
│   └── ui/       (DocumentUpload, ConsentBanner + shadcn)
├── contexts/     (ProgramContext, UserContext)
├── lib/
│   ├── api/      (client, programs, families)
│   ├── validations/
│   ├── formatters/
│   └── hooks/    (useProgram, usePermissions)
└── types/        (program.ts, family.ts, api.ts)
```

---

## ⚠ Riscos de Implementação (do documento de arquitetura)

| # | Risco | Mitigação |
|---|-------|-----------|
| 1 | Latência da ProgramUIConfig (gargalo de renderização) | Cache `stale-while-revalidate` no Next.js no `layout.tsx` |
| 2 | FeatureGate não é proteção real (risco de segurança) | Todo endpoint do backend valida permissões independentemente |
| 3 | Performance do FamilyForm (re-renderização) | Adotar React Hook Form para estado não-controlado |

---

## 🛠️ Instruções de Execução

1. **Seguir a ordem das etapas** — tipos primeiro, depois contextos, API, rotas e por fim componentes.
2. **TypeScript estrito** — nenhum `any`, todos os tipos explícitos.
3. **Nunca hardcode `programId`** — usar sempre `useProgram()`.
4. **Formulários** — usar React Hook Form desde o início.
5. **Testar cada etapa** — garantir que o build passa antes de avançar.
