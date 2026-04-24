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
  Text,
  VStack,
  Badge,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiUsers, FiAlertTriangle, FiLock, FiMail } from 'react-icons/fi'
import { subscriptionService } from '../../services'
import { useAuth } from '../../hooks/useAuth'

const PLANS = [
  {
    slug: 'pro',
    badge: 'AUTÔNOMO',
    price: 'R$ 49,90',
    period: '/mês',
    features: [
      'Orçamentos ilimitados',
      'Orçamento com a sua marca',
      'Saiba quando o cliente abriu seu orçamento',
      'Painel com seus indicadores',
      'Metas financeiras',
      'Suporte rápido',
    ],
  },
  {
    slug: 'business',
    badge: 'EQUIPE',
    price: 'R$ 97,90',
    period: '/mês',
    features: [
      'Orçamentos ilimitados',
      'Orçamento com a sua marca',
      'Saiba quando o cliente abriu seu orçamento',
      'Painel com seus indicadores',
      'Metas financeiras',
      'Suporte rápido',
      'Toda a equipe na mesma assinatura',
      'Veja o desempenho de cada um',
      'Gerencie sua equipe',
      'Metas financeiras para a equipe',
    ],
  },
]

const PaywallModal = ({ isOpen }) => {
  const toast = useToast()
  const { getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const firstName = user?.name?.split(' ')[0] || 'você'
  const isMember = user?.role === 4

  const [teamInfo, setTeamInfo] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(null)
  const [pendingDowngradePlan, setPendingDowngradePlan] = useState(null)
  const { isOpen: isWarnOpen, onOpen: onWarnOpen, onClose: onWarnClose } = useDisclosure()
  const cancelRef = useRef()

  useEffect(() => {
    if (!isOpen) return
    subscriptionService.teamInfo()
      .then(({ data }) => setTeamInfo(data))
      .catch(() => setTeamInfo({ team_member_count: 0, members: [], suggested_plan: 'pro' }))
  }, [isOpen])

  const suggestedPlan = teamInfo?.suggested_plan ?? 'pro'
  const memberCount = teamInfo?.team_member_count ?? 0
  const memberNames = teamInfo?.members?.slice(0, 2).map(m => m.name.split(' ')[0]) ?? []

  const handleCheckout = async (planSlug) => {
    if (planSlug === 'pro' && memberCount > 0) {
      setPendingDowngradePlan(planSlug)
      onWarnOpen()
      return
    }
    await doCheckout(planSlug)
  }

  const doCheckout = async (planSlug) => {
    setIsCheckingOut(planSlug)
    try {
      const { data } = await subscriptionService.checkout(planSlug)
      sessionStorage.setItem('show_welcome', planSlug)
      if (data?.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch {
      toast({
        title: 'Ih, algo deu errado aqui.',
        description: 'A gente já sabe e tá resolvendo. Tenta de novo em instantes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsCheckingOut(null)
    }
  }

  const handleConfirmDowngrade = async () => {
    onWarnClose()
    if (pendingDowngradePlan) {
      await doCheckout(pendingDowngradePlan)
      setPendingDowngradePlan(null)
    }
  }

  const teamNudge = memberCount > 0 ? (
    <Box
      bg="emerald.50"
      border="1px"
      borderColor="emerald.200"
      borderRadius="xl"
      p={4}
      mb={4}
    >
      <Flex align="flex-start" gap={3}>
        <Icon as={FiUsers} color="emerald.600" mt={0.5} flexShrink={0} />
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="emerald.800">
            Seu time tá esperando! 🚀
          </Text>
          <Text fontSize="sm" color="emerald.700" mt={0.5}>
            {memberNames.length > 0
              ? `${memberNames.join(' e ')}${memberCount > 2 ? ` e mais ${memberCount - 2}` : ''} ${memberCount > 1 ? 'precisam' : 'precisa'} de acesso para continuar.`
              : `${memberCount} membro${memberCount > 1 ? 's' : ''} da sua equipe ${memberCount > 1 ? 'precisam' : 'precisa'} de acesso para continuar.`
            }
          </Text>
        </Box>
      </Flex>
    </Box>
  ) : null

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size={{ base: 'full', md: 'xl' }}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.800" />
        <ModalContent
          borderRadius={{ base: '0', md: '2xl' }}
          mx={{ base: 0, md: 4 }}
          maxH={{ base: '100dvh', md: '90vh' }}
          overflowY="auto"
        >
          <ModalBody py={8} px={{ base: 5, md: 8 }}>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <VStack spacing={2} align="center" textAlign="center">
                <Flex
                  w={14} h={14}
                  bg="orange.100"
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiLock} w={7} h={7} color="orange.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">
                  {isMember ? 'Acesso pausado' : 'Seu teste gratuito encerrou'}
                </Text>
                <Text fontSize="sm" color="gray.600" maxW="sm">
                  {isMember
                    ? `A assinatura da conta encerrou, ${firstName}. Entre em contato com o administrador para reativar o acesso.`
                    : `Continue organizando o seu negócio, ${firstName}! Escolha um plano e retome de onde parou. Não perca nenhum dado.`
                  }
                </Text>
              </VStack>

              {/* Member view: informative only */}
              {isMember && (
                <Box
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                >
                  <VStack spacing={4}>
                    <Flex
                      w={12} h={12}
                      bg="blue.50"
                      borderRadius="full"
                      align="center"
                      justify="center"
                      mx="auto"
                    >
                      <Icon as={FiMail} boxSize={5} color="blue.500" />
                    </Flex>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.800" mb={1}>
                        O que você pode fazer?
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Entre em contato com o administrador da conta e peça para reativar a assinatura. Assim que ele renovar, você volta a ter acesso normalmente.
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              )}

              {/* Admin: team nudge */}
              {!isMember && teamNudge}

              {/* Plan cards — admin only */}
              {!isMember && <Flex
                direction={{ base: 'column', sm: 'row' }}
                gap={4}
                align="stretch"
              >
                {PLANS.map((plan) => {
                  const isSuggested = plan.slug === suggestedPlan
                  const isLoading = isCheckingOut === plan.slug

                  return (
                    <Box
                      key={plan.slug}
                      flex={1}
                      border="2px"
                      borderColor={isSuggested ? 'emerald.400' : 'gray.200'}
                      borderRadius="2xl"
                      p={5}
                      position="relative"
                      bg={isSuggested ? 'emerald.50' : 'white'}
                      transition="all 0.2s"
                    >
                      {isSuggested && (
                        <Badge
                          position="absolute"
                          top="-11px"
                          left="50%"
                          transform="translateX(-50%)"
                          bg="emerald.500"
                          color="white"
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="bold"
                          letterSpacing="wide"
                        >
                          SUGERIDO
                        </Badge>
                      )}

                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="widest" mb={1}>
                            {plan.badge}
                          </Text>
                          <HStack align="baseline" spacing={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                              {plan.price}
                            </Text>
                            <Text fontSize="sm" color="gray.500">{plan.period}</Text>
                          </HStack>
                        </Box>

                        <VStack align="stretch" spacing={2} flex={1}>
                          {plan.features.map((feat) => (
                            <Flex key={feat} align="flex-start" gap={2}>
                              <Icon as={FiCheck} color="emerald.500" mt={0.5} flexShrink={0} />
                              <Text fontSize="sm" color="gray.700">{feat}</Text>
                            </Flex>
                          ))}
                        </VStack>

                        <Button
                          w="full"
                          size="md"
                          borderRadius="xl"
                          fontWeight="semibold"
                          bg="emerald.500"
                          color="white"
                          border="none"
                          _hover={{ bg: 'emerald.600' }}
                          isLoading={isLoading}
                          loadingText="Aguardando..."
                          isDisabled={isCheckingOut !== null && !isLoading}
                          onClick={() => handleCheckout(plan.slug)}
                        >
                          {plan.slug === 'pro' ? 'Assinar Autônomo' : 'Assinar plano Equipe'}
                        </Button>
                      </VStack>
                    </Box>
                  )
                })}
              </Flex>}

              {!isMember && (
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Pagamento seguro via Stripe • Cancele quando quiser
                </Text>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Downgrade warning */}
      <AlertDialog
        isOpen={isWarnOpen}
        leastDestructiveRef={cancelRef}
        onClose={onWarnClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent borderRadius="2xl" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" pt={6}>
            <Flex align="center" gap={2}>
              <Icon as={FiAlertTriangle} color="orange.500" />
              Atenção antes de continuar
            </Flex>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text fontSize="sm" color="gray.700">
              Ao escolher o plano Autônomo,{' '}
              <Text as="span" fontWeight="semibold">
                seus {memberCount} membro{memberCount > 1 ? 's' : ''} de equipe perderão o acesso imediatamente.
              </Text>
              {' '}Você voltará a gerenciar tudo sozinho. Tem certeza?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter gap={3} pb={6}>
            <Button ref={cancelRef} onClick={onWarnClose} variant="outline" borderRadius="xl" size="sm">
              Manter Equipe
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleConfirmDowngrade}
              borderRadius="xl"
              size="sm"
            >
              Confirmar Autônomo
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PaywallModal
