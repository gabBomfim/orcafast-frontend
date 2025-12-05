import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  Card,
  CardBody,
  Progress,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiTrendingUp,
  FiTarget,
  FiBarChart,
  FiChevronDown,
} from 'react-icons/fi'

// Components
import Container from '../components/layout/Container'

// Mock data
import { dashboardStats, userInfo } from '../mock/stats'
import { useAuth } from '../hooks/useAuth'

const DashboardPage = () => {
  const { getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const [selectedPeriod, setSelectedPeriod] = useState('this-month')
  const { isOpen: isPeriodOpen, onToggle: onPeriodToggle } = useDisclosure()

  // Mock data - manter estrutura existente
  const stats = dashboardStats
  
  // Dados calculados
  const faturamento = stats.totalRevenue || 15420.0
  const metaMensal = 20000.0
  const metaAnual = 240000.0
  const faturamentoAnual = 108000.0 // Mock - pode vir de API
  
  const progressoMeta = (faturamento / metaMensal) * 100
  const faltaParaMeta = metaMensal - faturamento
  const progressoAnual = (faturamentoAnual / metaAnual) * 100
  
  const isYearlyView = selectedPeriod === 'this-year'
  const currentMeta = isYearlyView ? metaAnual : metaMensal
  const currentFaturamento = isYearlyView ? faturamentoAnual : faturamento
  const currentProgresso = isYearlyView ? progressoAnual : progressoMeta
  const currentFalta = currentMeta - currentFaturamento

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('pt-BR', { month: 'long' })
  }

  const getCurrentYear = () => {
    return new Date().getFullYear()
  }

  const getMetaTitle = () => {
    if (isYearlyView) {
      return `Meta de ${getCurrentYear()}`
    }
    const monthName = getCurrentMonthName()
    return `Meta de ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`
  }

  const periodOptions = [
    { value: 'this-month', label: 'Este Mês' },
    { value: 'last-month', label: 'Mês Passado' },
    { value: 'this-year', label: 'Este Ano' },
    { value: 'custom', label: 'Personalizado' },
  ]

  // Funil de vendas - mock data baseado nos stats
  const funnelData = [
    { label: 'Enviados', value: stats.totalProposals || 10, color: 'gray.400', percentage: 100 },
    { label: 'Visualizados', value: stats.viewedProposals || 8, color: 'blue.400', percentage: 80 },
    { label: 'Aprovados', value: stats.approvedProposals || 4, color: 'emerald.500', percentage: 40 },
  ]

  const taxaConversao = stats.totalProposals > 0 
    ? Math.round((stats.approvedProposals / stats.totalProposals) * 100)
    : 0

  const userName = user?.name?.split(' ')[0] || 'Usuário'

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
              Aqui está o resumo do seu negócio
          </Text>
        </Box>

          {/* Period Filter */}
          <Menu isOpen={isPeriodOpen} onClose={onPeriodToggle}>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={FiChevronDown} />}
              variant="outline"
              size="sm"
              onClick={onPeriodToggle}
              borderRadius="xl"
              px={4}
              py={2.5}
              fontSize="sm"
              fontWeight="medium"
            >
              {periodOptions.find((p) => p.value === selectedPeriod)?.label}
            </MenuButton>
            <MenuList borderRadius="xl" py={1}>
              {periodOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => {
                    setSelectedPeriod(option.value)
                    onPeriodToggle()
                  }}
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

        {/* Metrics Cards */}
        <VStack spacing={4} align="stretch">
          {/* Card 1: Faturamento Aprovado */}
          <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
            <CardBody p={6}>
              <Flex align="start" gap={4}>
                <Box
                  w={12}
                  h={12}
                  bg="emerald.50"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiTrendingUp} w={6} h={6} color="emerald.500" />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                    Faturamento Aprovado
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="emerald.500" mt={1}>
                    R$ {currentFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <Box
                  w={12}
                  h={12}
                  bg="emerald.50"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiTarget} w={6} h={6} color="emerald.500" />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                    {getMetaTitle()}
                  </Text>
                  <Text fontSize="sm" color="gray.900" mt={2}>
                    Sua meta:{' '}
                    <Text as="span" fontWeight="semibold">
                      R$ {currentMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                  </Text>

                  {/* Progress bar */}
                  <Box mt={3}>
                    <Box h={3} bg="gray.100" borderRadius="full" overflow="hidden">
                      <Box
                        h="full"
                        borderRadius="full"
                        bg={currentProgresso >= 100 ? 'green.500' : 'emerald.500'}
                        transition="all 0.5s"
                        width={`${Math.min(currentProgresso, 100)}%`}
                      />
                    </Box>
                    <Flex justify="space-between" align="center" mt={2}>
                      <Text fontSize="xs" color="gray.500">
                        {Math.round(currentProgresso)}% concluído
                      </Text>
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        color={currentProgresso >= 100 ? 'green.500' : 'emerald.500'}
                      >
                        R$ {currentFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </Flex>
                  </Box>
                  
                  {/* Motivational text */}
                  {currentFalta > 0 ? (
                    <Box mt={3} bg="emerald.50" px={3} py={2} borderRadius="lg">
                      <Text fontSize="sm" color="gray.900">
                        Faltam apenas{' '}
                        <Text as="span" fontWeight="semibold" color="emerald.600">
                          R$ {currentFalta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>{' '}
                        para bater a meta!
                      </Text>
                    </Box>
                  ) : (
                    <Box mt={3} bg="green.50" px={3} py={2} borderRadius="lg">
                      <Text fontSize="sm" color="gray.900">
                        <Text as="span" fontWeight="semibold" color="green.600">
                          Parabéns!
                        </Text>{' '}
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
                    <Text as="span" fontWeight="medium">
                      Visão Anual:
                    </Text>{' '}
                    Você já atingiu{' '}
                    <Text as="span" fontWeight="semibold" color="gray.900">
                      {Math.round(progressoAnual)}%
                    </Text>{' '}
                    da sua meta de {getCurrentYear()}.
                  </Text>
                </Flex>
              </Box>
            )}
          </Card>

          {/* Card 3: Eficiência dos Orçamentos */}
          <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
            <CardBody p={6}>
              <Flex align="start" gap={4}>
                <Box
                  w={12}
                  h={12}
                  bg="emerald.50"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiBarChart} w={6} h={6} color="emerald.500" />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={4}>
                    Eficiência dos Orçamentos
                  </Text>

                  {/* Horizontal bar chart */}
                  <VStack spacing={4} align="stretch">
                    {funnelData.map((item) => (
                      <Box key={item.label}>
                        <Flex justify="space-between" align="center" mb={1.5}>
                          <Text fontSize="sm" color="gray.900">
                            {item.label}
                          </Text>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                            {item.value}
                          </Text>
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
                      <Text fontSize="sm" color="gray.600">
                        Taxa de conversão
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="emerald.500">
                        {taxaConversao}%
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </VStack>
    </Container>
  )
}

export default DashboardPage
