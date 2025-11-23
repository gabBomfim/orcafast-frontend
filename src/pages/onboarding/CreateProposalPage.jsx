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
  Flex,
  SimpleGrid,
  useToast,
  Badge,
  Spinner,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import {
  FiFileText,
  FiArrowRight,
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiEye,
  FiPercent,
} from 'react-icons/fi'
import { WiStars } from "react-icons/wi"
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useState } from 'react'

const CreateProposalPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { guestData, updateProposalData } = useOnboarding()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [discount, setDiscount] = useState(0)
  const [validUntil, setValidUntil] = useState('')
  const [items, setItems] = useState([
    { id: 1, desc: '', qtd: 1, value: 0 },
  ])
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  // Dados do cliente vêm do contexto
  const clientData = guestData.client || {
    name: 'Cliente não definido',
    phone: '',
    email: ''
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

  const subtotal = items.reduce((acc, item) => {
    const value = parseFloat(item.value) || 0
    const qtd = parseInt(item.qtd, 10) || 0
    return acc + value * qtd
  }, 0)

  const discountAmount = (subtotal * (discount / 100))
  const total = subtotal - discountAmount

  const handleAISuggestion = async () => {
    if (!title.trim() && !description.trim() && !items.some(item => item.desc.trim())) {
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
    
    if (title.toLowerCase().includes('website') || title.toLowerCase().includes('site')) {
      suggestedPrice = 2500
    } else if (title.toLowerCase().includes('logo') || title.toLowerCase().includes('design')) {
      suggestedPrice = 800
    } else if (title.toLowerCase().includes('consultoria') || title.toLowerCase().includes('consultor')) {
      suggestedPrice = 1500
    }
    
    // Ajustes baseados na descrição
    if (description.toLowerCase().includes('complexo') || description.toLowerCase().includes('avançado')) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const proposalData = {
      title,
      description,
      discount,
      items: items.map(item => ({
        description: item.desc,
        quantity: parseInt(item.qtd, 10),
        unit_price: parseFloat(item.value) || 0
      }))
    }

    updateProposalData(proposalData)
    navigate('/onboarding/send-proposal')
  }

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      stepTitle="Detalhes da Proposta"
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Lado Esquerdo: Formulário */}
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Card
            shadow="xl"
            border="0"
            bg="white"
            borderRadius="2xl"
            w="full"
          >
            <CardHeader>
              <HStack spacing={4}>
                <Icon as={FiFileText} w={6} h={6} color="emerald.600" />
                <Heading as="h2" size="lg" fontWeight="bold" color="gray.900">
                  Criar proposta
                </Heading>
              </HStack>
            </CardHeader>

            <CardBody>
              <VStack spacing={8} w="full">
                <VStack spacing={6} w="full" align="start">
                  <VStack align="start" spacing={2} w="full">
                    <Text
                      htmlFor="title"
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      Título da proposta
                    </Text>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Ex: Desenvolvimento de Website"
                      size="lg"
                      borderRadius="xl"
                      py={6}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </VStack>

                  <VStack align="start" spacing={2} w="full">
                    <Text
                      htmlFor="description"
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.700"
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </VStack>
                </VStack>

                <VStack spacing={6} w="full" align="start">
                  <Heading as="h3" size="md" color="gray.800">
                  Válida até
                  </Heading>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </VStack>

                <VStack spacing={6} w="full" align="start">
                  <Heading as="h3" size="md" color="gray.800">
                    Itens da proposta
                  </Heading>
                  {items.map((item, index) => (
                    <VStack
                      key={item.id}
                      spacing={4}
                      w="full"
                      p={4}
                      bg="gray.50"
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <VStack align="start" spacing={2} w="full">
                        <Text htmlFor={`item-desc-${index}`}>
                          Descrição do item
                        </Text>
                        <Input
                          id={`item-desc-${index}`}
                          placeholder="Ex: Criação de logo"
                          value={item.desc}
                          onChange={(e) =>
                            handleItemChange(item.id, 'desc', e.target.value)
                          }
                        />
                      </VStack>
                      <HStack w="full" spacing={4}>
                        <VStack align="start" spacing={2} w="full">
                          <Text htmlFor={`item-qtd-${index}`}>
                            Quantidade
                          </Text>
                          <Input
                            id={`item-qtd-${index}`}
                            type="number"
                            value={item.qtd}
                            onChange={(e) =>
                              handleItemChange(item.id, 'qtd', e.target.value)
                            }
                          />
                        </VStack>
                        <VStack align="start" spacing={2} w="full">
                          <Text htmlFor={`item-value-${index}`}>
                            Valor (R$)
                          </Text>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiDollarSign} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              id={`item-value-${index}`}
                              type="number"
                              placeholder="1500.00"
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
                  {(title.trim() || description.trim() || items.some(item => item.desc.trim())) && (
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
                    htmlFor="discount"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    Desconto (opcional)
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPercent} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      size="lg"
                      borderRadius="xl"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                  </InputGroup>
                </FormControl>

                <Box height="1px" bg="gray.200" />

                <HStack w="full" pt={4}>
                  <Button
                    as={RouterLink}
                    to="/onboarding/create-client"
                    size="lg"
                    variant="ghost"
                    flex={1}
                    py={6}
                    leftIcon={<Icon as={FiArrowLeft} />}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    colorScheme="emerald"
                    flex={1}
                    py={6}
                    rightIcon={<Icon as={FiArrowRight} />}
                  >
                    Próximo
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Lado Direito: Preview */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Card
            shadow="xl"
            border="0"
            bg="white"
            borderRadius="2xl"
            position="sticky"
            top="24"
          >
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Preview da Proposta</Heading>
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
                    <Text fontWeight="bold" color="gray.900">{clientData.name}</Text>
                    {clientData.phone && (
                      <Text fontSize="sm" color="gray.600">{clientData.phone}</Text>
                    )}
                    {clientData.email && (
                      <Text fontSize="sm" color="gray.600">{clientData.email}</Text>
                    )}
                  </VStack>
                </Box>
                
                <Heading size="lg">{title || 'Título da Proposta'}</Heading>
                <Text color="gray.600">
                  {description || 'Descrição da proposta aparecerá aqui...'}
                </Text>
                <Box height="1px" bg="gray.200" />
                {items.filter(item => item.desc.trim()).map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{item.desc}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.qtd}x R$ {parseFloat(item.value || 0).toFixed(2)}
                      </Text>
                    </VStack>
                    <Text fontWeight="bold">
                      R$ {(parseFloat(item.value || 0) * parseInt(item.qtd || 1)).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
                <Box height="1px" bg="gray.200" />
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text fontWeight="medium">R$ {subtotal.toFixed(2)}</Text>
                  </HStack>
                  {discount > 0 && (
                    <HStack justify="space-between">
                      <Text>Desconto ({discount}%):</Text>
                      <Text fontWeight="medium" color="red.500">
                        - R$ {discountAmount.toFixed(2)}
                      </Text>
                    </HStack>
                  )}
                  <Box height="1px" bg="gray.200" />
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">
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

    </OnboardingLayout>
  )
}

export default CreateProposalPage
