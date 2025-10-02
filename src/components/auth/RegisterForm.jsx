import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
  Link as ChakraLink,
  Divider,
  Text,
} from '@chakra-ui/react'
import {
  FiMail,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'

const RegisterForm = ({ onSubmit, onGoogleLogin, onFacebookLogin, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  return (
    <VStack spacing={6}>
      {/* Form */}
      <VStack as="form" spacing={5} w="full" onSubmit={onSubmit}>
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
              borderRadius="xl"
              bg="white"
              border="1px"
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
              borderRadius="xl"
              bg="white"
              border="1px"
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
              borderRadius="xl"
              bg="white"
              border="1px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                size="sm"
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
              borderRadius="xl"
              bg="white"
              border="1px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)' }}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                size="sm"
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
          borderRadius="xl"
          rightIcon={<Icon as={FiArrowRight} />}
          isLoading={isLoading}
        >
          Criar conta grátis
        </Button>
      </VStack>

      {/* Divider */}
      <HStack w="full">
        <Divider />
        <Text
          fontSize="xs"
          color="gray.500"
          fontWeight="medium"
          whiteSpace="nowrap"
          px={2}
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
          onClick={onGoogleLogin}
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
          onClick={onFacebookLogin}
        >
          Continuar com Facebook
        </Button>
      </VStack>

      <Text fontSize="xs" color="gray.500" textAlign="center">
        Ao criar sua conta, você concorda com nossos{' '}
        <ChakraLink
          color="emerald.600"
          fontWeight="medium"
        >
          Termos de Uso
        </ChakraLink>{' '}
        e{' '}
        <ChakraLink
          color="emerald.600"
          fontWeight="medium"
        >
          Política de Privacidade
        </ChakraLink>
      </Text>
    </VStack>
  )
}

export default RegisterForm
