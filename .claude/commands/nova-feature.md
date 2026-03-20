# Implementar Nova Feature

Guia completo para implementar uma nova feature do zero.

## Antes de começar

1. Leia o `CLAUDE.md` completo
2. Entenda a regra de negócio da feature
3. Mapeie o que será necessário: componentes, service, rota, hook?

## Checklist de implementação

### 1. Service (se precisar de API)
- [ ] Criar ou atualizar em `src/services/`
- [ ] Exportar em `src/services/index.js`
- [ ] Atualizar tabela de Serviços no `CLAUDE.md`

### 2. Componentes de UI
- [ ] Criar em `src/components/ui/` (reutilizável) ou inline na página (uso único)
- [ ] Props tipadas com PropTypes
- [ ] Sem lógica de negócio
- [ ] Cores via tokens do tema
- [ ] Inputs com `variant="app"`
- [ ] Atualizar seção "Componentes Existentes" no `CLAUDE.md`

### 3. Página (se for nova rota)
- [ ] Criar em `src/pages/`
- [ ] Registrar em `src/App.jsx`
- [ ] Definir se é pública ou protegida (ProtectedRoute)
- [ ] Atualizar tabela de Rotas no `CLAUDE.md`

### 4. Mensagens e validações
- [ ] Adicionar novas mensagens em `src/utils/formMessages.js` se necessário
- [ ] Usar `<FieldError>`, `<FormFeedback>` ou `<FieldHint>`

### 5. Multi-tenant (se a feature lida com dados)
- [ ] Garantir que entidade tem `company_id`
- [ ] Verificar permissão por `role` (admin vs membro)
- [ ] Testar isolamento entre empresas

### 6. Regras de negócio específicas do orçamento
- [ ] Status muda automaticamente ao enviar (→ 2) e visualizar (→ 3)
- [ ] Status 4 e 5 são SEMPRE manuais pelo usuário
- [ ] Link público não requer autenticação

### 7. Documentação (OBRIGATÓRIO ao finalizar)
- [ ] Atualizar `CLAUDE.md` — todas as seções ⚠️ relevantes
- [ ] Confirmar que nenhuma feature anterior foi quebrada

## Tom e linguagem

Qualquer copy novo deve seguir o tom do Emílio:
- Direto, curto, coloquial profissional
- Sem jargão, sem anglicismo desnecessário
- Celebrar ações concretas, não genéricas
- Nunca usar "proposta" — sempre "orçamento"
- Nunca usar "o OrçaFast" — sempre "a OrçaFast"
