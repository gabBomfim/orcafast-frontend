import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
  HStack,
} from '@chakra-ui/react'
import {
  FiShare2,
  FiChevronLeft,
  FiMessageSquare,
  FiMail,
  FiLink,
  FiCheck,
  FiUser,
  FiDollarSign,
  FiFileText,
  FiDownload,
  FiList,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import LoginModal from '../../components/ui/LoginModal'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { storage } from '../../utils/storage'
import { openWhatsApp } from '../../utils/whatsapp'
import { proposalService } from '../../services/proposal.service'
import { FieldHint } from '../../components/ui/FormFeedback'
import { Spinner, Center } from '@chakra-ui/react'
import { maskPhone } from '../../utils/mask'

const SendProposalPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose } = useDisclosure()
  const { guestData } = useOnboarding()

  const [loading, setLoading] = useState(!!id)
  const [proposal, setProposal] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const isAuthenticated = !!storage.getToken()

  useEffect(() => {
    if (id && isAuthenticated) {
      setLoading(true)
      proposalService.get(id)
        .then(res => {
          const data = res.data
          setProposal({
            clientName: data.client?.name || data.client_name,
            clientPhone: data.client?.phone || data.client_phone,
            title: data.title,
            subtotal: data.subtotal,
            discount: data.discount,
            totalValue: data.total_value,
            items: data.items,
            sharingToken: data.sharing_token
          })
        })
        .catch(err => {
          console.error('Erro ao buscar orçamento:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, isAuthenticated])

  // Fallback para guestData se não houver proposal (onboarding puro)
  const clientName = proposal?.clientName || guestData.client?.name || 'Cliente'
  const clientPhone = proposal?.clientPhone || guestData.client?.phone || '(00) 00000-0000'
  const proposalTitle = proposal?.title || guestData.proposal?.title || 'Título do Orçamento'

  const subtotal = proposal?.subtotal || guestData.proposal?.items?.reduce((acc, item) => {
    return acc + (item.quantity * item.unit_price)
  }, 0) || 0
  const totalValue = proposal?.totalValue || (subtotal - (guestData.proposal?.discount || 0))

  const handleSend = (method) => {
    if (!isAuthenticated) {
      // No onboarding, qualquer ação de envio abre o modal de cadastro para capturar o lead
      onLoginModalOpen()
      return
    }

    // Se estiver autenticado e houver um ID, podemos realizar as ações reais
    if (id) {
      const proposalUrl = proposal?.sharingToken
        ? `${window.location.origin}/share/proposta/${proposal.sharingToken}`
        : `${window.location.origin}/proposta/${id}`

      if (method === 'whatsapp') {
        const message = `Olá ${clientName}!\n\nSeu orçamento de *${proposalTitle}* está pronto! 😊\n\nVisualize os detalhes completos clicando no link abaixo:\n🔗 ${proposalUrl}\n\nQualquer dúvida, estou à disposição!`
        openWhatsApp({
          phone: clientPhone,
          message: message
        })
        proposalService.updateStatus(id, 2) // Marca como enviado
      } else if (method === 'link') {
        navigator.clipboard.writeText(proposalUrl)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        proposalService.updateStatus(id, 2)
      } else if (method === 'pdf') {
        proposalService.downloadPDF(id).then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `proposta-${id}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          proposalService.updateStatus(id, 2)
        })
      } else if (method === 'finalize' || method === 'list') {
        navigate('/dashboard/propostas')
      }
    } else {
      // Caso comum: Usuário já estava logado e terminou o onboarding
      navigate('/dashboard/propostas')
    }
  }

  const handleLoginSuccess = () => {
    // Esta função será chamada após o login bem-sucedido
    // O modal já redireciona para /dashboard
  }

  if (loading) {
    return (
      <OnboardingLayout currentStep={3} totalSteps={3}>
        <Center py={20}>
          <Spinner size="xl" color="emerald.500" />
        </Center>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep={3} totalSteps={3}>
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
          <Icon as={FiShare2} w={8} h={8} color="emerald.500" />
        </Flex>
        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>
          Orçamento pronto! 🎉
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Tudo certo! Agora é só escolher como enviar pro cliente.
        </Text>
      </VStack>

      <VStack spacing={4}>
        {/* Full preview — same pattern as CreateProposalPage */}
        {(() => {
          const rawItems = proposal?.items || guestData.proposal?.items || []
          const previewItems = rawItems.map((item, i) => ({
            id: item.id || i,
            desc: item.description || '',
            qtd: item.quantity || 1,
            value: item.unit_price || 0,
          }))
          const previewSubtotal = parseFloat(proposal?.subtotal) || previewItems.reduce((acc, item) => {
            return acc + (parseFloat(item.value) || 0) * (parseFloat(item.qtd) || 0)
          }, 0)
          const discountPct = parseFloat(proposal?.discount || guestData.proposal?.discount) || 0
          const discountAmount = previewSubtotal * (discountPct / 100)
          const previewTotal = parseFloat(proposal?.totalValue) || (previewSubtotal - discountAmount)
          const fmt = (n) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

          return (
            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              w="full"
              mb={6}
            >
              <HStack justify="space-between" mb={6}>
                <Heading size="md" color="gray.900">Resumo do Orçamento</Heading>
                <Icon as={FiFileText} color="gray.400" />
              </HStack>

              <VStack spacing={4} align="stretch">
                {/* Cabeçalho do cliente */}
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

                <Heading size="lg" color="gray.900">{proposalTitle}</Heading>
                <Box height="1px" bg="gray.200" />

                {/* Lista de itens */}
                {previewItems.filter(item => item.desc.trim()).map((item) => {
                  const v = parseFloat(item.value) || 0
                  const q = parseInt(item.qtd) || 1
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

                <Box height="1px" bg="gray.200" />

                {/* Totais */}
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text color="gray.900">Subtotal:</Text>
                    <Text fontWeight="medium" color="gray.900">R$ {fmt(previewSubtotal)}</Text>
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
                    <Text fontSize="xl" fontWeight="bold" color="emerald.600">R$ {fmt(previewTotal)}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          )
        })()}

        {/* Send options standardized */}
        <VStack spacing={6} w="full">
          <VStack spacing={2} w="full">
            <Button
              type="button"
              w="full"
              h={14}
              bg="#25D366"
              _hover={{ bg: '#128C7E' }}
              _active={{ bg: '#075E54' }}
              borderRadius="xl"
              color="white"
              fontWeight="semibold"
              fontSize="sm"
              leftIcon={<Icon as={FaWhatsapp} />}
              onClick={() => handleSend('whatsapp')}
            >
              Enviar via WhatsApp
            </Button>
          </VStack>

          <VStack spacing={2} w="full">
            <Button
              type="button"
              w="full"
              h={14}
              variant="outline"
              colorScheme="emerald"
              borderRadius="xl"
              fontWeight="semibold"
              fontSize="sm"
              leftIcon={linkCopied ? <Icon as={FiCheck} /> : <Icon as={FiLink} />}
              onClick={() => handleSend('link')}
            >
              {linkCopied ? 'Link Copiado!' : 'Copiar link para compartilhar'}
            </Button>
          </VStack>
          {/* <VStack spacing={2} w="full">
            <Button
              type="button"
              w="full"
              h={14}
              variant="outline"
              colorScheme="gray"
              borderRadius="xl"
              color="gray.600"
              fontWeight="semibold"
              fontSize="sm"
              leftIcon={<Icon as={FiDownload} w={5} h={5} />}
              onClick={() => handleSend('pdf')}
            >
              Baixar PDF
            </Button>
            <FieldHint message={
              <>
                <b>Dica:</b> Se enviar por PDF, não conseguimos te avisar quando ele abrir.
              </>
            } />
          </VStack> */}

          {isAuthenticated && (
            <Button
              type="button"
              w="full"
              variant="ghost"
              h={12}
              color="gray.600"
              fontSize="sm"
              fontWeight="medium"
              leftIcon={<Icon as={FiList} w={5} h={5} />}
              onClick={() => handleSend('list')}
            >
              Ir para meus orçamentos
            </Button>
          )}
        </VStack>

        {/* Navigation */}
        <Flex align="center" justify="space-between" w="full" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
          <Button
            as={RouterLink}
            to={isAuthenticated ? "/dashboard/propostas" : "/onboarding/create-proposal"}
            variant="ghost"
            leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
            color="gray.600"
            _hover={{ color: 'gray.900' }}
          >
            Voltar
          </Button>
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
            onClick={() => handleSend('finalize')}
          >
            Feito
          </Button>
        </Flex>
      </VStack>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
        onSuccess={handleLoginSuccess}
      />
    </OnboardingLayout>
  )
}

export default SendProposalPage
