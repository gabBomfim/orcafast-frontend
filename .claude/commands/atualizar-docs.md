# Atualizar Documentação

Execute após qualquer implementação de feature, componente ou rota nova.

## O que atualizar no CLAUDE.md

Verifique cada seção abaixo e atualize o que for relevante:

### 1. Componentes Existentes
Adicione na tabela do componente criado:
```
| `NomeComponente` | Descrição do que faz e props principais |
```

### 2. Serviços
Adicione na tabela do service criado/modificado:
```
| `nomeService` | `metodo1`, `metodo2(params)` — observação importante |
```

### 3. Rotas
Adicione na lista correta (Públicas / Onboarding / Protegidas):
```
`/nova-rota/:param` · ...
```

### 4. Regras de Negócio
Se a feature introduz nova regra, documente:
- Quem pode acessar (admin? membro? guest?)
- Gatilhos de mudança de status
- Validações de negócio (não de formulário)

### 5. Hooks (se criou novo)
Adicione na seção de Hooks:
```
| `useNomeHook` | O que faz, retorno principal |
```

## Após atualizar

Confirme que o documento:
- Não tem seções "## Preencher" vazias
- Reflete o estado atual real do código
- Não tem componentes listados que foram removidos
- Mantém o tom e formatação das demais seções
