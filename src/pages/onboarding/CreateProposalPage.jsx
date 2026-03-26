import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  SimpleGrid,
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
  FiEye,
} from 'react-icons/fi'
import { WiStars } from 'react-icons/wi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useState } from 'react'
import { FieldError } from '../../components/ui/FormFeedback'
import { formMessages } from '../../utils/formMessages'

const CreateProposalPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateProposalData, guestData } = useOnboarding()
  const clientData = guestData?.client || {}

  const [title, setTitle] = useState(guestData?.proposal?.title || '')
  const [discount, setDiscount] = useState(guestData?.proposal?.discount || '')
  const [validUntil, setValidUntil] = useState(guestData?.proposal?.valid_until || guestData?.proposal?.validUntil || '')
  const [items, setItems] = useState(() => {
    if (guestData?.proposal?.items?.length > 0) {
      return guestData.proposal.items.map((item, index) => ({
        id: index + 1,
        desc: item.description || '',
        qtd: item.quantity || 1,
        value: item.unit_price || ''
      }))
    }
    return [{ id: 1, desc: '', qtd: 1, value: '' }]
  })
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [errors, setErrors] = useState({})

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qtd: 1, value: '' }])
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

  const handleItemChange = (id, field, rawValue) => {
    // Limites de entrada
    if (field === 'qtd') {
      if (rawValue.length > 6) return
    }
    if (field === 'value') {
      // Aceita vírgula como separador decimal
      const normalized = rawValue.replace(',', '.')
      // Permite apenas números e um ponto decimal
      if (!/^\d*\.?\d{0,2}$/.test(normalized) && rawValue !== '') return
      if (normalized.length > 10) return
    }

    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: rawValue }
      }
      return item
    })
    setItems(newItems)
  }

  const subtotal = items.reduce((acc, item) => {
    const value = parseFloat(String(item.value).replace(',', '.')) || 0
    const qtd = parseFloat(item.qtd) || 0
    return acc + value * qtd
  }, 0)

  const discountPct = parseFloat(String(discount).replace(',', '.')) || 0
  const discountAmount = (subtotal * (discountPct / 100))
  const total = subtotal - discountAmount

  const handleAISuggestion = async () => {
    if (!title.trim() && !items.some(item => item.desc.trim())) {
      toast({
        title: 'Adicione mais detalhes',
        description: 'Preencha o título ou itens para gerar uma sugestão.',
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

  const validate = () => {
    const next = {}
    if (!title.trim()) next.title = formMessages.required.title
    if (!validUntil.trim()) next.validUntil = formMessages.required.validUntil
    const firstItem = items[0]
    if (!firstItem?.desc?.trim()) next.itemDesc = formMessages.required.generic
    const itemVal = parseFloat(String(firstItem?.value || '').replace(',', '.')) || 0
    if (itemVal <= 0) next.itemValue = formMessages.value.zero
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Botão Próximo habilitado quando: título preenchido + 1º item tem descrição + 1º item tem valor > 0
  const isFormValid = (() => {
    if (!title.trim()) return false
    const first = items[0]
    if (!first?.desc?.trim()) return false
    const val = parseFloat(String(first?.value || '').replace(',', '.')) || 0
    return val > 0
  })()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const proposalData = {
      title,
      valid_until: validUntil,
      discount: discountPct,
      items: items.map(item => ({
        description: item.desc,
        quantity: parseFloat(item.qtd) || 0,
        unit_price: parseFloat(String(item.value).replace(',', '.')) || 0
      }))
    }

    updateProposalData(proposalData)
    navigate('/onboarding/send-proposal')
  }

  return (
    <OnboardingLayout currentStep={2} totalSteps={3} contentWidth="7xl">
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
          O que vamos orçar?
        </Heading>
        <Text color="gray.600">
          Preencha o que você vai cobrar. É jogo rápido.
        </Text>
      </VStack>

      {/* Grid Layout */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
        {/* Lado Esquerdo: Formulário */}
        <Box>
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
                Nome do serviço, projeto ou produto <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Ex: Revisão Geral de Mecânica"
                isInvalid={!!errors.title}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
                }}


              />
              <FieldError message={errors.title} />
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
                Validade do preço <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                id="validUntil"
                name="validUntil"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={validUntil}
                isInvalid={!!errors.validUntil}
                onChange={(e) => {
                  setValidUntil(e.target.value)
                  if (errors.validUntil) setErrors(prev => ({ ...prev, validUntil: '' }))
                }}
              />
              <FieldError message={errors.validUntil} />
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
                        onChange={(e) => {
                          handleItemChange(item.id, 'desc', e.target.value)
                          if (errors.itemDesc) setErrors(prev => ({ ...prev, itemDesc: '' }))
                        }}
                        placeholder="Ex: Mão de obra"
                        h={10}
                        px={3}
                        borderRadius="lg"
                        isInvalid={!!errors.itemDesc && item.id === items[0]?.id}
                      />
                      {errors.itemDesc && item.id === items[0]?.id && (
                        <>
                          <Box h={2} alignSelf="start" >
                            <FieldError message={errors.itemDesc} />
                          </Box>
                        </>

                      )}
                      <Flex align="center" gap={3} w="full">
                        <Box flex={1}>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Quantidade
                          </Text>
                          <Input
                            type="number"
                            min="0"
                            value={item.qtd}
                            onChange={(e) => handleItemChange(item.id, 'qtd', e.target.value)}
                            h={10}
                            px={3}
                            borderRadius="lg"
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
                            onFocus={(e) => { if (e.target.value === '0') handleItemChange(item.id, 'value', '') }}
                            onChange={(e) => {
                              handleItemChange(item.id, 'value', e.target.value)
                              if (errors.itemValue && item.id === items[0]?.id) setErrors(prev => ({ ...prev, itemValue: '' }))
                            }}
                            h={10}
                            px={3}
                            borderRadius="lg"
                            isInvalid={!!errors.itemValue && item.id === items[0]?.id}
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
                boxShadow="lg"
                bg="emerald.500"
                color="white"
                fontWeight="normal"
                fontSize="sm"
                leftIcon={<Icon as={FiPlus} w={4} h={4} />}
                _hover={{ bg: 'emerald.600' }}
              >
                Incluir serviço ou peça
              </Button>

              {/* Botão IA - aparece quando há dados suficientes */}
              {/* {(title.trim() || items.some(item => item.desc.trim())) && (
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
              )} */}
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
                placeholder="%"
                min="0"
                max="100"
                value={discount}
                onFocus={(e) => { if (e.target.value === '0' || e.target.value === 0) setDiscount('') }}
                onBlur={(e) => { if (e.target.value === '') setDiscount('') }}
                onChange={(e) => {
                  const val = e.target.value
                  if (val.length > 3) return
                  if (parseFloat(val) > 100) return
                  setDiscount(val)
                }}
              />
            </Box>

            {/* Navigation — inside the form, hidden on mobile (rendered below preview) */}
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
                as={RouterLink}
                to="/onboarding/create-client"
                variant="ghost"
                size="md"
                height="40px"
                minW="120px"
                leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
                color="gray.600"
                _hover={{ color: 'gray.900' }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                size="md"
                height="40px"
                minW="120px"
                px={8}
                bg="emerald.500"
                _hover={{ bg: 'emerald.600' }}
                color="white"
                fontWeight="semibold"
                fontSize="sm"
                borderRadius="xl"
                boxShadow="lg"
                //isDisabled={!isFormValid}
                rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
              >
                Continuar
              </Button>
            </Flex>
          </VStack>
        </Box>

        {/* Lado Direito: Preview */}
        <Box display={{ base: 'block', lg: 'block' }}>
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
              {/* Cabeçalho com dados do cliente */}
              <Box bg="emerald.50" p={4} borderRadius="lg" borderWidth="1px" borderColor="emerald.200">
                <Text fontSize="sm" color="emerald.700" fontWeight="semibold" mb={2}>
                  ORÇAMENTO PARA:
                </Text>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" color="gray.900">
                    {clientData?.name || 'Cliente do onboarding'}
                  </Text>
                  {clientData?.phone && (
                    <Text fontSize="sm" color="gray.600">{clientData.phone}</Text>
                  )}
                  {clientData?.email && (
                    <Text fontSize="sm" color="gray.600">{clientData.email}</Text>
                  )}
                </VStack>
              </Box>

              <Heading size="lg" color="gray.900">{title || 'Título do Orçamento'}</Heading>
              {validUntil && (
                <Text fontSize="sm" color="red.500" fontWeight="medium">
                  Válido até: {validUntil.split('-').reverse().join('/')}
                </Text>
              )}
              <Box height="1px" bg="gray.200" />
              {items.filter(item => item.desc.trim()).map((item) => {
                const v = parseFloat(String(item.value).replace(',', '.')) || 0
                const q = parseInt(item.qtd || 1)
                const fmt = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                return (
                  <HStack key={item.id} justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" color="gray.900">{item.desc}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {q}x R$ {fmt(v)}
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color="gray.900">
                      R$ {fmt(v * q)}
                    </Text>
                  </HStack>
                )
              })}
              <Box height="1px" bg="gray.200" />
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.900">Subtotal:</Text>
                  <Text fontWeight="medium" color="gray.900">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </HStack>
                {discountPct > 0 && (
                  <HStack justify="space-between">
                    <Text color="gray.900">Desconto ({discountPct}%):</Text>
                    <Text fontWeight="medium" color="red.500">
                      - R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </HStack>
                )}
                <Box height="1px" bg="gray.200" />
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold" color="gray.900">
                    Total
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="emerald.600">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>

      {/* Navigation mobile — below preview so user sees everything first */}
      <Flex
        align="center"
        justify="space-between"
        w="full"
        mt={8}
        pt={6}
        borderTop="1px"
        borderColor="gray.200"
        display={{ base: 'flex', lg: 'none' }}
        as="div"
      >
        <Button
          as={RouterLink}
          to="/onboarding/create-client"
          variant="ghost"
          size="md"
          height="40px"
          minW="120px"
          leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
          color="gray.600"
          _hover={{ color: 'gray.900' }}
        >
          Voltar
        </Button>
        <Button
          onClick={() => {
            // Dispara validação e submit manualmente no mobile
            if (!validate()) return
            const proposalData = {
              title,
              valid_until: validUntil,
              discount: discountPct,
              items: items.map(item => ({
                description: item.desc,
                quantity: parseFloat(item.qtd) || 0,
                unit_price: parseFloat(String(item.value).replace(',', '.')) || 0
              }))
            }
            updateProposalData(proposalData)
            navigate('/onboarding/send-proposal')
          }}
          size="md"
          height="40px"
          minW="120px"
          px={8}
          bg="emerald.500"
          _hover={{ bg: 'emerald.600' }}
          color="white"
          fontWeight="semibold"
          fontSize="sm"
          borderRadius="xl"
          boxShadow="lg"
          //isDisabled={!isFormValid}
          rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
        >
          Continuar
        </Button>
      </Flex>
    </OnboardingLayout>
  )
}

export default CreateProposalPage
