import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    Icon,
    Badge,
    Flex,
    Spinner,
    Center,
    useToast,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    FiAward, FiCheck, FiZap, FiStar, FiLock, FiMessageCircle,
    FiCreditCard, FiTrendingUp, FiExternalLink, FiAlertCircle,
    FiRefreshCw, FiTarget, FiArrowRight,
} from 'react-icons/fi'
import { useSubscription } from '../../hooks/useSubscription'
import { useAuth } from '../../hooks/useAuth'
import { subscriptionService } from '../../services'
import { storage } from '../../utils/storage'
const FREE_TO_PRO_BENEFITS = [
    { icon: FiZap, text: 'Remova a marca d\'água dos orçamentos' },
    { icon: FiStar, text: 'Metas financeiras ilimitadas e personalizadas' },
    { icon: FiLock, text: 'Backup automático dos dados' },
    { icon: FiMessageCircle, text: 'Suporte prioritário por WhatsApp' },
]

const PRO_TO_BUSINESS_BENEFITS = [
    { icon: FiTrendingUp, text: 'Múltiplos usuários na mesma conta' },
    { icon: FiStar, text: 'Relatórios avançados e exportação' },
    { icon: FiLock, text: 'SLA de suporte empresarial' },
    { icon: FiMessageCircle, text: 'Onboarding dedicado' },
]

// ─── Plan display config ──────────────────────────────────────────────────────

const PLAN_DISPLAY = {
    free: { label: 'FREE', badgeBg: 'gray.100', badgeColor: 'gray.600', iconBg: 'gray.50', iconColor: 'gray.400' },
    pro: { label: 'PRO', badgeBg: 'yellow.50', badgeColor: 'yellow.600', iconBg: 'yellow.50', iconColor: 'yellow.500' },
    business: { label: 'BUSINESS', badgeBg: 'purple.50', badgeColor: 'purple.600', iconBg: 'purple.50', iconColor: 'purple.500' },
}

// ─── UpgradeCTA ────────────────────────────────────────────────────────────────

const UpgradeCTA = ({ benefits, title, subtitle, price, buttonLabel, onCheckout, isLoading, bottomText }) => (
    <Card
        bg="linear-gradient(to bottom right, rgba(0, 217, 126, 0.05), rgba(0, 217, 126, 0.1), rgba(0, 217, 126, 0.05))"
        rounded="2xl"
        border="1px"
        borderColor="green.200"
    >
        <CardBody p={6}>
            <VStack spacing={1} mb={6}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800" textAlign="center">{title}</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">{subtitle}</Text>
            </VStack>

            <VStack spacing={3} mb={6}>
                {benefits.map((benefit, idx) => (
                    <Flex key={idx} align="center" gap={3} p={3} bg="white" rounded="xl" w="full">
                        <Flex w="40px" h="40px" bg="green.50" rounded="xl" align="center" justify="center" flexShrink={0}>
                            <Icon as={benefit.icon} boxSize={5} color="green.500" />
                        </Flex>
                        <Text fontSize="sm" fontWeight="medium" color="gray.800" flex={1}>
                            {benefit.text}
                        </Text>
                        <Icon as={FiCheck} boxSize={5} color="green.500" />
                    </Flex>
                ))}
            </VStack>

            <VStack spacing={1} mb={6}>
                <HStack spacing={1} justify="center">
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">R$ {price}</Text>
                    <Text color="gray.600">/mês</Text>
                </HStack>
                <Text fontSize="xs" color="gray.600" textAlign="center">{bottomText || "Cancele quando quiser, sem multa"}</Text>
            </VStack>

            <Button
                leftIcon={<Icon as={FiAward} />}
                colorScheme="green"
                bg="green.400"
                color="white"
                size="lg"
                w="full"
                h="56px"
                rounded="xl"
                fontWeight="semibold"
                fontSize="lg"
                shadow="lg"
                isLoading={isLoading}
                loadingText="Redirecionando..."
                onClick={onCheckout}
                _hover={{ bg: 'green.500', transform: 'translateY(-2px)', shadow: 'xl' }}
                transition="all 0.2s"
            >
                {buttonLabel}
            </Button>
        </CardBody>
    </Card>
)

// ─── ActiveSubscriptionCard ───────────────────────────────────────────────────

const ActiveSubscriptionCard = ({ subscription, onPortal, onCancel, onResume, isLoading }) => {
    const nextBilling = subscription?.next_billing_date
        ? new Date(subscription.next_billing_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : null

    const endsAt = subscription?.ends_at
        ? new Date(subscription.ends_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : null

    const onGracePeriod = subscription?.on_grace_period

    return (
        <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
            <CardBody p={6}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800" mb={4}>
                    Informações de Cobrança
                </Text>

                <VStack spacing={4} align="stretch">
                    {/* Status / grace period alert */}
                    {onGracePeriod && (
                        <Flex align="center" gap={3} p={4} bg="orange.50" rounded="xl" border="1px" borderColor="orange.200">
                            <Icon as={FiAlertCircle} boxSize={5} color="orange.500" flexShrink={0} />
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="medium" color="orange.800">
                                    Cancelamento agendado
                                </Text>
                                <Text fontSize="xs" color="orange.600">
                                    Seu acesso expira em {endsAt}. Reative antes disso para não perder nenhum recurso.
                                </Text>
                            </Box>
                            <Button
                                size="sm"
                                colorScheme="orange"
                                variant="solid"
                                leftIcon={<Icon as={FiRefreshCw} />}
                                isLoading={isLoading === 'resume'}
                                onClick={onResume}
                            >
                                Reativar
                            </Button>
                        </Flex>
                    )}

                    {/* Next billing */}
                    {nextBilling && !onGracePeriod && (
                        <Flex align="center" gap={3} p={4} bg="gray.50" rounded="xl">
                            <Icon as={FiCreditCard} boxSize={5} color="gray.500" flexShrink={0} />
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.800">Próxima cobrança</Text>
                                <Text fontSize="xs" color="gray.600">{nextBilling}</Text>
                            </Box>
                        </Flex>
                    )}
                </VStack>

                <VStack mt={4} spacing={2}>
                    <Button
                        w="full"
                        h={11}
                        p={3}
                        variant="outline"
                        colorScheme="green"
                        leftIcon={<Icon as={FiExternalLink} />}
                        borderRadius="xl"
                        fontWeight="medium"
                        isLoading={isLoading === 'portal'}
                        onClick={onPortal}
                    >
                        Gerenciar Cobrança
                    </Button>

                    {!onGracePeriod && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorScheme="red"
                            fontWeight="normal"
                            _hover={{ color: 'red.600' }}
                            isLoading={isLoading === 'cancel'}
                            onClick={onCancel}
                        >
                            Cancelar assinatura
                        </Button>
                    )}
                </VStack>
            </CardBody>
        </Card>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

const SettingsSubscription = () => {
    const { getCurrentUser } = useAuth()
    const user = getCurrentUser()
    const isAdmin = user?.role === 3 || user?.role === 1

    const { planSlug, planName, isPro, isPaid, subscribed, onTrial, trialEndsAt } = useSubscription()
    // Defaults to pro display if they are not Free and not Business, ensures styling doesn't break
    const display = PLAN_DISPLAY[planSlug] ?? PLAN_DISPLAY.pro
    const toast = useToast()

    const [subscription, setSubscription] = useState(null)
    const [isLoadingStatus, setIsLoadingStatus] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    // Upgrade confirmation modal (for direct swaps)
    const { isOpen: isUpgradeOpen, onOpen: onUpgradeOpen, onClose: onUpgradeClose } = useDisclosure()
    const [pendingUpgradePlan, setPendingUpgradePlan] = useState(null)

    // Cancel confirmation dialog
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure()
    const cancelRef = useRef()

    // ── Fetch subscription status ────────────────────────────────────────────────
    const loadStatus = useCallback(async () => {
        setIsLoadingStatus(true)
        try {
            const { data } = await subscriptionService.getStatus()
            setSubscription(data)

            // Persiste o plano no localStorage para o useSubscription lê-lo em todo o app
            const previous = storage.getSubscription()
            const newSlug = data.plan?.slug || 'free'
            const newSubscribed = data.subscribed ?? false

            storage.setSubscription(data)

            // Verifica se ocorreu uma mudança que justifique exibir o modal de Boas Vindas
            // Só validamos se já existia um histórico (previous) na navegação atual
            if (previous) {
                const previousSlug = previous.plan?.slug || 'free'
                const previousSubscribed = previous.subscribed ?? false

                const changedPlan = previousSlug !== newSlug && newSlug !== 'free'
                const justSubscribed = !previousSubscribed && newSubscribed

                // Só exibe o modal de boas vindas se a assinatura atual estiver ATIVA
                if (newSubscribed && (changedPlan || justSubscribed)) {
                    sessionStorage.setItem('show_welcome', newSlug)
                    window.location.reload()
                }
            }
        } catch {
            // Not subscribed or error — subscription remains null
        } finally {
            setIsLoadingStatus(false)
        }
    }, [])

    useEffect(() => { loadStatus() }, [loadStatus])

    // ── Handle Stripe Redirects ──────────────────────────────────────────────────
    useEffect(() => {
        const success = searchParams.get('success')
        const canceled = searchParams.get('canceled')

        if (success === '1' || success === 'true') {
            setSearchParams({})
        } else if (canceled === '1' || canceled === 'true') {
            toast({
                title: 'Pagamento não concluído',
                description: 'Você saiu do processo de pagamento. Seu plano atual permanece inalterado.',
                status: 'info',
                duration: 6000,
                isClosable: true,
            })
            setSearchParams({})
        }
    }, [searchParams, setSearchParams, toast])


    // ── Checkout / Upgrade ───────────────────────────────────────────────────────

    // 1. User clicks upgrade button -> open confirmation modal first
    const confirmUpgrade = (plan) => {
        setPendingUpgradePlan(plan)
        onUpgradeOpen()
    }

    // 2. User confirms upgrade -> call API (or direct call for Free -> Paid)
    const handleCheckout = async (directPlan = null) => {
        const plan = directPlan || pendingUpgradePlan
        if (!plan) return

        setActionLoading(`checkout-${plan}`)
        try {
            const { data } = await subscriptionService.checkout(plan)

            // If there's a checkout URL, redirect to Stripe
            if (data.checkout_url) {
                window.location.href = data.checkout_url
            } else {
                // Direct swap (pro-rata). Success is immediate.
                onUpgradeClose()

                // Force flags and storage before reload to guarantee modal and UI sync
                sessionStorage.setItem('show_welcome', plan)
                sessionStorage.setItem('swap_success', 'true')

                window.location.reload()
            }
        } catch (err) {
            toast({
                title: 'Erro ao assinar',
                description: err.response?.data?.message || 'Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setActionLoading(null)
        }
    }

    // ── Portal ───────────────────────────────────────────────────────────────────
    const handlePortal = async () => {
        setActionLoading('portal')
        try {
            const { data } = await subscriptionService.portal()
            window.location.href = data.portal_url
        } catch (err) {
            toast({
                title: 'Erro ao abrir portal',
                description: err.response?.data?.message || 'Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setActionLoading(null)
        }
    }

    // ── Cancel ───────────────────────────────────────────────────────────────────
    const handleCancel = async () => {
        onCancelClose()
        setActionLoading('cancel')
        try {
            await subscriptionService.cancel()
            toast({
                title: 'Assinatura cancelada',
                description: 'Seu acesso continua até o fim do período pago.',
                status: 'info',
                duration: 6000,
                isClosable: true,
            })
            await loadStatus()
        } catch (err) {
            toast({
                title: 'Erro ao cancelar',
                description: err.response?.data?.message || 'Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setActionLoading(null)
        }
    }

    // ── Resume ───────────────────────────────────────────────────────────────────
    const handleResume = async () => {
        setActionLoading('resume')
        try {
            await subscriptionService.resume()
            toast({
                title: 'Assinatura reativada!',
                description: 'Seu plano continua ativo normalmente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            await loadStatus()
        } catch (err) {
            toast({
                title: 'Erro ao reativar',
                description: err.response?.data?.message || 'Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setActionLoading(null)
        }
    }

    // ── Render ───────────────────────────────────────────────────────────────────
    const isActiveSubscription = subscribed || onTrial
    const isPaidPlan = isActiveSubscription && isPaid

    return (
        <Box maxW="2xl" mx="auto" p={6} position="relative">
            {!isAdmin && (
                <Flex
                    position="absolute"
                    top={0} left={0} right={0} bottom={0}
                    bg="whiteAlpha.700"
                    zIndex={100}
                    align="center"
                    justify="center"
                    backdropFilter="blur(8px)"
                    borderRadius="2xl"
                    minH="400px"
                >
                    <VStack spacing={4} bg="white" p={8} borderRadius="2xl" shadow="2xl" border="1px" borderColor="gray.100" maxW="sm" textAlign="center">
                        <Box p={3} bg="emerald.50" borderRadius="xl">
                            <Icon as={FiLock} color="emerald.500" boxSize={8} />
                        </Box>
                        <Box>
                            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                                Acesso Restrito
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Apenas Administradores podem gerenciar a assinatura da empresa.
                            </Text>
                        </Box>
                    </VStack>
                </Flex>
            )}
            {/* Header */}
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">Assinatura</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Gerencie seu plano e acesse recursos exclusivos
                </Text>
            </Box>

            {/* Trial Alert Box */}
            {!isLoadingStatus && subscribed && onTrial && trialEndsAt && (
                <Box mb={4} p={4} bg="blue.50" rounded="xl" border="1px" borderColor="blue.200">
                    <HStack spacing={3} align="flex-start">
                        <Icon as={FiAlertCircle} boxSize={5} color="blue.500" mt={0.5} />
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color="blue.900">
                                Você está no período de testes.
                            </Text>
                            <Text fontSize="sm" color="blue.700" mt={1}>
                                Seu cartão será cobrado em <strong>{new Date(trialEndsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>.
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            )}

            {/* Current Plan Card (showing even if unsubscribed since they technically have the plan mapped to them) */}
            <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200" mb={4}>
                <CardBody p={6}>
                    <HStack spacing={4}>
                        <Flex
                            w="56px" h="56px" rounded="2xl"
                            bg={display.iconBg}
                            align="center" justify="center" flexShrink={0}
                        >
                            <Icon as={FiAward} boxSize={7} color={display.iconColor} />
                        </Flex>
                        <Box flex={1}>
                            <HStack spacing={2} mb={1}>
                                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                    Plano Atual
                                </Text>
                                <Badge
                                    bg={display.badgeBg}
                                    color={display.badgeColor}
                                    px={2} py={0.5}
                                    rounded="full"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                >
                                    {display.label}
                                </Badge>
                                {!isActiveSubscription && (
                                    <Badge colorScheme="red" variant="subtle" px={2} py={0.5} rounded="full" fontSize="xs">
                                        Inativo
                                    </Badge>
                                )}
                            </HStack>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                                Você está no plano {planName}
                            </Text>
                        </Box>
                    </HStack>
                </CardBody>
            </Card>

            {/* Loading */}
            {isLoadingStatus && (
                <Center py={8}>
                    <Spinner size="md" color="emerald.500" thickness="2px" />
                </Center>
            )}

            {/* Unsubscribed user -> Needs to subscribe to PRO to start Trial */}
            {!isLoadingStatus && !isActiveSubscription && (
                <UpgradeCTA
                    benefits={FREE_TO_PRO_BENEFITS}
                    title="Comece seu teste de 7 dias"
                    subtitle="Desbloqueie todo o potencial do OrçaFast para o seu negócio. Você não será cobrado hoje."
                    price="49,90"
                    buttonLabel="Começar teste de 7 dias"
                    bottomText="Cancele a qualquer momento antes de 7 dias e nada será cobrado."
                    isLoading={actionLoading === 'checkout-pro'}
                    onCheckout={() => handleCheckout('pro')}
                />
            )}

            {/* Pro IS Subscribed → Can upgrade to Business */}
            {!isLoadingStatus && isPro && isActiveSubscription && (
                <>
                    <UpgradeCTA
                        benefits={PRO_TO_BUSINESS_BENEFITS}
                        title="Leve sua equipe ao próximo nível"
                        subtitle="Faça upgrade para o Business e escale sua operação com múltiplos usuários"
                        price="97,90"
                        buttonLabel="Fazer Upgrade para Business"
                        isLoading={actionLoading === 'checkout-business'}
                        onCheckout={() => confirmUpgrade('business')}
                    />
                    <Box mt={4}>
                        <ActiveSubscriptionCard
                            subscription={subscription}
                            onPortal={handlePortal}
                            onCancel={onCancelOpen}
                            onResume={handleResume}
                            isLoading={actionLoading}
                        />
                    </Box>
                </>
            )}

            {/* Business (Has active subscription): Top plan + billing management */}
            {!isLoadingStatus && isPaidPlan && !isPro && isActiveSubscription && (
                <ActiveSubscriptionCard
                    subscription={subscription}
                    onPortal={handlePortal}
                    onCancel={onCancelOpen}
                    onResume={handleResume}
                    isLoading={actionLoading}
                />
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog isOpen={isCancelOpen} leastDestructiveRef={cancelRef} onClose={onCancelClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="2xl">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Cancelar assinatura?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Seu acesso a todos os recursos pagos continuará até o final do período já cobrado.
                            Após isso, sua conta voltará para o plano gratuito.
                        </AlertDialogBody>
                        <AlertDialogFooter gap={2}>
                            <Button ref={cancelRef} onClick={onCancelClose} borderRadius="xl">
                                Manter assinatura
                            </Button>
                            <Button colorScheme="red" onClick={handleCancel} borderRadius="xl">
                                Sim, cancelar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>


            {/* Upgrade confirmation modal */}
            <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="2xl" shadow="xl">
                    <ModalHeader pb={0}>Confirmar Upgrade</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pt={4}>
                        <VStack spacing={4} align="stretch" color="gray.600" fontSize="sm">
                            <Text>
                                Você está prestes a fazer upgrade para o plano{' '}
                                <Text as="strong" color="green.600">
                                    {pendingUpgradePlan === 'business' ? 'Business' : 'Pro'}
                                </Text>.
                            </Text>
                            {isPaidPlan && (
                                <Text>
                                    Como você já possui um plano ativo, a <b>diferença será cobrada proporcionalmente </b>
                                    no cartão cadastrado (prorated).
                                </Text>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter bg="gray.50" borderBottomRadius="2xl" mt={6}>
                        <Button variant="ghost" onClick={onUpgradeClose} mr={3}>Cancelar</Button>
                        <Button
                            colorScheme="green"
                            onClick={() => handleCheckout()}
                            isLoading={actionLoading === `checkout-${pendingUpgradePlan}`}
                        >
                            Confirmar Assinatura
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default SettingsSubscription
