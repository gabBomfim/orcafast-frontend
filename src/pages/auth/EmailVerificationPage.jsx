import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiAlertCircle, FiMail } from 'react-icons/fi'
import { useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import OrcafastLogo from '../../components/ui/OrcafastLogo'
import { authService } from '../../services'
import { storage } from '../../utils/storage'

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams()
  const isInvalid = searchParams.get('error') === 'invalid'
  const [isResending, setIsResending] = useState(false)
  const toast = useToast()

  const isLoggedIn = !!storage.getToken()

  const handleResend = async () => {
    if (!isLoggedIn) return
    setIsResending(true)
    try {
      await authService.resendVerification()
      toast({
        title: 'E-mail reenviado!',
        description: 'Confira sua caixa de entrada. Pode levar alguns minutinhos.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch {
      toast({
        title: 'Ih, algo deu errado aqui.',
        description: 'Tenta de novo em instantes.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsResending(false)
    }
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
      <OrcafastLogo
        variant="full"
        height="40px"
        style={{ cursor: 'pointer', marginBottom: '2.5rem' }}
        onClick={() => window.location.href = '/'}
      />

      <Box
        w="full"
        maxW="sm"
        bg="white"
        borderRadius="2xl"
        border="1px"
        borderColor="gray.200"
        p={8}
        textAlign="center"
        boxShadow="sm"
      >
        <VStack spacing={5}>
          <Flex
            w={16} h={16}
            bg={isInvalid ? 'red.50' : 'emerald.50'}
            borderRadius="2xl"
            align="center"
            justify="center"
          >
            <Icon
              as={isInvalid ? FiAlertCircle : FiMail}
              w={8} h={8}
              color={isInvalid ? 'red.500' : 'emerald.500'}
            />
          </Flex>

          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              {isInvalid
                ? 'Link expirado ou inválido'
                : 'Confirme seu e-mail'
              }
            </Text>
            <Text fontSize="sm" color="gray.600">
              {isInvalid
                ? 'Esse link de confirmação não é mais válido. Pode ter expirado ou já ter sido usado. Solicita um novo aí.'
                : 'Enviamos um link de confirmação para o seu e-mail. Clica nele para liberar o acesso completo.'
              }
            </Text>
          </VStack>

          {isLoggedIn ? (
            <Button
              w="full"
              h={12}
              bg="emerald.500"
              color="white"
              _hover={{ bg: 'emerald.600' }}
              borderRadius="xl"
              fontWeight="semibold"
              onClick={handleResend}
              isLoading={isResending}
              loadingText="Enviando..."
            >
              Reenviar e-mail de confirmação
            </Button>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              w="full"
              h={12}
              bg="emerald.500"
              color="white"
              _hover={{ bg: 'emerald.600' }}
              borderRadius="xl"
              fontWeight="semibold"
            >
              Fazer login
            </Button>
          )}

          <Button
            as={RouterLink}
            to={isLoggedIn ? '/dashboard' : '/'}
            variant="ghost"
            size="sm"
            color="gray.500"
            _hover={{ color: 'gray.700' }}
          >
            {isLoggedIn ? 'Voltar ao painel' : 'Ir para o início'}
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}

export default EmailVerificationPage
