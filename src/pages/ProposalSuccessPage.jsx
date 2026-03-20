import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiShare2,
  FiChevronLeft,
  FiLink,
  FiCheck,
  FiFileText,
  FiDownload,
  FiList,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Container from '../components/layout/Container'
import { proposalService } from '../services'
import { openWhatsApp } from '../utils/whatsapp'
import { maskPhone } from '../utils/mask'

const ProposalSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopyingLink, setIsCopyingLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [proposal, setProposal] = useState(null)
  const [isLoadingProposal, setIsLoadingProposal] = useState(true)

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

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await proposalService.downloadPDF(proposalId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url  = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href     = url
      link.download = `orcamento-${proposalId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      await proposalService.updateStatus(proposalId, 2)
    } catch {
      // falha silenciosa
    } finally {
      setIsDownloading(false)
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
          <Box
            bg="white"
            borderRadius="2xl"
            p={6}
            boxShadow="sm"
            border="1px"
            borderColor="gray.200"
            w="full"
          >
            <HStack justify="space-between" mb={6}>
              <Heading size="md" color="gray.900">Resumo do orçamento</Heading>
              <Icon as={FiFileText} color="gray.400" />
            </HStack>

            <VStack spacing={4} align="stretch">
              {/* Cabeçalho cliente */}
              <Box bg="emerald.50" p={4} borderRadius="lg" borderWidth="1px" borderColor="emerald.200">
                <Text fontSize="sm" color="emerald.700" fontWeight="semibold" mb={2}>
                  ORÇAMENTO PARA:
                </Text>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" color="gray.900">{clientName}</Text>
                  {clientPhone && (
                    <Text fontSize="sm" color="gray.600">{maskPhone(clientPhone)}</Text>
                  )}
                </VStack>
              </Box>

              <Heading size="lg" color="gray.900">{title}</Heading>
              <Box height="1px" bg="gray.200" />

              {/* Itens */}
              {previewItems.filter(item => String(item.desc).trim()).map((item) => {
                const v = parseFloat(item.value) || 0
                const q = parseInt(item.qtd)      || 1
                return (
                  <HStack key={item.id} justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" color="gray.900">{item.desc}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {q}x R$ {fmt(v)}
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color="gray.900">R$ {fmt(v * q)}</Text>
                  </HStack>
                )
              })}

              {previewItems.length === 0 && (
                <Text fontSize="sm" color="gray.400" textAlign="center" py={2}>
                  Carregando itens...
                </Text>
              )}

              <Box height="1px" bg="gray.200" />

              {/* Totais */}
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.900">Subtotal:</Text>
                  <Text fontWeight="medium" color="gray.900">R$ {fmt(subtotal)}</Text>
                </HStack>
                {discountPct > 0 && (
                  <HStack justify="space-between">
                    <Text color="gray.900">Desconto ({discountPct}%):</Text>
                    <Text fontWeight="medium" color="red.500">- R$ {fmt(discountAmount)}</Text>
                  </HStack>
                )}
                <Box height="1px" bg="gray.200" />
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold" color="gray.900">Total</Text>
                  <Text fontSize="xl" fontWeight="bold" color="emerald.600">
                    R$ {fmt(total)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        )}

        {/* Botões de ação */}
        <VStack spacing={3} w="full">
          {/* WhatsApp */}
          <Button
            w="full"
            h={14}
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
            Enviar via WhatsApp
          </Button>

          {/* Copiar link */}
          <Button
            w="full"
            h={14}
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
            h={12}
            px={8}
            bg="emerald.500"
            _hover={{ bg: 'emerald.600' }}
            color="white"
            fontWeight="semibold"
            fontSize="sm"
            borderRadius="xl"
            boxShadow="lg"
            rightIcon={<Icon as={FiCheck} w={4} h={4} />}
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
