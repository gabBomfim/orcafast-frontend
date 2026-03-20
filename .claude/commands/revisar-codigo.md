# Revisar Código

Faça uma revisão do código selecionado ou do arquivo atual verificando:

## 1. Padrões de código
- [ ] Functional component com arrow function?
- [ ] Props tipadas com PropTypes?
- [ ] Nenhuma lógica de negócio no componente de UI?
- [ ] Nenhum `fetch` ou `axios` direto (tudo via service)?

## 2. Design System
- [ ] Cores hardcodadas? → substituir por tokens do tema
- [ ] `<Input>` sem `variant="app"`? → corrigir
- [ ] `<Select>` nativo do Chakra? → substituir por react-select + selectStyles
- [ ] Botão sem variante definida? → adicionar `variant="solid"`, `"outline"` etc.

## 3. Mensagens e feedback
- [ ] Mensagem de erro escrita inline? → mover para `formMessages.js`
- [ ] Erro exibido sem `<FieldError>` ou `<FormFeedback>`? → corrigir
- [ ] Tom das mensagens segue o Emílio? (direto, sem jargão, coloquial)

## 4. Linguagem e copy
- [ ] Usa "proposta"? → trocar por "orçamento"
- [ ] Usa "o OrçaFast"? → trocar por "a OrçaFast"
- [ ] Tem anglicismo desnecessário? → substituir
- [ ] Tem jargão corporativo? → simplificar

## 5. Multi-tenant e segurança
- [ ] Entidade nova tem `company_id`?
- [ ] Rota protegida usa `<ProtectedRoute>`?
- [ ] Feature de admin verifica `role`?
- [ ] Metas financeiras inacessíveis para membros?

## 6. Performance e qualidade
- [ ] `useEffect` com dependências corretas?
- [ ] Chamadas de API dentro de `useApi` hook?
- [ ] Estados de loading exibidos ao usuário?
- [ ] Estado vazio com mensagem e CTA?

Ao final, liste os problemas encontrados e proponha as correções.
