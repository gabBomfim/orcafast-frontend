import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import {
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { FaApple } from 'react-icons/fa'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService, subscriptionService } from '../services'
import { storage } from '../utils/storage'

// Componente SVG do Google inline
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [document, setDocument] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Fraca', color: 'red.500', width: '33%' }
    if (password.length < 10) return { label: 'Média', color: 'amber.500', width: '66%' }
    return { label: 'Forte', color: 'emerald.500', width: '100%' }
  }

  const strength = getPasswordStrength()
  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const data = {
      name,
      company_name: companyName,
      document,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }

    try {
      const response = await authService.register(data)

      storage.setToken(response.data.access_token)
      storage.setUser(response.data.user)

      try {
        const fullReturnUrl = window.location.origin + '/dashboard'
        sessionStorage.setItem('show_welcome', 'pro')

        const { data: checkoutData } = await subscriptionService.checkout('pro', fullReturnUrl)

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

      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
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

  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      direction="column"
      align="center"
      justify="center"
      px={4}
      py={8}
    >
      {/* Logo */}
      <OrcafastLogo
        variant="full"
        height="40px"
        style={{ cursor: 'pointer', marginBottom: '2.5rem' }}
        onClick={() => window.location.href = '/'}
      />

      {/* Card Container */}
      <Box w="full" maxW="sm">
        {/* Header */}
        <VStack textAlign="center" mb={8} spacing={2}>
          <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900">
            Criar sua conta
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Sem cartão de crédito, sem compromisso.
          </Text>
        </VStack>

        {/* Social buttons first */}
        <VStack spacing={3} mb={6}>
          <Button
            w="full"
            h={12}
            bg="gray.100"
            _hover={{ bg: 'gray.200' }}
            borderRadius="xl"
            fontWeight="medium"
            color="gray.900"
            fontSize="sm"
            leftIcon={<GoogleIcon />}
            onClick={() => handleSocialLogin('Google')}
          >
            Continuar com Google
          </Button>
          {/* <Button
            w="full"
            h={12}
            bg="gray.900"
            _hover={{ bg: 'gray.800' }}
            borderRadius="xl"
            fontWeight="medium"
            color="white"
            fontSize="sm"
            leftIcon={<Icon as={FaApple} boxSize={5} />}
            onClick={() => handleSocialLogin('Apple')}
          >
            Continuar com Apple
          </Button> */}
        </VStack>

        {/* Divider */}
        <Flex align="center" gap={4} mb={6}>
          <Box flex={1} h="1px" bg="gray.300" />
          <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
            ou
          </Text>
          <Box flex={1} h="1px" bg="gray.300" />
        </Flex>

        {/* Form */}
        <VStack as="form" onSubmit={handleSubmit} spacing={4}>
          {/* Name field */}
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            required
          />

          {/* Company Name field */}
          <Input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Nome da empresa"
            required
          />

          {/* Company CPF/CNPJ field */}
          <Input
            type="text"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="CNPJ ou CPF"
            required
          />

          {/* Email field */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          {/* Password field */}
          <Box w="full">
            <InputGroup size="lg">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (mínimo 8 caracteres)"
                minLength={8}
                pr={12}
                _focus={{ outline: 'none', ring: 2, ringColor: 'emerald.200' }}
                transition="all"
                required
              />
              <InputRightElement h={12}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  _hover={{ bg: 'transparent' }}
                  tabIndex={-1}
                >
                  <Icon
                    as={showPassword ? FiEyeOff : FiEye}
                    w={4}
                    h={4}
                    color="gray.500"
                  />
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* Password strength */}
            {password.length > 0 && (
              <Box mt={2}>
                <Box h={1} bg="gray.200" rounded="full" overflow="hidden">
                  <Box
                    h="full"
                    bg={strength.color}
                    transition="all 0.3s"
                    w={strength.width}
                  />
                </Box>
                <Text
                  fontSize="xs"
                  mt={1}
                  color={
                    strength.color === 'emerald.500' ? 'emerald.500' :
                      strength.color === 'amber.500' ? 'orange.400' :
                        'red.500'
                  }
                >
                  Senha {strength.label.toLowerCase()}
                </Text>
              </Box>
            )}
          </Box>

          {/* Password confirmation field */}
          <Box w="full">
            <InputGroup size="lg">
              <Input
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirmar senha"
                minLength={8}
                pr={12}
                _focus={{
                  outline: 'none',
                  ring: 2,
                  ringColor: passwordConfirmation && !passwordsMatch ? 'red.200' : 'emerald.200'
                }}
                ring={passwordConfirmation ? 2 : undefined}
                ringColor={passwordConfirmation && !passwordsMatch ? 'red.200' : passwordsMatch ? 'emerald.200' : undefined}
                transition="all"
                required
              />
              <InputRightElement h={12}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  _hover={{ bg: 'transparent' }}
                  tabIndex={-1}
                >
                  <Icon
                    as={showPasswordConfirmation ? FiEyeOff : FiEye}
                    w={4}
                    h={4}
                    color="gray.500"
                  />
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* Match indicator */}
            {passwordConfirmation && (
              <Flex align="center" gap={1.5} mt={2}>
                {passwordsMatch ? (
                  <>
                    <Icon as={FiCheckCircle} w={3.5} h={3.5} color="emerald.500" />
                    <Text fontSize="xs" color="emerald.500">Senhas coincidem</Text>
                  </>
                ) : (
                  <>
                    <Icon as={FiXCircle} w={3.5} h={3.5} color="red.500" />
                    <Text fontSize="xs" color="red.500">Senhas não coincidem</Text>
                  </>
                )}
              </Flex>
            )}
          </Box>

          {/* Submit button */}
          <Button
            type="submit"
            w="full"
            h={12}
            bg="emerald.500"
            _hover={{ bg: 'emerald.600' }}
            color="white"
            fontWeight="semibold"
            fontSize="sm"
            borderRadius="xl"
            boxShadow="lg"
            isLoading={isLoading}
            loadingText="Criando conta..."
          >
            Criar conta grátis
          </Button>
        </VStack>

        {/* Footer */}
        <Text textAlign="center" fontSize="sm" color="gray.600" mt={8}>
          Já tem uma conta?{' '}
          <ChakraLink
            as={RouterLink}
            to="/login"
            color="emerald.600"
            fontWeight="medium"
            _hover={{ textDecoration: 'underline' }}
          >
            Fazer login
          </ChakraLink>
        </Text>
      </Box>

      {/* Terms - bottom */}
      <Text fontSize="xs" color="gray.500" textAlign="center" mt={12} maxW="sm">
        Ao criar sua conta, você concorda com nossos{' '}
        <ChakraLink
          as={RouterLink}
          to="/termos"
          textDecoration="underline"
          _hover={{ color: 'gray.700' }}
        >
          Termos de Uso
        </ChakraLink>{' '}
        e{' '}
        <ChakraLink
          as={RouterLink}
          to="/privacidade"
          textDecoration="underline"
          _hover={{ color: 'gray.700' }}
        >
          Política de Privacidade
        </ChakraLink>
      </Text>
    </Flex>
  )
}

export default RegisterPage