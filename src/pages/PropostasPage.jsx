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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import {
  FiArrowLeft,
  FiPlus,
  FiFileText,
  FiEye,
  FiEdit,
  FiMoreVertical,
  FiCopy,
  FiMessageSquare,
  FiTrash2,
} from 'react-icons/fi'

// Components
import Layout from '../components/layout/Layout'
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import StatusBadge from '../components/ui/StatusBadge'
import SearchBar from '../components/ui/SearchBar'

// Mock data
import { propostas } from '../mock/propostas'

const PropostasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [proposals] = useState(propostas)

  const getStatusCount = (status) => {
    if (status === 'all') return proposals.length
    return proposals.filter((p) => p.status === status).length
  }

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const headerRightContent = (
    <Button
      as={Link}
      to="/dashboard/propostas/nova"
      leftIcon={<Icon as={FiPlus} />}
      variant="gradient"
    >
      Nova Proposta
    </Button>
  )

  return (
    <Layout
      headerTitle="Propostas"
      showBackButton={true}
      headerRightContent={headerRightContent}
    >
      <Container>
        <VStack align="stretch" spacing={8}>
          {/* Stats */}
          <Grid 
            templateColumns={{ 
              base: 'repeat(2, 1fr)', 
              md: 'repeat(5, 1fr)' 
            }} 
            gap={4}
          >
            <StatsCard
              title="Total"
              value={getStatusCount('all')}
              colorScheme="primary"
              isActive={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            />
            <StatsCard
              title="Aprovadas"
              value={getStatusCount('approved')}
              colorScheme="green"
              isActive={statusFilter === 'approved'}
              onClick={() => setStatusFilter('approved')}
            />
            <StatsCard
              title="Visualizadas"
              value={getStatusCount('viewed')}
              colorScheme="blue"
              isActive={statusFilter === 'viewed'}
              onClick={() => setStatusFilter('viewed')}
            />
            <StatsCard
              title="Enviadas"
              value={getStatusCount('sent')}
              colorScheme="yellow"
              isActive={statusFilter === 'sent'}
              onClick={() => setStatusFilter('sent')}
            />
            <StatsCard
              title="Rascunhos"
              value={getStatusCount('draft')}
              colorScheme="gray"
              isActive={statusFilter === 'draft'}
              onClick={() => setStatusFilter('draft')}
            />
          </Grid>

          {/* Search */}
          <SearchBar
            placeholder="Buscar propostas por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Proposals List */}
          <DataCard
            title="Suas Propostas"
            subtitle={`${filteredProposals.length} proposta${filteredProposals.length !== 1 ? 's' : ''} encontrada${filteredProposals.length !== 1 ? 's' : ''}`}
          >
            <VStack spacing={4}>
              {filteredProposals.map((proposal) => (
                <Box
                  key={proposal.id}
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
                        <Icon as={FiFileText} color="primary.500" boxSize={6} />
                      </Box>
                      
                      <Box flex="1">
                        <HStack spacing={2} mb={1}>
                          <Text fontWeight="semibold">{proposal.client}</Text>
                          <StatusBadge status={proposal.status} />
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mb={2}>
                          {proposal.service}
                        </Text>
                        <HStack spacing={4} fontSize="xs" color="gray.400">
                          <Text>Criada: {proposal.createdAt}</Text>
                          {proposal.viewedAt && (
                            <Text>Visualizada: {proposal.viewedAt}</Text>
                          )}
                          <Text>Válida até: {proposal.validUntil}</Text>
                        </HStack>
                      </Box>
                    </HStack>

                    <HStack spacing={4}>
                      <Box textAlign="right">
                        <Text
                          fontWeight="semibold"
                          color="primary.500"
                          fontSize="lg"
                        >
                          R$ {proposal.value.toLocaleString('pt-BR')}
                        </Text>
                      </Box>

                      <HStack spacing={2}>
                        {proposal.status === 'draft' ? (
                          <Button
                            as={Link}
                            to={`/dashboard/propostas/nova?edit=${proposal.id}`}
                            variant="outline"
                            size="sm"
                            leftIcon={<Icon as={FiEdit} />}
                          >
                            Continuar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Icon as={FiEye} />}
                          >
                            Visualizar
                          </Button>
                        )}

                        <Menu>
                          <MenuButton
                            as={Button}
                            variant="ghost"
                            size="sm"
                          >
                            <Icon as={FiMoreVertical} />
                          </MenuButton>
                          <MenuList>
                            <MenuItem icon={<Icon as={FiCopy} />}>
                              Duplicar
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiMessageSquare} />}>
                              Reenviar WhatsApp
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiEdit} />}>
                              Editar
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

export default PropostasPage
