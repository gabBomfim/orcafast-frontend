# OrçaFast Frontend

Frontend do OrçaFast - Plataforma para criação, envio e acompanhamento de propostas profissionais.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interfaces
- **Chakra UI** - Sistema de componentes e design system
- **React Router DOM** - Roteamento
- **React Icons** - Ícones
- **Vite** - Build tool e dev server

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout (Header, Container, Layout)
│   └── ui/             # Componentes de interface (Cards, Badges, etc.)
├── pages/              # Páginas da aplicação
├── theme/              # Tema customizado do Chakra UI
├── mock/               # Dados mockados para desenvolvimento
├── hooks/              # Custom hooks (futuros)
├── utils/              # Utilitários (futuros)
└── assets/             # Assets estáticos
```

## 🎨 Design System

O projeto utiliza um tema customizado do Chakra UI baseado no design original do V0:

### Cores Principais
- **Primary**: `#164e63` (azul escuro)
- **Secondary/Accent**: `#f59e0b` (âmbar)
- **Success**: `#10b981` (verde esmeralda)

### Componentes Customizados
- **StatusBadge**: Badge com ícones para status de propostas
- **StatsCard**: Card para exibir estatísticas
- **ActionCard**: Card clicável para ações rápidas
- **DataCard**: Card para listagem de dados
- **SearchBar**: Barra de pesquisa estilizada

## 📱 Páginas

### 1. HomePage (`/`)
Landing page com:
- Hero section
- Seção "Como funciona"
- Estatísticas
- Features do dashboard
- Call-to-action
- Footer

### 2. DashboardPage (`/dashboard`)
Dashboard principal com:
- Boas-vindas personalizada
- Cards de ação rápida
- Estatísticas principais
- Lista de propostas recentes

### 3. PropostasPage (`/dashboard/propostas`)
Gerenciamento de propostas com:
- Filtros por status
- Busca por cliente/serviço
- Lista completa de propostas
- Ações (visualizar, editar, duplicar, excluir)

### 4. ClientesPage (`/dashboard/clientes`)
Gerenciamento de clientes com:
- Estatísticas de clientes
- Busca por nome/email/empresa
- Lista completa de clientes
- Ações (nova proposta, editar, WhatsApp, excluir)

## 🔧 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📊 Dados Mock

Os dados estão organizados em arquivos separados:
- `src/mock/propostas.js` - Propostas e propostas recentes
- `src/mock/clientes.js` - Lista de clientes
- `src/mock/stats.js` - Estatísticas do dashboard

## 🎯 Features Implementadas

✅ **Layout Responsivo** - Mobile-first design  
✅ **Tema Customizado** - Cores e componentes personalizados  
✅ **Componentes Reutilizáveis** - Arquitetura modular  
✅ **Roteamento** - Navegação entre páginas  
✅ **Estados Locais** - Gerenciamento simples com useState  
✅ **Dados Mockados** - Estrutura preparada para API  
✅ **TypeScript Ready** - Estrutura preparada para tipagem  

## 🔮 Próximos Passos

- [ ] Integração com API backend
- [ ] Formulários para criação/edição
- [ ] Autenticação e autorização
- [ ] Testes unitários e E2E
- [ ] PWA e notificações
- [ ] Internacionalização (i18n)

## 📝 Convenções

### Componentes
- PascalCase para nomes de componentes
- Props destrutradas no parâmetro
- Exportação default

### Arquivos
- PascalCase para componentes React
- camelCase para utilitários e hooks
- kebab-case para assets

### Estrutura de Pastas
- Cada página em arquivo separado
- Componentes agrupados por funcionalidade
- Mock data em arquivos separados por entidade

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.