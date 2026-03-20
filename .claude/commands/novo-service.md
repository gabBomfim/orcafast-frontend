# Criar ou Atualizar Service

Crie ou atualize um service de API seguindo os padrões da OrçaFast.

## Regras obrigatórias

1. **Toda chamada de API passa por `src/services/`** — nunca usar `fetch` ou `axios` direto nos componentes/páginas
2. Importar a instância Axios de `src/api.js` (já tem interceptors de auth)
3. Usar `BASE_URL` e endpoints de `src/config/api.js`
4. Entidades com `company_id`: o service deve injetar automaticamente do localStorage

## Estrutura base

```js
import api from '../api'

export const meuService = {
  list: (params = {}) => api.get('/meu-recurso', { params }),
  get: (id) => api.get(`/meu-recurso/${id}`),
  create: (data) => api.post('/meu-recurso', data),
  update: (id, data) => api.put(`/meu-recurso/${id}`, data),
  delete: (id) => api.delete(`/meu-recurso/${id}`),
}
```

## Após criar

- Exportar em `src/services/index.js`
- Adicionar na tabela de Serviços do `CLAUDE.md`
