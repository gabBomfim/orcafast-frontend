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
import { subscriptionService } from '../../services'
import { storage } from '../../utils/storage'

// ─── Plan feature map for welcome modal ─────────────────────────────────────────

const PLAN_WELCOME = {
    pro: {
        badge: 'PRO',
        badgeColor: 'yellow',
        title: 'Bem-vindo ao Profissional!',
        subtitle: 'Você desbloqueou ferramentas que vão transformar sua gestão de negócios.',
        features: [
            { icon: FiZap, text: 'Orçamentos sem marca d\'água' },
            { icon: FiStar, text: 'Metas financeiras ilimitadas' },
            { icon: FiLock, text: 'Backup automático dos dados' },
            { icon: FiMessageCircle, text: 'Suporte prioritário por WhatsApp' },
        ],
        cta: 'Definir minhas metas agora',
        ctaPath: '/dashboard/configuracoes/metas',
        prompt: 'Comece agora definindo suas metas financeiras. Com o plano PRO você pode criar metas ilimitadas e acompanhar o crescimento do seu negócio em tempo real.',
    },
    business: {
        badge: 'BUSINESS',
        badgeColor: 'purple',
        title: 'Bem-vindo ao Business!',
        subtitle: 'Sua operação está pronta para crescer. Todos os recursos estão liberados.',
        features: [
            { icon: FiTrendingUp, text: 'Múltiplos usuários na mesma conta' },
            { icon: FiStar, text: 'Relatórios avançados e exportação' },
            { icon: FiLock, text: 'SLA de suporte empresarial' },
            { icon: FiMessageCircle, text: 'Onboarding dedicado' },
        ],
        cta: 'Acessar relatórios avançados',
        ctaPath: '/dashboard',
        prompt: 'Comece agora configurando sua equipe e explorando os relatórios avançados. Escale sua operação com total controle.',
    },
}

const AUTO_CLOSE_SECONDS = 12

// ─── WelcomePlanModal ──────────────────────────────────────────────────────────

const WelcomePlanModal = ({ isOpen, onClose, planSlug }) => {
    const navigate = useNavigate()
    const config = PLAN_WELCOME[planSlug] ?? PLAN_WELCOME.pro

    const handleCta = () => {
        onClose()
        navigate(config.ctaPath)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="md"
            motionPreset="slideInBottom"
        >
            <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" overflow="hidden" shadow="2xl" mx={4}>
                <ModalBody p={0}>
                    {/* Header gradient band */}
                    <Box
                        bg="linear-gradient(135deg, rgba(0,217,126,0.08) 0%, rgba(0,179,104,0.12) 100%)"
                        borderBottom="1px"
                        borderColor="green.100"
                        p={7}
                        textAlign="center"
                    >
                        {/* Trophy icon */}
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
                            <Icon as={FiAward} boxSize={8} color="green.500" />
                        </Flex>

                        <Badge
                            colorScheme={config.badgeColor}
                            fontSize="xs"
                            fontWeight="bold"
                            px={3} py={1}
                            borderRadius="full"
                            mb={3}
                        >
                            PLANO {config.badge} ATIVO
                        </Badge>

                        <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1.3">
                            {config.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={2} maxW="280px" mx="auto">
                            {config.subtitle}
                        </Text>
                    </Box>

                    {/* Features + CTA */}
                    <Box p={6}>
                        {/* Features grid */}
                        <VStack spacing={2} mb={5}>
                            {config.features.map((f, idx) => (
                                <HStack
                                    key={idx}
                                    w="full"
                                    p={3}
                                    bg="gray.50"
                                    rounded="xl"
                                    spacing={3}
                                >
                                    <Flex
                                        w={8} h={8}
                                        bg="green.50"
                                        rounded="lg"
                                        align="center"
                                        justify="center"
                                        flexShrink={0}
                                    >
                                        <Icon as={f.icon} boxSize={4} color="green.500" />
                                    </Flex>
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" flex={1}>
                                        {f.text}
                                    </Text>
                                    <Icon as={FiCheck} boxSize={4} color="green.500" />
                                </HStack>
                            ))}
                        </VStack>

                        {/* Prompt */}
                        <Box
                            p={4}
                            bg="green.50"
                            rounded="xl"
                            border="1px"
                            borderColor="green.100"
                            mb={5}
                        >
                            <HStack align="flex-start" spacing={3}>
                                <Icon as={FiTarget} boxSize={4} color="green.600" mt={0.5} flexShrink={0} />
                                <Text fontSize="sm" color="green.800" lineHeight="1.6">
                                    {config.prompt}
                                </Text>
                            </HStack>
                        </Box>

                        {/* Actions */}
                        <VStack spacing={2}>
                            <Button
                                w="full"
                                h={12}
                                bg="green.500"
                                color="white"
                                rightIcon={<Icon as={FiArrowRight} />}
                                borderRadius="xl"
                                fontWeight="semibold"
                                fontSize="md"
                                px={6}
                                _hover={{ bg: 'green.600', transform: 'translateY(-1px)', shadow: 'md' }}
                                transition="all 0.2s"
                                onClick={handleCta}
                            >
                                {config.cta}
                            </Button>
                            <Button
                                w="full"
                                h={10}
                                variant="ghost"
                                color="gray.500"
                                fontSize="sm"
                                borderRadius="xl"
                                onClick={onClose}
                            >
                                Fechar
                            </Button>
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

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

const UpgradeCTA = ({ benefits, title, subtitle, price, buttonLabel, onCheckout, isLoading }) => (
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
                <Text fontSize="xs" color="gray.600">Cancele quando quiser, sem multa</Text>
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
    const { planSlug, planName, isFree, isPro, isPaid } = useSubscription()
    const display = PLAN_DISPLAY[planSlug] ?? PLAN_DISPLAY.free
    const toast = useToast()

    const [subscription, setSubscription] = useState(null)
    const [isLoadingStatus, setIsLoadingStatus] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [welcomePlanSlug, setWelcomePlanSlug] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    // Upgrade confirmation modal (for direct swaps)
    const { isOpen: isUpgradeOpen, onOpen: onUpgradeOpen, onClose: onUpgradeClose } = useDisclosure()
    const [pendingUpgradePlan, setPendingUpgradePlan] = useState(null)

    // Welcome modal
    const { isOpen: isWelcomeOpen, onOpen: onWelcomeOpen, onClose: onWelcomeClose } = useDisclosure()
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
            const previousSlug = previous?.plan?.slug || 'free'
            const newSlug = data.plan?.slug || 'free'

            storage.setSubscription(data)

            // Quando o plano mudou, salva flag no sessionStorage e recarrega para
            // propagar o novo plano no Header/Sidebar via useSubscription
            if (previousSlug !== newSlug && newSlug !== 'free') {
                sessionStorage.setItem('show_welcome', newSlug)
                window.location.reload()
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
            // Show welcome modal once loadStatus resolves and we know the plan slug
            // We set a flag so the modal fires after subscription data is loaded
            setWelcomePlanSlug('pending')
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

    // Open welcome modal once subscription data is loaded after a successful payment
    useEffect(() => {
        const pendingSlug = sessionStorage.getItem('show_welcome')
        const swapSuccess = sessionStorage.getItem('swap_success')

        // Show correct toast if it was a direct swap
        if (swapSuccess === 'true') {
            sessionStorage.removeItem('swap_success')
            toast({
                title: 'Plano atualizado!',
                description: 'A diferença foi cobrada proporcionalmente no seu cartão.',
                status: 'success',
                duration: 6000,
                isClosable: true,
            })
        }

        if (pendingSlug && !isLoadingStatus) {
            sessionStorage.removeItem('show_welcome') // clear so it only fires once
            setWelcomePlanSlug(pendingSlug)
            onWelcomeOpen()
        }
    }, [isLoadingStatus, onWelcomeOpen, toast])

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
    const isPaidPlan = !isFree

    return (
        <Box maxW="2xl" mx="auto" p={6}>
            {/* Header */}
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">Assinatura</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Gerencie seu plano e acesse recursos exclusivos
                </Text>
            </Box>

            {/* Current Plan Card */}
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

            {/* Free → upgrade to Pro */}
            {!isLoadingStatus && isFree && (
                <UpgradeCTA
                    benefits={FREE_TO_PRO_BENEFITS}
                    title="Desbloqueie todo o potencial"
                    subtitle="Faça upgrade para o Pro e leve seu negócio para o próximo nível"
                    price="29"
                    buttonLabel="Fazer Upgrade para PRO"
                    isLoading={actionLoading === 'checkout-pro'}
                    onCheckout={() => handleCheckout('pro')}
                />
            )}

            {/* Pro → upgrade to Business */}
            {!isLoadingStatus && isPro && (
                <>
                    <UpgradeCTA
                        benefits={PRO_TO_BUSINESS_BENEFITS}
                        title="Leve sua equipe ao próximo nível"
                        subtitle="Faça upgrade para o Business e escale sua operação com múltiplos usuários"
                        price="79"
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

            {/* Business: top plan + billing management */}
            {!isLoadingStatus && isPaid && !isPro && (
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

            {/* Welcome modal — shown after successful plan upgrade */}
            <WelcomePlanModal
                isOpen={isWelcomeOpen}
                onClose={onWelcomeClose}
                planSlug={welcomePlanSlug}
            />

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
