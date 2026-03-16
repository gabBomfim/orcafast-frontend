import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Container,
  Flex,
  Icon,
  Spinner,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'
import { invitationService } from '../services'
import { storage } from '../utils/storage'
import OrcafastLogo from '../components/ui/OrcafastLogo'

const InviteAcceptPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invitationData, setInvitationData] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const data = await invitationService.validate(token)
      setInvitationData(data)
    } catch (error) {
      toast({
        title: 'Convite inválido ou expirado',
        description: 'Verifique o link ou solicite um novo convite ao administrador.',
        status: 'error',
        duration: null,
        isClosable: false,
      })
      setTimeout(() => navigate('/login'), 5000)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Nome é obrigatório'
    if (!formData.password) newErrors.password = 'Senha é obrigatória'
    else if (formData.password.length < 8) newErrors.password = 'Mínimo de 8 caracteres'
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'As senhas não coincidem'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const res = await invitationService.accept(token, formData)
      
      // Automatic Login
      if (res.access_token) {
        storage.setToken(res.access_token)
        storage.setUser(res.user)
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo(a) ao time da ${invitationData.company_name}.`,
        status: 'success',
      })

      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error.response?.data?.message || 'Tente novamente.',
        status: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="emerald.500" thickness="4px" />
      </Center>
    )
  }

  if (!invitationData) return null

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Box as={Link} to="/">
            <OrcafastLogo variant="full" height="40px" />
          </Box>

          <Box
            w="full"
            bg="white"
            p={8}
            borderRadius="2xl"
            shadow="xl"
            border="1px"
            borderColor="gray.100"
          >
            <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
              <Box textAlign="center">
                <Heading size="lg" mb={2} color="gray.800">
                  Aceitar Convite
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Você foi convidado para participar da empresa <Text as="span" fontWeight="bold" color="emerald.600">{invitationData.company_name}</Text>.
                </Text>
              </Box>

              <VStack spacing={4}>
                <FormControl isReadOnly>
                  <FormLabel fontSize="sm" fontWeight="semibold">E-mail</FormLabel>
                  <Input readOnly value={invitationData.email} bg="gray.50" color="gray.500" />
                </FormControl>

                <FormControl isInvalid={errors.name} isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">Seu Nome Completo</FormLabel>
                  <Input
                    placeholder="Como gostaria de ser chamado"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password} isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">Criar Senha</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      pr={12}
                    />
                    <InputRightElement h={12}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: 'transparent' }}
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
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password_confirmation} isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">Confirmar Senha</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repita a senha"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      pr={12}
                    />
                    <InputRightElement h={12}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: 'transparent' }}
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
                  <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
                </FormControl>
              </VStack>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Criando conta..."
                mt={2}
              >
                Ativar Minha Conta
              </Button>

              <HStack spacing={2} justify="center" pt={2}>
                <Icon as={FiCheckCircle} color="emerald.500" />
                <Text fontSize="xs" color="gray.500">
                  Ao ativar sua conta, você aceita nossos termos de uso.
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

// Internal Link helper (since we're using react-router)
const Link = ({ to, children, ...props }) => {
  const navigate = useNavigate()
  return (
    <Box as="span" cursor="pointer" onClick={() => navigate(to)} {...props}>
      {children}
    </Box>
  )
}

export default InviteAcceptPage
