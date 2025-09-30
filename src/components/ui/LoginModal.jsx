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
import { authService } from '../../services'
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
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      if (isLoginMode) {
        const response = await authService.login({
          email: data.email,
          password: data.password,
        })
        
        storage.setToken(response.data.token)
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
        
        storage.setToken(response.data.token)
        storage.setUser(response.data.user)
        
        clearGuestData()
      }

      toast({
        title: isLoginMode ? 'Login realizado!' : 'Conta criada com sucesso!',
        description: 'Redirecionando para o dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onClose()
      if (onSuccess) onSuccess()
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
    toast({
      title: 'Login com Google',
      description: 'Funcionalidade será implementada em breve',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleFacebookLogin = () => {
    toast({
      title: 'Login com Facebook',
      description: 'Funcionalidade será implementada em breve',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader textAlign="center" pt={8}>
          <VStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {isLoginMode ? 'Fazer login' : 'Criar sua conta'}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {isLoginMode
                ? 'Entre para continuar enviando sua proposta'
                : 'Crie sua conta para enviar e acompanhar sua proposta'
              }
            </Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody pb={8}>
          <VStack spacing={6}>
            {isLoginMode ? (
              <LoginForm
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onFacebookLogin={handleFacebookLogin}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onFacebookLogin={handleFacebookLogin}
                isLoading={isLoading}
              />
            )}

            <Text fontSize="sm" color="gray.500" textAlign="center">
              {isLoginMode ? 'Não tem conta?' : 'Já tem conta?'}{' '}
              <Button
                variant="link"
                colorScheme="emerald"
                fontSize="sm"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? 'Criar conta' : 'Fazer login'}
              </Button>
            </Text>

            {!isLoginMode && (
              <Text fontSize="xs" color="gray.500" textAlign="center">
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
