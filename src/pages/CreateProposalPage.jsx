import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
  Select as ChakraSelect,
  FormControl,
  FormLabel,
  Spinner,
  Flex,
  useColorModeValue,
  Center,
} from '@chakra-ui/react'
import ReactSelect from 'react-select'
import {
  FiFileText,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiEye,
  FiPercent,
  FiUser,
  FiCalendar,
} from 'react-icons/fi'
import { WiStars } from 'react-icons/wi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Container from '../components/layout/Container'
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
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const itemBgColor = useColorModeValue('gray.50', 'gray.700')

  // Estilos customizados para o React Select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: bgColor,
      borderColor: state.isFocused ? '#10B981' : borderColor, // emerald.500
      borderRadius: '0.75rem', // xl
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 1px #10B981' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#10B981' : '#A0AEC0', // gray.400
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      borderRadius: '0.75rem',
      zIndex: 10,
      border: `1px solid ${borderColor}`,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#10B981' // emerald.500
        : state.isFocused 
          ? '#ECFDF5' // emerald.50
          : 'transparent',
      color: state.isSelected ? 'white' : textColor,
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#10B981',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: textColor,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: textColor,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#A0AEC0', // gray.400
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
          title: 'Erro ao carregar proposta',
          description: error.response?.data?.message || 'Não foi possível carregar os dados da proposta',
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

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qtd: 1, value: 0 }])
  }

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      toast({
        title: 'A proposta deve ter pelo menos um item.',
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

  const clientOptions = Array.isArray(clients) 
    ? clients.map(client => ({
        value: client.id,
        label: `${client.name} ${client.company ? `- ${client.company}` : ''}`,
        original: client
      }))
    : []

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

      // Navega para página de sucesso com os dados da proposta
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
      const message = error.response?.data?.message || 'Erro ao criar proposta'
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
    <Container maxW="container.xl">
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Lado Esquerdo: Formulário */}
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Card
            shadow="xl"
            border="0"
            bg={bgColor}
            borderRadius="2xl"
            w="full"
          >
            <CardHeader>
              <HStack spacing={4}>
                <Icon as={FiFileText} w={6} h={6} color="emerald.600" />
                <Heading as="h2" size="lg" fontWeight="bold" color={textColor}>
                  {isEditMode ? 'Editar proposta' : 'Criar proposta'}
                </Heading>
              </HStack>
            </CardHeader>

            <CardBody>
              {isLoadingData ? (
                <Center py={12}>
                  <Spinner size="lg" color="emerald.500" />
                </Center>
              ) : (
                <VStack spacing={8} w="full">
                <VStack spacing={6} w="full" align="start">
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="lg"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Cliente
                    </FormLabel>
                    <ReactSelect
                      name="clientId"
                      value={clientOptions.find(option => option.value === parseInt(formData.clientId)) || null}
                      onChange={(option) => setFormData({ ...formData, clientId: option ? option.value : '' })}
                      options={clientOptions}
                      placeholder={loadingClients ? 'Carregando clientes...' : 'Selecione ou busque um cliente...'}
                      isDisabled={loadingClients}
                      isClearable
                      isSearchable
                      isLoading={loadingClients}
                      styles={customSelectStyles}
                      noOptionsMessage={() => 'Nenhum cliente encontrado'}
                      loadingMessage={() => 'Carregando...'}
                    />
                  </FormControl>

                  <VStack align="start" spacing={2} w="full">
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Título da proposta *
                    </Text>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Ex: Desenvolvimento de Website"
                      size="lg"
                      borderRadius="xl"
                      py={6}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </VStack>

                  <VStack align="start" spacing={2} w="full">
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Descrição (opcional)
                    </Text>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva brevemente o projeto..."
                      size="lg"
                      borderRadius="xl"
                      minH="120px"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </VStack>

                  <FormControl isRequired>
                    <FormLabel
                      fontSize="lg"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Válida até
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiCalendar} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        size="lg"
                        borderRadius="xl"
                      />
                    </InputGroup>
                  </FormControl>
                </VStack>

                <VStack spacing={6} w="full" align="start">
                  <Heading as="h3" size="md" color={textColor}>
                    Itens da proposta
                  </Heading>
                  {items.map((item, index) => (
                    <VStack
                      key={item.id}
                      spacing={4}
                      w="full"
                      p={4}
                      bg={itemBgColor}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <VStack align="start" spacing={2} w="full">
                        <Text>Descrição do item</Text>
                        <Input
                          placeholder="Ex: Criação de logo"
                          value={item.desc}
                          onChange={(e) =>
                            handleItemChange(item.id, 'desc', e.target.value)
                          }
                        />
                      </VStack>
                      <HStack w="full" spacing={4}>
                        <VStack align="start" spacing={2} w="full">
                          <Text>Quantidade</Text>
                          <Input
                            type="number"
                            value={item.qtd}
                            onChange={(e) =>
                              handleItemChange(item.id, 'qtd', e.target.value)
                            }
                          />
                        </VStack>
                        <VStack align="start" spacing={2} w="full">
                          <Text>Valor (R$)</Text>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiDollarSign} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              type="number"
                              placeholder="1500.00"
                              step="0.01"
                              value={item.value}
                              onChange={(e) =>
                                handleItemChange(item.id, 'value', e.target.value)
                              }
                            />
                          </InputGroup>
                        </VStack>
                      </HStack>
                      <IconButton
                        aria-label="Remover item"
                        icon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        alignSelf="flex-end"
                        onClick={() => handleRemoveItem(item.id)}
                      />
                    </VStack>
                  ))}
                  <Button
                    leftIcon={<FiPlus />}
                    variant="outline"
                    colorScheme="emerald"
                    onClick={handleAddItem}
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
                <FormControl>
                  <FormLabel
                    fontSize="lg"
                    fontWeight="semibold"
                    color={textColor}
                  >
                    Desconto (opcional)
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPercent} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      size="lg"
                      borderRadius="xl"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    />
                  </InputGroup>
                </FormControl>

                <Box height="1px" bg={borderColor} />

                <HStack w="full" pt={4}>
                  <Button
                    onClick={() => navigate('/dashboard/propostas')}
                    size="lg"
                    variant="ghost"
                    flex={1}
                    py={6}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    colorScheme="emerald"
                    flex={1}
                    py={6}
                    rightIcon={<Icon as={FiArrowRight} />}
                    isLoading={isLoading}
                    loadingText="Salvando..."
                  >
                    {isEditMode ? 'Atualizar Proposta' : 'Salvar Proposta'}
                  </Button>
                </HStack>
              </VStack>
              )}
            </CardBody>
          </Card>
        </VStack>

        {/* Lado Direito: Preview */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Card
            shadow="xl"
            border="0"
            bg={bgColor}
            borderRadius="2xl"
            position="sticky"
            top="100px"
          >
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md" color={textColor}>Preview da Proposta</Heading>
                <Icon as={FiEye} color="gray.400" />
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Cabeçalho da Proposta */}
                <Box bg="emerald.50" p={4} borderRadius="lg" borderWidth="1px" borderColor="emerald.200">
                  <Text fontSize="sm" color="emerald.700" fontWeight="semibold" mb={2}>
                    PROPOSTA PARA:
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color={textColor}>
                      {selectedClient?.name || 'Selecione um cliente'}
                    </Text>
                    {selectedClient?.phone && (
                      <Text fontSize="sm" color={subTextColor}>{selectedClient.phone}</Text>
                    )}
                    {selectedClient?.email && (
                      <Text fontSize="sm" color={subTextColor}>{selectedClient.email}</Text>
                    )}
                  </VStack>
                </Box>
                
                <Heading size="lg" color={textColor}>{formData.title || 'Título da Proposta'}</Heading>
                <Text color={subTextColor}>
                  {formData.description || 'Descrição da proposta aparecerá aqui...'}
                </Text>
                <Box height="1px" bg={borderColor} />
                {items.filter(item => item.desc.trim()).map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" color={textColor}>{item.desc}</Text>
                      <Text fontSize="sm" color={subTextColor}>
                        {item.qtd}x R$ {parseFloat(item.value || 0).toFixed(2)}
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color={textColor}>
                      R$ {(parseFloat(item.value || 0) * parseInt(item.qtd || 1)).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
                <Box height="1px" bg={borderColor} />
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text color={textColor}>Subtotal:</Text>
                    <Text fontWeight="medium" color={textColor}>R$ {subtotal.toFixed(2)}</Text>
                  </HStack>
                  {formData.discount > 0 && (
                    <HStack justify="space-between">
                      <Text color={textColor}>Desconto ({formData.discount}%):</Text>
                      <Text fontWeight="medium" color="red.500">
                        - R$ {discountAmount.toFixed(2)}
                      </Text>
                    </HStack>
                  )}
                  <Box height="1px" bg={borderColor} />
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Total
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="emerald.600">
                      R$ {total.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  )
}

export default CreateProposalPage
