import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
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
  FiEye,
} from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { proposalService, clientService } from '../services'
import { storage } from '../utils/storage'
import { maskPhone, unmaskPhone } from '../utils/mask'
import { FieldError } from '../components/ui/FormFeedback'
import { formMessages } from '../utils/formMessages'
import { appSelectStyles } from '../theme/selectStyles'

const CreateProposalPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = !!editId
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(isEditMode)
  const [clients, setClients] = useState([])
  const [loadingClients, setLoadingClients] = useState(true)
  const fetching = useRef(false)
  const [errors, setErrors] = useState({})

  // Quick Create Client modal
  const { isOpen: isClientModalOpen, onOpen: onClientModalOpen, onClose: onClientModalClose } = useDisclosure()
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' })
  const [clientErrors, setClientErrors] = useState({})
  const [isSavingClient, setIsSavingClient] = useState(false)

  const [formData, setFormData] = useState({
    clientId: searchParams.get('client') || '',
    title: '',
    discount: '',
    validUntil: '',
  })

  const [items, setItems] = useState([
    { id: 1, desc: '', qtd: 1, value: '' },
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
          discount: parseFloat(data.discount || 0),
          validUntil: data.valid_until ? new Date(data.valid_until).toISOString().split('T')[0] : '',
        })

        if (data.items && data.items.length > 0) {
          setItems(data.items.map((item, index) => ({
            id: item.id || index + 1,
            desc: item.description || '',
            qtd: item.quantity || 1,
            value: String(parseFloat(item.unit_price || item.unitPrice || 0) || ''),
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
      const clientsData = response.data.data || response.data
      setClients(Array.isArray(clientsData) ? clientsData : [])
    } catch {
      setClients([])
    } finally {
      setLoadingClients(false)
    }
  }

  // ─── Itens ────────────────────────────────────────────────────────────────

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qtd: 1, value: '' }])
  }

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id, field, rawValue) => {
    if (field === 'qtd' && rawValue.length > 6) return
    if (field === 'value') {
      const normalized = rawValue.replace(',', '.')
      if (!/^\d*\.?\d{0,2}$/.test(normalized) && rawValue !== '') return
      if (normalized.length > 10) return
    }
    setItems(items.map((item) => item.id === id ? { ...item, [field]: rawValue } : item))
  }

  // ─── Cálculos ─────────────────────────────────────────────────────────────

  const subtotal = items.reduce((acc, item) => {
    const value = parseFloat(String(item.value).replace(',', '.')) || 0
    const qtd = parseFloat(item.qtd) || 0
    return acc + value * qtd
  }, 0)

  const discountPct = parseFloat(String(formData.discount).replace(',', '.')) || 0
  const discountAmount = subtotal * (discountPct / 100)
  const total = subtotal - discountAmount

  // ─── Select de clientes ───────────────────────────────────────────────────

  const selectedClient = Array.isArray(clients)
    ? clients.find(c => c.id === parseInt(formData.clientId))
    : null

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
    if (errors.clientId) setErrors(prev => ({ ...prev, clientId: '' }))
  }

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

  // ─── Validação do formulário principal ────────────────────────────────────

  const validate = () => {
    const next = {}
    if (!formData.clientId) next.clientId = formMessages.required.client
    if (!formData.title.trim()) next.title = formMessages.required.title
    if (!formData.validUntil) next.validUntil = formMessages.required.validUntil
    const firstItem = items[0]
    if (!firstItem?.desc?.trim()) next.itemDesc = formMessages.required.generic
    const itemVal = parseFloat(String(firstItem?.value || '').replace(',', '.')) || 0
    if (itemVal <= 0) next.itemValue = formMessages.value.zero
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ─── Validação do modal de cliente ────────────────────────────────────────

  const validateClient = () => {
    const next = {}
    if (!newClient.name.trim()) next.name = formMessages.required.name
    const digits = newClient.phone.replace(/\D/g, '')
    if (!digits) next.phone = formMessages.required.phone
    else if (digits.length < 10) next.phone = formMessages.invalid.phone
    setClientErrors(next)
    return Object.keys(next).length === 0
  }

  const handleQuickCreateClient = async () => {
    if (!validateClient()) return
    setIsSavingClient(true)
    try {
      const { data } = await clientService.create({
        ...newClient,
        phone: unmaskPhone(newClient.phone),
      })
      setClients((prev) => [...prev, data])
      setFormData((prev) => ({ ...prev, clientId: String(data.id) }))
      if (errors.clientId) setErrors(prev => ({ ...prev, clientId: '' }))
      toast({ title: `Cliente "${data.name}" cadastrado!`, status: 'success', duration: 3000, isClosable: true })
      setNewClient({ name: '', phone: '', email: '' })
      setClientErrors({})
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

  const handleCloseClientModal = () => {
    setNewClient({ name: '', phone: '', email: '' })
    setClientErrors({})
    onClientModalClose()
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      const user = storage.getUser()
      const dataToSend = {
        company_id: user?.company_id,
        client_id: parseInt(formData.clientId),
        title: formData.title,
        discount: parseFloat(String(formData.discount).replace(',', '.')) || 0,
        valid_until: formData.validUntil,
        items: items.map(item => ({
          description: item.desc,
          quantity: parseInt(item.qtd, 10),
          unit_price: parseFloat(String(item.value).replace(',', '.')) || 0,
        })),
      }

      let response
      if (isEditMode) {
        response = await proposalService.update(editId, dataToSend)
      } else {
        response = await proposalService.create(dataToSend)
      }

      navigate('/dashboard/propostas/sucesso', {
        state: {
          proposalId: response.data.id || editId,
          sharingToken: response.data.sharing_token || response.data.sharingToken,
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
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao salvar orçamento',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Preview formatação ───────────────────────────────────────────────────

  const fmtBRL = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Flex minH="100vh" bg="gray.50" direction="column" py={8}>
      <Flex flex={1} justify="center" px={4}>
        <Box w="full" maxW="container.xl">

          {/* Icon e título */}
          <VStack textAlign="center" mb={8}>
            <Flex
              w={16} h={16}
              bg="emerald.50"
              borderRadius="2xl"
              align="center" justify="center"
              mx="auto" mb={4}
            >
              <Icon as={FiFileText} w={8} h={8} color="emerald.500" />
            </Flex>
            <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
              {isEditMode ? 'Editar orçamento' : 'O que vamos orçar?'}
            </Heading>
            <Text color="gray.600">
              {isEditMode ? 'Atualize os dados do orçamento.' : 'Preencha o que você vai cobrar. É jogo rápido.'}
            </Text>
          </VStack>

          {isLoadingData ? (
            <Center py={16}>
              <Spinner size="xl" color="emerald.500" thickness="3px" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">

              {/* ── Formulário ─────────────────────────────────────────── */}
              <Box>
                <VStack as="form" onSubmit={handleSubmit} spacing={4}>

                  {/* Cliente */}
                  <Box w="full">
                    <Text
                      as="label"
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={2}
                    >
                      Cliente <Text as="span" color="red.500">*</Text>
                    </Text>
                    <ReactSelect
                      value={clientOptions.find(o => o.value === parseInt(formData.clientId)) || null}
                      onChange={handleClientSelectChange}
                      options={clientOptions}
                      placeholder={loadingClients ? 'Carregando clientes...' : 'Selecione ou busque um cliente...'}
                      isDisabled={loadingClients}
                      isClearable
                      isSearchable
                      isLoading={loadingClients}
                      styles={{
                        ...appSelectStyles,
                        control: (provided, state) => ({
                          ...appSelectStyles.control(provided, state),
                          borderColor: errors.clientId ? '#E53E3E' : state.isFocused ? '#00d97e' : '#e2e8f0',
                          boxShadow: errors.clientId
                            ? '0 0 0 2px #E53E3E'
                            : state.isFocused
                              ? '0 0 0 2px #00d97e'
                              : 'none',
                        }),
                        option: (provided, state) => ({
                          ...appSelectStyles.option(provided, state),
                          backgroundColor: state.data?.isCreate
                            ? state.isFocused ? '#F0FDF4' : 'transparent'
                            : appSelectStyles.option(provided, state).backgroundColor,
                          color: state.data?.isCreate ? '#059669' : appSelectStyles.option(provided, state).color,
                          fontWeight: state.data?.isCreate ? '600' : appSelectStyles.option(provided, state).fontWeight,
                        }),
                      }}
                      formatOptionLabel={formatOptionLabel}
                      noOptionsMessage={() => 'Nenhum cliente encontrado'}
                      loadingMessage={() => 'Carregando...'}
                    />
                    <FieldError message={errors.clientId} />
                  </Box>

                  {/* Título */}
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
                      Nome do serviço, projeto ou produto <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Ex: Revisão Geral de Mecânica"
                      value={formData.title}
                      isInvalid={!!errors.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value })
                        if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
                      }}
                    />
                    <FieldError message={errors.title} />
                  </Box>

                  {/* Validade */}
                  <Box w="full">
                    <Text
                      as="label"
                      htmlFor="validUntil"
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={2}
                    >
                      Validade do preço <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      id="validUntil"
                      name="validUntil"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.validUntil}
                      isInvalid={!!errors.validUntil}
                      onChange={(e) => {
                        setFormData({ ...formData, validUntil: e.target.value })
                        if (errors.validUntil) setErrors(prev => ({ ...prev, validUntil: '' }))
                      }}
                    />
                    <FieldError message={errors.validUntil} />
                  </Box>

                  {/* Itens */}
                  <Box w="full">
                    <Text
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={3}
                    >
                      Itens do orçamento <Text as="span" color="red.500">*</Text>
                    </Text>

                    <VStack spacing={3} w="full">
                      {items.map((item) => (
                        <Box
                          key={item.id}
                          w="full"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="xl"
                          p={4}
                        >
                          <VStack spacing={3} w="full">
                            <Input
                              type="text"
                              value={item.desc}
                              placeholder="Ex: Mão de obra"
                              h={10}
                              px={3}
                              borderRadius="lg"
                              isInvalid={!!errors.itemDesc && item.id === items[0]?.id}
                              onChange={(e) => {
                                handleItemChange(item.id, 'desc', e.target.value)
                                if (errors.itemDesc) setErrors(prev => ({ ...prev, itemDesc: '' }))
                              }}
                            />
                            {errors.itemDesc && item.id === items[0]?.id && (
                              <Box alignSelf="start">
                                <FieldError message={errors.itemDesc} />
                              </Box>
                            )}

                            <Flex align="center" gap={3} w="full">
                              <Box flex={1}>
                                <Text fontSize="xs" color="gray.600" mb={1}>Quantidade</Text>
                                <Input
                                  type="number"
                                  min="0"
                                  value={item.qtd}
                                  h={10}
                                  px={3}
                                  borderRadius="lg"
                                  onChange={(e) => handleItemChange(item.id, 'qtd', e.target.value)}
                                />
                              </Box>

                              <Box flex={1}>
                                <Text fontSize="xs" color="gray.600" mb={1}>
                                  Valor (R$) <Text as="span" color="red.500">*</Text>
                                </Text>
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0,00"
                                  value={item.value}
                                  h={10}
                                  px={3}
                                  borderRadius="lg"
                                  isInvalid={!!errors.itemValue && item.id === items[0]?.id}
                                  onFocus={(e) => { if (e.target.value === '0') handleItemChange(item.id, 'value', '') }}
                                  onChange={(e) => {
                                    handleItemChange(item.id, 'value', e.target.value)
                                    if (errors.itemValue && item.id === items[0]?.id) setErrors(prev => ({ ...prev, itemValue: '' }))
                                  }}
                                />
                                {errors.itemValue && item.id === items[0]?.id && (
                                  <FieldError message={errors.itemValue} />
                                )}
                              </Box>

                              <IconButton
                                aria-label="Remover item"
                                icon={<FiTrash2 />}
                                variant="ghost"
                                color="gray.500"
                                _hover={{ color: 'red.500' }}
                                mt={5}
                                size="md"
                                onClick={() => handleRemoveItem(item.id)}
                                isDisabled={items.length === 1}
                              />
                            </Flex>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>

                    <Button
                      type="button"
                      onClick={handleAddItem}
                      mt={3}
                      w="full"
                      size="md"
                      height="40px"
                      borderRadius="xl"
                      variant="solid"
                      leftIcon={<Icon as={FiPlus} w={4} h={4} />}
                    >
                      Incluir serviço ou peça
                    </Button>
                  </Box>

                  {/* Desconto */}
                  <Box w="full">
                    <Text
                      as="label"
                      htmlFor="discount"
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={2}
                    >
                      Desconto <Text as="span" color="gray.500">(opcional)</Text>
                    </Text>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      placeholder="%"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onFocus={(e) => { if (e.target.value === '0' || e.target.value === 0) setFormData({ ...formData, discount: '' }) }}
                      onBlur={(e) => { if (e.target.value === '') setFormData({ ...formData, discount: '' }) }}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val.length > 3) return
                        if (parseFloat(val) > 100) return
                        setFormData({ ...formData, discount: val })
                      }}
                    />
                  </Box>

                  {/* Navegação desktop */}
                  <Flex
                    align="center"
                    justify="space-between"
                    w="full"
                    mt={8}
                    pt={6}
                    borderTop="1px"
                    borderColor="gray.200"
                    display={{ base: 'none', lg: 'flex' }}
                  >
                    <Button
                      onClick={() => navigate('/dashboard/propostas')}
                      variant="ghost"
                      size="md"
                      height="40px"
                      minW="120px"
                      leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
                      color="gray.600"
                      _hover={{ color: 'gray.900' }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="md"
                      height="40px"
                      minW="120px"
                      px={8}
                      variant="solid"
                      rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
                      isLoading={isLoading}
                      loadingText="Salvando..."
                    >
                      {isEditMode ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
                    </Button>
                  </Flex>
                </VStack>
              </Box>

              {/* ── Preview ────────────────────────────────────────────── */}
              <Box>
                <Box
                  bg="white"
                  borderRadius="2xl"
                  position={{ base: 'relative', lg: 'sticky' }}
                  top={{ base: '0', lg: '100px' }}
                  p={6}
                  boxShadow="sm"
                  border="1px"
                  borderColor="gray.200"
                >
                  <HStack justify="space-between" mb={6}>
                    <Heading size="md" color="gray.900">Olha como seu cliente vai ver:</Heading>
                    <Icon as={FiEye} color="gray.400" />
                  </HStack>

                  <VStack spacing={4} align="stretch">
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

                    <Heading size="lg" color="gray.900">
                      {formData.title || 'Título do Orçamento'}
                    </Heading>

                    {formData.validUntil && (
                      <Text fontSize="sm" color="red.500" fontWeight="medium">
                        Válido até: {formData.validUntil.split('-').reverse().join('/')}
                      </Text>
                    )}

                    <Box height="1px" bg="gray.200" />

                    {items.filter(item => item.desc.trim()).map((item) => {
                      const v = parseFloat(String(item.value).replace(',', '.')) || 0
                      const q = parseInt(item.qtd || 1)
                      return (
                        <HStack key={item.id} justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium" color="gray.900">{item.desc}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {q}x R$ {fmtBRL(v)}
                            </Text>
                          </VStack>
                          <Text fontWeight="bold" color="gray.900">
                            R$ {fmtBRL(v * q)}
                          </Text>
                        </HStack>
                      )
                    })}

                    <Box height="1px" bg="gray.200" />

                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text color="gray.900">Subtotal:</Text>
                        <Text fontWeight="medium" color="gray.900">R$ {fmtBRL(subtotal)}</Text>
                      </HStack>
                      {discountPct > 0 && (
                        <HStack justify="space-between">
                          <Text color="gray.900">Desconto ({discountPct}%):</Text>
                          <Text fontWeight="medium" color="red.500">
                            - R$ {fmtBRL(discountAmount)}
                          </Text>
                        </HStack>
                      )}
                      <Box height="1px" bg="gray.200" />
                      <HStack justify="space-between">
                        <Text fontSize="xl" fontWeight="bold" color="gray.900">Total</Text>
                        <Text fontSize="xl" fontWeight="bold" color="emerald.600">
                          R$ {fmtBRL(total)}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </Box>

            </SimpleGrid>
          )}

          {/* ── Navegação mobile — abaixo do preview ───────────────────── */}
          {!isLoadingData && (
            <Flex
              align="center"
              justify="space-between"
              w="full"
              mt={8}
              pt={6}
              borderTop="1px"
              borderColor="gray.200"
              display={{ base: 'flex', lg: 'none' }}
            >
              <Button
                onClick={() => navigate('/dashboard/propostas')}
                variant="ghost"
                size="md"
                height="40px"
                minW="120px"
                leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
                color="gray.600"
                _hover={{ color: 'gray.900' }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                size="md"
                height="40px"
                minW="120px"
                px={8}
                variant="solid"
                rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                {isEditMode ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
              </Button>
            </Flex>
          )}

        </Box>
      </Flex>

      {/* ── Modal: Cadastrar novo cliente ──────────────────────────────────── */}
      <Modal isOpen={isClientModalOpen} onClose={handleCloseClientModal} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" shadow="2xl" mx={4}>
          <ModalHeader fontSize="lg" fontWeight="bold" color="gray.900" pb={2}>
            Cadastrar novo cliente
          </ModalHeader>
          <ModalCloseButton top={4} right={4} />

          <ModalBody>
            <VStack spacing={4}>
              {/* Nome */}
              <Box w="full">
                <Text
                  as="label"
                  htmlFor="modal-name"
                  display="block"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={2}
                >
                  Nome do cliente <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  id="modal-name"
                  placeholder="Ex: João Silva"
                  value={newClient.name}
                  isInvalid={!!clientErrors.name}
                  onChange={(e) => {
                    setNewClient({ ...newClient, name: e.target.value })
                    if (clientErrors.name) setClientErrors(prev => ({ ...prev, name: '' }))
                  }}
                />
                <FieldError message={clientErrors.name} />
              </Box>

              {/* Telefone e E-mail */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                <Box>
                  <Text
                    as="label"
                    htmlFor="modal-phone"
                    display="block"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    mb={2}
                  >
                    Celular <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    id="modal-phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={newClient.phone}
                    isInvalid={!!clientErrors.phone}
                    onChange={(e) => {
                      setNewClient({ ...newClient, phone: maskPhone(e.target.value) })
                      if (clientErrors.phone) setClientErrors(prev => ({ ...prev, phone: '' }))
                    }}
                  />
                  <FieldError message={clientErrors.phone} />
                </Box>

                <Box>
                  <Text
                    as="label"
                    htmlFor="modal-email"
                    display="block"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    mb={2}
                  >
                    E-mail
                  </Text>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="cliente@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </Box>
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} pt={2}>
            <Button
              variant="ghost"
              onClick={handleCloseClientModal}
              isDisabled={isSavingClient}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
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
