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
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Stack,
  Avatar,
  Tooltip,
} from '@chakra-ui/react'
import ReactSelect from 'react-select'
import { appSelectStyles } from '../theme/selectStyles'
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
  FiSearch,
  FiChevronDown,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'

// Components
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import Pagination from '../components/ui/Pagination'

import { clientService, teamUserService } from '../services'
import { openWhatsApp } from '../utils/whatsapp'

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const { getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const isAdmin = user?.role === 3 || user?.role === 1
  const { isBusiness } = useSubscription()
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])

  // Date Filters
  const [datePreset, setDatePreset] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [dateError, setDateError] = useState('')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchClients = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page,
        search: debouncedSearchTerm || undefined,
        beginDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        'user_ids[]': selectedUserIds.length > 0 ? selectedUserIds : undefined
      }

      const { data } = await clientService.list(params)
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
    if (!dateError) fetchClients(pagination.currentPage)
  }, [debouncedSearchTerm, dateRange.start, dateRange.end, dateError, pagination.currentPage, selectedUserIds])

  // Fetch team members if admin AND business
  useEffect(() => {
    if (isAdmin && isBusiness) {
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

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset)
    const today = new Date()
    let start = new Date()
    let end = new Date()

    if (preset === '7days') {
      start.setDate(today.getDate() - 7)
    } else if (preset === '30days') {
      start.setDate(today.getDate() - 30)
    } else if (preset === 'thisMonth') {
      start.setDate(1)
    } else if (preset === 'all') {
      start = null
      end = null
    }

    const formatDateInput = (d) => d ? d.toISOString().split('T')[0] : ''

    setDateRange({
      start: start ? formatDateInput(start) : '',
      end: end ? formatDateInput(end) : ''
    })
  }

  const totalClients = pagination.total || clients.length
  const totalProposalsSent = clients.reduce(
    (total, client) => total + (client.proposalsCount || 0),
    0
  )
  const totalProposalValue = clients.reduce(
    (total, client) => total + (client.totalValue || 0),
    0
  )
  const averageTicket = totalClients ? Math.round(totalProposalValue / totalClients) : 0

  const handleDelete = async () => {
    try {
      await clientService.delete(selectedClient.id)
      toast({
        title: 'Cliente apagado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      // Recarrega a página atual
      fetchClients(pagination.currentPage)
    } catch (err) {
      toast({
        title: 'Erro ao apagar cliente',
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

  const handleWhatsApp = (client) => {
    if (!client.phone) {
      toast({
        title: 'Celular não informado',
        description: 'Este cliente não possui celular cadastrado.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Abre o WhatsApp de forma inteligente (Web no desktop, App no mobile)
    openWhatsApp({
      phone: client.phone
    })

    toast({
      title: 'Abrindo WhatsApp',
      description: 'Selecione o contato no WhatsApp.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Container>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Clientes</Text>
        </Box>
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
            title="Orçamentos Enviados"
            value={totalProposalsSent}
            icon={FiFileText}
            colorScheme="primary"
          />

          <StatsCard
            title="Total orçado"
            value={`R$ ${totalProposalValue.toLocaleString('pt-BR')}`}
            icon={FiZap}
            colorScheme="primary"
          />

          <StatsCard
            title="Média por serviço"
            value={`R$ ${averageTicket.toLocaleString('pt-BR')}`}
            icon={FiActivity}
            colorScheme="primary"
          />
        </Grid>

        {/* Filters */}
        <DataCard title="Ache um cliente">
          <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} align={{ lg: 'flex-end' }}>
            <FormControl flex={2}>
              <FormLabel>Buscar</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Quem você está procurando?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>De quando?</FormLabel>
              <ReactSelect
                styles={appSelectStyles}
                value={[
                  { value: 'all', label: 'Todo o histórico' },
                  { value: '7days', label: 'Últimos 7 dias' },
                  { value: '30days', label: 'Últimos 30 dias' },
                  { value: 'thisMonth', label: 'Este mês' },
                  { value: 'custom', label: 'Personalizado' },
                ].find(o => o.value === datePreset)}
                onChange={(opt) => handleDatePresetChange(opt?.value || 'all')}
                options={[
                  { value: 'all', label: 'Todo o histórico' },
                  { value: '7days', label: 'Últimos 7 dias' },
                  { value: '30days', label: 'Últimos 30 dias' },
                  { value: 'thisMonth', label: 'Este mês' },
                  { value: 'custom', label: 'Personalizado' },
                ]}
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </FormControl>

            {isAdmin && teamMembers.length > 0 && (
              <FormControl flex={1.5}>
                <FormLabel>Quem do time cadastrou?</FormLabel>
                <ReactSelect
                  isMulti
                  placeholder="Membros da equipe"
                  closeMenuOnSelect={false}
                  styles={appSelectStyles}
                  value={teamMembers.filter(m => selectedUserIds.includes(m.value))}
                  options={teamMembers}
                  onChange={(selected) => setSelectedUserIds(selected ? selected.map(s => s.value) : [])}
                  noOptionsMessage={() => "Nenhum membro encontrado"}
                  loadingMessage={() => "Carregando..."}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </FormControl>
            )}

            {(datePreset === 'custom') && (
              <>
                <FormControl w={{ base: 'full', lg: 'auto' }} isInvalid={!!dateError}>
                  <FormLabel>De</FormLabel>
                  <Input
                    type="date"
                    value={dateRange.start}
                    max={dateRange.end || undefined}
                    onChange={(e) => {
                      const newStart = e.target.value
                      if (dateRange.end && newStart > dateRange.end) {
                        setDateError('Data inicial não pode ser maior que a data final')
                      } else {
                        setDateError('')
                      }
                      setDateRange({ ...dateRange, start: newStart })
                    }}
                  />
                  {dateError && <FormErrorMessage fontSize="xs">{dateError}</FormErrorMessage>}
                </FormControl>
                <FormControl w={{ base: 'full', lg: 'auto' }} isInvalid={!!dateError}>
                  <FormLabel>Até</FormLabel>
                  <Input
                    type="date"
                    value={dateRange.end}
                    min={dateRange.start || undefined}
                    onChange={(e) => {
                      const newEnd = e.target.value
                      if (dateRange.start && newEnd < dateRange.start) {
                        setDateError('Data final não pode ser menor que a data inicial')
                      } else {
                        setDateError('')
                      }
                      setDateRange({ ...dateRange, end: newEnd })
                    }}
                  />
                </FormControl>
              </>
            )}
          </Stack>
        </DataCard>

        {/* Clients List */}
        <DataCard
          title="Seus Clientes"
          subtitle={`${pagination.total} cliente${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
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
              {clients.length === 0 ? (
                <Box w="full" textAlign="center" py={6} color="gray.500">
                  Sua lista tá vazia. Que tal cadastrar o primeiro cliente e já mandar um orçamento?
                </Box>
              ) : (
                clients.map((client) => (
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
                              {client.proposalsCount} {client.proposalsCount !== 1 ? 'orçamentos feitos' : 'orçamento feito'}
                            </Badge>
                          </HStack>

                          <VStack spacing={1} align="start">
                            {client.email && (
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiMail} boxSize={3} />
                                <Text>{client.email}</Text>
                              </HStack>
                            )}
                            {client.phone && (
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiPhone} boxSize={3} />
                                <Text>{client.phone}</Text>
                              </HStack>
                            )}
                            {client.company && (
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={FiActivity} boxSize={3} />
                                <Text>{client.company}</Text>
                              </HStack>
                            )}
                          </VStack>

                          {isAdmin && client.user && (
                            <HStack spacing={2} mt={3}>
                              <Tooltip label={`Criado por ${client.user.name}`}>
                                <Avatar size="xs" name={client.user.name} />
                              </Tooltip>
                              <Text fontSize="xs" color="gray.600" fontWeight="medium">
                                Cadastrado por: {client.user.name.split(' ')[0]}
                              </Text>
                            </HStack>
                          )}
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
                            {client.lastProposal ? `Último orçamento: ${client.lastProposal}` : 'Nenhum orçamento ainda'}
                          </Text>
                        </Box>

                        <Stack spacing={2} direction={{ base: 'column', md: 'row' }} w={{ base: 'full', md: 'auto' }} align="center">
                          <Button
                            as={Link}
                            to={`/dashboard/propostas/nova?client=${client.id}`}
                            variant="outline"
                            size={{ base: 'md', md: 'sm' }}
                            leftIcon={<Icon as={FiFileText} />}
                            w={{ base: 'full', md: 'auto' }}
                            h={{ base: '44px', md: 'auto' }}
                          >
                            Novo Orçamento
                          </Button>

                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="outline"
                              size="md"
                              height="40px"
                              minW="120px"
                              rightIcon={<Icon as={FiChevronDown} />}
                              bg="gray.50"
                              borderColor="gray.200"
                              _hover={{ bg: 'gray.100' }}
                              w={{ base: 'full', md: 'auto' }}
                            >
                              Opções
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                as={Link}
                                to={`/dashboard/clientes/novo?edit=${client.id}`}
                                icon={<Icon as={FiEdit} />}
                              >
                                Editar
                              </MenuItem>
                              <MenuItem
                                icon={<Icon as={FaWhatsapp} color="#25D366" />}
                                onClick={() => handleWhatsApp(client)}
                              >
                                Chamar no WhatsApp
                              </MenuItem>
                              <MenuItem
                                icon={<Icon as={FiTrash2} />}
                                color="red.500"
                                onClick={() => {
                                  setSelectedClient(client)
                                  onOpen()
                                }}
                              >
                                Apagar cliente
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Stack>
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
              Apagar cliente?
            </AlertDialogHeader>

            <AlertDialogBody>
              {selectedClient?.proposalsCount > 0 ? (
                <VStack align="start" spacing={3}>
                  <Text>
                    Quer mesmo apagar <strong>{selectedClient?.name}</strong>?
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
                      Esse cliente tem <strong>{selectedClient.proposalsCount}</strong> orçamento{selectedClient.proposalsCount !== 1 ? 's' : ''} vinculado{selectedClient.proposalsCount !== 1 ? 's' : ''}. Apagar o cliente vai apagar tudo junto.
                    </Text>
                  </Box>
                  <Text fontSize="sm" color="gray.600">
                    Depois que apagar não tem como recuperar, tá bom?
                  </Text>
                </VStack>
              ) : (
                <Text>
                  Quer mesmo apagar <strong>{selectedClient?.name}</strong>? Depois que apagar não tem como recuperar, tá bom?
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
                Pode apagar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

export default ClientesPage
