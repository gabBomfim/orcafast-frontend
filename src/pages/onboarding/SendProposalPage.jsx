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
import { Spinner, Center } from '@chakra-ui/react'

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
            totalValue: data.total_value,
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
  
  const subtotal = guestData.proposal?.items?.reduce((acc, item) => {
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
          Orçamento criado!
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Seu orçamento foi criado e está pronto para ser enviado.
        </Text>
      </VStack>

      <VStack spacing={4}>
        {/* Details card standardized with ProposalSuccessPage */}
        <VStack spacing={4} align="stretch" bg="emerald.50" p={6} borderRadius="xl" w="full" mb={6}>
          <HStack spacing={3}>
            <Icon as={FiUser} color="emerald.600" boxSize={5} />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Cliente
              </Text>
              <Text fontSize="md" color="gray.900" fontWeight="semibold">
                {clientName}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={3}>
            <Icon as={FiFileText} color="emerald.600" boxSize={5} />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Título
              </Text>
              <Text fontSize="md" color="gray.900" fontWeight="semibold">
                {proposalTitle}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={3}>
            <Icon as={FiDollarSign} color="emerald.600" boxSize={5} />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Valor Total
              </Text>
              <Text fontSize="lg" color="emerald.600" fontWeight="bold">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </VStack>
          </HStack>
        </VStack>

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
            <Text fontSize="xs" color="emerald.600" fontWeight="medium" textAlign="center">
              Acompanhe quando o cliente visualizar e aprovar a proposta.
            </Text>
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
              {linkCopied ? 'Link Copiado!' : 'Copiar link para o cliente'}
            </Button>
            <Text fontSize="xs" color="emerald.600" fontWeight="medium" textAlign="center">
              Ideal para enviar em outras redes sociais com rastreamento.
            </Text>
          </VStack>
          <VStack spacing={2} w="full">
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
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Atenção: O rastreamento de visualização não funciona em arquivos PDF.
            </Text>
          </VStack>

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
              Ver todos os orçamentos
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
            Finalizar
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
