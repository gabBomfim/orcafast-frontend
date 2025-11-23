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
  FiFileText,
  FiEye,
  FiEdit,
  FiMoreVertical,
  FiCopy,
  FiMessageSquare,
  FiTrash2,
} from 'react-icons/fi'

// Components
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import StatusBadge from '../components/ui/StatusBadge'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'

import { proposalService } from '../services'

const STATUS_MAP = {
  1: 'draft',
  2: 'sent',
  3: 'viewed',
  4: 'approved',
  5: 'rejected',
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Não informado'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Não informado'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Não informado'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Não informado'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(date)
}

const PropostasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [proposals, setProposals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()

  const fetchProposals = async (page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await proposalService.list({ page })
      const normalizedProposals = data.data.map((proposal) => {
          const rawStatus = proposal.status
          let normalizedStatus = 'draft'

          if (rawStatus !== null && rawStatus !== undefined) {
            if (typeof rawStatus === 'number') {
              normalizedStatus = STATUS_MAP[rawStatus] ?? normalizedStatus
            } else {
              const parsedStatus = Number(rawStatus)
              normalizedStatus = Number.isNaN(parsedStatus)
                ? String(rawStatus).toLowerCase()
                : STATUS_MAP[parsedStatus] ?? String(rawStatus).toLowerCase()
            }
          }

          return {
            ...proposal,
            client:
              proposal.client?.name ??
              proposal.client_name ??
              proposal.client ??
              'Cliente não informado',
            service: proposal.service ?? proposal.title ?? 'Serviço não informado',
            value: Number(proposal.value ?? proposal.total_value ?? 0),
            status: normalizedStatus,
            createdAt: proposal.createdAt ?? proposal.created_at ?? null,
            viewedAt: proposal.viewedAt ?? proposal.viewed_at ?? null,
            validUntil: proposal.validUntil ?? proposal.valid_until ?? null,
          }
        })

        setProposals(normalizedProposals)
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
        })
      } catch (err) {
        setError('Não foi possível carregar as propostas. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchProposals()
  }, [])

  const getStatusCount = (status) => {
    if (status === 'all') return proposals.length
    return proposals.filter((p) => p.status === status).length
  }

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      `${proposal.client ?? ''} ${proposal.service ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async () => {
    try {
      await proposalService.delete(selectedProposal.id)
      toast({
        title: 'Proposta excluída',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      // Recarrega a página atual
      fetchProposals(pagination.currentPage)
    } catch (err) {
      toast({
        title: 'Erro ao excluir proposta',
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
    fetchProposals(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
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
          p={2}
            placeholder="Buscar propostas por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Proposals List */}
          <DataCard
            title="Suas Propostas"
            subtitle={`${filteredProposals.length} proposta${filteredProposals.length !== 1 ? 's' : ''} encontrada${filteredProposals.length !== 1 ? 's' : ''}`}
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
                {filteredProposals.length === 0 ? (
                  <Box w="full" textAlign="center" py={6} color="gray.500">
                    Nenhuma proposta encontrada.
                  </Box>
                ) : (
                  filteredProposals.map((proposal) => (
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
                          <Text>Criada: {formatDateTime(proposal.createdAt)}</Text>
                              {proposal.viewedAt && (
                            <Text>Visualizada: {formatDateTime(proposal.viewedAt)}</Text>
                              )}
                          <Text>Válida até: {formatDate(proposal.validUntil)}</Text>
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
                              R$ {(proposal.value || 0).toLocaleString('pt-BR')}
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
                                <MenuItem
                                  as={Link}
                                  to={`/dashboard/propostas/nova?edit=${proposal.id}`}
                                  icon={<Icon as={FiEdit} />}
                                >
                                  Editar
                                </MenuItem>
                                <MenuItem
                                  icon={<Icon as={FiTrash2} />}
                                  color="red.500"
                                  onClick={() => {
                                    setSelectedProposal(proposal)
                                    onOpen()
                                  }}
                                >
                                  Excluir
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </HStack>
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
              Excluir Proposta
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir a proposta para{' '}
              <strong>{selectedProposal?.client}</strong>?
              Esta ação não pode ser desfeita.
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

export default PropostasPage
