import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  Textarea,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import {
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'
import { WiStars } from 'react-icons/wi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useState } from 'react'

const CreateProposalPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateProposalData } = useOnboarding()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [discount, setDiscount] = useState(0)
  const [validUntil, setValidUntil] = useState('')
  const [items, setItems] = useState([
    { id: 1, desc: '', qtd: 1, value: 0 },
  ])
  const [isLoadingAI, setIsLoadingAI] = useState(false)

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

  const subtotal = items.reduce((acc, item) => {
    const value = parseFloat(item.value) || 0
    const qtd = parseInt(item.qtd, 10) || 0
    return acc + value * qtd
  }, 0)

  const discountAmount = parseFloat(discount) || 0
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
      validUntil,
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
    <OnboardingLayout currentStep={2} totalSteps={3}>
      {/* Icon and title */}
      <VStack textAlign="center" mb={8}>
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
          Criar orçamento
        </Heading>
        <Text color="gray.600">
          Agora vamos montar seu orçamento
        </Text>
      </VStack>

      {/* Form */}
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
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
            Título do orçamento
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            Descrição <Text as="span" color="gray.500">(opcional)</Text>
          </Text>
          <Textarea
            id="description"
            name="description"
            placeholder="Descreva brevemente o projeto..."
            rows={3}
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
            resize="none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

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
            Válido até
          </Text>
          <Input
            id="validUntil"
            name="validUntil"
            type="date"
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
            fontSize="sm"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </Box>

        {/* Items */}
        <Box w="full">
          <Text
            display="block"
            fontSize="sm"
            fontWeight="medium"
            color="gray.900"
            mb={3}
          >
            Itens do orçamento
          </Text>
          <VStack spacing={3} w="full">
            {items.map((item) => (
              <Box
                key={item.id}
                w="full"
                bg="gray.100"
                borderRadius="xl"
                p={4}
              >
                <VStack spacing={3} w="full">
                  <Input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
                    placeholder="Descrição do item"
                    h={10}
                    px={3}
                    bg="white"
                    border="none"
                    borderRadius="lg"
                    color="gray.900"
                    _placeholder={{ color: 'gray.500' }}
                    _focus={{ 
                      boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                      outline: 'none'
                    }}
                    fontSize="sm"
                  />
                  <Flex align="center" gap={3} w="full">
                    <Box flex={1}>
                      <Text fontSize="xs" color="gray.600" mb={1}>
                        Qtd
                      </Text>
                      <Input
                        type="number"
                        min="1"
                        value={item.qtd}
                        onChange={(e) => handleItemChange(item.id, 'qtd', parseInt(e.target.value) || 1)}
                        h={10}
                        px={3}
                        bg="white"
                        border="none"
                        borderRadius="lg"
                        color="gray.900"
                        _focus={{ 
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                        fontSize="sm"
                      />
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="xs" color="gray.600" mb={1}>
                        Valor (R$)
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.value}
                        onChange={(e) => handleItemChange(item.id, 'value', parseFloat(e.target.value) || 0)}
                        h={10}
                        px={3}
                        bg="white"
                        border="none"
                        borderRadius="lg"
                        color="gray.900"
                        _focus={{ 
                          boxShadow: '0 0 0 2px var(--chakra-colors-emerald-500)',
                          outline: 'none'
                        }}
                        fontSize="sm"
                      />
                    </Box>
                    <IconButton
                      aria-label="Remover item"
                      icon={<FiTrash2 />}
                      variant="ghost"
                      color="gray.500"
                      _hover={{ color: 'red.500' }}
                      mt={5}
                      size="sm"
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
            h={10}
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="xl"
            bg="transparent"
            color="gray.500"
            fontWeight="normal"
            fontSize="sm"
            leftIcon={<Icon as={FiPlus} w={4} h={4} />}
            _hover={{ 
              color: 'gray.900',
              borderColor: 'emerald.300'
            }}
          >
            Adicionar item
          </Button>

          {/* Botão IA - aparece quando há dados suficientes */}
          {(title.trim() || description.trim() || items.some(item => item.desc.trim())) && (
            <Button
              type="button"
              leftIcon={<Icon fontSize="24px" as={WiStars} />}
              colorScheme="purple"
              variant="outline"
              onClick={handleAISuggestion}
              isLoading={isLoadingAI}
              loadingText="Calculando..."
              size="sm"
              borderRadius="lg"
              mt={2}
              w="full"
            >
              {isLoadingAI ? 'Calculando...' : 'Sugerir preço com IA'}
            </Button>
          )}
        </Box>

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
            min="0"
            step="0.01"
            placeholder="0"
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
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
          />
        </Box>

        {/* Total preview */}
        <Box
          w="full"
          bg="emerald.50"
          border="1px"
          borderColor="emerald.100"
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" fontSize="sm" color="gray.600" mb={2}>
            <Text>Subtotal</Text>
            <Text>R$ {subtotal.toFixed(2)}</Text>
          </Flex>
          {discountAmount > 0 && (
            <Flex justify="space-between" fontSize="sm" color="gray.600" mb={2}>
              <Text>Desconto</Text>
              <Text color="red.500">- R$ {discountAmount.toFixed(2)}</Text>
            </Flex>
          )}
          <Flex
            justify="space-between"
            fontSize="md"
            fontWeight="semibold"
            color="gray.900"
            pt={2}
            borderTop="1px"
            borderColor="emerald.200"
          >
            <Text>Total</Text>
            <Text color="emerald.600">R$ {total.toFixed(2)}</Text>
          </Flex>
        </Box>

        {/* Navigation */}
        <Flex align="center" justify="space-between" w="full" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
          <Button
            as={RouterLink}
            to="/onboarding/create-client"
            variant="ghost"
            leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
            color="gray.600"
            _hover={{ color: 'gray.900' }}
          >
            Voltar
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
          >
            Próximo
          </Button>
        </Flex>
      </VStack>
    </OnboardingLayout>
  )
}

export default CreateProposalPage
