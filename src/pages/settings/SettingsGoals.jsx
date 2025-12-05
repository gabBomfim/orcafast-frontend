import { useState } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    Card,
    CardBody,
    Icon,
    Switch,
    SimpleGrid,
    Flex,
} from '@chakra-ui/react'
import { FiTarget, FiCalendar, FiSave, FiInfo } from 'react-icons/fi'

const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

const SettingsGoals = () => {
    const [metaAnual, setMetaAnual] = useState('240000')
    const [metaMensalPadrao, setMetaMensalPadrao] = useState('20000')
    const [usarPadrao, setUsarPadrao] = useState(true)
    const [metasMensais, setMetasMensais] = useState(
        Object.fromEntries(months.map((m) => [m, '20000']))
    )

    const handleMetaMensalChange = (month, value) => {
        setMetasMensais((prev) => ({ ...prev, [month]: value }))
    }

    const handleMetaMensalPadraoChange = (value) => {
        setMetaMensalPadrao(value)
        if (usarPadrao) {
            setMetasMensais(Object.fromEntries(months.map((m) => [m, value])))
        }
    }

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0
        return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    }

    const handleSave = () => {
        console.log('Salvando metas:', { metaAnual, metaMensalPadrao, usarPadrao, metasMensais })
        // TODO: Implementar lógica de salvamento
    }

    return (
        <Box maxW="2xl" mx="auto" p={6}>
            {/* Header */}
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Metas Financeiras
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Defina suas metas de faturamento para acompanhar seu progresso
                </Text>
            </Box>

            {/* Annual Goal Card */}
            <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200" mb={4}>
                <CardBody p={6}>
                    <HStack align="flex-start" spacing={4}>
                        <Flex
                            w="48px"
                            h="48px"
                            bg="green.50"
                            rounded="xl"
                            align="center"
                            justify="center"
                            flexShrink={0}
                        >
                            <Icon as={FiTarget} boxSize={6} color="green.500" />
                        </Flex>
                        <Box flex={1}>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800" mb={1}>
                                    Meta Anual (2025)
                                </FormLabel>
                                <Text fontSize="xs" color="gray.600" mb={3}>
                                    Quanto você deseja faturar em todo o ano
                                </Text>
                                <HStack spacing={0}>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        px={4}
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Text fontWeight="medium" color="gray.600">
                                            R$
                                        </Text>
                                    </Flex>
                                    <Input
                                        value={metaAnual}
                                        onChange={(e) => setMetaAnual(e.target.value.replace(/\D/g, ''))}
                                        placeholder="0"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                                <Text fontSize="xs" color="gray.600" mt={2}>
                                    Equivale a R$ {formatCurrency((parseFloat(metaAnual) / 12).toString())} por mês
                                    em média
                                </Text>
                            </FormControl>
                        </Box>
                    </HStack>
                </CardBody>
            </Card>

            {/* Monthly Goal Card */}
            <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                <CardBody p={6}>
                    <HStack align="flex-start" spacing={4} mb={6}>
                        <Flex
                            w="48px"
                            h="48px"
                            bg="green.50"
                            rounded="xl"
                            align="center"
                            justify="center"
                            flexShrink={0}
                        >
                            <Icon as={FiCalendar} boxSize={6} color="green.500" />
                        </Flex>
                        <Box flex={1}>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800" mb={1}>
                                    Meta Mensal Padrão
                                </FormLabel>
                                <Text fontSize="xs" color="gray.600" mb={3}>
                                    Valor base usado para cada mês
                                </Text>
                                <HStack spacing={0}>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        px={4}
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Text fontWeight="medium" color="gray.600">
                                            R$
                                        </Text>
                                    </Flex>
                                    <Input
                                        value={metaMensalPadrao}
                                        onChange={(e) =>
                                            handleMetaMensalPadraoChange(e.target.value.replace(/\D/g, ''))
                                        }
                                        placeholder="0"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                            </FormControl>
                        </Box>
                    </HStack>

                    {/* Toggle Switch */}
                    <Flex
                        align="center"
                        justify="space-between"
                        p={4}
                        bg="gray.50"
                        rounded="xl"
                        mb={4}
                    >
                        <HStack spacing={3}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                Usar este valor para todos os meses
                            </Text>
                        </HStack>
                        <Switch
                            colorScheme="green"
                            size="lg"
                            isChecked={usarPadrao}
                            onChange={(e) => setUsarPadrao(e.target.checked)}
                        />
                    </Flex>

                    {/* Helper text or Monthly grid */}
                    {usarPadrao ? (
                        <Flex
                            align="flex-start"
                            gap={2}
                            p={4}
                            bg="green.50"
                            rounded="xl"
                        >
                            <Icon as={FiInfo} boxSize={4} color="green.500" mt={0.5} flexShrink={0} />
                            <Text fontSize="sm" color="gray.800">
                                Todos os meses de 2025 terão a meta de{' '}
                                <Text as="span" fontWeight="semibold" color="green.600">
                                    R$ {formatCurrency(metaMensalPadrao)}
                                </Text>
                            </Text>
                        </Flex>
                    ) : (
                        <VStack spacing={3} align="stretch">
                            <Text fontSize="sm" color="gray.600" mb={1}>
                                Personalize a meta de cada mês individualmente:
                            </Text>
                            <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
                                {months.map((month) => (
                                    <FormControl key={month}>
                                        <FormLabel fontSize="xs" fontWeight="medium" color="gray.600" mb={1.5}>
                                            {month}
                                        </FormLabel>
                                        <HStack spacing={0}>
                                            <Flex
                                                align="center"
                                                justify="center"
                                                px={3}
                                                h="40px"
                                                bg="gray.50"
                                                roundedLeft="lg"
                                                borderY="1px"
                                                borderLeft="1px"
                                                borderColor="gray.200"
                                            >
                                                <Text fontSize="xs" color="gray.600">
                                                    R$
                                                </Text>
                                            </Flex>
                                            <Input
                                                value={metasMensais[month]}
                                                onChange={(e) =>
                                                    handleMetaMensalChange(month, e.target.value.replace(/\D/g, ''))
                                                }
                                                placeholder="0"
                                                bg="gray.50"
                                                border="1px"
                                                borderColor="gray.200"
                                                roundedRight="lg"
                                                roundedLeft="none"
                                                h="40px"
                                                fontSize="sm"
                                                fontWeight="medium"
                                                _focus={{
                                                    borderColor: 'green.400',
                                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                                }}
                                            />
                                        </HStack>
                                    </FormControl>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    )}

                    {/* Save Button */}
                    <HStack justify="flex-end" mt={8}>
                        <Button
                            leftIcon={<Icon as={FiSave} />}
                            colorScheme="green"
                            bg="green.400"
                            color="white"
                            size="lg"
                            px={6}
                            rounded="xl"
                            fontWeight="medium"
                            shadow="lg"
                            _hover={{
                                bg: 'green.500',
                                transform: 'translateY(-2px)',
                                shadow: 'xl',
                            }}
                            transition="all 0.2s"
                            onClick={handleSave}
                        >
                            Salvar Metas
                        </Button>
                    </HStack>
                </CardBody>
            </Card>
        </Box>
    )
}

export default SettingsGoals
