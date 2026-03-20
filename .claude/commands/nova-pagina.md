# Criar Nova Página

Crie uma nova página seguindo os padrões da OrçaFast.

## Instruções

1. **Leia o CLAUDE.md** antes de começar.

2. **Pergunte ao usuário** se não souber:
   - Nome da página e rota
   - É pública, protegida ou onboarding?
   - Usa o `<Layout>` do dashboard ou layout próprio?

3. **Checklist obrigatório:**
   - Arquivo em `src/pages/[subpasta]/NomePage.jsx`
   - Se protegida: envolver com `<ProtectedRoute>` em `App.jsx`
   - Se usa painel: envolver com `<Layout headerTitle="..." />`
   - Chamadas de API sempre via service, nunca direto
   - Usar `useApi` hook para loading/error/toast automático
   - Estados vazios: usar `<ActionCard variant="dashed">` com mensagem do Emílio
   - Paginação: usar `<Pagination>` de `src/components/ui/`
   - Busca: usar `<SearchBar>` de `src/components/ui/`

4. **Após criar a página:**
   - Adicionar a rota na tabela correta do `CLAUDE.md` (Públicas / Onboarding / Protegidas)
   - Registrar a rota em `src/App.jsx`

## Estrutura base de página protegida

```jsx
import { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'
import { useApi } from '../hooks/useApi'
import { meuService } from '../services/meu.service'

const MinhaPagina = () => {
  const { loading, execute } = useApi(meuService.list)

  useEffect(() => {
    execute()
  }, [])

  return (
    <Layout headerTitle="Título da Página">
      <Box>
        {/* conteúdo */}
      </Box>
    </Layout>
  )
}

export default MinhaPagina
```
