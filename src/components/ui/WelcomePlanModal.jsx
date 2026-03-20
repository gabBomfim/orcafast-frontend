import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Box,
    Flex,
    Icon,
    Badge,
    Text,
    VStack,
    HStack,
    Button,
} from '@chakra-ui/react'
import {
    FiAward, FiCheck, FiZap, FiStar, FiLock, FiMessageCircle,
    FiTrendingUp, FiTarget, FiArrowRight, FiFilter, FiUsers
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const PLAN_WELCOME = {
    pro: {
        badge: 'AUTÔNOMO',
        badgeColor: 'yellow',
        title: 'Tudo pronto! O Plano Autônomo tá ativo.',
        subtitle: 'Agora você tem tudo o que precisa para profissionalizar seus orçamentos e ganhar tempo.',
        features: [
            { icon: FiZap, text: 'Mande quantos orçamentos quiser, com a sua logo.' },
            { icon: FiStar, text: 'Defina suas metas e acompanhe seu lucro.' },
            { icon: FiLock, text: 'Veja o dinheiro entrando direto no seu painel.' },
            { icon: FiMessageCircle, text: 'Suporte prioritário por WhatsApp' },
        ],
        cta: 'Começar a usar',
        prompt: 'Dica: comece definindo suas metas financeiras. Assim, a gente te ajuda a acompanhar o crescimento do seu negócio em tempo real.',
    },
    business: {
        badge: 'EQUIPE',
        badgeColor: 'purple',
        title: 'Show de bola! O Plano Equipe tá liberado.',
        subtitle: 'Agora seu time tem a ferramenta certa pra parar de bater cabeça e fechar mais negócios.',
        features: [
            { icon: FiTrendingUp, text: 'Traga sua equipe: todo mundo na mesma página.' },
            { icon: FiStar, text: 'Relatórios prontos: veja onde seu lucro está de verdade.' },
            { icon: FiLock, text: 'Painel completo: controle total do que entra e sai.' },
            { icon: FiFilter, text: 'Busca rápida: ache qualquer orçamento num piscar de olhos.' },
            { icon: FiMessageCircle, text: 'Suporte VIP por WhatsApp (fale direto com a gente).' },
        ],
        cta: 'Começar a usar',
        prompt: 'Dica: comece cadastrando seus ajudantes ou sócios. Assim, todo mundo fala a mesma língua e você foca em fazer a empresa crescer.',
    },
}

const WelcomePlanModal = ({ isOpen, onClose, planSlug }) => {
    const navigate = useNavigate()
    const config = PLAN_WELCOME[planSlug] ?? PLAN_WELCOME.pro

    const handleCta = () => {
        onClose()
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
                            <Icon as={planSlug === 'business' ? FiUsers : FiAward} boxSize={8} color="green.500" />
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

                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default WelcomePlanModal
