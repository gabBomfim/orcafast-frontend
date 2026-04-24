import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { FiMail, FiRefreshCw, FiCheckCircle, FiArrowRight, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { useCallback, useEffect, useRef, useState } from 'react'
import { authService } from '../../services'
import { storage } from '../../utils/storage'

const RESEND_COOLDOWN = 60
const POLL_INTERVAL = 5000

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`

const EmailVerificationModal = ({ isOpen, onVerified }) => {
  const user = storage.getUser()

  const [displayEmail, setDisplayEmail] = useState(user?.email ?? '')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isCheckingNow, setIsCheckingNow] = useState(false)
  const [justResent, setJustResent] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const pollRef = useRef(null)
  const cooldownRef = useRef(null)

  const checkVerification = useCallback(async (manual = false) => {
    if (manual) setIsCheckingNow(true)
    try {
      const { data } = await authService.getProfile()
      if (data?.email_verified_at) {
        clearInterval(pollRef.current)
        const currentUser = storage.getUser()
        storage.setUser({ ...currentUser, email_verified_at: data.email_verified_at })
        onVerified()
      }
    } catch {
      // ignore — will retry on next poll
    } finally {
      if (manual) setIsCheckingNow(false)
    }
  }, [onVerified])

  const handleUpdateEmail = async () => {
    setEmailError('')
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError('Esse e-mail não tá certo. Confira.')
      return
    }
    setIsUpdating(true)
    try {
      const { data } = await authService.updateEmail(newEmail)
      const updated = data.email ?? newEmail
      setDisplayEmail(updated)
      const u = storage.getUser()
      storage.setUser({ ...u, email: updated, email_verified_at: null })
      setIsChangingEmail(false)
      setNewEmail('')
      setJustResent(true)
      setTimeout(() => setJustResent(false), 4000)
    } catch (err) {
      setEmailError(
        err.response?.data?.errors?.email?.[0] ??
        err.response?.data?.message ??
        'Não foi possível atualizar. Tenta de novo.'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    pollRef.current = setInterval(() => checkVerification(), POLL_INTERVAL)
    return () => clearInterval(pollRef.current)
  }, [isOpen, checkVerification])

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => {
    clearInterval(pollRef.current)
    clearInterval(cooldownRef.current)
  }, [])

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return
    setIsResending(true)
    try {
      await authService.resendVerification()
      setJustResent(true)
      startCooldown()
      setTimeout(() => setJustResent(false), 4000)
    } catch {
      // silently ignore — user can try again
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      size="md"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
      <ModalContent borderRadius="2xl" overflow="hidden" shadow="2xl" mx={4}>
        <ModalBody p={0}>
          {/* Header — mesmo padrão do WelcomePlanModal */}
          <Box
            bg="linear-gradient(135deg, rgba(0,217,126,0.08) 0%, rgba(0,179,104,0.12) 100%)"
            borderBottom="1px"
            borderColor="green.100"
            p={7}
            textAlign="center"
          >
            <Flex
              w={16} h={16}
              bg="white"
              shadow="md"
              border="2px"
              borderColor="green.200"
              rounded="2xl"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiMail} boxSize={8} color="green.500" />
            </Flex>

            <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1.3">
              Confirme seu e-mail para começar
            </Text>
            <Text fontSize="sm" color="gray.600" mt={2} maxW="280px" mx="auto">
              Enviamos um link para o e-mail abaixo. Clique nele e começe a usar a OrçaFast!
            </Text>
          </Box>

          {/* Corpo */}
          <Box p={6}>
            <VStack spacing={4}>
              {/* E-mail em destaque + alterar */}
              <Box
                w="full"
                p={4}
                bg="gray.50"
                rounded="xl"
                border="1px"
                borderColor="gray.200"
              >
                {isChangingEmail ? (
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                      Novo e-mail
                    </Text>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => { setNewEmail(e.target.value); setEmailError('') }}
                      placeholder={displayEmail}
                      autoFocus
                      isInvalid={!!emailError}
                      size="sm"
                      borderRadius="lg"
                    />
                    {emailError && (
                      <Text fontSize="xs" color="red.500">{emailError}</Text>
                    )}
                    <HStack>
                      <Button
                        flex={1}
                        size="sm"
                        bg="emerald.500"
                        color="white"
                        _hover={{ bg: 'emerald.600' }}
                        borderRadius="lg"
                        onClick={handleUpdateEmail}
                        isLoading={isUpdating}
                        loadingText="Salvando..."
                        leftIcon={<Icon as={FiCheck} />}
                      >
                        Salvar e reenviar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        borderRadius="lg"
                        onClick={() => { setIsChangingEmail(false); setNewEmail(''); setEmailError('') }}
                        leftIcon={<Icon as={FiX} />}
                      >
                        Cancelar
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  <>
                    <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium" textTransform="uppercase" letterSpacing="wide" textAlign="center">
                      E-mail enviado para
                    </Text>
                    <Flex align="center" justify="center" gap={2} flexWrap="wrap">
                      <Text fontSize="md" fontWeight="semibold" color="gray.900" wordBreak="break-all" textAlign="center">
                        {displayEmail}
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: 'gray.600' }}
                        leftIcon={<Icon as={FiEdit2} boxSize={3} />}
                        onClick={() => { setIsChangingEmail(true); setNewEmail('') }}
                      >
                        Alterar
                      </Button>
                    </Flex>
                  </>
                )}
              </Box>

              {/* Indicador de polling */}
              <HStack spacing={2} py={1}>
                <Box
                  w={2} h={2}
                  borderRadius="full"
                  bg="emerald.500"
                  animation={`${pulse} 2s ease-in-out infinite`}
                />
                <Text fontSize="sm" color="gray.500">
                  Aguardando sua confirmação...
                </Text>
              </HStack>

              {/* Feedback de reenvio */}
              {justResent && (
                <HStack
                  spacing={2}
                  p={3}
                  bg="green.50"
                  rounded="xl"
                  border="1px"
                  borderColor="green.100"
                  w="full"
                  justify="center"
                >
                  <Icon as={FiCheckCircle} color="green.500" />
                  <Text fontSize="sm" color="green.700" fontWeight="medium">
                    E-mail reenviado! Confira a caixa de entrada.
                  </Text>
                </HStack>
              )}

              {/* Botão verificar agora */}
              <Button
                w="full"
                h={12}
                bg="green.500"
                color="white"
                rightIcon={<Icon as={FiArrowRight} />}
                borderRadius="xl"
                fontWeight="semibold"
                fontSize="md"
                _hover={{ bg: 'green.600', transform: 'translateY(-1px)', shadow: 'md' }}
                transition="all 0.2s"
                isLoading={isCheckingNow}
                loadingText="Verificando..."
                onClick={() => checkVerification(true)}
              >
                Já confirmei, entrar
              </Button>

              {/* Reenviar */}
              <Button
                variant="ghost"
                size="sm"
                color={resendCooldown > 0 ? 'gray.400' : 'emerald.600'}
                leftIcon={<Icon as={FiRefreshCw} />}
                isLoading={isResending}
                isDisabled={resendCooldown > 0}
                onClick={handleResend}
                _hover={{ bg: resendCooldown > 0 ? 'transparent' : 'emerald.50' }}
                cursor={resendCooldown > 0 ? 'not-allowed' : 'pointer'}
              >
                {resendCooldown > 0
                  ? `Reenviar em ${resendCooldown}s`
                  : 'Reenviar e-mail de confirmação'
                }
              </Button>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                Não achou o e-mail? Confira o spam também.
              </Text>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EmailVerificationModal
