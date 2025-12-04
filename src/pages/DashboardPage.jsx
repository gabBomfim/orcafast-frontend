import { useState } from 'react'
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import {
  FiPlus,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiMessageSquare,
} from 'react-icons/fi'

// Components
import Container from '../components/layout/Container'
import ActionCard from '../components/ui/ActionCard'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import StatusBadge from '../components/ui/StatusBadge'

// Mock data
import { dashboardStats, userInfo, monthlyGrowth } from '../mock/stats'
import { recentProposals } from '../mock/propostas'

const DashboardPage = () => {
  const [stats] = useState(dashboardStats)
  const [proposals] = useState(recentProposals)

  return (
    <Container>
      {/* Welcome Section */}
      <VStack align="stretch" spacing={8}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" color="gray.700" mb={2}>
            {userInfo.greeting}
          </Text>
          <Text color="gray.500" fontSize="lg">
            Você já faturou{' '}
            <Text as="span" fontWeight="semibold" color="emerald.500">
              R$ {stats.totalRevenue.toLocaleString('pt-BR')}
            </Text>{' '}
            este mês
          </Text>
        </Box>

        {/* Quick Actions */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <ActionCard
            icon={FiPlus}
            title="Novo Orçamento"
            subtitle="Criar em 3 cliques"
            to="/dashboard/propostas/nova"
            variant="dashed"
          />
          <ActionCard
            icon={FiUsers}
            title="Clientes"
            subtitle="Gerenciar contatos"
            to="/dashboard/clientes"
          />
          <ActionCard
            icon={FiFileText}
            title="Orçamentos"
            subtitle="Ver todas"
            to="/dashboard/propostas"
          />
        </Grid>

        {/* Stats Cards */}
        <Grid 
          templateColumns={{ 
            base: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }} 
          gap={6}
        >
          <StatsCard
            title="Total Faturado"
            value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
            helpText={
              <HStack spacing={1}>
                <Icon as={FiTrendingUp} boxSize={3} />
                <span>+{monthlyGrowth.revenue}% este mês</span>
              </HStack>
            }
            icon={FiDollarSign}
            colorScheme="primary"
          />
          
          <StatsCard
            title="Orçamentos Aprovados"
            value={stats.approvedProposals}
            helpText={`Taxa de ${Math.round((stats.approvedProposals / stats.totalProposals) * 100)}% de aprovação`}
            icon={FiCheckCircle}
            colorScheme="green"
          />
          
          <StatsCard
            title="Visualizadas"
            value={stats.viewedProposals}
            helpText={`${stats.totalProposals - stats.viewedProposals} ainda não visualizadas`}
            icon={FiEye}
            colorScheme="blue"
          />
          
          <StatsCard
            title="Pendentes"
            value={stats.pendingProposals}
            helpText="Aguardando resposta"
            icon={FiClock}
            colorScheme="yellow"
          />
        </Grid>

        {/* Recent Proposals */}
        <DataCard
          title="Orçamentos Recentes"
          subtitle="Seus últimos orçamentos enviados"
          headerAction={
            <Button
              as={Link}
              to="/dashboard/propostas"
              variant="outline"
              size="sm"
            >
              Ver Todas
            </Button>
          }
        >
          <VStack spacing={4}>
            {proposals.map((proposal) => (
              <Box
                key={proposal.id}
                w="full"
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="lg"
                bg="white"
                _hover={{ bg: 'gray.50' }}
                transition="background 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <Box flex="1">
                    <HStack spacing={3} mb={1}>
                      <Text fontWeight="medium">{proposal.client}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {proposal.service}
                    </Text>
                  </Box>
                  
                  <HStack spacing={4}>
                    <Box textAlign="right">
                      <Text fontWeight="semibold" color="emerald.500">
                        R$ {proposal.value.toLocaleString('pt-BR')}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {proposal.createdAt}
                      </Text>
                    </Box>
                    
                    <StatusBadge status={proposal.status} />
                    
                    <Button variant="ghost" size="sm">
                      <Icon as={FiMessageSquare} />
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </DataCard>
      </VStack>
    </Container>
  )
}

export default DashboardPage
