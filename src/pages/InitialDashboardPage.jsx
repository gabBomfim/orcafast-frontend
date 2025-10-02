import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Icon,
  Card,
  CardBody,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiAward,
  FiEye,
  FiCheckCircle,
  FiDollarSign,
  FiPlus,
  FiUsers,
  FiFileText,
  FiArrowRight,
  FiZap,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ActionCard from '../components/ui/ActionCard'
import StatusBadge from '../components/ui/StatusBadge'
import { storage } from '../utils/storage'

const InitialDashboardPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = storage.getUser()
    setUser(userData)
    setLoading(false)
  }, [])

  if (loading || !user) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  const firstClient = user.clients?.[0]
  const firstProposal = firstClient?.proposals?.[0]

  const stats = {
    sent: firstProposal ? 1 : 0,
    viewed: 0,
    approved: 0,
    totalValue: firstProposal ? parseFloat(firstProposal.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  }

  const proposalStatus = (status) => {
    switch (status) {
      case 1: return 'sent'
      case 2: return 'viewed'
      case 3: return 'approved'
      case 4: return 'rejected'
      default: return 'pending'
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack align="stretch" spacing={8}>
        {/* Header Gamificado */}
        <Box textAlign="center">
          <VStack spacing={4}>
            <HStack spacing={2} justify="center">
              <Icon as={FiAward} color="emerald.500" boxSize={8} />
              <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.900">
                Parabéns, você enviou sua 1ª proposta!
              </Text>
              <Icon as={FiAward} color="emerald.500" boxSize={8} />
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Agora é só acompanhar o progresso. Você será notificado sobre cada etapa.
            </Text>
            <Badge
              colorScheme="emerald"
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
            >
              🚀 Primeiro passo concluído!
            </Badge>
          </VStack>
        </Box>

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          <Card bg="gray.50" border="1px" borderColor="gray.200">
            <CardBody textAlign="center">
              <VStack spacing={2}>
                <Icon as={FiFileText} color="emerald.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">{stats.sent}</Text>
                <Text fontSize="sm" color="gray.600">Propostas Enviadas</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="gray.50" border="1px" borderColor="gray.200">
            <CardBody textAlign="center">
              <VStack spacing={2}>
                <Icon as={FiEye} color="blue.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">{stats.viewed}</Text>
                <Text fontSize="sm" color="gray.600">Visualizadas</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="gray.50" border="1px" borderColor="gray.200">
            <CardBody textAlign="center">
              <VStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">{stats.approved}</Text>
                <Text fontSize="sm" color="gray.600">Aprovadas</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="gray.50" border="1px" borderColor="gray.200">
            <CardBody textAlign="center">
              <VStack spacing={2}>
                <Icon as={FiDollarSign} color="purple.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">{stats.totalValue}</Text>
                <Text fontSize="sm" color="gray.600">Valor Total</Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Recent Proposals Table */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <HStack justify="space-between" align="center">
                <Heading size="md" color="gray.900">Sua Primeira Proposta</Heading>
                <Button as={Link} to="/dashboard" variant="outline" size="sm" rightIcon={<Icon as={FiArrowRight} />}>
                  Ver Todas
                </Button>
              </HStack>

              {firstProposal ? (
                <Box p={4} border="1px" borderColor="gray.200" borderRadius="lg">
                  <HStack justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{firstProposal.title}</Text>
                      <Text fontSize="sm" color="gray.600">Para: {firstClient.name}</Text>
                    </Box>
                    <HStack>
                      <Text fontWeight="semibold" color="emerald.600">
                        {parseFloat(firstProposal.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Text>
                      <StatusBadge status={proposalStatus(firstProposal.status)} />
                    </HStack>
                  </HStack>
                </Box>
              ) : (
                <Text color="gray.500">Nenhuma proposta encontrada.</Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <Heading size="md" color="gray.900">Próximos Passos</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                <ActionCard icon={FiPlus} title="Nova Proposta" subtitle="Criar outra proposta" to="/onboarding/create-client" variant="solid" colorScheme="emerald" />
                <ActionCard icon={FiUsers} title="Clientes" subtitle="Gerenciar seus contatos" to="/dashboard/clientes" />
                <ActionCard icon={FiZap} title="Plano Pro" subtitle="Desbloquear recursos" to="/planos" variant="outline" colorScheme="purple" />
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default InitialDashboardPage
