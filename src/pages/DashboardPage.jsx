import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  Card,
  CardBody,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Spinner,
  Input,
  Collapse,
  useToast,
} from '@chakra-ui/react'
import {
  FiTrendingUp,
  FiTarget,
  FiBarChart,
  FiChevronDown,
} from 'react-icons/fi'

import Container from '../components/layout/Container'
import { dashboardService } from '../services'
import { useAuth } from '../hooks/useAuth'

// ─── Constants ───────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { value: 'this-month', label: 'Este Mês' },
  { value: 'last-month', label: 'Mês Passado' },
  { value: 'this-year', label: 'Este Ano' },
  { value: 'custom', label: 'Personalizado' },
]

const fmt = (val) =>
  (val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

// ─── Empty / default API shape (shown while loading) ─────────────────────────
const EMPTY_STATS = {
  revenue: { total: 0, annual_total: 0 },
  goal: { target: 0, annual_target: 0, progress: 0, annual_progress: 0, remaining: 0 },
  proposals: { total_sent: 0, total_viewed: 0, total_approved: 0, total_rejected: 0, conversion_rate: 0 },
}

// ─── Component ───────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const toast = useToast()

  const [selectedPeriod, setSelectedPeriod] = useState('this-month')
  const [customDates, setCustomDates] = useState({ begin_date: '', end_date: '' })

  const [stats, setStats] = useState(EMPTY_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [periodLabel, setPeriodLabel] = useState('')

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async (period, dates = {}) => {
    setIsLoading(true)
    try {
      const params = { period, ...dates }
      const { data } = await dashboardService.get(params)
      setStats(data)

      // Build a human-readable period label from the API dates
      if (data.period_from && data.period_to) {
        const from = new Date(data.period_from + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        const to = new Date(data.period_to + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        setPeriodLabel(`${from} – ${to}`)
      }
    } catch (err) {
      toast({
        title: 'Erro ao carregar dashboard',
        description: err.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch whenever period changes (but wait for both dates to be filled on custom)
  useEffect(() => {
    if (selectedPeriod === 'custom') {
      if (customDates.begin_date && customDates.end_date) {
        fetchDashboard('custom', customDates)
      }
    } else {
      fetchDashboard(selectedPeriod)
    }
  }, [selectedPeriod, customDates.begin_date, customDates.end_date, fetchDashboard])

  // ─── Derived values ──────────────────────────────────────────────────────────
  const isYearlyView = selectedPeriod === 'this-year'

  const revenue = isYearlyView ? stats.revenue.annual_total : stats.revenue.total
  const target = stats.goal.target
  const progress = Math.min(stats.goal.progress ?? 0, 100)
  const remaining = stats.goal.remaining ?? 0
  const annualProg = Math.round(stats.goal.annual_progress ?? 0)

  const proposals = stats.proposals
  const totalSent = proposals.total_sent ?? 0
  const funnelData = [
    { label: 'Enviados', value: totalSent, color: 'gray.400', percentage: 100 },
    { label: 'Visualizados', value: proposals.total_viewed ?? 0, color: 'blue.400', percentage: totalSent > 0 ? Math.round(((proposals.total_viewed ?? 0) / totalSent) * 100) : 0 },
    { label: 'Aprovados', value: proposals.total_approved ?? 0, color: 'emerald.500', percentage: totalSent > 0 ? Math.round(((proposals.total_approved ?? 0) / totalSent) * 100) : 0 },
  ]

  const getMetaTitle = () => {
    if (isYearlyView) return `Meta de ${new Date().getFullYear()}`
    const m = new Date().toLocaleDateString('pt-BR', { month: 'long' })
    if (selectedPeriod === 'last-month') {
      const d = new Date()
      d.setMonth(d.getMonth() - 1)
      const lm = d.toLocaleDateString('pt-BR', { month: 'long' })
      return `Meta de ${lm.charAt(0).toUpperCase() + lm.slice(1)}`
    }
    return `Meta de ${m.charAt(0).toUpperCase() + m.slice(1)}`
  }

  const userName = user?.name?.split(' ')[0] || 'Usuário'

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Container maxW="container.xl">
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          gap={4}
          mb={2}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>
              Olá, {userName}!
            </Text>
            <Text color="gray.600" fontSize="sm">
              {periodLabel || 'Carregando período...'}
            </Text>
          </Box>

          {/* Period Filter */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={FiChevronDown} />}
              variant="outline"
              size="sm"
              borderRadius="xl"
              px={4}
              py={2.5}
              fontSize="sm"
              fontWeight="medium"
              isDisabled={isLoading}
            >
              {PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label}
            </MenuButton>
            <MenuList borderRadius="xl" py={1}>
              {PERIOD_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  bg={selectedPeriod === option.value ? 'emerald.50' : 'transparent'}
                  color={selectedPeriod === option.value ? 'emerald.600' : 'gray.900'}
                  fontWeight={selectedPeriod === option.value ? 'medium' : 'normal'}
                  _hover={{ bg: 'gray.50' }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        {/* Custom date inputs */}
        <Collapse in={selectedPeriod === 'custom'} animateOpacity>
          <HStack spacing={3} p={4} bg="white" rounded="2xl" border="1px" borderColor="gray.200" shadow="sm">
            <Box flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Data início</Text>
              <Input
                type="date"
                size="sm"
                rounded="lg"
                value={customDates.begin_date}
                onChange={(e) => setCustomDates((prev) => ({ ...prev, begin_date: e.target.value }))}
              />
            </Box>
            <Box flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Data fim</Text>
              <Input
                type="date"
                size="sm"
                rounded="lg"
                value={customDates.end_date}
                onChange={(e) => setCustomDates((prev) => ({ ...prev, end_date: e.target.value }))}
              />
            </Box>
          </HStack>
        </Collapse>

        {/* Loading overlay */}
        {isLoading && (
          <Flex justify="center" py={8}>
            <Spinner size="xl" color="emerald.500" thickness="3px" />
          </Flex>
        )}

        {/* Metrics Cards */}
        {!isLoading && (
          <VStack spacing={4} align="stretch">
            {/* Card 1: Faturamento */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <Flex align="start" gap={4}>
                  <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={FiTrendingUp} w={6} h={6} color="emerald.500" />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                      Faturamento Aprovado
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="emerald.500" mt={1}>
                      R$ {fmt(revenue)}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Baseado em propostas aprovadas neste período
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {/* Card 2: Meta */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
              <CardBody p={6}>
                <Flex align="start" gap={4}>
                  <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={FiTarget} w={6} h={6} color="emerald.500" />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                      {getMetaTitle()}
                    </Text>
                    <Text fontSize="sm" color="gray.900" mt={2}>
                      Sua meta:{' '}
                      <Text as="span" fontWeight="semibold">
                        R$ {fmt(target)}
                      </Text>
                    </Text>

                    {/* Progress bar */}
                    <Box mt={3}>
                      <Box h={3} bg="gray.100" borderRadius="full" overflow="hidden">
                        <Box
                          h="full"
                          borderRadius="full"
                          bg={progress >= 100 ? 'green.500' : 'emerald.500'}
                          transition="all 0.5s"
                          width={`${progress}%`}
                        />
                      </Box>
                      <Flex justify="space-between" align="center" mt={2}>
                        <Text fontSize="xs" color="gray.500">
                          {Math.round(progress)}% concluído
                        </Text>
                        <Text fontSize="xs" fontWeight="medium"
                          color={progress >= 100 ? 'green.500' : 'emerald.500'}>
                          R$ {fmt(revenue)}
                        </Text>
                      </Flex>
                    </Box>

                    {/* Motivational text */}
                    {remaining > 0 ? (
                      <Box mt={3} bg="emerald.50" px={3} py={2} borderRadius="lg">
                        <Text fontSize="sm" color="gray.900">
                          Faltam apenas{' '}
                          <Text as="span" fontWeight="semibold" color="emerald.600">
                            R$ {fmt(remaining)}
                          </Text>{' '}
                          para bater a meta!
                        </Text>
                      </Box>
                    ) : (
                      <Box mt={3} bg="green.50" px={3} py={2} borderRadius="lg">
                        <Text fontSize="sm" color="gray.900">
                          <Text as="span" fontWeight="semibold" color="green.600">Parabéns!</Text>{' '}
                          Você bateu a meta!
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </CardBody>

              {/* Annual Vision Footer */}
              {!isYearlyView && (
                <Box px={6} py={4} bg="gray.50" borderTop="1px" borderColor="gray.200">
                  <Flex align="center" gap={2}>
                    <Icon as={FiTrendingUp} w={4} h={4} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="medium">Visão Anual:</Text>{' '}
                      Você já atingiu{' '}
                      <Text as="span" fontWeight="semibold" color="gray.900">
                        {annualProg}%
                      </Text>{' '}
                      da sua meta de {new Date().getFullYear()}.
                    </Text>
                  </Flex>
                </Box>
              )}
            </Card>

            {/* Card 3: Funil */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <Flex align="start" gap={4}>
                  <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={FiBarChart} w={6} h={6} color="emerald.500" />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={4}>
                      Eficiência dos Orçamentos
                    </Text>

                    <VStack spacing={4} align="stretch">
                      {funnelData.map((item) => (
                        <Box key={item.label}>
                          <Flex justify="space-between" align="center" mb={1.5}>
                            <Text fontSize="sm" color="gray.900">{item.label}</Text>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900">{item.value}</Text>
                          </Flex>
                          <Box h={8} bg="gray.100" borderRadius="lg" overflow="hidden" position="relative">
                            <Box
                              h="full"
                              bg={item.color}
                              borderRadius="lg"
                              transition="all 0.5s"
                              width={`${item.percentage}%`}
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-end"
                              pr={3}
                            >
                              {item.percentage >= 30 && (
                                <Text fontSize="xs" fontWeight="medium" color="white">
                                  {item.percentage}%
                                </Text>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </VStack>

                    {/* Conversion rate */}
                    <Box mt={4} pt={4} borderTop="1px" borderColor="gray.200">
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">Taxa de conversão</Text>
                        <Text fontSize="lg" fontWeight="bold" color="emerald.500">
                          {Math.round(proposals.conversion_rate ?? 0)}%
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </VStack>
        )}
      </VStack>
    </Container>
  )
}

export default DashboardPage
