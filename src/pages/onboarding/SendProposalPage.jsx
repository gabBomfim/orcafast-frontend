import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiShare2,
  FiChevronLeft,
  FiMessageSquare,
  FiMail,
  FiLink,
  FiCheck,
} from 'react-icons/fi'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import LoginModal from '../../components/ui/LoginModal'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { storage } from '../../utils/storage'
import { openWhatsApp } from '../../utils/whatsapp'

const SendProposalPage = () => {
  const navigate = useNavigate()
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose } = useDisclosure()
  const { guestData } = useOnboarding()
  const [linkCopied, setLinkCopied] = useState(false)

  const isAuthenticated = !!storage.getToken()

  const clientData = guestData.client || {
    name: 'Cliente',
    phone: '(00) 00000-0000',
  }

  const proposalData = guestData.proposal || {
    title: 'Título do Orçamento',
    items: [],
    discount: 0,
  }

  const subtotal = proposalData.items?.reduce((acc, item) => {
    return acc + (item.quantity * item.unit_price)
  }, 0) || 0

  const total = subtotal - (proposalData.discount || 0)

  const handleSend = (method) => {
    if (method === 'whatsapp') {
      openWhatsApp({
        phone: clientData.phone,
        message: `Olá ${clientData.name}! Acabei de criar seu orçamento de *${proposalData.title}* via OrçaFast. 😊\n\nEm breve te envio o link oficial para visualização!`
      })
    }

    if (isAuthenticated) {
      navigate('/dashboard/propostas')
      return
    }

    if (method === 'link') {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
    // Mostra o modal de cadastro/login após ou em vez de enviar (dependendo do fluxo desejado)
    // Para o onboarding, mantemos a captura de lead
    onLoginModalOpen()
  }

  const handleLoginSuccess = () => {
    // Esta função será chamada após o login bem-sucedido
    // O modal já redireciona para /dashboard
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
        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
          Enviar orçamento
        </Heading>
        <Text color="gray.600">
          Tudo pronto! Escolha como enviar
        </Text>
      </VStack>

      <VStack spacing={4}>
        {/* Preview card */}
        <Box
          w="full"
          bg="gray.100"
          borderRadius="xl"
          p={4}
          mb={2}
        >
          <Text fontSize="xs" color="gray.500" mb={1}>
            Orçamento para
          </Text>
          <Text fontWeight="medium" color="gray.900">
            {clientData.name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {clientData.phone}
          </Text>
          <Box mt={3} pt={3} borderTop="1px" borderColor="gray.300">
            <Text fontWeight="medium" color="gray.900">
              {proposalData.title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="emerald.600" mt={1}>
              R$ {total.toFixed(2)}
            </Text>
          </Box>
        </Box>

        {/* Send options */}
        <VStack spacing={4} w="full">
          <VStack spacing={1} w="full">
            <Button
              type="button"
              w="full"
              h={14}
              bg="#25D366"
              _hover={{ bg: '#20BD5A' }}
              borderRadius="xl"
              color="white"
              fontWeight="medium"
              fontSize="sm"
              leftIcon={<Icon as={FiMessageSquare} w={5} h={5} />}
              onClick={() => handleSend('whatsapp')}
            >
              Enviar via WhatsApp
            </Button>
            <Text fontSize="xs" color="emerald.600" fontWeight="medium" textAlign="center">
              Saiba exatamente quando o cliente abrir seu orçamento.
            </Text>
          </VStack>

          <VStack spacing={1} w="full">
            <Button
              type="button"
              w="full"
              h={14}
              bg="gray.100"
              _hover={{ bg: 'gray.200' }}
              borderRadius="xl"
              color="gray.900"
              fontWeight="medium"
              fontSize="sm"
              leftIcon={linkCopied ? <Icon as={FiCheck} w={5} h={5} color="emerald.500" /> : <Icon as={FiLink} w={5} h={5} />}
              onClick={() => handleSend('link')}
            >
              {linkCopied ? 'Link copiado!' : 'Copiar link para o cliente'}
            </Button>
            {!linkCopied && (
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Acompanhe a visualização e aprovação em tempo real.
              </Text>
            )}
          </VStack>

          <Button
            type="button"
            w="full"
            h={12}
            variant="ghost"
            borderRadius="xl"
            color="gray.600"
            fontWeight="medium"
            fontSize="sm"
            leftIcon={<Icon as={FiMail} w={5} h={5} />}
            onClick={() => handleSend('email')}
          >
            Enviar por E-mail
          </Button>
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
