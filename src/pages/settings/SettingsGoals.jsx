import { useState, useEffect } from 'react'
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
    Spinner,
    Select,
    useToast,
} from '@chakra-ui/react'
import { FiTarget, FiCalendar, FiSave, FiInfo, FiLock } from 'react-icons/fi'
import { useSubscription } from '../../hooks/useSubscription'
import { goalsService } from '../../services'

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const CURRENT_YEAR = new Date().getFullYear()
// Allow selecting current year and the two surrounding years
const YEAR_OPTIONS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]

/** Parse a server value (string|number|null) to a plain integer string for inputs */
const toInputStr = (v) => (v != null ? String(Math.round(Number(v))) : '0')

/** Build 12-element monthly array from the custom targets (array) or fill with a default */
const buildMonthlyArray = (customArr, defaultVal = '0') => {
    if (Array.isArray(customArr) && customArr.length === 12) {
        return customArr.map((v) => toInputStr(v))
    }
    return MONTHS.map(() => String(defaultVal))
}

const formatCurrency = (value) => {
    const num = parseFloat(value) || 0
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const SettingsGoals = () => {
    const { canSetFinancialGoals } = useSubscription()
    const toast = useToast()

    const [year, setYear] = useState(CURRENT_YEAR)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [metaAnual, setMetaAnual] = useState('0')
    const [metaMensalPadrao, setMetaMensalPadrao] = useState('0')
    const [usarPadrao, setUsarPadrao] = useState(true)           // true = NOT custom
    const [metasMensais, setMetasMensais] = useState(
        MONTHS.map(() => '0')                                    // indexed array
    )

    // ─── Load goals whenever year changes ───────────────────────────────────────
    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setIsLoadingData(true)
            try {
                const { data } = await goalsService.get(year)
                if (cancelled) return

                const defaultVal = toInputStr(data.monthly_target_default)
                setMetaAnual(toInputStr(data.annual_target))
                setMetaMensalPadrao(defaultVal)
                setUsarPadrao(!data.is_monthly_custom)
                setMetasMensais(
                    data.is_monthly_custom
                        ? buildMonthlyArray(data.monthly_targets_custom, defaultVal)
                        : MONTHS.map(() => defaultVal)
                )
            } catch (err) {
                if (cancelled) return
                toast({
                    title: 'Erro ao carregar metas',
                    description: err.response?.data?.message || 'Tente novamente',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            } finally {
                if (!cancelled) setIsLoadingData(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [year])

    // ─── Handlers ────────────────────────────────────────────────────────────────
    const handleMetaMensalPadraoChange = (value) => {
        const clean = value.replace(/\D/g, '')
        setMetaMensalPadrao(clean)
        if (usarPadrao) {
            setMetasMensais(MONTHS.map(() => clean))
        }
    }

    const handleTogglePadrao = (checked) => {
        setUsarPadrao(checked)
        if (checked) {
            // Reset all months to the default value
            setMetasMensais(MONTHS.map(() => metaMensalPadrao))
        }
    }

    const handleMetaMensalChange = (idx, value) => {
        const clean = value.replace(/\D/g, '')
        setMetasMensais((prev) => {
            const next = [...prev]
            next[idx] = clean
            return next
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const payload = {
                year,
                annual_target: Number(metaAnual) || 0,
                monthly_target_default: Number(metaMensalPadrao) || 0,
                is_monthly_custom: !usarPadrao,
                ...((!usarPadrao) && {
                    monthly_targets_custom: metasMensais.map((v) => Number(v) || 0),
                }),
            }

            await goalsService.save(payload)

            toast({
                title: 'Metas salvas com sucesso!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.upgrade_required) {
                toast({
                    title: 'Plano não inclui este recurso',
                    description: 'Faça upgrade para o plano Pro ou Business para definir metas financeiras.',
                    status: 'warning',
                    duration: 6000,
                    isClosable: true,
                })
                return
            }
            toast({
                title: 'Erro ao salvar metas',
                description: err.response?.data?.message || 'Verifique os dados e tente novamente',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setIsSaving(false)
        }
    }

    // ─── Loading state ───────────────────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <Flex h="300px" align="center" justify="center">
                <Spinner size="xl" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    return (
        <Box maxW="2xl" mx="auto" p={6}>
            {/* Header */}
            <HStack justify="space-between" align="flex-start" mb={8} wrap="wrap" gap={4}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        Metas Financeiras
                    </Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                        Defina suas metas de faturamento para acompanhar seu progresso
                    </Text>
                </Box>

                {/* Year selector */}
                <Select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    w="120px"
                    size="sm"
                    rounded="lg"
                    borderColor="gray.200"
                    bg="white"
                    fontWeight="medium"
                >
                    {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </Select>
            </HStack>

            <Box position="relative">
                {/* Plan gate overlay */}
                {!canSetFinancialGoals && (
                    <Flex
                        position="absolute"
                        top={0} left={0} right={0} bottom={0}
                        bg="whiteAlpha.600"
                        zIndex={20}
                        align="center"
                        justify="center"
                        borderRadius="2xl"
                        backdropFilter="blur(3px)"
                    >
                        <VStack spacing={4} bg="white" p={8} borderRadius="2xl" shadow="xl" border="1px" borderColor="gray.100" maxW="sm" textAlign="center">
                            <Box p={3} bg="emerald.50" borderRadius="xl">
                                <Icon as={FiLock} color="emerald.500" boxSize={8} />
                            </Box>
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                                    Metas Financeiras
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Acesse o plano Pro ou Business para definir metas de faturamento e acompanhar seu progresso.
                                </Text>
                            </Box>
                            <Button
                                w="full"
                                colorScheme="emerald"
                                onClick={() => window.open('https://orcafast.com.br/precos', '_blank')}
                            >
                                Fazer Upgrade
                            </Button>
                        </VStack>
                    </Flex>
                )}

                {/* Annual Goal Card */}
                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200" mb={4}>
                    <CardBody p={6}>
                        <HStack align="flex-start" spacing={4}>
                            <Flex w="48px" h="48px" bg="green.50" rounded="xl" align="center" justify="center" flexShrink={0}>
                                <Icon as={FiTarget} boxSize={6} color="green.500" />
                            </Flex>
                            <Box flex={1}>
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.800" mb={1}>
                                        Meta Anual ({year})
                                    </FormLabel>
                                    <Text fontSize="xs" color="gray.600" mb={3}>
                                        Quanto você deseja faturar em todo o ano
                                    </Text>
                                    <HStack spacing={0}>
                                        <Flex align="center" justify="center" px={4} h="48px" bg="gray.50"
                                            roundedLeft="xl" borderY="1px" borderLeft="1px" borderColor="gray.200">
                                            <Text fontWeight="medium" color="gray.600">R$</Text>
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
                                            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px var(--chakra-colors-green-400)' }}
                                        />
                                    </HStack>
                                    <Text fontSize="xs" color="gray.600" mt={2}>
                                        Equivale a R$ {formatCurrency((parseFloat(metaAnual) / 12).toString())} por mês em média
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
                            <Flex w="48px" h="48px" bg="green.50" rounded="xl" align="center" justify="center" flexShrink={0}>
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
                                        <Flex align="center" justify="center" px={4} h="48px" bg="gray.50"
                                            roundedLeft="xl" borderY="1px" borderLeft="1px" borderColor="gray.200">
                                            <Text fontWeight="medium" color="gray.600">R$</Text>
                                        </Flex>
                                        <Input
                                            value={metaMensalPadrao}
                                            onChange={(e) => handleMetaMensalPadraoChange(e.target.value)}
                                            placeholder="0"
                                            bg="gray.50"
                                            border="1px"
                                            borderColor="gray.200"
                                            roundedRight="xl"
                                            roundedLeft="none"
                                            h="48px"
                                            fontSize="lg"
                                            fontWeight="semibold"
                                            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px var(--chakra-colors-green-400)' }}
                                        />
                                    </HStack>
                                </FormControl>
                            </Box>
                        </HStack>

                        {/* Toggle */}
                        <Flex align="center" justify="space-between" p={4} bg="gray.50" rounded="xl" mb={4}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                Usar este valor para todos os meses
                            </Text>
                            <Switch
                                colorScheme="green"
                                size="lg"
                                isChecked={usarPadrao}
                                onChange={(e) => handleTogglePadrao(e.target.checked)}
                            />
                        </Flex>

                        {/* Info or per-month grid */}
                        {usarPadrao ? (
                            <Flex align="flex-start" gap={2} p={4} bg="green.50" rounded="xl">
                                <Icon as={FiInfo} boxSize={4} color="green.500" mt={0.5} flexShrink={0} />
                                <Text fontSize="sm" color="gray.800">
                                    Todos os meses de {year} terão a meta de{' '}
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
                                    {MONTHS.map((month, idx) => (
                                        <FormControl key={month}>
                                            <FormLabel fontSize="xs" fontWeight="medium" color="gray.600" mb={1.5}>
                                                {month}
                                            </FormLabel>
                                            <HStack spacing={0}>
                                                <Flex align="center" justify="center" px={3} h="40px" bg="gray.50"
                                                    roundedLeft="lg" borderY="1px" borderLeft="1px" borderColor="gray.200">
                                                    <Text fontSize="xs" color="gray.600">R$</Text>
                                                </Flex>
                                                <Input
                                                    value={metasMensais[idx]}
                                                    onChange={(e) => handleMetaMensalChange(idx, e.target.value)}
                                                    placeholder="0"
                                                    bg="gray.50"
                                                    border="1px"
                                                    borderColor="gray.200"
                                                    roundedRight="lg"
                                                    roundedLeft="none"
                                                    h="40px"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px var(--chakra-colors-green-400)' }}
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
                                _hover={{ bg: 'green.500', transform: 'translateY(-2px)', shadow: 'xl' }}
                                transition="all 0.2s"
                                onClick={handleSave}
                                isLoading={isSaving}
                                loadingText="Salvando..."
                            >
                                Salvar Metas
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>
            </Box>
        </Box>
    )
}

export default SettingsGoals
