import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../auth/LoginForm'
import RegisterForm from '../auth/RegisterForm'
import { authService, subscriptionService } from '../../services'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { storage } from '../../utils/storage'

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { guestData, clearGuestData } = useOnboarding()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      company_name: formData.get('company_name'),
      document: formData.get('document'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
    }

    try {
      if (isLoginMode) {
        const response = await authService.login({
          email: data.email,
          password: data.password,
        })

        storage.setToken(response.data.access_token)
        storage.setUser(response.data.user)
      } else {
        const registerData = {
          ...data,
          guest_data: {
            client: guestData.client,
            proposal: guestData.proposal,
          }
        }

        const response = await authService.register(registerData)

        storage.setToken(response.data.access_token)
        storage.setUser(response.data.user)

        let createdProposalId = null
        if (response.data.user?.clients?.length > 0) {
          const clients = response.data.user.clients
          const lastClient = clients[clients.length - 1]
          if (lastClient.proposals?.length > 0) {
            const lastProposal = lastClient.proposals[lastClient.proposals.length - 1]
            createdProposalId = lastProposal.id

            const subtotal = lastProposal.items?.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0) || 0
            sessionStorage.setItem('pending_proposal_success', JSON.stringify({
              proposalId: createdProposalId,
              proposalData: {
                clientName: lastClient.name,
                title: lastProposal.title,
                totalValue: subtotal - (lastProposal.discount || 0)
              }
            }))
          }
        }
      }

      toast({
        title: isLoginMode ? 'Login realizado!' : 'Conta criada com sucesso!',
        description: isLoginMode ? 'Redirecionando para o dashboard...' : 'Você está a 1 passo de enviar sua proposta 🚀',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onClose()
      if (onSuccess) onSuccess()

      // Redirect to Stripe if registering
      if (!isLoginMode) {
        try {
          const successUrl = `${window.location.origin}/dashboard/propostas/sucesso`
          sessionStorage.setItem('show_welcome', 'pro')

          const { data: checkoutData } = await subscriptionService.checkout('pro', successUrl)

          if (checkoutData?.checkout_url) {
            window.location.href = checkoutData.checkout_url
            return
          }
        } catch (err) {
          console.error('Erro ao iniciar checkout:', err)
          toast({
            title: 'Aviso',
            description: 'Não foi possível iniciar o teste grátis automaticamente. Você será redirecionado.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          })
        }
      }

      // Default redirect if it's just a login or Stripe failed
      navigate('/initial-dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao processar requisição'
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

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_REDIRECT_URL
  }

  const handleAppleLogin = () => {
    toast({
      title: 'Login com Apple',
      description: 'Funcionalidade será implementada em breve',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} bg="white">
        <ModalHeader textAlign="center" pt={8} pb={2}>
          <VStack spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {isLoginMode ? 'Entrar na sua conta' : 'Criar sua conta'}
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="normal">
              {isLoginMode
                ? 'Digite seus dados para continuar.'
                : 'Crie sua conta para enviar e acompanhar sua proposta'
              }
            </Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton top={4} right={4} />

        <ModalBody pb={8} px={6}>
          <VStack spacing={4}>
            {isLoginMode ? (
              <LoginForm
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onFacebookLogin={handleAppleLogin}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onFacebookLogin={handleAppleLogin}
                isLoading={isLoading}
              />
            )}

            <Text fontSize="sm" color="gray.600" textAlign="center">
              {isLoginMode ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
              <Button
                variant="link"
                color="emerald.600"
                fontSize="sm"
                fontWeight="medium"
                onClick={() => setIsLoginMode(!isLoginMode)}
                _hover={{ textDecoration: 'underline' }}
              >
                {isLoginMode ? 'Criar conta grátis' : 'Fazer login'}
              </Button>
            </Text>

            {!isLoginMode && (
              <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
                Sem cartão de crédito • Você está a 1 clique de enviar sua proposta 🚀
              </Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
