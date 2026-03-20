# Criar Novo Componente

Crie um novo componente React seguindo os padrões da OrçaFast.

## Instruções

1. **Leia o CLAUDE.md** antes de começar.

2. **Pergunte ao usuário** se não souber:
   - Nome do componente (PascalCase)
   - Onde ficará: `src/components/ui/`, `src/components/layout/` ou outra pasta
   - Props necessárias

3. **Estrutura obrigatória:**
   - Arquivo: `src/components/[categoria]/NomeComponente.jsx`
   - Arrow function, functional component
   - Props tipadas com PropTypes
   - Nenhuma lógica de negócio no componente
   - Cores sempre via tokens do tema Chakra (nunca hardcoded)
   - Inputs sempre com `variant="app"`
   - Select sempre com react-select + `selectStyles`

4. **Mensagens de erro/validação:**
   - Sempre importar de `src/utils/formMessages.js`
   - Nunca escrever string de erro inline
   - Usar `<FieldError>`, `<FormFeedback>` ou `<FieldHint>` de `src/components/ui/FormFeedback.jsx`

5. **Após criar o componente:**
   - Adicionar na seção "Componentes Existentes" do `CLAUDE.md`
   - Exportar em `src/components/[categoria]/index.js` se existir

## Exemplo de estrutura

```jsx
import PropTypes from 'prop-types'
import { Box, Text } from '@chakra-ui/react'

const MeuComponente = ({ titulo, onClick }) => {
  return (
    <Box onClick={onClick}>
      <Text color="gray.900">{titulo}</Text>
    </Box>
  )
}

MeuComponente.propTypes = {
  titulo: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default MeuComponente
```
