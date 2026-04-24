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
  Spinner,
  Input,
  Collapse,
  useToast,
  FormControl,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { appSelectStyles } from '../theme/selectStyles'
import {
  FiTrendingUp,
  FiTarget,
  FiBarChart,
  FiStar,
  FiZap,
  FiLock,
  FiFileText,
  FiArrowRight,
  FiClock,
} from 'react-icons/fi'

import Container from '../components/layout/Container'
import { dashboardService, teamUserService, proposalService } from '../services'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'


// ─── Constants ───────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { value: 'this-month', label: 'O que rolou este mês' },
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
  const isAdmin = user?.role === 3 || user?.role === 1
  const isMember = user?.role === 4
  const { isFree, onTrial, trialDaysRemaining, isBusiness } = useSubscription()
  const toast = useToast()

  const [selectedPeriod, setSelectedPeriod] = useState('this-month')
  const [customDates, setCustomDates] = useState({ begin_date: '', end_date: '' })
  const [dateError, setDateError] = useState('')

  const [stats, setStats] = useState(EMPTY_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [periodLabel, setPeriodLabel] = useState('')
  // Verifica se o usuário tem QUALQUER orçamento (incluindo rascunhos do onboarding)
  const [hasAnyProposal, setHasAnyProposal] = useState(null)

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async (period, dates = {}, userIds = []) => {
    setIsLoading(true)
    try {
      const params = { period, ...dates }

      // Axios serializes arrays as user_ids[] automatically with index or brackets
      // but let's be explicit with the keys if needed
      if (userIds.length > 0) {
        params['user_ids[]'] = userIds
      }

      const { data } = await dashboardService.get(params)
      setStats(data)

      // Build a human-readable period label from the API dates
      if (data.period_from && data.period_to) {
        const from = new Date(data.period_from + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        const to = new Date(data.period_to + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        setPeriodLabel(`${from} – ${to}`)
      }
    } catch (err) {
      // 403 de email não verificado é tratado pelo EmailVerificationModal — não mostrar toast
      if (err.response?.status !== 403) {
        toast({
          title: 'Erro ao carregar dashboard',
          description: err.response?.data?.message || 'Tente novamente',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch whenever period or team filter changes
  useEffect(() => {
    if (selectedPeriod === 'custom') {
      if (customDates.begin_date && customDates.end_date) {
        fetchDashboard('custom', customDates, selectedUserIds)
      }
    } else {
      fetchDashboard(selectedPeriod, {}, selectedUserIds)
    }
  }, [selectedPeriod, customDates.begin_date, customDates.end_date, selectedUserIds, fetchDashboard])

  // Verifica se existe ao menos 1 orçamento (qualquer status, inclusive rascunho do onboarding)
  useEffect(() => {
    proposalService.list({ per_page: 1 })
      .then(({ data }) => {
        const total = data?.meta?.total ?? data?.total ?? data?.data?.length ?? 0
        setHasAnyProposal(total > 0)
      })
      .catch(() => setHasAnyProposal(false))
  }, [])

  // Fetch team members if admin AND business
  useEffect(() => {
    if (isAdmin && (isBusiness || onTrial)) {
      teamUserService.list().then(response => {
        const membersList = response.data || []
        setTeamMembers(membersList.map(m => ({
          value: m.id,
          label: m.name
        })))
      }).catch(err => {
        console.error('Erro ao buscar membros da equipe:', err)
      })
    }
  }, [isAdmin, isBusiness])

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
    { label: 'Já mandou', value: totalSent, color: 'gray.400', percentage: 100 },
    { label: 'O cliente já viu', value: proposals.total_viewed ?? 0, color: 'blue.400', percentage: totalSent > 0 ? Math.round(((proposals.total_viewed ?? 0) / totalSent) * 100) : 0 },
    { label: 'Fechados', value: proposals.total_approved ?? 0, color: 'emerald.500', percentage: totalSent > 0 ? Math.round(((proposals.total_approved ?? 0) / totalSent) * 100) : 0 },
  ]

  const getMetaTitle = () => {
    if (isMember) return 'Seu Desempenho'
    if (isYearlyView) return `Seu objetivo para ${new Date().getFullYear()}`
    if (selectedPeriod === 'custom') return 'Objetivo proporcional ao período'
    const m = new Date().toLocaleDateString('pt-BR', { month: 'long' })
    if (selectedPeriod === 'last-month') {
      const d = new Date()
      d.setMonth(d.getMonth() - 1)
      const lm = d.toLocaleDateString('pt-BR', { month: 'long' })
      return `Seu objetivo para ${lm.charAt(0).toUpperCase() + lm.slice(1)}`
    }
    return `Seu objetivo para ${m.charAt(0).toUpperCase() + m.slice(1)}`
  }

  const userName = user?.name?.split(' ')[0] || 'Usuário'

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Container maxW="container.xl">
      <VStack align="stretch" spacing={6}>
        {/* Trial countdown banner */}
        {onTrial && trialDaysRemaining !== null && (
          <Box
            bg={trialDaysRemaining <= 2 ? 'orange.50' : 'emerald.50'}
            border="1px"
            borderColor={trialDaysRemaining <= 2 ? 'orange.200' : 'emerald.200'}
            borderRadius="xl"
            px={4}
            py={3}
          >
            <Flex
              align={{ base: 'flex-start', sm: 'center' }}
              justify="space-between"
              gap={3}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Flex align="center" gap={2}>
                <Icon
                  as={FiClock}
                  color={trialDaysRemaining <= 2 ? 'orange.500' : 'emerald.600'}
                  flexShrink={0}
                />
                <Text fontSize="sm" color={trialDaysRemaining <= 2 ? 'orange.800' : 'emerald.800'}>
                  {trialDaysRemaining === 0
                    ? 'Seu teste gratuito termina hoje!'
                    : `Seu teste gratuito termina em ${trialDaysRemaining} dia${trialDaysRemaining > 1 ? 's' : ''}.`
                  }{' '}
                  Garanta seu acesso para continuar profissionalizando seu negócio e lucrar mais! 🚀
                </Text>
              </Flex>
              <Button
                as={Link}
                to="/dashboard/configuracoes/assinatura"
                size="sm"
                bg={trialDaysRemaining <= 2 ? 'orange.500' : 'emerald.500'}
                color="white"
                _hover={{ bg: trialDaysRemaining <= 2 ? 'orange.600' : 'emerald.600' }}
                borderRadius="lg"
                fontWeight="semibold"
                flexShrink={0}
              >
                Escolher plano
              </Button>
            </Flex>
          </Box>
        )}

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

          {/* Filters */}
          <HStack spacing={3} w={{ base: 'full', sm: 'auto' }} flexWrap="wrap">
            {isAdmin && teamMembers.length > 0 && (
              <Box w={{ base: 'full', sm: '250px' }}>
                <ReactSelect
                  isMulti
                  placeholder="Ver orçamentos do time"
                  closeMenuOnSelect={false}
                  styles={appSelectStyles}
                  options={teamMembers}
                  onChange={(selected) => setSelectedUserIds(selected ? selected.map((s) => s.value) : [])}
                  noOptionsMessage={() => 'Nenhum membro encontrado'}
                  loadingMessage={() => 'Carregando...'}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </Box>
            )}

            <Box w={{ base: 'full', sm: '200px' }}>
              <ReactSelect
                styles={{
                  ...appSelectStyles,
                  control: (p, s) => ({
                    ...appSelectStyles.control(p, s),
                    minHeight: '38px',
                  }),
                }}
                value={PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)}
                onChange={(opt) => setSelectedPeriod(opt?.value || 'this-month')}
                options={PERIOD_OPTIONS}
                isSearchable={false}
                isDisabled={isLoading}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </Box>
          </HStack>
        </Flex>

        {/* Custom date inputs */}
        <Collapse in={selectedPeriod === 'custom'} animateOpacity>
          <HStack spacing={3} p={4} bg="white" rounded="2xl" border="1px" borderColor={dateError ? 'red.300' : 'gray.200'} shadow="sm" align="flex-start">
            <FormControl flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Data início</Text>
              <Input
                type="date"
                size="sm"
                rounded="lg"
                value={customDates.begin_date}
                max={customDates.end_date || undefined}
                onChange={(e) => {
                  const newStart = e.target.value
                  if (customDates.end_date && newStart > customDates.end_date) {
                    setDateError('Data inicial não pode ser maior que a data final')
                  } else {
                    setDateError('')
                  }
                  setCustomDates((prev) => ({ ...prev, begin_date: newStart }))
                }}
              />
            </FormControl>
            <FormControl flex={1} isInvalid={!!dateError}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Data fim</Text>
              <Input
                type="date"
                size="sm"
                rounded="lg"
                value={customDates.end_date}
                min={customDates.begin_date || undefined}
                onChange={(e) => {
                  const newEnd = e.target.value
                  if (customDates.begin_date && newEnd < customDates.begin_date) {
                    setDateError('Data final não pode ser menor que a data inicial')
                  } else {
                    setDateError('')
                  }
                  setCustomDates((prev) => ({ ...prev, end_date: newEnd }))
                }}
              />
              {dateError && <FormErrorMessage fontSize="xs">{dateError}</FormErrorMessage>}
            </FormControl>
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
            {!isMember && (
              <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
                <CardBody p={6}>
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'center', md: 'start' }}
                    gap={4}
                    textAlign={{ base: 'center', md: 'left' }}
                  >
                    <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                      <Icon as={FiTrendingUp} w={6} h={6} color="emerald.500" />
                    </Box>

                    <Box flex={1} w="full">
                      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                        Orçamentos fechados
                      </Text>
                      {totalSent > 0 ? (
                        <>
                          <Text fontSize="3xl" fontWeight="bold" color="emerald.500" mt={1}>
                            R$ {fmt(revenue)}
                          </Text>
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            Total dos orçamentos que você marcou como fechados.
                          </Text>
                        </>
                      ) : (
                        <Box mt={3}>
                          <Text fontSize="3xl" fontWeight="bold" color="gray.300">R$ 0,00</Text>
                          <Box mt={4} p={5} bg="emerald.50" rounded="2xl" border="1px" borderColor="emerald.100">
                            <Flex
                              direction={{ base: 'column', md: 'row' }}
                              align={{ base: 'center', md: 'start' }}
                              textAlign={{ base: 'center', md: 'left' }}
                              gap={4}
                            >
                              <Box
                                w={12} h={12}
                                bg="emerald.100"
                                rounded="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                              >
                                <Icon as={FiFileText} w={6} h={6} color="emerald.600" />
                              </Box>
                              <Box flex={1}>
                                {selectedUserIds.length > 0 ? (
                                  <>
                                    <Text fontSize="md" fontWeight="bold" color="gray.900">
                                      Nenhum faturamento encontrado
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mt={1}>
                                      O(s) membro(s) selecionado(s) ainda não possui(em) orçamentos aprovados neste período.
                                    </Text>
                                  </>
                                ) : hasAnyProposal === null ? (
                                  // ainda checando — mostra estado neutro sem piscar
                                  <Box h="60px" />
                                ) : hasAnyProposal ? (
                                  <>
                                    <Text fontSize="md" fontWeight="bold" color="gray.900">
                                      Nenhum faturamento neste período
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mt={1}>
                                      Você tem orçamentos criados. Envie-os para os clientes e acompanhe o faturamento aqui.
                                    </Text>
                                    <Button
                                      as={Link}
                                      to="/dashboard/propostas"
                                      variant="solid"
                                      size="md"
                                      height="40px"
                                      minW="120px"
                                      mt={4}
                                      w={{ base: 'full', md: 'auto' }}
                                      leftIcon={<Icon as={FiFileText} />}
                                      rightIcon={<Icon as={FiArrowRight} />}
                                    >
                                      Ver meus orçamentos
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Text fontSize="md" fontWeight="bold" color="gray.900">
                                      Comece a faturar agora
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mt={1}>
                                      Crie seu primeiro orçamento e acompanhe seu faturamento em tempo real.
                                    </Text>
                                    <Button
                                      as={Link}
                                      to="/dashboard/propostas/nova"
                                      variant="solid"
                                      size="md"
                                      height="40px"
                                      minW="120px"
                                      mt={4}
                                      w={{ base: 'full', md: 'auto' }}
                                      leftIcon={<Icon as={FiZap} />}
                                      rightIcon={<Icon as={FiArrowRight} />}
                                    >
                                      Criar primeiro orçamento
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </Flex>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            )}

            {/* Card 2: Meta / Performance */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
              <CardBody p={6}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align={{ base: 'center', md: 'start' }}
                  gap={4}
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={isMember ? FiTrendingUp : FiTarget} w={6} h={6} color="emerald.500" />
                  </Box>
                  <Box flex={1} w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                      {getMetaTitle()}
                    </Text>

                    {isMember ? (
                      // MEMBER PERFORMANCE VIEW
                      <VStack align="stretch" spacing={4} mt={3}>
                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={1}>Faturamento no período</Text>
                          <Text fontSize="2xl" fontWeight="bold" color="emerald.500">
                            R$ {fmt(revenue)}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={2}>Taxa de conversão atual</Text>
                          <Box h={3} bg="gray.100" borderRadius="full" overflow="hidden">
                            <Box
                              h="full"
                              borderRadius="full"
                              bg="blue.400"
                              transition="all 0.5s"
                              width={`${stats.proposals.conversion_rate ?? 0}%`}
                            />
                          </Box>
                          <Flex justify="space-between" align="center" mt={2}>
                            <Text fontSize="xs" color="gray.500">
                              {Math.round(stats.proposals.conversion_rate ?? 0)}% orçamentos aprovadas
                            </Text>
                            <Text fontSize="xs" fontWeight="medium" color="blue.500">
                              {stats.proposals.total_approved ?? 0} aprovadas
                            </Text>
                          </Flex>
                        </Box>

                        <Box p={3} bg="blue.50" borderRadius="lg">
                          <Text fontSize="xs" color="blue.700">
                            Continue enviando orçamentos para aumentar suas conversões! 🚀
                          </Text>
                        </Box>
                      </VStack>
                    ) : (
                      // ADMIN META VIEW
                      <>
                        {!target || target <= 0 ? (
                          // EMPTY STATE
                          <Box mt={4} textAlign="center" py={6}>
                            {isFree ? (
                              <>
                                <Flex w={16} h={16} bg="orange.100" rounded="2xl" align="center" justify="center" mx="auto" mb={4}>
                                  <Icon as={FiLock} w={8} h={8} color="orange.600" />
                                </Flex>
                                <Text fontSize="md" fontWeight="semibold" color="gray.900">Metas Financeiras</Text>
                                <Text fontSize="sm" color="gray.500" mt={2} maxW="xs" mx="auto">
                                  Defina objetivos mensais e anuais para acompanhar o crescimento do seu negócio.
                                </Text>
                                <Button
                                  as={Link}
                                  to="/dashboard/configuracoes/assinatura"
                                  variant="outline"
                                  size="md"
                                  height="40px"
                                  minW="120px"
                                  mt={4}
                                  fontWeight="medium"
                                  rounded="lg"
                                  borderColor="orange.300"
                                  color="orange.700"
                                  _hover={{ bg: 'orange.50' }}
                                  leftIcon={<Icon as={FiStar} w={4} h={4} />}
                                >
                                  Fazer Upgrade para o Pro
                                </Button>
                              </>
                            ) : (
                              <>
                                <Flex w={16} h={16} bg="emerald.50" rounded="2xl" align="center" justify="center" mx="auto" mb={4}>
                                  <Icon as={FiTarget} w={8} h={8} color="emerald.500" />
                                </Flex>
                                <Text fontSize="md" fontWeight="semibold" color="gray.900">Quanto você quer ganhar este mês?</Text>
                                <Text fontSize="sm" color="gray.500" mt={2} maxW="xs" mx="auto">
                                  Coloque o seu objetivo de lucro pra gente te ajudar a acompanhar.
                                </Text>
                                <Button
                                  as={Link}
                                  to="/dashboard/configuracoes/metas"
                                  size="md"
                                  height="40px"
                                  minW="120px"
                                  mt={4}
                                  bg="emerald.500"
                                  color="white"
                                  _hover={{ bg: 'emerald.600' }}
                                  fontWeight="medium"
                                  rounded="lg"
                                  rightIcon={<Icon as={FiArrowRight} w={4} h={4} />}
                                >
                                  Bora crescer!
                                </Button>
                              </>
                            )}
                          </Box>
                        ) : (
                          // FILLED STATE
                          <>
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
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Flex>
              </CardBody>

              {/* Annual Vision Footer - ONLY SHOW FOR ADMINS AND IF TARGET > 0 */}
              {isAdmin && target > 0 && !isYearlyView && (
                <Box px={6} py={4} bg="gray.50" borderTop="1px" borderColor="gray.200">
                  <Flex align="center" gap={2}>
                    <Icon as={FiTrendingUp} w={4} h={4} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="medium">Visão anual:</Text>{' '}
                      Você já atingiu{' '}
                      <Text as="span" fontWeight="semibold" color="gray.900">
                        {annualProg}%
                      </Text>{' '}
                      do seu objetivo para {new Date().getFullYear()}.
                    </Text>
                  </Flex>
                </Box>
              )}
            </Card>

            {/* Card 3: Funil */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align={{ base: 'center', md: 'start' }}
                  gap={4}
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  <Box w={12} h={12} bg="emerald.50" borderRadius="xl"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={FiBarChart} w={6} h={6} color="emerald.500" />
                  </Box>
                  <Box flex={1} w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={4}>
                      Como andam seus negócios
                    </Text>

                    {totalSent > 0 ? (
                      <>
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
                            <Text fontSize="sm" color="gray.600">Sua média de fechamento</Text>
                            <Text fontSize="lg" fontWeight="bold" color="emerald.500">
                              {Math.round(proposals.conversion_rate ?? 0)}%
                            </Text>
                          </Flex>
                        </Box>
                      </>
                    ) : (
                      // EMPTY FUNNEL STATE
                      <Box mt={4} textAlign="center" py={6}>
                        <Flex w={16} h={16} bg="gray.100" rounded="2xl" align="center" justify="center" mx="auto" mb={4}>
                          <Icon as={FiBarChart} w={8} h={8} color="gray.400" />
                        </Flex>
                        <Text fontSize="md" fontWeight="semibold" color="gray.900">Sem dados ainda</Text>
                        <Text fontSize="sm" color="gray.500" mt={2} maxW="xs" mx="auto">
                          Envie orçamentos para ver suas métricas de conversão e eficiência.
                        </Text>
                        <Flex align="center" justify="center" gap={6} mt={6}>
                          <Flex align="center" gap={1.5}>
                            <Box w={2.5} h={2.5} rounded="full" bg="gray.400" />
                            <Text fontSize="xs" color="gray.500">Já mandou</Text>
                          </Flex>
                          <Flex align="center" gap={1.5}>
                            <Box w={2.5} h={2.5} rounded="full" bg="blue.400" />
                            <Text fontSize="xs" color="gray.500">O cliente já viu</Text>
                          </Flex>
                          <Flex align="center" gap={1.5}>
                            <Box w={2.5} h={2.5} rounded="full" bg="emerald.500" />
                            <Text fontSize="xs" color="gray.500">Fechados</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    )}
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
