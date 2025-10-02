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
  Checkbox,
  Link as ChakraLink,
  Divider,
  Text,
} from '@chakra-ui/react'
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'

const LoginForm = ({ onSubmit, onGoogleLogin, onFacebookLogin, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <VStack spacing={6}>
      <VStack as="form" spacing={6} w="full" onSubmit={onSubmit}>
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
              placeholder="Digite sua senha"
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

        <HStack w="full" justify="space-between">
          <Checkbox colorScheme="emerald" size="md">
            Lembrar-me
          </Checkbox>
          <ChakraLink
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
          borderRadius="xl"
          isLoading={isLoading}
        >
          Entrar
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
    </VStack>
  )
}

export default LoginForm
