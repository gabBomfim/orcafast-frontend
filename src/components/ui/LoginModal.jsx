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
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  FormControl,
  FormLabel,
  Box,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiLock, FiArrowRight, FiMessageSquare } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // For demo purposes, just show success
    toast({
      title: isLoginMode ? 'Login realizado!' : 'Conta criada com sucesso!',
      description: 'Redirecionando para o dashboard...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    setIsLoading(false)

    // Close modal and redirect to initial dashboard
    onClose()
    if (onSuccess) onSuccess()
    navigate('/initial-dashboard')
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

  const handleWhatsAppLogin = () => {
    toast({
      title: 'Login com WhatsApp',
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
          <VStack as="form" spacing={6} onSubmit={handleSubmit}>
            {!isLoginMode && (
              <FormControl isRequired>
                <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                  Nome completo
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    borderRadius="xl"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: 'emerald.400', bg: 'white' }}
                  />
                </InputGroup>
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                E-mail
              </FormLabel>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  borderRadius="xl"
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'emerald.400', bg: 'white' }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                Senha
              </FormLabel>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiLock} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  borderRadius="xl"
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'emerald.400', bg: 'white' }}
                />
              </InputGroup>
            </FormControl>

            <VStack spacing={4} w="full">
              <Button
                type="submit"
                w="full"
                size="lg"
                colorScheme="emerald"
                borderRadius="xl"
                py={6}
                fontSize="lg"
                fontWeight="semibold"
                rightIcon={!isLoading ? <Icon as={FiArrowRight} /> : undefined}
                isLoading={isLoading}
                loadingText="Processando..."
              >
                {isLoading
                  ? 'Processando...'
                  : isLoginMode
                    ? 'Entrar'
                    : 'Criar conta grátis'
                }
              </Button>

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
            </VStack>

            <VStack spacing={3} w="full">
              <HStack w="full" align="center">
                <Box h="1px" bg="gray.200" flex="1" />
                <Text fontSize="xs" color="gray.500" px={3}>ou</Text>
                <Box h="1px" bg="gray.200" flex="1" />
              </HStack>

              <Button
                w="full"
                size="lg"
                variant="outline"
                borderRadius="xl"
                py={6}
                fontSize="md"
                leftIcon={<Icon as={FiMail} />}
                onClick={handleGoogleLogin}
              >
                Continuar com Google
              </Button>

              <Button
                w="full"
                size="lg"
                variant="outline"
                borderRadius="xl"
                py={6}
                fontSize="md"
                leftIcon={<Icon as={FiMessageSquare} />}
                onClick={handleWhatsAppLogin}
              >
                Continuar com WhatsApp
              </Button>
            </VStack>

            <Box textAlign="center" pt={4}>
              <Text fontSize="xs" color="gray.500">
                Sem cartão de crédito • Você está a 1 clique de enviar sua proposta 🚀
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
