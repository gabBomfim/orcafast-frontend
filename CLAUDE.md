# OrçaFast — Frontend

> **LEIA ESTE DOCUMENTO ANTES DE QUALQUER IMPLEMENTAÇÃO.**
> Após cada nova feature, atualizar as seções marcadas com ⚠️.

---

## Identidade da Marca (NUNCA VIOLAR)

- A marca é FEMININA: "**a OrçaFast**", nunca "o OrçaFast"
- Nunca usar a palavra **"proposta"** — sempre **"orçamento"**
- Tom de voz: direto, encorajador, prático. Persona: **Emílio, 32 anos** — parceiro, não guru
- Linguagem simples, popular, coloquial profissional. Sem jargão corporativo
- Quem aprova o orçamento é o **USUÁRIO**, não o cliente

### Palavras PROIBIDAS
`proposta` · `analytics` · `template` · `freelancer` · `pipeline` · `stakeholder` · `synergy` · `sinergia` · `paradigma` · `escalável` · `ecossistema` · `disruptivo` · `alavancar` · `potencializar` · `metodologia` · `KPI` · `OKR` · `networking` · `mindset` · `dashboard` (use "painel") · `URL` (use "link")

### Tom nas Mensagens (Emílio fala assim)
| Errado | Certo |
|--------|-------|
| "E-mail inválido" | "Esse e-mail não tá certo." |
| "Campo obrigatório" | "Esqueceu o nome do cliente." |
| "Erro interno do servidor" | "Ih, algo deu errado aqui. A gente já sabe e tá resolvendo." |
| "Orçamento aprovado com sucesso" | "Orçamento aprovado! Hora de colocar a mão na massa. Bora trabalhar!" |
| "Nenhum registro encontrado" | "Nenhum orçamento por aqui ainda. Que tal criar o primeiro? É rápido." |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18.2 + Vite 7.1 |
| UI Library | **Chakra UI 2.8** — tema customizado em `src/theme/` |
| Estado Global | Redux 4.2 + react-redux 8.1 |
| Roteamento | React Router DOM 6.8 |
| HTTP | Axios 1.6 — instância em `src/api.js` com interceptors |
| Select | **react-select 5.x** (NUNCA o Select nativo do Chakra) |
| Animações | framer-motion 6.5 |
| Ícones | react-icons 4.12 |
| Pagamento | Stripe (via `subscriptionService`) |
| Build | Vite · Scripts: `npm run dev`, `npm run build`, `npm run lint` |
| Env | `.env` com `VITE_API_URL`, `VITE_GOOGLE_REDIRECT_URL`, `VITE_STRIPE_PUBLIC_KEY` |

---

## Estrutura de Pastas

```
src/
├── api.js                  ← instância Axios com interceptors (auth + 401 redirect)
├── App.jsx                 ← definição de todas as rotas (50+ rotas)
├── main.jsx                ← entry point
│
├── config/
│   └── api.js              ← BASE_URL, TIMEOUT (10s), endpoints
│
├── theme/
│   ├── index.js            ← tema Chakra (cores, variantes, inputs, botões)
│   └── selectStyles.js     ← estilos do react-select alinhados ao tema
│
├── styles/
│   └── landing.css         ← CSS da landing page (variáveis CSS globais)
│
├── components/
│   ├── layout/             ← Layout, Header, Sidebar, Container, OnboardingLayout
│   ├── auth/               ← LoginForm, RegisterForm, ProtectedRoute
│   └── ui/                 ← componentes reutilizáveis (ver seção abaixo)
│
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx / RegisterPage.jsx
│   ├── DashboardPage.jsx / InitialDashboardPage.jsx
│   ├── ClientesPage.jsx / CreateClientPage.jsx
│   ├── PropostasPage.jsx / CreateProposalPage.jsx / ProposalSuccessPage.jsx
│   ├── PublicProposalView.jsx
│   ├── UsersPage.jsx / InviteAcceptPage.jsx
│   ├── auth/               ← ForgotPasswordPage, ResetPasswordPage, GoogleCallbackPage
│   ├── onboarding/         ← CreateClientPage, CreateProposalPage, SendProposalPage
│   ├── settings/           ← SettingsProfile, SettingsCompany, SettingsGoals, SettingsSubscription
│   └── institucional/      ← TermosDeUso, PoliticaPrivacidade, Suporte, LayoutInstitucional
│
├── hooks/
│   ├── useAuth.js          ← logout, getCurrentUser, updateUser, isAuthenticated
│   ├── useApi.js           ← wrapper para chamadas de API com loading/error/toast
│   ├── useIdleTimeout.js   ← auto-logout após 30 min de inatividade
│   └── useSubscription.js  ← plano atual, flags de feature, trial info
│
├── contexts/
│   ├── OnboardingContext.jsx  ← dados do guest antes do login (localStorage: pending_onboarding)
│   └── SidebarContext.jsx     ← colapso/expansão da sidebar (mobile-aware < 768px)
│
├── services/               ← TODA chamada de API passa por aqui
│   ├── auth.service.js / client.service.js / proposal.service.js
│   ├── company.service.js / subscription.service.js / goals.service.js
│   ├── dashboard.service.js / teamUser.service.js
│   ├── invitation.service.js / onboarding.service.js
│   └── index.js
│
├── utils/
│   ├── formMessages.js     ← TODAS as mensagens de validação/feedback
│   ├── storage.js          ← wrapper de localStorage (token, user, subscription)
│   ├── mask.js             ← maskPhone(), unmaskPhone()
│   └── whatsapp.js         ← openWhatsApp() com detecção mobile/desktop
│
└── types/                  ← interfaces TypeScript (migração gradual)
```

---

## Cores e Design System

> **NUNCA hardcodar cores.** Sempre usar tokens do tema Chakra ou variáveis CSS.

### Paleta Principal (`src/theme/index.js`)

| Token | Hex | Uso |
|-------|-----|-----|
| `emerald.500` | `#00d97e` | CTA principal, foco, brand |
| `emerald.600` | `#00b368` | Hover |
| `gray.50` | `#f8fafc` | Background |
| `gray.100` | `#f1f5f9` | Chips, fundo sutil |
| `gray.200` | `#e2e8f0` | Bordas |
| `gray.400` | `#94a3b8` | Placeholder |
| `gray.500` | `#64748b` | Texto secundário |
| `gray.900` | `#0f172a` | Texto principal |
| `dark.500` | `#0a1628` | Gradiente landing |
| `dark.300` | `#0f1f3a` | Gradiente landing |

### Variáveis CSS (`src/styles/landing.css`)

```css
--primary: #00d97e;
--primary-dark: #00b368;
--accent: #e8f8f2;
--background: #ffffff;
--foreground: #0a1628;
--muted-foreground: #64748b;
--border: #e2e8f0;
```

### Padrão de Inputs — `variant="app"` (OBRIGATÓRIO)

```jsx
<Input variant="app" placeholder="..." />
```

- `bg: white` · `border: 1.5px solid gray.200` · `borderRadius: xl (12px)` · `height: 48px`
- Focus: `border emerald.500` + `box-shadow: 0 0 0 2px #00d97e`
- NUNCA `<Select>` nativo do Chakra — sempre `<ReactSelect>` com `src/theme/selectStyles.js`

### Variantes de Botão

| Variante | Uso |
|----------|-----|
| `solid` | Ação primária — gradiente emerald |
| `gradient` | CTA de alta ênfase — sombra maior |
| `outline` | Ação secundária |
| `ghost` | Ação terciária / links |

### Badges de Status

Variantes do tema: `approved` (verde) · `viewed` (azul) · `sent` (amarelo) · `rejected` (vermelho) · `draft` (cinza)

---

## Padrões de Código

- Componentes: **arrow function** + **functional component**
- Nomeação: `PascalCase` para componentes, `camelCase` para funções/variáveis
- Arquivo de componente: `ProposalCard.jsx` (nunca `proposal-card.jsx`)
- Cada componente em sua própria pasta com `index.jsx` + estilos se necessário
- Props com `PropTypes` ou interface TypeScript — **nunca inline sem tipagem**
- **Nenhuma lógica de negócio em componentes de UI**
- **Nunca `fetch` direto** — sempre via service (`src/services/`)
- **Nunca hardcodar cores** — sempre tokens do tema

---

## Mensagens e Feedback (`src/utils/formMessages.js`)

Biblioteca centralizada com **todas** as mensagens. Tom: direto e encorajador (voz do Emílio).
**Nunca escrever mensagem de erro fora desta biblioteca.**

```js
import { formMessages, successMessages, warningMessages, infoMessages } from '../utils/formMessages'

formMessages.required.name        // "Esqueceu o nome do cliente."
formMessages.invalid.email        // "Esse e-mail não tá certo."
formMessages.password.mismatch    // "As senhas não batem."
formMessages.auth.emailInUse      // "Já tem uma conta com esse e-mail."
formMessages.system.serverError   // "Ih, algo deu errado aqui. A gente já sabe e tá resolvendo."
formMessages.quote.noItems        // "Coloca pelo menos um item no orçamento."

successMessages.save              // "Salvo com sucesso."
successMessages.proposalSent      // "Orçamento enviado! Agora é só aguardar."
warningMessages.deleteConfirm     // "Tem certeza que quer apagar? Não dá pra desfazer."
infoMessages.loading              // "Carregando..."
```

**Categorias:** `required` · `invalid` · `length` · `password` · `value` · `date` · `file` · `auth` · `system` · `quote` · `client`

### Componentes de Feedback (`src/components/ui/FormFeedback.jsx`)

```jsx
import { FormFeedback, FieldError, FieldHint } from '../components/ui/FormFeedback'

<FormFeedback type="error" message={formMessages.auth.emailInUse} />  // bloco de alerta
<FieldError message={errors.email} />                                  // erro inline
<FieldHint message="Será exibido no orçamento." />                     // dica sutil
```

Tipos disponíveis: `error` · `success` · `warning` · `info`

---

## ⚠️ Componentes Existentes (atualizar ao criar novo)

### UI (`src/components/ui/`)

| Componente | Descrição |
|-----------|-----------|
| `StatusBadge` | Badge colorido por status (1–5) com ícone |
| `StatsCard` | Card de métrica com ícone, título, valor, helpText. Props: `isActive`, `onClick` |
| `SearchBar` | Input de busca com ícone FiSearch, placeholder "Buscar..." |
| `ActionCard` | Card de ação — suporta `Link` e `onClick`. Variante `dashed` para estados vazios |
| `DataCard` | Container com título, subtítulo e `headerAction` |
| `FormFeedback` | `FormFeedback` (bloco) · `FieldError` (inline) · `FieldHint` (dica sutil) |
| `Pagination` | Paginação com truncamento inteligente (máx 5 páginas visíveis) |
| `LoginModal` | Modal login/cadastro com toggle. Google OAuth + Stripe checkout |
| `WelcomePlanModal` | Modal pós-assinatura com features do plano escolhido |
| `EmailVerificationModal` | Modal não-closeable de verificação de e-mail com polling a cada 5s. Permite alterar e-mail dentro do modal |
| `PaywallModal` | Modal não-closeable de bloqueio quando trial expira. Comparativo de 2 planos (Autônomo/Equipe) com upsell inteligente baseado em membros da equipe |
| `OrcafastLogo` | Logo: `variant="full"` (40px) ou `variant="symbol"` (32px) |
| `TeamRankingCard` | Ranking de fechados por membro (admin com equipe). Top 5 + "Ver todo o ranking +N", toggle Quantidade/Valor, destaque "VOCÊ", barras hachuradas pra zerados. Cada linha → `/dashboard/propostas?status=approved&user_ids[]=<id>`. Mobile: reflow em 2 linhas com área de toque ampla |

### Layout (`src/components/layout/`)

| Componente | Descrição |
|-----------|-----------|
| `Layout` | Wrapper dashboard: Header + Sidebar + conteúdo. Props: `headerTitle`, `showBackButton`, `headerRightContent` |
| `Header` | Barra superior de navegação |
| `Sidebar` | Menu lateral com colapso/expansão |
| `SidebarContent` | Itens de menu da sidebar |
| `SidebarToggle` | Botão colapsar/expandir |
| `Container` | Wrapper de conteúdo interno |
| `OnboardingLayout` | Layout específico para fluxo de onboarding |

### Auth (`src/components/auth/`)

| Componente | Descrição |
|-----------|-----------|
| `LoginForm` | Formulário email/senha + OAuth Google |
| `RegisterForm` | Formulário de cadastro |
| `ProtectedRoute` | Guard de rota para páginas autenticadas |

---

## ⚠️ Serviços (`src/services/`) — atualizar ao criar novo

| Service | Métodos |
|---------|---------|
| `authService` | `register`, `login`, `logout`, `getCurrentUser`, `getProfile`, `forgotPassword`, `resetPassword`, `updateProfile`, `resendVerification()`, `updateEmail(email)` |
| `clientService` | `list(params)`, `get(id)`, `create`, `update`, `delete` — auto-injeta `company_id` |
| `proposalService` | `list`, `get`, `create`, `update`, `delete`, `send`, `downloadPDF`, `updateStatus`, `getPublicProposal(token)`, `downloadPublicPDF(token)` |
| `companyService` | `get()`, `update(formData)` multipart, `deleteLogo()` |
| `subscriptionService` | `getStatus()`, `teamInfo()`, `checkout(planSlug, url)`, `cancel()`, `resume()`, `portal()` |
| `goalsService` | `get(year)`, `save(payload)` |
| `dashboardService` | `get(params)` — filtrável por período |
| `teamUserService` | `list()`, `store(data)`, `show(id)`, `update(id, data)`, `destroy(id)` |
| `invitationService` | `validate(token)`, `accept(token, data)` |
| `onboardingService` | `associate(guestData)` — vincula dados de guest a conta nova |

---

## ⚠️ Rotas (`src/App.jsx`) — atualizar ao adicionar rota

### Públicas
`/` · `/login` · `/register` · `/esqueci-senha` · `/redefinir-senha` · `/auth/callback` · `/verificar-email` · `/share/proposta/:token` · `/convite/:token` · `/termos` · `/privacidade` · `/suporte`

### Onboarding (guest)
`/onboarding/create-client` · `/onboarding/create-proposal` · `/onboarding/send-proposal`

### Protegidas (ProtectedRoute)
`/dashboard` · `/initial-dashboard` · `/dashboard/clientes` · `/dashboard/clientes/novo` · `/dashboard/propostas` · `/dashboard/propostas/nova` · `/dashboard/propostas/sucesso` · `/dashboard/orcamentos/:id/enviar` · `/dashboard/configuracoes/perfil` · `/dashboard/configuracoes/empresa` · `/dashboard/configuracoes/metas` · `/dashboard/configuracoes/assinatura` · `/dashboard/usuarios`

---

## Regras de Negócio

### Status do Orçamento
| Código | Status | Quem muda | Gatilho |
|--------|--------|-----------|---------|
| `1` | Pendente de envio (Rascunho) | Sistema | Criação |
| `2` | Enviado | Sistema | Clicar enviar/copiar link |
| `3` | Visualizado | Sistema | Acessar via link (se não for o dono) |
| `4` | **Aprovado** | **Usuário** (manual) | Após confirmação do cliente |
| `5` | **Reprovado** | **Usuário** (manual) | Após confirmação do cliente |

### Planos
| Plano | Preço | Recursos |
|-------|-------|---------|
| Autônomo | R$ 49,90/mês | Orçamentos ilimitados · Painel · Metas · Logo · Rastreamento · Suporte |
| Equipe | R$ 97,90/mês | Tudo do Autônomo + Gestão de equipe + Painel gerencial por membro |

### Multi-tenant
- **Toda** entidade tem `company_id`
- Membro (`role: 3`): vê apenas os **próprios** orçamentos e clientes
- Admin (`role: 1`): vê tudo da empresa, pode filtrar por membro
- `clientService` auto-injeta `company_id` do localStorage
- Metas financeiras: apenas Admin pode definir

### Ranking do time (Painel)
- Card `TeamRankingCard` aparece no painel **apenas para admins** (`role 1` / `role 3`) com plano Equipe ou em trial
- Compara orçamentos fechados (status `4`) por membro — toggle Quantidade × Valor (R$)
- Filtra pelo período selecionado no painel (`this-month` / `last-month` / `this-year` / `custom`)
- Cada linha é um deep link para `/dashboard/propostas?status=approved&user_ids[]=<id>` — `PropostasPage` lê esses search params no mount e já abre filtrado por membro + status fechado
- Membros zerados aparecem com barra hachurada na expansão "Ver todo o ranking"

### Fluxo de Envio
- Link público via `sharing_token` → `/share/proposta/:token` (sem autenticação)
- WhatsApp: `openWhatsApp()` detecta mobile (app) vs desktop (web)
- Enviar/copiar → status `2 (Enviado)` automático
- Acessar via link → status `3 (Visualizado)` se o acesso NÃO for do dono
- Download em PDF na view pública via `proposalService.downloadPublicPDF(token)` → back-end `GET /proposta/{token}/pdf` (rota pública, valida sharing_token e expiração)
- O PDF segue o mesmo design da view pública (cards, paleta emerald, layout mobile-first em A4) — blades em `resources/views/proposals/pdf-free.blade.php` e `pdf-premium.blade.php`

### Onboarding Gamificado (guest → usuário)
1. Cadastro do cliente (Nome + Telefone obrigatórios; E-mail opcional)
2. Criação do orçamento com preview em tempo real
3. Escolha de envio (WhatsApp ou Link)
4. Modal de cadastro ao tentar enviar (Nome, E-mail, Empresa, Senha ou Google)
5. Stripe checkout (pagamento ou trial)
6. Retorno com modal de boas-vindas do plano (Autônomo ou Equipe)

### Autenticação
- JWT em `localStorage` via `src/utils/storage.js`
- Axios auto-attach `Bearer token` + redirect `/login` em 401
- Auto-logout por inatividade: 30 min (`useIdleTimeout`)
- Google OAuth: redirect + `GoogleCallbackPage`
- Convite de membro: link mágico com token → `InviteAcceptPage`

### Trial-First + Email Verification
- Novo usuário recebe **7 dias de trial** automático ao registrar (sem cartão de crédito)
- Sistema bloqueia acesso até **email verificado** (via `EmailVerificationModal`)
- Modal de verificação não pode ser fechado (closeOnOverlayClick/closeOnEsc = false)
- Polling a cada 5s via `authService.getProfile()` para detectar verificação
- Usuário pode alterar email dentro do modal e solicitar novo link de confirmação
- Após email verificado: `PaywallModal` aparece quando trial expira
- `PaywallModal` mostra comparativo de 2 planos com upsell inteligente (badge "RECOMENDADO" se `users_count > 1`)
- Página de settings `/dashboard/configuracoes/assinatura` também mostra comparativo quando em trial
- Downgrade de Equipe para Autônomo requer confirmação (alerta que membros perderão acesso)

### Trial e Bloqueio de Acesso
- `useSubscription()` retorna `hasActiveAccess` = true se subscrito OU em trial com dias restantes
- `ProtectedRoute` bloqueia tudo exceto email verification até `emailVerified = true`
- Após email verified: `PaywallModal` aparece se `!hasActiveAccess` (trial expirado)
- Banner de countdown no painel: mostra dias restantes + muda cor se ≤ 2 dias

---

## ⚠️ Regra: Atualizar Documentação Após Nova Feature

**Ao finalizar qualquer feature, OBRIGATORIAMENTE atualizar este arquivo:**

1. **Componentes Existentes** — novo componente com descrição
2. **Serviços** — novos métodos ou services
3. **Rotas** — nova rota na tabela correta
4. **Regras de Negócio** — se houver nova regra
5. **Hooks** — se criar novo hook

**Nenhuma feature está completa sem o CLAUDE.md atualizado.**

---

## O que NUNCA fazer

- Usar `fetch` direto — sempre via `src/services/`
- Hardcodar cores — sempre tokens do tema ou variáveis CSS
- Escrever mensagem de erro/validação fora de `formMessages.js`
- Criar componente sem tipagem de props
- Colocar lógica de negócio em componente de UI
- Usar `<Select>` nativo do Chakra — sempre `react-select` com `selectStyles`
- Usar input sem `variant="app"` sem justificativa
- Usar inglês no copy de interface — sempre português coloquial
- Escrever "proposta" — sempre "orçamento"
- Escrever "o OrçaFast" — sempre "a OrçaFast"
- Dar acesso a metas financeiras para membros (`role: 3`)
- Criar entidade sem `company_id`
