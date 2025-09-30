import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Icon,
  Grid,
  Card,
  CardBody,
  Heading,
  Button,
  Badge,
  Flex,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react'
import {
  FiAward,
  FiEye,
  FiCheckCircle,
  FiDollarSign,
  FiPlus,
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiArrowRight,
  FiZap,
  FiTrendingUp,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import StatsCard from '../components/ui/StatsCard'
import ActionCard from '../components/ui/ActionCard'

const InitialDashboardPage = () => {
  const toast = useToast()

  const handleNotificationSimulation = () => {
    toast({
      title: 'Cliente abriu sua proposta! 👁️',
      description: 'Você será notificado quando houver novidades.',
      status: 'info',
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Layout>
      <Container maxW="container.xl">
        <VStack align="stretch" spacing={8}>
          {/* Header Gamificado */}
          <Box textAlign="center" py={8}>
            <VStack spacing={4}>
              <HStack spacing={2} justify="center">
                <Icon as={FiAward} color="emerald.500" boxSize={8} />
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                  Parabéns, você enviou sua 1ª proposta
                </Text>
                <Icon as={FiAward} color="emerald.500" boxSize={8} />
              </HStack>

              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Agora é só acompanhar o progresso. Você será notificado quando seu cliente visualizar e aprovar.
              </Text>

              <Badge
                colorScheme="emerald"
                fontSize="sm"
                px={4}
                py={2}
                borderRadius="full"
                mt={2}
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
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    1
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Propostas Enviadas
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="gray.50" border="1px" borderColor="gray.200">
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Icon as={FiEye} color="blue.500" boxSize={6} />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Visualizadas
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="gray.50" border="1px" borderColor="gray.200">
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Icon as={FiCheckCircle} color="green.500" boxSize={6} />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Aprovadas
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="gray.50" border="1px" borderColor="gray.200">
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Icon as={FiDollarSign} color="purple.500" boxSize={6} />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    R$ 0,00
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Valor Total
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Proposals Table */}
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={6}>
                <HStack justify="space-between" align="center">
                  <Heading size="md" color="gray.900">
                    Suas Propostas Recentes
                  </Heading>
                  <Button
                    as={Link}
                    to="/dashboard"
                    variant="outline"
                    size="sm"
                    rightIcon={<Icon as={FiArrowRight} />}
                  >
                    Ver Todas
                  </Button>
                </HStack>

                <Box
                  p={6}
                  border="2px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  borderStyle="dashed"
                  textAlign="center"
                >
                  <VStack spacing={4}>
                    <Icon as={FiFileText} color="gray.400" boxSize={8} />
                    <Text color="gray.600" fontSize="lg">
                      Sua proposta aparecerá aqui assim que for enviada
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Você será notificado quando seu cliente visualizar esta proposta 👁️
                    </Text>

                    <Button
                      colorScheme="emerald"
                      size="sm"
                      onClick={handleNotificationSimulation}
                      leftIcon={<Icon as={FiMessageSquare} />}
                    >
                      Simular notificação
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={6}>
                <Heading size="md" color="gray.900">
                  Próximos Passos
                </Heading>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  <ActionCard
                    icon={FiPlus}
                    title="Nova Proposta"
                    subtitle="Enviar outra proposta"
                    to="/onboarding/create-client"
                    variant="solid"
                    colorScheme="emerald"
                  />

                  <ActionCard
                    icon={FiUsers}
                    title="Clientes"
                    subtitle="Gerenciar seus clientes"
                    to="/dashboard/clientes"
                  />

                  <ActionCard
                    icon={FiZap}
                    title="Plano Pro"
                    subtitle="Desbloquear recursos avançados"
                    to="/register"
                    variant="outline"
                    colorScheme="purple"
                  />
                </Grid>
              </VStack>
            </CardBody>
          </Card>

          {/* Progress Encouragement */}
          <Card bg="emerald.50" border="1px" borderColor="emerald.200">
            <CardBody textAlign="center">
              <VStack spacing={4}>
                <Icon as={FiTrendingUp} color="emerald.500" boxSize={8} />
                <Heading size="md" color="gray.900">
                  Você está no caminho certo!
                </Heading>
                <Text color="gray.700">
                  Continue enviando propostas e acompanhe seu crescimento.
                  Em breve você verá seus primeiros resultados aqui! 🎯
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Layout>
  )
}

export default InitialDashboardPage
