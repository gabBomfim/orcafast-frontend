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
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} minH="100vh">
      {/* Left side - Branding */}
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

      {/* Right side - Register Form */}
      <Flex
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
        bg="gray.50"
        direction="column"
        justify={{ base: 'start', lg: 'center' }}
      >
        {/* Mobile Header */}
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
              {/* Form */}
              <VStack as="form" spacing={5} w="full">
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
                      borderColor="gray.300"
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
                      borderColor="gray.300"
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
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      borderRadius="md"
                      borderColor="gray.300"
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
                >
                  Criar conta grátis
                </Button>
              </VStack>

              {/* Divider */}
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

              {/* Social Logins */}
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
