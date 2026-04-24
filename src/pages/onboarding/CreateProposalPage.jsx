import {
  Box,
  Button,
  Center,
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
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
} from 'react-icons/fi'
import { WiStars } from 'react-icons/wi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import OrcafastLogo from '../../components/ui/OrcafastLogo'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useState } from 'react'
import { FieldError } from '../../components/ui/FormFeedback'
import { formMessages } from '../../utils/formMessages'
import { maskBRL, parseBRL, initBRL } from '../../utils/mask'

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
        value: initBRL(item.unit_price || 0),
      }))
    }
    return [{ id: 1, desc: '', qtd: 1, value: '' }]
  })
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [errors, setErrors] = useState({})

  const fmtBRL = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    if (cleaned.length === 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    return phone
  }

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
    if (field === 'qtd' && rawValue.length > 6) return
    setItems(items.map((item) => item.id === id ? { ...item, [field]: rawValue } : item))
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + parseBRL(item.value) * (parseFloat(item.qtd) || 0)
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
      handleItemChange(items[0].id, 'value', maskBRL(String(Math.round(suggestedPrice * 100))))
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
    items.forEach((item) => {
      if (!item.desc.trim()) next[`itemDesc_${item.id}`] = formMessages.required.generic
      if (parseBRL(item.value) <= 0) next[`itemValue_${item.id}`] = formMessages.value.zero
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Botão Próximo habilitado quando: título preenchido + 1º item tem descrição + 1º item tem valor > 0
  const isFormValid = (() => {
    if (!title.trim()) return false
    const first = items[0]
    if (!first?.desc?.trim()) return false
    const val = parseBRL(first?.value || '')
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
        unit_price: parseBRL(item.value)
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
                          if (errors[`itemDesc_${item.id}`]) setErrors(prev => { const n = { ...prev }; delete n[`itemDesc_${item.id}`]; return n })
                        }}
                        placeholder="Ex: Mão de obra"
                        h={10}
                        px={3}
                        borderRadius="lg"
                        isInvalid={!!errors[`itemDesc_${item.id}`]}
                      />
                      {errors[`itemDesc_${item.id}`] && (
                        <Box alignSelf="start">
                          <FieldError message={errors[`itemDesc_${item.id}`]} />
                        </Box>
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
                            inputMode="numeric"
                            placeholder="0,00"
                            value={item.value}
                            h={10}
                            px={3}
                            borderRadius="lg"
                            isInvalid={!!errors[`itemValue_${item.id}`]}
                            onChange={(e) => {
                              handleItemChange(item.id, 'value', maskBRL(e.target.value))
                              if (errors[`itemValue_${item.id}`]) setErrors(prev => { const n = { ...prev }; delete n[`itemValue_${item.id}`]; return n })
                            }}
                          />
                          {errors[`itemValue_${item.id}`] && (
                            <FieldError message={errors[`itemValue_${item.id}`]} />
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
                Incluir itens
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
        <Box>
          <Box
            position={{ base: 'relative', lg: 'sticky' }}
            top={{ base: '0', lg: '100px' }}
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="gray.900">Olha como seu cliente vai ver:</Heading>
              <Icon as={FiEye} color="gray.400" />
            </HStack>

            <VStack spacing={4} align="stretch">

              {/* Client Card */}
              <Box bg="emerald.50" borderRadius="2xl" border="1px" borderColor="emerald.100" p={5}>
                <Text fontSize="xs" fontWeight="semibold" color="emerald.600" textTransform="uppercase" letterSpacing="wider" mb={3}>
                  Orçamento para
                </Text>
                <HStack align="start" spacing={3}>
                  <Center w={10} h={10} bg="emerald.100" borderRadius="full" flexShrink={0}>
                    <Icon as={FiUser} color="emerald.600" boxSize={5} />
                  </Center>
                  <Box flex={1} minW={0}>
                    <Text fontWeight="bold" color="gray.900">
                      {clientData?.name || 'Cliente do onboarding'}
                    </Text>
                    {clientData?.company && (
                      <Text fontSize="xs" color="gray.500">{clientData.company}</Text>
                    )}
                    <VStack align="start" spacing={1} mt={clientData?.name ? 2 : 0}>
                      {clientData?.phone && (
                        <HStack spacing="1.5" color="gray.500">
                          <Icon as={FiPhone} boxSize={3} />
                          <Text fontSize="xs">{formatPhone(clientData.phone)}</Text>
                        </HStack>
                      )}
                      {clientData?.email && (
                        <HStack spacing="1.5" color="gray.500">
                          <Icon as={FiMail} boxSize={3} />
                          <Text fontSize="xs">{clientData.email}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </HStack>
              </Box>

              {/* Quote Details Card */}
              <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
                <Box p={5} borderBottom="1px" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.900">
                    {title || 'Título do Orçamento'}
                  </Text>
                  {validUntil && (
                    <HStack spacing={1} color="orange.500" mt={2}>
                      <Icon as={FiCalendar} boxSize={3} />
                      <Text fontSize="xs" fontWeight="semibold">
                        Válido até {validUntil.split('-').reverse().join('/')}
                      </Text>
                    </HStack>
                  )}
                </Box>

                {items.filter(item => item.desc.trim()).map((item, idx, arr) => {
                  const v = parseBRL(item.value)
                  const q = parseInt(item.qtd || 1)
                  return (
                    <Flex
                      key={item.id}
                      p={4}
                      justify="space-between"
                      align="center"
                      gap={4}
                      borderBottom={idx < arr.length - 1 ? '1px' : undefined}
                      borderColor="gray.100"
                    >
                      <Box flex={1} minW={0}>
                        <Text fontWeight="medium" color="gray.900" fontSize="sm">{item.desc}</Text>
                        <Text fontSize="xs" color="gray.500" mt="0.5">
                          {q}x R$ {fmtBRL(v)}
                        </Text>
                      </Box>
                      <Text fontWeight="semibold" color="gray.900" fontSize="sm" flexShrink={0}>
                        R$ {fmtBRL(v * q)}
                      </Text>
                    </Flex>
                  )
                })}

                <Box p={5} bg="gray.50" borderTop="1px" borderColor="gray.100">
                  <VStack spacing={2} align="stretch">
                    <Flex justify="space-between" fontSize="sm">
                      <Text color="gray.500">Subtotal</Text>
                      <Text fontWeight="medium" color="gray.900">R$ {fmtBRL(subtotal)}</Text>
                    </Flex>
                    {discountPct > 0 && (
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Desconto ({discountPct}%)</Text>
                        <Text fontWeight="medium" color="red.500">- R$ {fmtBRL(discountAmount)}</Text>
                      </Flex>
                    )}
                    <Flex justify="space-between" align="center" pt={2} borderTop="1px" borderColor="gray.200">
                      <Text fontWeight="bold" color="gray.900">Total</Text>
                      <Text fontSize="xl" fontWeight="bold" color="emerald.600">R$ {fmtBRL(total)}</Text>
                    </Flex>
                  </VStack>
                </Box>
              </Box>

              {/* Footer */}
              <Box pt={2} textAlign="center">
                <Text fontSize="xs" color="gray.400" mb={2}>Documento gerado por</Text>
                <Flex justify="center">
                  <OrcafastLogo variant="full" height="24px" />
                </Flex>
              </Box>

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
                unit_price: parseBRL(item.value)
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
