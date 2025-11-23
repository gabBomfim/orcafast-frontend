import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Center,
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
  Spinner,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import {
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
import { useColorModeValue } from '@chakra-ui/react'

// Components
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'

import { clientService } from '../services'

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()

  const fetchClients = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await clientService.list({ page })
      const normalizedClients = data.data.map((client) => ({
        ...client,
        proposalsCount: client.proposals ? client.proposals.length : 0,
        totalValue: client.totalValue ?? client.total_value ?? 0,
        lastProposal: client.lastProposal ?? client.last_proposal ?? 'Sem registro',
      }))

      setClients(normalizedClients)
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      })
    } catch (err) {
      setError('Não foi possível carregar os clientes. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const totalClients = clients.length
  const totalProposalsSent = clients.reduce(
    (total, client) => total + (client.proposalsCount || 0),
    0
  )
  const totalProposalValue = clients.reduce(
    (total, client) => total + (client.totalValue || 0),
    0
  )
  const averageTicket = totalClients ? Math.round(totalProposalValue / totalClients) : 0

  const filteredClients = clients.filter(
    (client) =>
      `${client.name ?? ''} ${client.email ?? ''} ${client.company ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    try {
      await clientService.delete(selectedClient.id)
      toast({
        title: 'Cliente excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      // Recarrega a página atual
      fetchClients(pagination.currentPage)
    } catch (err) {
      toast({
        title: 'Erro ao excluir cliente',
        description: err.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      onClose()
    }
  }

  const handlePageChange = (page) => {
    fetchClients(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
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
              value={totalClients}
              icon={FiUsers}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Propostas Enviadas"
              value={totalProposalsSent}
              icon={FiFileText}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Valor Total"
              value={`R$ ${totalProposalValue.toLocaleString('pt-BR')}`}
              icon={FiZap}
              colorScheme="primary"
            />
            
            <StatsCard
              title="Ticket Médio"
              value={`R$ ${averageTicket.toLocaleString('pt-BR')}`}
              icon={FiActivity}
              colorScheme="primary"
            />
          </Grid>

          {/* Search */}
          <SearchBar
            p={2}
            placeholder="Buscar clientes por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clients List */}
          <DataCard
            title="Seus Clientes"
            subtitle={`${filteredClients.length} cliente${filteredClients.length !== 1 ? 's' : ''} encontrado${filteredClients.length !== 1 ? 's' : ''}`}
          >
            {isLoading ? (
              <Center w="full" py={12}>
                <Spinner size="lg" color="primary.500" />
              </Center>
            ) : error ? (
              <Box w="full" p={4} borderRadius="lg" bg="red.50" color="red.600">
                {error}
              </Box>
            ) : (
              <VStack spacing={4}>
                {filteredClients.length === 0 ? (
                  <Box w="full" textAlign="center" py={6} color="gray.500">
                    Nenhum cliente encontrado.
                  </Box>
                ) : (
                  filteredClients.map((client) => (
                    <Box
                      key={client.id}
                      w="full"
                      p={4}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.700')}
                      borderRadius="lg"
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                      transition="background 0.2s"
                    >
                      <Flex 
                        direction={{ base: 'column', md: 'row' }} 
                        justify="space-between" 
                        align={{ base: 'start', md: 'center' }}
                      >
                        <HStack spacing={4} flex="1" mb={{ base: 4, md: 0 }}>
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
                            <HStack spacing={2} mb={1} wrap="wrap">
                              <Text fontWeight="semibold">{client.name}</Text>
                              <Badge colorScheme="gray" variant="subtle">
                                {client.proposalsCount} {client.proposalsCount !== 1 ? 'propostas' : 'proposta'}
                              </Badge>
                            </HStack>
                            
                            <VStack spacing={1} align="start">
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiMail} boxSize={3} />
                                <Text>{client.email || 'Não informado'}</Text>
                              </HStack>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiPhone} boxSize={3} />
                                <Text>{client.phone || 'Não informado'}</Text>
                              </HStack>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiActivity} boxSize={3} />
                                <Text>{client.company || 'Sem empresa'}</Text>
                              </HStack>
                            </VStack>
                          </Box>
                        </HStack>

                        <VStack 
                          spacing={{ base: 3, md: 2 }} 
                          align={{ base: 'start', md: 'end' }} 
                          w={{ base: 'full', md: 'auto' }}
                        >
                          <Box textAlign={{ base: 'left', md: 'right' }}>
                            <Text fontWeight="semibold" color="primary.500">
                              R$ {(client.totalValue || 0).toLocaleString('pt-BR')}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Última proposta: {client.lastProposal || 'Sem registro'}
                            </Text>
                          </Box>

                          <HStack spacing={2} w={{ base: 'full', md: 'auto' }}>
                            <Button
                              as={Link}
                              to={`/dashboard/propostas/nova?client=${client.id}`}
                              variant="outline"
                              size="sm"
                              leftIcon={<Icon as={FiFileText} />}
                              flex={{ base: 1, md: 'auto' }}
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
                                <MenuItem
                                  as={Link}
                                  to={`/dashboard/clientes/novo?edit=${client.id}`}
                                  icon={<Icon as={FiEdit} />}
                                >
                                  Editar
                                </MenuItem>
                                <MenuItem icon={<Icon as={FiMessageSquare} />}>
                                  WhatsApp
                                </MenuItem>
                                <MenuItem
                                  icon={<Icon as={FiTrash2} />}
                                  color="red.500"
                                  onClick={() => {
                                    setSelectedClient(client)
                                    onOpen()
                                  }}
                                >
                                  Excluir
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </VStack>
                      </Flex>
                    </Box>
                  ))
                )}
              </VStack>
            )}
          </DataCard>

          {/* Paginação */}
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Cliente
            </AlertDialogHeader>

            <AlertDialogBody>
              {selectedClient?.proposalsCount > 0 ? (
                <VStack align="start" spacing={3}>
                  <Text>
                    Tem certeza que deseja excluir <strong>{selectedClient?.name}</strong>?
                  </Text>
                  <Box
                    p={3}
                    bg="orange.50"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="orange.200"
                    w="full"
                  >
                    <Text fontSize="sm" color="orange.800" fontWeight="medium" mb={1}>
                      ⚠️ Atenção
                    </Text>
                    <Text fontSize="sm" color="orange.700">
                      Este cliente possui <strong>{selectedClient.proposalsCount}</strong> proposta{selectedClient.proposalsCount !== 1 ? 's' : ''} associada{selectedClient.proposalsCount !== 1 ? 's' : ''}.
                      A exclusão do cliente também removerá todas as propostas relacionadas a ele.
                    </Text>
                  </Box>
                  <Text fontSize="sm" color="gray.600">
                    Esta ação não pode ser desfeita.
                  </Text>
                </VStack>
              ) : (
                <Text>
                  Tem certeza que deseja excluir <strong>{selectedClient?.name}</strong>?
                  Esta ação não pode ser desfeita.
                </Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3}
                bg="red.500"
                _hover={{ bg: 'red.600' }}
              >
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

export default ClientesPage
