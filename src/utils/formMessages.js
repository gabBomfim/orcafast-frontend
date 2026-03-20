/**
 * OrçaFast — Biblioteca de Mensagens de Formulário
 *
 * Tom de voz baseado na persona Emílio, 32 anos:
 * - Direto, prático, sem jargão
 * - Indica sempre o que fazer pra resolver
 * - Coloquial profissional — parece gente falando, não sistema
 *
 * Uso:
 *   import { formMessages, successMessages, warningMessages, infoMessages } from '../utils/formMessages'
 *   toast({ description: formMessages.auth.wrongPassword, status: 'error' })
 */

// ─── Validação de Campos ──────────────────────────────────────────────────────

export const formMessages = {
  // Campos obrigatórios
  required: {
    generic: 'Preencha este campo para continuar.',
    name: 'Coloque o nome aqui.',
    email: 'Preciso do e-mail para seguir.',
    phone: 'Coloque o telefone aqui.',
    password: 'Crie uma senha para proteger sua conta.',
    title: 'Dê um título para o orçamento.',
    value: 'Coloque o valor aqui.',
    client: 'Selecione um cliente.',
    date: 'Escolha uma data.',
    validUntil: 'Escolha uma data de validade.',
  },

  // Formato inválido
  invalid: {
    email: 'Esse e-mail não tá certo. Confere aí.',
    phone: 'Esse telefone não tá no formato certo. Ex: (11) 99999-9999',
    cpf: 'Esse CPF não tá batendo. Confere os números.',
    cnpj: 'Esse CNPJ não tá batendo. Confere os números.',
    cep: 'Esse CEP não existe. Confere aí.',
    date: 'Essa data não tá certa. Usa o formato dd/mm/aaaa.',
    url: 'Esse link não tá funcionando. Confere o endereço.',
    number: 'Coloque só números aqui.',
    currency: 'Coloque um valor válido. Ex: 1.500,00',
  },

  // Tamanho / Limites
  length: {
    tooShort: (min) => `Precisa de pelo menos ${min} caracteres.`,
    tooLong: (max) => `Pode ter no máximo ${max} caracteres.`,
    passwordWeak: 'Essa senha tá fraca. Usa pelo menos 8 caracteres com letras e números.',
    titleTooShort: 'O título ficou curto demais. Descreve melhor o serviço.',
  },

  // Senhas
  password: {
    mismatch: 'As senhas não batem. Confere aí.',
    weak: 'Essa senha tá fraca. Mistura letras, números e símbolos.',
    same: 'Usa uma senha diferente da anterior.',
    current: 'A senha atual não tá certa.',
  },

  // Valores numéricos
  value: {
    negative: 'O valor não pode ser negativo.',
    zero: 'Coloque um valor maior que zero.',
    tooHigh: (max) => `O valor máximo é R$ ${Number(max).toLocaleString('pt-BR')}.`,
    tooLow: (min) => `O valor mínimo é R$ ${Number(min).toLocaleString('pt-BR')}.`,
  },

  // Datas
  date: {
    past: 'Essa data já passou. Escolhe uma data futura.',
    future: 'Essa data ainda não chegou. Escolhe uma data passada.',
    invalid: 'Essa data não existe. Confere aí.',
    expired: 'Essa data de validade já expirou.',
  },

  // Arquivos
  file: {
    tooLarge: (maxMB) => `Esse arquivo é grande demais. O máximo é ${maxMB}MB.`,
    wrongType: 'Esse tipo de arquivo não é aceito. Usa JPG, PNG ou PDF.',
    required: 'Seleciona um arquivo pra continuar.',
    corrupt: 'Ih, esse arquivo tá com problema. Tenta outro.',
  },

  // Autenticação
  auth: {
    emailInUse: 'Esse e-mail já tá cadastrado. Tenta fazer login.',
    emailNotFound: 'Não achei nenhuma conta com esse e-mail.',
    wrongPassword: 'Senha incorreta. Tenta de novo.',
    tooManyAttempts: 'Muitas tentativas. Espera uns minutos e tenta de novo.',
    sessionExpired: 'Sua sessão expirou. Faz login de novo.',
    accountLocked: 'Conta bloqueada por segurança. Redefine sua senha.',
  },

  // Rede / Sistema
  system: {
    offline: 'Parece que você tá sem internet. Confere a conexão.',
    timeout: 'Demorou demais. Tenta de novo.',
    serverError: 'Ih, algo deu errado aqui. A gente já sabe e tá resolvendo.',
    maintenance: 'A gente tá fazendo uma manutenção rápida. Volta em instantes.',
    rateLimit: 'Calma aí! Muitas requisições. Espera um pouquinho.',
  },

  // Orçamentos
  quote: {
    noItems: 'Adiciona pelo menos um item no orçamento.',
    duplicateItem: 'Esse item já tá na lista.',
    invalidTotal: 'O valor total não tá batendo. Confere os itens.',
    expiredValidity: 'A validade do orçamento já passou. Atualiza a data.',
    clientRequired: 'Seleciona um cliente pra esse orçamento.',
  },

  // Clientes
  client: {
    duplicate: 'Já existe um cliente com esse telefone.',
    notFound: 'Não achei esse cliente. Confere o nome.',
  },
}

// ─── Sucesso ──────────────────────────────────────────────────────────────────

export const successMessages = {
  save: 'Salvo!',
  create: 'Criado com sucesso!',
  update: 'Atualizado!',
  delete: 'Removido.',
  send: 'Enviado!',
  copy: 'Copiado!',
  upload: 'Arquivo enviado!',

  quote: {
    created: 'Orçamento criado! Agora é só enviar pro cliente.',
    sent: 'Orçamento enviado! Fica de olho no status.',
    approved: 'Orçamento aprovado! Bora trabalhar.',
    copied: 'Link copiado! Cola lá no WhatsApp.',
    downloaded: 'PDF baixado com sucesso.',
  },

  client: {
    created: 'Cliente cadastrado!',
    updated: 'Dados do cliente atualizados.',
    deleted: 'Cliente removido.',
  },

  profile: {
    updated: 'Perfil atualizado!',
    logoUploaded: 'Logo atualizada!',
    passwordChanged: 'Senha alterada com sucesso.',
  },

  auth: {
    login: 'Bem-vinda de volta!',
    logout: 'Até mais! Volta logo.',
    register: 'Conta criada! Bora começar.',
    passwordReset: 'E-mail enviado! Confere sua caixa de entrada.',
    passwordChanged: 'Senha redefinida! Agora é só fazer login.',
  },
}

// ─── Avisos (Warnings) ────────────────────────────────────────────────────────

export const warningMessages = {
  unsavedChanges: 'Você tem alterações não salvas. Quer sair mesmo assim?',
  deleteConfirm: 'Tem certeza? Essa ação não pode ser desfeita.',
  logoutConfirm: 'Quer mesmo sair da sua conta?',

  quote: {
    noSave: 'Seu orçamento ainda não foi salvo.',
    expiringSoon: 'Esse orçamento vence em breve.',
    highDiscount: 'Desconto alto! Confere se tá certo.',
  },

  plan: {
    limitReached: 'Você atingiu o limite do plano. Faz upgrade pra continuar.',
    featureLocked: 'Essa função é do plano Autônomo.',
  },
}

// ─── Informativos ─────────────────────────────────────────────────────────────

export const infoMessages = {
  loading: 'Carregando...',
  processing: 'Processando...',
  saving: 'Salvando...',
  sending: 'Enviando...',

  empty: {
    quotes: 'Nenhum orçamento por aqui ainda. Que tal criar o primeiro?',
    clients: 'Sua lista de clientes tá vazia. Cadastra o primeiro!',
    search: 'Nenhum resultado pra essa busca.',
  },

  tip: {
    whatsapp: 'Dica: adiciona o telefone do WhatsApp pra enviar direto.',
    description: 'Dica: uma boa descrição ajuda o cliente a entender o serviço.',
    validity: 'Dica: orçamentos com validade curta têm mais chance de fechar.',
  },
}
