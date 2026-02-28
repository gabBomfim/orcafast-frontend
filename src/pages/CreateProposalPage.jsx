import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Textarea,
  IconButton,
  SimpleGrid,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
  Flex,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import ReactSelect from 'react-select'
import {
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiEye,
  FiPercent,
  FiCalendar,
} from 'react-icons/fi'
import { WiStars } from 'react-icons/wi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { proposalService, clientService } from '../services'

const CreateProposalPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = !!editId
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(isEditMode)
  const [clients, setClients] = useState([])
  const [loadingClients, setLoadingClients] = useState(true)
  const fetching = useRef(false)

  // Quick Create Client modal
  const { isOpen: isClientModalOpen, onOpen: onClientModalOpen, onClose: onClientModalClose } = useDisclosure()
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '' })
  const [isSavingClient, setIsSavingClient] = useState(false)

  // Estilos customizados para o React Select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#F3F4F6', // gray.100
      borderColor: 'transparent',
      borderRadius: '0.75rem', // xl
      padding: '0.3rem',
      minHeight: '48px',
      boxShadow: state.isFocused ? '0 0 0 2px #10B981' : 'none',
      '&:hover': {
        backgroundColor: '#F3F4F6',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      zIndex: 10,
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.data?.isCreate
        // "+ Cadastrar" never gets the full emerald fill — use a soft tint
        ? state.isFocused ? '#F0FDF4' : 'transparent'
        : state.isSelected
          ? '#10B981'
          : state.isFocused
            ? '#ECFDF5'
            : 'transparent',
      color: state.data?.isCreate
        ? '#059669' // emerald.600 — always readable against white / light tint
        : state.isSelected ? 'white' : '#111827',
      cursor: 'pointer',
      fontWeight: state.data?.isCreate ? '600' : 'normal',
      '&:active': {
        backgroundColor: state.data?.isCreate ? '#DCFCE7' : '#10B981',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: '#111827', // gray.900
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827', // gray.900
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF', // gray.400
    }),
  }

  const [formData, setFormData] = useState({
    clientId: searchParams.get('client') || '',
    title: '',
    description: '',
    discount: 0,
    validUntil: '',
  })

  const [items, setItems] = useState([
    { id: 1, desc: '', qtd: 1, value: 0 },
  ])

  useEffect(() => {
    loadClients()
  }, [])


  useEffect(() => {
    if (!isEditMode || fetching.current) return
    fetching.current = true

    const loadProposal = async () => {
      try {
        const { data } = await proposalService.get(editId)
        setFormData({
          clientId: String(data.client_id || data.clientId || ''),
          title: data.title || '',
          description: data.description || '',
          discount: parseFloat(data.discount || 0),
          validUntil: data.valid_until ? new Date(data.valid_until).toISOString().split('T')[0] : '',
        })

        if (data.items && data.items.length > 0) {
          setItems(data.items.map((item, index) => ({
            id: item.id || index + 1,
            desc: item.description || '',
            qtd: item.quantity || 1,
            value: parseFloat(item.unit_price || item.unitPrice || 0),
          })))
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar orçamento',
          description: error.response?.data?.message || 'Não foi possível carregar os dados do orçamento',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        navigate('/dashboard/propostas')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadProposal()
  }, [editId, isEditMode, navigate, toast])

  const loadClients = async () => {
    try {
      const response = await clientService.list()
      // Extrai o array de clientes da resposta paginada
      const clientsData = response.data.data || response.data
      setClients(Array.isArray(clientsData) ? clientsData : [])
    } catch (error) {
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setClients([])
    } finally {
      setLoadingClients(false)
    }
  }

  // ─── Quick Create Client ──────────────────────────────────────────────────
  const handleQuickCreateClient = async () => {
    if (!newClient.name.trim()) {
      toast({ title: 'Nome é obrigatório', status: 'warning', duration: 3000, isClosable: true })
      return
    }
    setIsSavingClient(true)
    try {
      const { data } = await clientService.create(newClient)
      // Add to local list immediately
      setClients((prev) => [...prev, data])
      // Auto-select the new client
      setFormData((prev) => ({ ...prev, clientId: String(data.id) }))
      toast({ title: `Cliente "${data.name}" cadastrado!`, status: 'success', duration: 3000, isClosable: true })
      setNewClient({ name: '', email: '', phone: '', company: '' })
      onClientModalClose()
    } catch (err) {
      toast({
        title: 'Erro ao cadastrar cliente',
        description: err.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSavingClient(false)
    }
  }

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qtd: 1, value: 0 }])
  }

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      toast({
        title: 'O orçamento deve ter pelo menos um item.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id, field, value) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    })
    setItems(newItems)
  }

  const handleAISuggestion = async () => {
    if (!formData.title.trim() && !formData.description.trim() && !items.some(item => item.desc.trim())) {
      toast({
        title: 'Adicione mais detalhes',
        description: 'Preencha o título, descrição ou itens para gerar uma sugestão.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoadingAI(true)

    // Simulação da IA baseada nos dados do formulário
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Lógica simples de precificação baseada nos dados
    let suggestedPrice = 500 // base

    if (formData.title.toLowerCase().includes('website') || formData.title.toLowerCase().includes('site')) {
      suggestedPrice = 2500
    } else if (formData.title.toLowerCase().includes('logo') || formData.title.toLowerCase().includes('design')) {
      suggestedPrice = 800
    } else if (formData.title.toLowerCase().includes('consultoria') || formData.title.toLowerCase().includes('consultor')) {
      suggestedPrice = 1500
    }

    // Ajustes baseados na descrição
    if (formData.description.toLowerCase().includes('complexo') || formData.description.toLowerCase().includes('avançado')) {
      suggestedPrice *= 1.5
    }

    // Aplica no primeiro item
    if (items.length > 0) {
      handleItemChange(items[0].id, 'value', suggestedPrice)
      toast({
        title: 'Preço sugerido aplicado!',
        description: `Valor de R$ ${suggestedPrice.toFixed(2)} foi aplicado ao primeiro item.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    }

    setIsLoadingAI(false)
  }

  const subtotal = items.reduce((acc, item) => {
    const value = parseFloat(item.value) || 0
    const qtd = parseInt(item.qtd, 10) || 0
    return acc + value * qtd
  }, 0)

  const discountAmount = (subtotal * (formData.discount / 100))
  const total = subtotal - discountAmount

  const selectedClient = Array.isArray(clients)
    ? clients.find(c => c.id === parseInt(formData.clientId))
    : null

  // Special "create" option pinned at the top of the dropdown
  const CREATE_OPTION = { value: '__create__', label: '+ Cadastrar novo cliente', isCreate: true }

  const clientOptions = [
    CREATE_OPTION,
    ...(Array.isArray(clients)
      ? clients.map(client => ({
        value: client.id,
        label: `${client.name}${client.company ? ` — ${client.company}` : ''}`,
        original: client,
      }))
      : []),
  ]

  const handleClientSelectChange = (option) => {
    if (!option) { setFormData({ ...formData, clientId: '' }); return }
    if (option.isCreate) { onClientModalOpen(); return }
    setFormData({ ...formData, clientId: String(option.value) })
  }

  // Custom renderer so the "create" option stands out visually
  const formatOptionLabel = (option) => {
    if (option.isCreate) {
      return (
        <Flex align="center" gap={2} color="emerald.600" fontWeight="semibold" fontSize="sm">
          <Box w={5} h={5} bg="emerald.50" rounded="md" display="flex" alignItems="center" justifyContent="center">
            <FiPlus size={12} />
          </Box>
          Cadastrar novo cliente
        </Flex>
      )
    }
    return option.label
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataToSend = {
        client_id: parseInt(formData.clientId),
        title: formData.title,
        description: formData.description,
        discount: parseFloat(formData.discount),
        valid_until: formData.validUntil,
        items: items.map(item => ({
          description: item.desc,
          quantity: parseInt(item.qtd, 10),
          unit_price: parseFloat(item.value) || 0
        }))
      }

      let response
      if (isEditMode) {
        response = await proposalService.update(editId, dataToSend)
      } else {
        response = await proposalService.create(dataToSend)
      }

      // Navega para página de sucesso com os dados do orçamento
      navigate('/dashboard/propostas/sucesso', {
        state: {
          proposalId: response.data.id || editId,
          proposalData: {
            clientName: selectedClient?.name || 'Cliente',
            clientPhone: selectedClient?.phone || '',
            title: formData.title,
            totalValue: total,
          },
          isEdit: isEditMode,
        },
      })
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar orçamento'
      toast({
        title: 'Erro',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex minH="100vh" bg="gray.50" direction="column" py={8}>
      <Flex flex={1} justify="center" px={4}>
        <Box w="full" maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Lado Esquerdo: Formulário */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={8}
              boxShadow="sm"
            >
              <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                {/* Icon and title */}
                <VStack textAlign="center" w="full">
                  <Flex
                    w={16}
                    h={16}
                    bg="emerald.50"
                    borderRadius="2xl"
                    align="center"
                    justify="center"
                    mx="auto"
                    mb={4}
                  >
                    <Icon as={FiFileText} w={8} h={8} color="emerald.500" />
                  </Flex>
                  <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                    {isEditMode ? 'Editar orçamento' : 'Criar orçamento'}
                  </Heading>
                  <Text color="gray.600" mb={6}>
                    {isEditMode ? 'Atualize os dados do orçamento' : 'Crie um novo orçamento para seu cliente'}
                  </Text>
                </VStack>

                {isLoadingData ? (
                  <Center py={12} w="full">
                    <Spinner size="lg" color="emerald.500" />
                  </Center>
                ) : (
                  <VStack spacing={6} w="full">
                    <FormControl isRequired w="full">
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.900"
                      >
                        Cliente *
                      </FormLabel>
                      <ReactSelect
                        name="clientId"
                        value={clientOptions.find(option => option.value === parseInt(formData.clientId)) || null}
                        onChange={handleClientSelectChange}
                        options={clientOptions}
                        placeholder={loadingClients ? 'Carregando clientes...' : 'Selecione ou busque um cliente...'}
                        isDisabled={loadingClients}
                        isClearable
                        isSearchable
                        isLoading={loadingClients}
                        styles={customSelectStyles}
                        formatOptionLabel={formatOptionLabel}
                        noOptionsMessage={() => 'Nenhum cliente encontrado'}
                        loadingMessage={() => 'Carregando...'}
                      />
                    </FormControl>

                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="title"
                        display="block"
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.900"
                        mb={2}
                      >
                        Título do orçamento *
                      </Text>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Ex: Desenvolvimento de Website"
                        h={12}
                        px={4}
                        bg="gray.100"
                        border="none"
                        borderRadius="xl"
                        color="gray.900"
                        _placeholder={{ color: 'gray.500' }}
                        _hover={{ bg: 'gray.100' }}
                        _focus={{
                          bg: 'gray.100',
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                        fontSize="sm"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </Box>

                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="description"
                        display="block"
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.900"
                        mb={2}
                      >
                        Descrição (opcional)
                      </Text>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Descreva brevemente o projeto..."
                        minH="120px"
                        px={4}
                        py={3}
                        bg="gray.100"
                        border="none"
                        borderRadius="xl"
                        color="gray.900"
                        _placeholder={{ color: 'gray.500' }}
                        _hover={{ bg: 'gray.100' }}
                        _focus={{
                          bg: 'gray.100',
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                        fontSize="sm"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </Box>

                    <FormControl isRequired w="full">
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.900"
                      >
                        Válida até *
                      </FormLabel>
                      <Input
                        name="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        h={12}
                        px={4}
                        bg="gray.100"
                        border="none"
                        borderRadius="xl"
                        color="gray.900"
                        _hover={{ bg: 'gray.100' }}
                        _focus={{
                          bg: 'gray.100',
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                      />
                    </FormControl>

                    <VStack spacing={4} w="full" align="start">
                      <Heading as="h3" size="sm" color="gray.900">
                        Itens do orçamento
                      </Heading>
                      {items.map((item, index) => (
                        <VStack
                          key={item.id}
                          spacing={3}
                          w="full"
                          p={4}
                          bg="white"
                          borderRadius="xl"
                          boxShadow="sm"
                        >
                          <Box w="full">
                            <Text fontSize="sm" fontWeight="medium" color="gray.900" mb={2}>
                              Descrição do item
                            </Text>
                            <Input
                              placeholder="Ex: Criação de logo"
                              h={12}
                              px={4}
                              bg="gray.100"
                              border="none"
                              borderRadius="xl"
                              color="gray.900"
                              _placeholder={{ color: 'gray.500' }}
                              _hover={{ bg: 'gray.100' }}
                              _focus={{
                                bg: 'gray.100',
                                boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                                outline: 'none'
                              }}
                              fontSize="sm"
                              value={item.desc}
                              onChange={(e) =>
                                handleItemChange(item.id, 'desc', e.target.value)
                              }
                            />
                          </Box>
                          <HStack w="full" spacing={3}>
                            <Box flex={1}>
                              <Text fontSize="sm" fontWeight="medium" color="gray.900" mb={2}>
                                Quantidade
                              </Text>
                              <Input
                                type="number"
                                h={12}
                                px={4}
                                bg="gray.100"
                                border="none"
                                borderRadius="xl"
                                color="gray.900"
                                _hover={{ bg: 'gray.100' }}
                                _focus={{
                                  bg: 'gray.100',
                                  boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                                  outline: 'none'
                                }}
                                value={item.qtd}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'qtd', e.target.value)
                                }
                              />
                            </Box>
                            <Box flex={1}>
                              <Text fontSize="sm" fontWeight="medium" color="gray.900" mb={2}>
                                Valor (R$)
                              </Text>
                              <Input
                                type="number"
                                placeholder="1500.00"
                                step="0.01"
                                h={12}
                                px={4}
                                bg="gray.100"
                                border="none"
                                borderRadius="xl"
                                color="gray.900"
                                _placeholder={{ color: 'gray.500' }}
                                _hover={{ bg: 'gray.100' }}
                                _focus={{
                                  bg: 'gray.100',
                                  boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                                  outline: 'none'
                                }}
                                fontSize="sm"
                                value={item.value}
                                onChange={(e) =>
                                  handleItemChange(item.id, 'value', e.target.value)
                                }
                              />
                            </Box>
                          </HStack>
                          {items.length > 1 && (
                            <IconButton
                              aria-label="Remover item"
                              icon={<FiTrash2 />}
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              alignSelf="flex-end"
                              onClick={() => handleRemoveItem(item.id)}
                            />
                          )}
                        </VStack>
                      ))}
                      <Button
                        leftIcon={<FiPlus />}
                        variant="ghost"
                        colorScheme="emerald"
                        onClick={handleAddItem}
                        size="sm"
                      >
                        Adicionar item
                      </Button>

                      {/* Botão IA - aparece quando há dados suficientes */}
                      {(formData.title.trim() || formData.description.trim() || items.some(item => item.desc.trim())) && (
                        <Button
                          leftIcon={<Icon fontSize="24px" as={WiStars} />}
                          colorScheme="purple"
                          variant="outline"
                          onClick={handleAISuggestion}
                          isLoading={isLoadingAI}
                          loadingText="Calculando..."
                          size="sm"
                        >
                          {isLoadingAI ? 'Calculando...' : 'Sugerir preço com IA'}
                        </Button>
                      )}
                    </VStack>

                    {/* Campo de Desconto */}
                    <FormControl w="full">
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.900"
                      >
                        Desconto (opcional)
                      </FormLabel>
                      <Input
                        name="discount"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0%"
                        h={12}
                        px={4}
                        bg="gray.100"
                        border="none"
                        borderRadius="xl"
                        color="gray.900"
                        _placeholder={{ color: 'gray.500' }}
                        _hover={{ bg: 'gray.100' }}
                        _focus={{
                          bg: 'gray.100',
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      />
                    </FormControl>

                    {/* Navigation */}
                    <Flex align="center" justify="space-between" w="full" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
                      <Button
                        onClick={() => navigate('/dashboard/propostas')}
                        variant="ghost"
                        leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
                        color="gray.600"
                        _hover={{ color: 'gray.900' }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        h={12}
                        px={8}
                        bg="emerald.500"
                        _hover={{ bg: 'emerald.600' }}
                        color="white"
                        fontWeight="semibold"
                        fontSize="sm"
                        borderRadius="xl"
                        boxShadow="lg"
                        rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
                        isLoading={isLoading}
                        loadingText="Salvando..."
                      >
                        {isEditMode ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
                      </Button>
                    </Flex>
                  </VStack>
                )}
              </VStack>
            </Box>

            {/* Lado Direito: Preview */}
            <Box display={{ base: 'none', lg: 'block' }}>
              <Box
                bg="white"
                borderRadius="2xl"
                position="sticky"
                top="100px"
                p={6}
                boxShadow="sm"
              >
                <HStack justify="space-between" mb={6}>
                  <Heading size="md" color="gray.900">Preview do Orçamento</Heading>
                  <Icon as={FiEye} color="gray.400" />
                </HStack>

                <VStack spacing={4} align="stretch">
                  {/* Cabeçalho da Proposta */}
                  <Box bg="emerald.50" p={4} borderRadius="lg" borderWidth="1px" borderColor="emerald.200">
                    <Text fontSize="sm" color="emerald.700" fontWeight="semibold" mb={2}>
                      ORÇAMENTO PARA:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" color="gray.900">
                        {selectedClient?.name || 'Selecione um cliente'}
                      </Text>
                      {selectedClient?.phone && (
                        <Text fontSize="sm" color="gray.600">{selectedClient.phone}</Text>
                      )}
                      {selectedClient?.email && (
                        <Text fontSize="sm" color="gray.600">{selectedClient.email}</Text>
                      )}
                    </VStack>
                  </Box>

                  <Heading size="lg" color="gray.900">{formData.title || 'Título do Orçamento'}</Heading>
                  <Text color="gray.600">
                    {formData.description || 'Descrição do orçamento aparecerá aqui...'}
                  </Text>
                  <Box height="1px" bg="gray.200" />
                  {items.filter(item => item.desc.trim()).map((item) => (
                    <HStack key={item.id} justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color="gray.900">{item.desc}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {item.qtd}x R$ {parseFloat(item.value || 0).toFixed(2)}
                        </Text>
                      </VStack>
                      <Text fontWeight="bold" color="gray.900">
                        R$ {(parseFloat(item.value || 0) * parseInt(item.qtd || 1)).toFixed(2)}
                      </Text>
                    </HStack>
                  ))}
                  <Box height="1px" bg="gray.200" />
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text color="gray.900">Subtotal:</Text>
                      <Text fontWeight="medium" color="gray.900">R$ {subtotal.toFixed(2)}</Text>
                    </HStack>
                    {formData.discount > 0 && (
                      <HStack justify="space-between">
                        <Text color="gray.900">Desconto ({formData.discount}%):</Text>
                        <Text fontWeight="medium" color="red.500">
                          - R$ {discountAmount.toFixed(2)}
                        </Text>
                      </HStack>
                    )}
                    <Box height="1px" bg="gray.200" />
                    <HStack justify="space-between">
                      <Text fontSize="xl" fontWeight="bold" color="gray.900">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="emerald.600">
                        R$ {total.toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>

      {/* ── Quick Create Client Modal ───────────────────────────────────── */}
      <Modal isOpen={isClientModalOpen} onClose={onClientModalClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" shadow="2xl">
          <ModalHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={2}>
            Cadastrar novo cliente
          </ModalHeader>
          <ModalCloseButton top={4} right={4} />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Nome</FormLabel>
                <Input
                  placeholder="Nome completo"
                  bg="gray.100"
                  border="none"
                  rounded="xl"
                  h={12}
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  _focus={{ boxShadow: '0 0 0 2px #10B981' }}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={3} w="full">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">E-mail</FormLabel>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    bg="gray.100"
                    border="none"
                    rounded="xl"
                    h={12}
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    _focus={{ boxShadow: '0 0 0 2px #10B981' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Telefone</FormLabel>
                  <Input
                    placeholder="(11) 99999-9999"
                    bg="gray.100"
                    border="none"
                    rounded="xl"
                    h={12}
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    _focus={{ boxShadow: '0 0 0 2px #10B981' }}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Empresa</FormLabel>
                <Input
                  placeholder="Nome da empresa (opcional)"
                  bg="gray.100"
                  border="none"
                  rounded="xl"
                  h={12}
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  _focus={{ boxShadow: '0 0 0 2px #10B981' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} pt={2}>
            <Button variant="ghost" rounded="xl" onClick={onClientModalClose} isDisabled={isSavingClient}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              bg="green.400"
              color="white"
              rounded="xl"
              fontWeight="medium"
              px={6}
              _hover={{ bg: 'green.500' }}
              onClick={handleQuickCreateClient}
              isLoading={isSavingClient}
              loadingText="Salvando..."
            >
              Salvar e selecionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default CreateProposalPage
