import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi'
import { FaApple } from 'react-icons/fa'
import { useState } from 'react'
import { FieldError } from '../ui/FormFeedback'
import { formMessages } from '../../utils/formMessages'

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

// Aplica máscara CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
const formatDocument = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

const RegisterForm = ({ onSubmit, onGoogleLogin, onFacebookLogin, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [documentMasked, setDocumentMasked] = useState('')
  const [errors, setErrors] = useState({})

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Fraca', color: 'red.500', width: '33%' }
    if (password.length < 10) return { label: 'Média', color: 'amber.500', width: '66%' }
    return { label: 'Forte', color: 'emerald.500', width: '100%' }
  }

  const strength = getPasswordStrength()
  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation

  // ─── Validação ─────────────────────────────────────────────────────────────

  const validate = (formData) => {
    const next = {}

    if (!formData.get('name')?.trim())
      next.name = formMessages.required.name

    if (!formData.get('company_name')?.trim())
      next.company_name = formMessages.required.generic

    const digits = (formData.get('document') || '').replace(/\D/g, '')
    if (!digits)
      next.document = formMessages.required.generic
    else if (digits.length !== 11 && digits.length !== 14)
      next.document = 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.'

    const email = formData.get('email')?.trim()
    if (!email)
      next.email = formMessages.required.email
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = formMessages.invalid.email

    const pwd = formData.get('password') || ''
    if (!pwd)
      next.password = formMessages.required.password
    else if (pwd.length < 8)
      next.password = formMessages.length.tooShort(8)

    const pwdConfirm = formData.get('password_confirmation') || ''
    if (!pwdConfirm)
      next.password_confirmation = formMessages.required.generic
    else if (pwd !== pwdConfirm)
      next.password_confirmation = formMessages.password.mismatch

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (!validate(formData)) return
    onSubmit(e)
  }

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: '' }))

  return (
    <VStack spacing={6} w="full">
      {/* Social buttons first */}
      <VStack spacing={3} w="full">
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
          onClick={onGoogleLogin}
        >
          Continuar com Google
        </Button>
      </VStack>

      {/* Divider */}
      <Flex align="center" gap={4} w="full">
        <Box flex={1} h="1px" bg="gray.300" />
        <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
          ou
        </Text>
        <Box flex={1} h="1px" bg="gray.300" />
      </Flex>

      {/* Form */}
      <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit} noValidate>

        {/* Name */}
        <Box w="full">
          <Input
            type="text"
            name="name"
            placeholder="Seu nome"
            isInvalid={!!errors.name}
            onChange={() => clearError('name')}
          />
          <FieldError message={errors.name} />
        </Box>

        {/* Company Name */}
        <Box w="full">
          <Input
            type="text"
            name="company_name"
            placeholder="Nome da sua empresa (ou oficina, loja...)"
            isInvalid={!!errors.company_name}
            onChange={() => clearError('company_name')}
          />
          <FieldError message={errors.company_name} />
        </Box>

        {/* CPF / CNPJ */}
        <Box w="full">
          <Input
            type="text"
            name="document"
            placeholder="CNPJ ou CPF"
            value={documentMasked}
            maxLength={18}
            isInvalid={!!errors.document}
            onChange={(e) => {
              setDocumentMasked(formatDocument(e.target.value))
              clearError('document')
            }}
          />
          <FieldError message={errors.document} />
        </Box>

        {/* Email */}
        <Box w="full">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            isInvalid={!!errors.email}
            onChange={() => clearError('email')}
          />
          <FieldError message={errors.email} />
        </Box>

        {/* Password */}
        <Box w="full">
          <InputGroup size="lg">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearError('password')
              }}
              placeholder="Senha (mínimo 8 caracteres)"
              minLength={8}
              pr={12}
              isInvalid={!!errors.password}
              transition="all"
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
          <FieldError message={errors.password} />
        </Box>

        {/* Password confirmation */}
        <Box w="full">
          <InputGroup size="lg">
            <Input
              type={showPasswordConfirmation ? 'text' : 'password'}
              name="password_confirmation"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value)
                clearError('password_confirmation')
              }}
              placeholder="Confirmar senha"
              minLength={8}
              pr={12}
              isInvalid={!!errors.password_confirmation}
              transition="all"
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
          {passwordConfirmation && !errors.password_confirmation && (
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
          <FieldError message={errors.password_confirmation} />
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
        >
          Continuar para o teste grátis
        </Button>
      </VStack>

      <Text fontSize="xs" color="gray.500" textAlign="center">
        Ao criar sua conta, você concorda com nossos{' '}
        <ChakraLink
          color="emerald.600"
          fontWeight="medium"
          textDecoration="underline"
          href="/termos"
          target="_blank"
        >
          Termos de Uso

        </ChakraLink>{' '}
        e{' '}
        <ChakraLink
          color="emerald.600"
          fontWeight="medium"
          textDecoration="underline"
          href="/privacidade"
          target="_blank"
        >
          Política de Privacidade
        </ChakraLink>
      </Text>
    </VStack>
  )
}

export default RegisterForm
