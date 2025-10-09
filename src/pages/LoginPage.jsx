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
  Flex,
  Checkbox,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import {
  FiZap,
  FiMail,
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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      const response = await authService.login(credentials)
      
      storage.setToken(response.data.access_token)
      storage.setUser(response.data.user)

      toast({
        title: 'Login realizado!',
        description: 'Redirecionando para o dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
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
              Fazer login
            </Heading>
            <Text color="gray.600">Acesse sua conta OrçaFast</Text>
          </CardHeader>

          <CardBody>
            <VStack spacing={6}>
              <VStack as="form" onSubmit={handleSubmit} spacing={6} w="full">
                <FormControl>
                  <FormLabel
                    htmlFor="email"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Email
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
                      placeholder="Digite seu e-mail"
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
                      placeholder="Digite sua senha"
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

                <HStack w="full" justify="space-between">
                  <Checkbox colorScheme="emerald" size="md">
                    Lembrar-me
                  </Checkbox>
                  <ChakraLink
                    as={RouterLink}
                    to="/recuperar-senha"
                    fontSize="sm"
                    color="emerald.600"
                    fontWeight="medium"
                  >
                    Esqueci minha senha
                  </ChakraLink>
                </HStack>

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
                  isLoading={isLoading}
                  loadingText="Entrando..."
                >
                  Entrar
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

              <Text mt={6} textAlign="center" fontSize="sm" color="gray.600">
                Ainda não tem conta?{' '}
                <ChakraLink
                  as={RouterLink}
                  to="/register"
                  color="emerald.600"
                  fontWeight="medium"
                >
                  Começar grátis
                </ChakraLink>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </SimpleGrid>
  )
}

export default LoginPage