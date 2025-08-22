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
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import {
  FiPlus,
  FiUsers,
  FiMail,
  FiPhone,
  FiActivity,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiFileText,
  FiZap,
} from 'react-icons/fi'

// Components
import Layout from '../components/layout/Layout'
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import SearchBar from '../components/ui/SearchBar'

// Mock data
import { clientes } from '../mock/clientes'

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients] = useState(clientes)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const headerRightContent = (
    <Button
      as={Link}
      to="/dashboard/clientes/novo"
      leftIcon={<Icon as={FiPlus} />}
      variant="gradient"
    >
      Novo Cliente
    </Button>
  )

  return (
    <Layout
      headerTitle="Clientes"
      showBackButton={true}
      headerRightContent={headerRightContent}
    >
      <Container>
        <VStack align="stretch" spacing={8}>
          {/* Stats */}
          <Grid 
            templateColumns={{ 
              base: '1fr', 
              md: 'repeat(4, 1fr)' 
            }} 
            gap={6}
          >
            <StatsCard
              title="Total de Clientes"
              value={clients.length}
              icon={FiUsers}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Propostas Enviadas"
              value={clients.reduce((total, client) => total + client.proposalsCount, 0)}
              icon={FiFileText}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Valor Total"
              value={`R$ ${clients.reduce((total, client) => total + client.totalValue, 0).toLocaleString('pt-BR')}`}
              icon={FiZap}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Ticket Médio"
              value={`R$ ${Math.round(
                clients.reduce((total, client) => total + client.totalValue, 0) / clients.length
              ).toLocaleString('pt-BR')}`}
              icon={FiActivity}
              colorScheme="primary"
            />
          </Grid>

          {/* Search */}
          <SearchBar
            placeholder="Buscar clientes por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clients List */}
          <DataCard
            title="Seus Clientes"
            subtitle={`${filteredClients.length} cliente${filteredClients.length !== 1 ? 's' : ''} encontrado${filteredClients.length !== 1 ? 's' : ''}`}
          >
            <VStack spacing={4}>
              {filteredClients.map((client) => (
                <Box
                  key={client.id}
                  w="full"
                  p={4}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _hover={{ bg: 'gray.50' }}
                  transition="background 0.2s"
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={4} flex="1">
                      <Box
                        w={12}
                        h={12}
                        bg="primary.50"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiUsers} color="primary.500" boxSize={6} />
                      </Box>
                      
                      <Box flex="1">
                        <HStack spacing={2} mb={1}>
                          <Text fontWeight="semibold">{client.name}</Text>
                          <Badge colorScheme="gray" variant="subtle">
                            {client.proposalsCount} propostas
                          </Badge>
                        </HStack>
                        
                        <VStack spacing={1} align="start">
                          <HStack spacing={2} fontSize="sm" color="gray.500">
                            <Icon as={FiMail} boxSize={3} />
                            <Text>{client.email}</Text>
                          </HStack>
                          <HStack spacing={2} fontSize="sm" color="gray.500">
                            <Icon as={FiPhone} boxSize={3} />
                            <Text>{client.phone}</Text>
                          </HStack>
                          <HStack spacing={2} fontSize="sm" color="gray.500">
                            <Icon as={FiActivity} boxSize={3} />
                            <Text>{client.company}</Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </HStack>

                    <HStack spacing={4}>
                      <Box textAlign="right">
                        <Text fontWeight="semibold" color="primary.500">
                          R$ {client.totalValue.toLocaleString('pt-BR')}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Última proposta: {client.lastProposal}
                        </Text>
                      </Box>

                      <HStack spacing={2}>
                        <Button
                          as={Link}
                          to={`/dashboard/propostas/nova?client=${client.id}`}
                          variant="outline"
                          size="sm"
                          leftIcon={<Icon as={FiFileText} />}
                        >
                          Nova Proposta
                        </Button>

                        <Menu>
                          <MenuButton
                            as={Button}
                            variant="ghost"
                            size="sm"
                          >
                            <Icon as={FiMoreVertical} />
                          </MenuButton>
                          <MenuList>
                            <MenuItem icon={<Icon as={FiEdit} />}>
                              Editar
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiMessageSquare} />}>
                              WhatsApp
                            </MenuItem>
                            <MenuItem
                              icon={<Icon as={FiTrash2} />}
                              color="red.500"
                            >
                              Excluir
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </DataCard>
        </VStack>
      </Container>
    </Layout>
  )
}

export default ClientesPage
