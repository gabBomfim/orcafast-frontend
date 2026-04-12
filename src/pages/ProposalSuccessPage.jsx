import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiShare2,
  FiLink,
  FiCheck,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiGrid,
  FiCopy,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Container from '../components/layout/Container'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { proposalService, companyService } from '../services'
import { openWhatsApp } from '../utils/whatsapp'

const ProposalSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [isCopyingLink, setIsCopyingLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [proposal, setProposal] = useState(null)
  const [isLoadingProposal, setIsLoadingProposal] = useState(true)
  const [company, setCompany] = useState(null)
  const [copiedPix, setCopiedPix] = useState(false)

  const [initialData] = useState(() => {
    return location.state || JSON.parse(sessionStorage.getItem('pending_proposal_success') || '{}')
  })

  const { proposalId, proposalData, sharingToken, isEdit } = initialData

  useEffect(() => {
    if (!proposalId || !proposalData) {
      navigate('/dashboard/propostas')
      return
    }
    sessionStorage.removeItem('pending_proposal_success')

    // Busca detalhes completos para montar o preview com itens
    proposalService.get(proposalId)
      .then(({ data }) => setProposal(data))
      .catch(() => setProposal(null))
      .finally(() => setIsLoadingProposal(false))

    companyService.get().then(({ data }) => setCompany(data)).catch(() => {})
  }, [proposalId, proposalData, navigate])

  if (!proposalId || !proposalData) return null

  // ─── Dados do preview ─────────────────────────────────────────────────────

  const clientName  = proposal?.client?.name  || proposalData.clientName  || 'Cliente'
  const clientPhone = proposal?.client?.phone || proposalData.clientPhone || ''
  const title       = proposal?.title         || proposalData.title        || ''
  const token       = proposal?.sharing_token || sharingToken               || ''

  const rawItems = proposal?.items || []
  const previewItems = rawItems.map((item, i) => ({
    id:    item.id || i,
    desc:  item.description || '',
    qtd:   item.quantity    || 1,
    value: item.unit_price  || 0,
  }))

  const subtotal = previewItems.reduce((acc, item) => {
    return acc + (parseFloat(item.value) || 0) * (parseFloat(item.qtd) || 0)
  }, 0)

  const discountPct    = parseFloat(proposal?.discount || 0)
  const discountAmount = subtotal * (discountPct / 100)
  const total          = parseFloat(proposal?.total_value || proposalData.totalValue || subtotal - discountAmount)

  const proposalUrl = token
    ? `${window.location.origin}/share/proposta/${token}`
    : `${window.location.origin}/proposta/${proposalId}`

  const fmt = (n) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    if (cleaned.length === 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    return phone
  }

  const handleCopyPix = async (pixKey) => {
    try {
      await navigator.clipboard.writeText(pixKey)
      setCopiedPix(true)
      setTimeout(() => setCopiedPix(false), 2000)
    } catch {
      // clipboard não disponível
    }
  }

  // ─── Ações ────────────────────────────────────────────────────────────────

  const handleWhatsApp = async () => {
    setIsSendingWhatsApp(true)
    try {
      await proposalService.updateStatus(proposalId, 2)
      const message = `Olá ${clientName}!\n\nSeu orçamento de *${title}* está pronto! 😊\n\nVisualize os detalhes clicando no link:\n🔗 ${proposalUrl}\n\nQualquer dúvida, estou à disposição!`
      openWhatsApp({ phone: clientPhone, message })
    } catch {
      // silencia — o WhatsApp ainda abre mesmo se o status falhar
      openWhatsApp({ phone: clientPhone, message: `Olá! Seu orçamento está pronto: ${proposalUrl}` })
    } finally {
      setIsSendingWhatsApp(false)
    }
  }

  const handleCopyLink = async () => {
    setIsCopyingLink(true)
    try {
      await navigator.clipboard.writeText(proposalUrl)
      await proposalService.updateStatus(proposalId, 2)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    } catch {
      // falha silenciosa
    } finally {
      setIsCopyingLink(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Container maxW="container.sm">
      <VStack spacing={6} py={4}>

        {/* Cabeçalho */}
        <VStack textAlign="center" spacing={3}>
          <Flex
            w={16} h={16}
            bg="emerald.50"
            borderRadius="2xl"
            align="center" justify="center"
            mx="auto"
          >
            <Icon as={FiShare2} w={8} h={8} color="emerald.500" />
          </Flex>
          <Heading as="h1" fontSize="3xl" fontWeight="bold" color="gray.900">
            {isEdit ? 'Orçamento atualizado! ✅' : 'Orçamento pronto! 🎉'}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {isEdit
              ? 'As alterações foram salvas. Escolha como enviar pro cliente.'
              : 'Tudo certo! Agora é só escolher como enviar pro cliente.'}
          </Text>
        </VStack>

        {/* Preview do orçamento */}
        {isLoadingProposal ? (
          <Center py={8} w="full">
            <Spinner size="lg" color="emerald.500" />
          </Center>
        ) : (
          <VStack spacing={4} align="stretch" w="full">

            {/* Company Header Card */}
            <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
              <Box p={5}>
                <HStack align="start" spacing={4}>
                  {company?.logo_url ? (
                    <Image
                      src={company.logo_url}
                      h={12} w={12}
                      objectFit="contain"
                      borderRadius="xl"
                      flexShrink={0}
                      fallback={
                        <Center w={12} h={12} bg="emerald.50" borderRadius="xl" flexShrink={0}>
                          <Icon as={FiBriefcase} color="emerald.500" boxSize={6} />
                        </Center>
                      }
                    />
                  ) : (
                    <Center w={12} h={12} bg="emerald.50" borderRadius="xl" flexShrink={0}>
                      <Icon as={FiBriefcase} color="emerald.500" boxSize={6} />
                    </Center>
                  )}
                  <Box flex={1} minW={0}>
                    <Text fontWeight="bold" color="gray.900" noOfLines={1}>
                      {company?.name || 'Sua empresa'}
                    </Text>
                    {company?.document && (
                      <Text fontSize="xs" color="gray.500">{company.document}</Text>
                    )}
                  </Box>
                </HStack>
                {(company?.email || company?.phone) && (
                  <HStack mt={4} flexWrap="wrap" spacing={4}>
                    {company.email && (
                      <HStack spacing={1} color="gray.500">
                        <Icon as={FiMail} boxSize={3} />
                        <Text fontSize="xs">{company.email}</Text>
                      </HStack>
                    )}
                    {company.phone && (
                      <HStack spacing={1} color="gray.500">
                        <Icon as={FiPhone} boxSize={3} />
                        <Text fontSize="xs">{formatPhone(company.phone)}</Text>
                      </HStack>
                    )}
                  </HStack>
                )}
              </Box>
              <Flex px={5} py={4} bg="gray.50" borderTop="1px" borderColor="gray.100" justify="space-between" align="center">
                <Box>
                  <Text fontSize="xs" color="gray.500">Criado em</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    {proposal?.created_at ? new Date(proposal.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
                  </Text>
                </Box>
                {proposal?.valid_until && (
                  <Box textAlign="right">
                    <Text fontSize="xs" color="gray.500">Válido até</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="orange.500">
                      {new Date(proposal.valid_until).toLocaleDateString('pt-BR')}
                    </Text>
                  </Box>
                )}
              </Flex>
            </Box>

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
                  <Text fontWeight="bold" color="gray.900">{clientName}</Text>
                  {proposal?.client?.company && (
                    <Text fontSize="xs" color="gray.500">{proposal.client.company}</Text>
                  )}
                  <VStack align="start" spacing={1} mt={2}>
                    {clientPhone && (
                      <HStack spacing="1.5" color="gray.500">
                        <Icon as={FiPhone} boxSize={3} />
                        <Text fontSize="xs">{formatPhone(clientPhone)}</Text>
                      </HStack>
                    )}
                    {proposal?.client?.email && (
                      <HStack spacing="1.5" color="gray.500">
                        <Icon as={FiMail} boxSize={3} />
                        <Text fontSize="xs">{proposal.client.email}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </HStack>
            </Box>

            {/* Quote Details Card */}
            <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
              <Box p={5} borderBottom="1px" borderColor="gray.100">
                <Text fontWeight="bold" color="gray.900">{title}</Text>
              </Box>

              {previewItems.filter(item => String(item.desc).trim()).map((item, idx, arr) => {
                const v = parseFloat(item.value) || 0
                const q = parseInt(item.qtd) || 1
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
                      <Text fontSize="xs" color="gray.500" mt="0.5">{q}x R$ {fmt(v)}</Text>
                    </Box>
                    <Text fontWeight="semibold" color="gray.900" fontSize="sm" flexShrink={0}>
                      R$ {fmt(v * q)}
                    </Text>
                  </Flex>
                )
              })}

              <Box p={5} bg="gray.50" borderTop="1px" borderColor="gray.100">
                <VStack spacing={2} align="stretch">
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.500">Subtotal</Text>
                    <Text fontWeight="medium" color="gray.900">R$ {fmt(subtotal)}</Text>
                  </Flex>
                  {discountPct > 0 && (
                    <Flex justify="space-between" fontSize="sm">
                      <Text color="gray.500">Desconto ({discountPct}%)</Text>
                      <Text fontWeight="medium" color="red.500">- R$ {fmt(discountAmount)}</Text>
                    </Flex>
                  )}
                  <Flex justify="space-between" align="center" pt={2} borderTop="1px" borderColor="gray.200">
                    <Text fontWeight="bold" color="gray.900">Total</Text>
                    <Text fontSize="xl" fontWeight="bold" color="emerald.600">R$ {fmt(total)}</Text>
                  </Flex>
                </VStack>
              </Box>
            </Box>

            {/* PIX Card */}
            {company?.pix_key && (
              <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" p={5}>
                <HStack align="center" spacing={3}>
                  <Center w={10} h={10} bg="emerald.50" borderRadius="xl" flexShrink={0}>
                    <Icon as={FiGrid} color="emerald.500" boxSize={5} />
                  </Center>
                  <Box flex={1} minW={0}>
                    <Text fontWeight="semibold" color="gray.900" fontSize="sm">Chave Pix</Text>
                    <Text fontSize="xs" color="gray.500" mt="0.5" noOfLines={1}>{company.pix_key}</Text>
                  </Box>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyPix(company.pix_key)}
                    borderRadius="xl"
                    fontSize="xs"
                    h={8}
                    flexShrink={0}
                    leftIcon={
                      <Icon
                        as={copiedPix ? FiCheck : FiCopy}
                        boxSize="3.5"
                        color={copiedPix ? 'emerald.500' : undefined}
                      />
                    }
                  >
                    {copiedPix ? 'Copiado' : 'Copiar'}
                  </Button>
                </HStack>
              </Box>
            )}

            {/* Terms Card */}
            {company?.default_proposal_terms && (
              <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" p={5}>
                <Text fontWeight="semibold" color="gray.900" fontSize="sm" mb={2}>Condições de Pagamento</Text>
                <Text fontSize="sm" color="gray.500" whiteSpace="pre-wrap">
                  {company.default_proposal_terms}
                </Text>
              </Box>
            )}

          </VStack>
        )}

        {/* Botões de ação */}
        <VStack spacing={3} w="full">
          {/* WhatsApp */}
          <Button
            w="full"
            size="md"
            height="40px"
            bg="#25D366"
            _hover={{ bg: '#128C7E' }}
            _active={{ bg: '#075E54' }}
            borderRadius="xl"
            color="white"
            fontWeight="semibold"
            leftIcon={<Icon as={FaWhatsapp} boxSize={5} />}
            onClick={handleWhatsApp}
            isLoading={isSendingWhatsApp}
            loadingText="Abrindo WhatsApp..."
          >
            Enviar no WhatsApp
          </Button>

          {/* Copiar link */}
          <Button
            w="full"
            size="md"
            height="40px"
            variant="outline"
            colorScheme="emerald"
            borderRadius="xl"
            fontWeight="semibold"
            leftIcon={<Icon as={linkCopied ? FiCheck : FiLink} boxSize={5} />}
            onClick={handleCopyLink}
            isLoading={isCopyingLink}
            loadingText="Copiando..."
            isDisabled={linkCopied}
          >
            {linkCopied ? 'Link copiado!' : 'Copiar link para compartilhar'}
          </Button>
        </VStack>

        {/* Navegação */}
        <Flex
          align="center"
          justify="right"
          w="full"
          pt={6}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Button
           type="button"
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
            leftIcon={<Icon as={FiCheck} w={4} h={4} />}
            onClick={() => navigate('/dashboard/propostas')}
          >
            Feito
          </Button>
        </Flex>

      </VStack>
    </Container>
  )
}

export default ProposalSuccessPage
