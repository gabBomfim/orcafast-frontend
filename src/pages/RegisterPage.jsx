import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as ChakraLink,
  Text,
  VStack,
  Badge,
  Flex,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import {
  FiZap,
  FiArrowRight,
  FiCheckCircle,
  FiMail,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services'
import { storage } from '../utils/storage'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
    }

    try {
      const response = await authService.register(data)
      
      storage.setToken(response.data.access_token)
      storage.setUser(response.data.user)

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Redirecionando para o dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

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

  const handleSocialLogin = (provider) => {
    toast({
      title: `Login com ${provider}`,
      description: 'Funcionalidade será implementada em breve',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} minH="100vh">
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        bg="gray.900"
        color="white"
        p={12}
        direction="column"
        justify="center"
      >
        <VStack align="start" spacing={8} maxW="md">
          <Flex
            w={12}
            h={12}
            bg="whiteAlpha.200"
            borderRadius="lg"
            align="center"
            justify="center"
          >
            <Icon as={FiZap} color="emerald.400" w={7} h={7} />
          </Flex>

          <Heading as="h1" size="2xl" fontWeight="bold" lineHeight="tight">
            Orça rápido,
            <br />
            <Text as="span" color="emerald.400">
              fecha fácil
            </Text>
          </Heading>

          <Text fontSize="lg" color="gray.300">
            A plataforma mais simples para criar, enviar e acompanhar propostas
            profissionais. Sem enrolação, sem complexidade.
          </Text>

          <HStack color="emerald.400" spacing={3}>
            <Icon as={FiZap} w={5} h={5} />
            <Text fontWeight="medium">3 cliques para enviar sua proposta</Text>
          </HStack>
        </VStack>
      </Flex>

      <Flex
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
        bg="gray.50"
        direction="column"
        justify={{ base: 'start', lg: 'center' }}
      >
        <HStack
          display={{ base: 'flex', lg: 'none' }}
          spacing={3}
          mb={8}
          alignSelf="center"
        >
          <Flex
            w={10}
            h={10}
            bgGradient="linear(to-r, emerald.600, emerald.500)"
            borderRadius="lg"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiZap} w={6} h={6} color="white" />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            OrçaFast
          </Text>
        </HStack>

        <Card w="full" maxW="md" shadow="lg" borderRadius="xl" p={6}>
          <CardHeader textAlign="center" pb={6}>
            <Heading as="h2" size="lg" fontWeight="bold" color="gray.900">
              Criar conta grátis
            </Heading>
            <Text color="gray.600">
              Sem cartão de crédito, sem compromisso
            </Text>
          </CardHeader>

          <CardBody>
            <VStack spacing={6}>
              <VStack as="form" onSubmit={handleSubmit} spacing={5} w="full">
                <FormControl>
                  <FormLabel
                    htmlFor="name"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Nome completo
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      size="lg"
                      borderRadius="md"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="email"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    E-mail
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      size="lg"
                      borderRadius="md"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="password"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Senha
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 8 caracteres"
                      minLength={8}
                      borderRadius="md"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon
                          as={showPassword ? FiEyeOff : FiEye}
                          color="gray.500"
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="password_confirmation"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Confirmar senha
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      required
                      placeholder="Digite a senha novamente"
                      minLength={8}
                      borderRadius="md"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        <Icon
                          as={showPasswordConfirmation ? FiEyeOff : FiEye}
                          color="gray.500"
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  py={6}
                  fontSize="md"
                  fontWeight="bold"
                  colorScheme="emerald"
                  bg="emerald.500"
                  _hover={{
                    bg: 'emerald.600',
                  }}
                  borderRadius="md"
                  rightIcon={<Icon as={FiArrowRight} />}
                  isLoading={isLoading}
                  loadingText="Criando conta..."
                >
                  Criar conta grátis
                </Button>
              </VStack>

              <HStack w="full">
                <Divider />
                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontWeight="medium"
                  whiteSpace="nowrap"
                >
                  ou continue com
                </Text>
                <Divider />
              </HStack>

              <VStack spacing={3} w="full">
                <Button
                  w="full"
                  size="lg"
                  py={6}
                  variant="outline"
                  fontSize="md"
                  fontWeight="semibold"
                  leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                  borderColor="gray.300"
                  onClick={() => handleSocialLogin('Google')}
                >
                  Continuar com Google
                </Button>
                <Button
                  w="full"
                  size="lg"
                  py={6}
                  colorScheme="facebook"
                  fontSize="md"
                  fontWeight="semibold"
                  leftIcon={<Icon as={FaFacebook} boxSize={5} />}
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  Continuar com Facebook
                </Button>
              </VStack>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                Ao criar sua conta, você concorda com nossos{' '}
                <ChakraLink
                  as={RouterLink}
                  to="/termos"
                  color="emerald.600"
                  fontWeight="medium"
                >
                  Termos de Uso
                </ChakraLink>{' '}
                e{' '}
                <ChakraLink
                  as={RouterLink}
                  to="/privacidade"
                  color="emerald.600"
                  fontWeight="medium"
                >
                  Política de Privacidade
                </ChakraLink>
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Text mt={6} textAlign="center" fontSize="sm" color="gray.600">
          Já tem uma conta?{' '}
          <ChakraLink
            as={RouterLink}
            to="/login"
            color="emerald.600"
            fontWeight="medium"
          >
            Fazer login
          </ChakraLink>
        </Text>
      </Flex>
    </SimpleGrid>
  )
}

export default RegisterPage