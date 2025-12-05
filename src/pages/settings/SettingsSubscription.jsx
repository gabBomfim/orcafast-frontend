import { useState } from 'react'
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
    List,
    ListItem,
    ListIcon,
    Flex,
} from '@chakra-ui/react'
import { FiAward, FiCheck, FiZap, FiStar, FiLock, FiMessageCircle, FiCreditCard } from 'react-icons/fi'

const benefits = [
    { icon: FiZap, text: 'Remova a marca d\'água dos orçamentos' },
    { icon: FiStar, text: 'Metas ilimitadas e personalizadas' },
    { icon: FiLock, text: 'Backup automático dos dados' },
    { icon: FiMessageCircle, text: 'Suporte prioritário por WhatsApp' },
]

const SettingsSubscription = () => {
    const [currentPlan] = useState('free') // 'free' or 'pro'
    const isPro = currentPlan === 'pro'

    return (
        <Box maxW="2xl" mx="auto" p={6}>
            {/* Header */}
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Assinatura
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Gerencie seu plano e acesse recursos exclusivos
                </Text>
            </Box>

            {/* Current Plan Card */}
            <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200" mb={4}>
                <CardBody p={6}>
                    <HStack spacing={4}>
                        <Flex
                            w="56px"
                            h="56px"
                            rounded="2xl"
                            bg={isPro ? 'yellow.50' : 'gray.50'}
                            align="center"
                            justify="center"
                            flexShrink={0}
                        >
                            <Icon
                                as={FiAward}
                                boxSize={7}
                                color={isPro ? 'yellow.500' : 'gray.400'}
                            />
                        </Flex>
                        <Box flex={1}>
                            <HStack spacing={2} mb={1}>
                                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                    Plano Atual
                                </Text>
                                <Badge
                                    bg={isPro ? 'yellow.50' : 'gray.100'}
                                    color={isPro ? 'yellow.600' : 'gray.600'}
                                    px={2}
                                    py={0.5}
                                    rounded="full"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                >
                                    {isPro ? 'PRO' : 'FREE'}
                                </Badge>
                            </HStack>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                                {isPro ? 'Você está no plano Pro' : 'Você está no plano Gratuito'}
                            </Text>
                            {isPro && (
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                    Próxima cobrança em: 15/01/2026
                                </Text>
                            )}
                        </Box>
                    </HStack>
                </CardBody>
            </Card>

            {/* Upgrade CTA (only for Free users) */}
            {!isPro && (
                <Card
                    bg="linear-gradient(to bottom right, rgba(0, 217, 126, 0.05), rgba(0, 217, 126, 0.1), rgba(0, 217, 126, 0.05))"
                    rounded="2xl"
                    border="1px"
                    borderColor="green.200"
                >
                    <CardBody p={6}>
                        {/* Title */}
                        <VStack spacing={1} mb={6}>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800" textAlign="center">
                                Desbloqueie todo o potencial
                            </Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                Faça upgrade para o Pro e leve seu negócio para o próximo nível
                            </Text>
                        </VStack>

                        {/* Benefits List */}
                        <VStack spacing={3} mb={6}>
                            {benefits.map((benefit, index) => (
                                <Flex
                                    key={index}
                                    align="center"
                                    gap={3}
                                    p={3}
                                    bg="white"
                                    rounded="xl"
                                    w="full"
                                >
                                    <Flex
                                        w="40px"
                                        h="40px"
                                        bg="green.50"
                                        rounded="xl"
                                        align="center"
                                        justify="center"
                                        flexShrink={0}
                                    >
                                        <Icon as={benefit.icon} boxSize={5} color="green.500" />
                                    </Flex>
                                    <Text fontSize="sm" fontWeight="medium" color="gray.800" flex={1}>
                                        {benefit.text}
                                    </Text>
                                    <Icon as={FiCheck} boxSize={5} color="green.500" />
                                </Flex>
                            ))}
                        </VStack>

                        {/* Price */}
                        <VStack spacing={1} mb={6}>
                            <HStack spacing={1} justify="center">
                                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                                    R$ 29
                                </Text>
                                <Text color="gray.600">/mês</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.600">
                                Cancele quando quiser, sem multa
                            </Text>
                        </VStack>

                        {/* Upgrade Button */}
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
                            _hover={{
                                bg: 'green.500',
                                transform: 'translateY(-2px)',
                                shadow: 'xl',
                            }}
                            transition="all 0.2s"
                        >
                            Fazer Upgrade para PRO
                        </Button>
                    </CardBody>
                </Card>
            )}

            {/* Pro User: Billing Info */}
            {isPro && (
                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                    <CardBody p={6}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.800" mb={4}>
                            Informações de Cobrança
                        </Text>

                        <VStack spacing={4} align="stretch">
                            <Flex
                                align="center"
                                justify="space-between"
                                p={4}
                                bg="gray.50"
                                rounded="xl"
                            >
                                <HStack spacing={3}>
                                    <Icon as={FiCreditCard} boxSize={5} color="gray.500" />
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                            Cartão terminando em 4242
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            Expira em 12/2026
                                        </Text>
                                    </Box>
                                </HStack>
                                <Button size="sm" variant="ghost" colorScheme="green" fontWeight="medium">
                                    Alterar
                                </Button>
                            </Flex>

                            <Flex justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    Próxima cobrança
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                    R$ 29,00 em 15/01/2026
                                </Text>
                            </Flex>
                        </VStack>

                        <Box mt={6} pt={6} borderTop="1px" borderColor="gray.200">
                            <Button
                                variant="ghost"
                                size="sm"
                                colorScheme="red"
                                fontWeight="normal"
                                _hover={{ color: 'red.600' }}
                            >
                                Cancelar assinatura
                            </Button>
                        </Box>
                    </CardBody>
                </Card>
            )}
        </Box>
    )
}

export default SettingsSubscription
