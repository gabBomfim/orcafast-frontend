import { useEffect, useRef, useState, useCallback } from 'react'
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
  FiFileText,
  FiEdit,
  FiMoreVertical,
  FiCopy,
  FiTrash2,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiExternalLink,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

// Components
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import StatusBadge from '../components/ui/StatusBadge'
import Pagination from '../components/ui/Pagination'

import { proposalService, teamUserService } from '../services'
import { openWhatsApp } from '../utils/whatsapp'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'

const STATUS_MAP = {
  1: 'draft',
  2: 'sent',
  3: 'viewed',
  4: 'approved',
  5: 'rejected',
}

const REVERSE_STATUS_MAP = {
  'draft': 1,
  'sent': 2,
  'viewed': 3,
  'approved': 4,
  'rejected': 5,
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

  const [selectedProposal, setSelectedProposal] = useState(null)
  const [actionType, setActionType] = useState(null) // 'delete', 'approve', 'reject'
  const [isConfirming, setIsConfirming] = useState(false)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    approved: 0,
    viewed: 0,
    sent: 0,
    draft: 0,
  })
  const [loadingAction, setLoadingAction] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [copiedProposalId, setCopiedProposalId] = useState(null)

  // Debounce search term to avoid excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Single consolidated effect to handle all data fetching
  // This prevents multiple simultaneous API calls
  // 1. Fetch Proposals (List)
  useEffect(() => {
    let isCancelled = false

    const loadProposals = async () => {
      setIsLoading(true)
      try {
        const params = {
          page: pagination.currentPage,
          search: debouncedSearchTerm || undefined,
          status: statusFilter === 'all' ? undefined : REVERSE_STATUS_MAP[statusFilter],
          beginDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
          'user_ids[]': selectedUserIds.length > 0 ? selectedUserIds : undefined
        }

        const { data } = await proposalService.list(params)
        if (isCancelled) return

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
        
        if (data.counts) {
          setStatusCounts({
            all: data.counts.all || 0,
            approved: data.counts.approved || 0,
            viewed: data.counts.viewed || 0,
            sent: data.counts.sent || 0,
            draft: data.counts.draft || 0,
          })
        }
        
        setError(null)
      } catch (err) {
        if (!isCancelled) setError('Não foi possível carregar os orçamentos.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    if (!dateError) loadProposals()

    return () => { isCancelled = true }
  }, [debouncedSearchTerm, statusFilter, dateRange.start, dateRange.end, dateError, pagination.currentPage, refreshTrigger, selectedUserIds])
  
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

  const getStatusCount = (status) => {
    return statusCounts[status] || 0
  }

  const confirmAction = (type, proposal) => {
    setActionType(type)
    setSelectedProposal(proposal)
    onOpen()
  }

  // Helper function to reload data after actions
  const reloadData = useCallback(() => {
    // Triggers the effects gracefully instead of duplicating APIs
    setRefreshTrigger(prev => prev + 1)
  }, [])

  const executeAction = async () => {
    if (!selectedProposal) return
    setIsConfirming(true)

    try {
      if (actionType === 'delete') {
        await proposalService.delete(selectedProposal.id)
        
        // Update local state for immediate feedback
        setProposals(prev => prev.filter(p => p.id !== selectedProposal.id))
        
        // Update status counts manually
        const statusToDelete = selectedProposal.status
        setStatusCounts(prev => ({
          ...prev,
          all: Math.max(0, (prev.all || 0) - 1),
          [statusToDelete]: Math.max(0, (prev[statusToDelete] || 0) - 1)
        }))

        // Update pagination total label
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, (prev.total || 0) - 1)
        }))

        toast({
          title: 'Orçamento excluído',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else if (actionType === 'approve') {
        await proposalService.updateStatus(selectedProposal.id, 4)
        setProposals(prev => prev.map(p => 
          p.id === selectedProposal.id ? { ...p, status: 'approved' } : p
        ))
        toast({
          title: 'Orçamento aprovado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else if (actionType === 'reject') {
        await proposalService.updateStatus(selectedProposal.id, 5)
        setProposals(prev => prev.map(p => 
          p.id === selectedProposal.id ? { ...p, status: 'rejected' } : p
        ))
        toast({
          title: 'Orçamento reprovado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      await reloadData()
    } catch (err) {
      toast({
        title: 'Erro na operação',
        description: err.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsConfirming(false)
      onClose()
      setActionType(null)
    }
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppShare = async (proposal) => {
    setLoadingAction({ ...loadingAction, [proposal.id]: 'whatsapp' })

    try {
      // Only update status if NOT approved
      if (proposal.status !== 'approved') {
        await proposalService.updateStatus(proposal.id, 2)
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposal.id ? { ...p, status: 'sent' } : p
        ))
      }

      const proposalUrl = proposal.sharing_token
        ? `${window.location.origin}/share/proposta/${proposal.sharing_token}`
        : `${window.location.origin}/proposta/${proposal.id}` // Fallback para rota interna

      const message = `Olá ${proposal.client}!

Seu orçamento de *${proposal.service}* está pronto! 😊

Visualize os detalhes completos clicando no link abaixo:
🔗 ${proposalUrl}

Qualquer dúvida, estou à disposição!`

      // Abre o WhatsApp de forma inteligente
      openWhatsApp({
        phone: proposal.client_phone || proposal.client?.phone,
        message: message
      })

      toast({
        title: proposal.status === 'approved' ? 'Abrindo WhatsApp' : 'Orçamento marcado como enviado',
        description: 'Selecione o contato no WhatsApp.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      await reloadData()
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: error.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setLoadingAction({ ...loadingAction, [proposal.id]: null })
    }
  }

  const handleDownloadPDF = async (proposalId) => {
    setLoadingAction({ ...loadingAction, [proposalId]: 'download' })
    try {
      const response = await proposalService.downloadPDF(proposalId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `proposta-${proposalId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Download concluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao baixar PDF',
        description: error.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      // Se era rascunho, marca como enviado e recarrega
      const proposal = proposals.find(p => p.id === proposalId)
      if (proposal?.status === 'draft') {
        try {
          await proposalService.updateStatus(proposalId, 2)
          // Update local state
          setProposals(prev => prev.map(p => 
            p.id === proposalId ? { ...p, status: 'sent' } : p
          ))
          await reloadData()
        } catch (e) {
          console.error("Erro ao atualizar status após download", e)
        }
      }
      setLoadingAction({ ...loadingAction, [proposalId]: null })
    }
  }

  const handleCopyLink = async (proposal) => {
    const proposalUrl = proposal.sharing_token
      ? `${window.location.origin}/share/proposta/${proposal.sharing_token}`
      : `${window.location.origin}/proposta/${proposal.id}`

    navigator.clipboard.writeText(proposalUrl)
    setCopiedProposalId(proposal.id)
    
    setTimeout(() => {
      setCopiedProposalId(null)
    }, 2000)
    
    toast({
      title: 'Link copiado!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      variant: 'subtle',
    })

    // Se é rascunho, marca como enviado
    if (proposal.status === 'draft') {
      try {
        await proposalService.updateStatus(proposal.id, 2)
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposal.id ? { ...p, status: 'sent' } : p
        ))
        await reloadData()
      } catch (error) {
        console.error("Erro ao atualizar status após copiar link", error)
      }
    }
  }

  const getDialogContent = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Aprovar Orçamento',
          body: `Tem certeza que deseja marcar o orçamento para ${selectedProposal?.client} como APROVADO? Esta ação impactará os relatórios.`,
          confirmText: 'Aprovar Orçamento',
          confirmColor: 'green'
        }
      case 'reject':
        return {
          title: 'Reprovar Orçamento',
          body: `Tem certeza que deseja marcar o orçamento para ${selectedProposal?.client} como REPROVADO? Esta ação impactará os relatórios.`,
          confirmText: 'Reprovar Orçamento',
          confirmColor: 'red'
        }
      case 'delete':
      default:
        return {
          title: 'Excluir Orçamento',
          body: `Tem certeza que deseja excluir o orçamento para ${selectedProposal?.client}? Esta ação não pode ser desfeita.`,
          confirmText: 'Excluir',
          confirmColor: 'red'
        }
    }
  }

  const dialogContent = getDialogContent()

  return (
    <Container>
      <VStack align="stretch" spacing={8}>
        {/* Stats */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Filtrar por Status</Text>
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
              title="Pendentes de Envio"
              value={getStatusCount('draft')}
              colorScheme="gray"
              isActive={statusFilter === 'draft'}
              onClick={() => setStatusFilter('draft')}
            />
          </Grid>
        </Box>

        {/* Filters */}
        <DataCard title="Filtros e Busca">
          <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} align={{ lg: 'flex-end' }}>
            <FormControl flex={2}>
              <FormLabel>Buscar</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>Período</FormLabel>
              <ReactSelect
                styles={appSelectStyles}
                value={[
                  { value: 'all', label: 'Todo o período' },
                  { value: '7days', label: 'Últimos 7 dias' },
                  { value: '30days', label: 'Últimos 30 dias' },
                  { value: 'thisMonth', label: 'Este mês' },
                  { value: 'custom', label: 'Personalizado' },
                ].find(o => o.value === datePreset)}
                onChange={(opt) => handleDatePresetChange(opt?.value || 'all')}
                options={[
                  { value: 'all', label: 'Todo o período' },
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
                <FormLabel>Filtrar por Equipe</FormLabel>
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

        {/* Proposals List */}
        <DataCard
          title="Seus Orçamentos"
          subtitle={`${pagination.total} orçamento${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
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
              {proposals.length === 0 ? (
                <Box w="full" textAlign="center" py={6} color="gray.500">
                  Nenhum orçamento encontrado.
                </Box>
              ) : (
                proposals.map((proposal) => (
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
                    <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                      <HStack spacing={4} flex="1" w="full">
                        <Box
                          w={12}
                          h={12}
                          bg="primary.50"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <Icon as={FiFileText} color="primary.500" boxSize={6} />
                        </Box>

                        <Box flex="1">
                          <HStack spacing={2} mb={1} wrap="wrap">
                            <Text fontWeight="semibold">{proposal.client}</Text>
                            <StatusBadge
                              status={proposal.status}
                              customLabel={
                                proposal.status === 'approved' ? 'Orçamento aceito pelo cliente' :
                                  proposal.status === 'rejected' ? 'Orçamento negado pelo cliente' : undefined
                              }
                            />
                          </HStack>
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            {proposal.service}
                          </Text>
                          <HStack spacing={4} fontSize="xs" color="gray.400" wrap="wrap">
                            <Text>Criada: {formatDateTime(proposal.createdAt)}</Text>
                            {proposal.viewedAt && (
                              <Text>Visualizada: {formatDateTime(proposal.viewedAt)}</Text>
                            )}
                            <Text>Válida até: {formatDate(proposal.validUntil)}</Text>
                          </HStack>
                        </Box>
                      </HStack>

                      <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} align="center" w={{ base: 'full', md: 'auto' }} justify={{ base: 'space-between', md: 'flex-end' }}>
                        <Box textAlign={{ base: 'left', md: 'right' }}>
                          <Text
                            fontWeight="semibold"
                            color="primary.500"
                            fontSize="lg"
                          >
                            R$ {(proposal.value || 0).toLocaleString('pt-BR')}
                          </Text>
                          
                          {isAdmin && proposal.user && (
                            <HStack spacing={2} mt={1}>
                              <Tooltip label={`Criado por ${proposal.user.name}`}>
                                <Avatar size="xs" name={proposal.user.name} />
                              </Tooltip>
                              <Text fontSize="xs" color="gray.500">
                                {proposal.user.name.split(' ')[0]}
                              </Text>
                            </HStack>
                          )}
                        </Box>

                        <Flex
                          direction={{ base: 'column', md: 'row' }}
                          gap={2}
                          w={{ base: 'full', md: 'auto' }}
                          align="center"
                        >
                          {/* Action Buttons */}
                          {(proposal.status === 'draft' || proposal.status === 'sent' || proposal.status === 'viewed') ? (
                            <Stack direction={{ base: 'column', md: 'row' }} spacing={2} w={{ base: 'full', md: 'auto' }}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                onClick={() => confirmAction('approve', proposal)}
                                leftIcon={<Icon as={FiCheckCircle} />}
                                w={{ base: 'full', md: 'auto' }}
                              >
                                Aprovar orçamento
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => confirmAction('reject', proposal)}
                                leftIcon={<Icon as={FiXCircle} />}
                                _hover={{ bg: 'red.50', borderColor: 'red.500', color: 'red.600' }}
                                w={{ base: 'full', md: 'auto' }}
                              >
                                Reprovar orçamento
                              </Button>
                            </Stack>
                          ) : proposal.status === 'approved' ? (
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => confirmAction('reject', proposal)}
                              leftIcon={<Icon as={FiXCircle} />}
                              _hover={{ bg: 'red.50', borderColor: 'red.500', color: 'red.600' }}
                              w={{ base: 'full', md: 'auto' }}
                            >
                              Reprovar orçamento
                            </Button>
                          ) : proposal.status === 'rejected' && (
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              onClick={() => confirmAction('approve', proposal)}
                              leftIcon={<Icon as={FiCheckCircle} />}
                              w={{ base: 'full', md: 'auto' }}
                            >
                              Aprovar orçamento
                            </Button>
                          )}

                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="outline"
                              size="sm"
                              rightIcon={<Icon as={FiChevronDown} />}
                              bg="gray.50"
                              borderColor="gray.200"
                              _hover={{ bg: 'gray.100' }}
                              isLoading={loadingAction[proposal.id] === 'whatsapp' || loadingAction[proposal.id] === 'download'}
                              w={{ base: 'full', md: 'auto' }}
                            >
                              Opções
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                icon={<Icon as={FiExternalLink} />}
                                as="a"
                                href={proposal.sharing_token ? `/share/proposta/${proposal.sharing_token}` : '#'}
                                target="_blank"
                              >
                                Visualizar
                              </MenuItem>
                              <MenuItem
                                icon={<Icon as={FaWhatsapp} color="#25D366" />}
                                onClick={() => handleWhatsAppShare(proposal)}
                              >
                                {proposal.status === 'draft' ? 'Enviar via WhatsApp' : 'Reenviar via WhatsApp'}
                              </MenuItem>
                              <MenuItem
                                icon={<Icon as={copiedProposalId === proposal.id ? FiCheck : FiCopy} color={copiedProposalId === proposal.id ? "emerald.500" : undefined} />}
                                onClick={() => handleCopyLink(proposal)}
                              >
                                {copiedProposalId === proposal.id ? 'Link Copiado!' : 'Copiar link para o cliente'}
                              </MenuItem>
                              <MenuItem
                                icon={<Icon as={FiDownload} />}
                                onClick={() => handleDownloadPDF(proposal.id)}
                              >
                                Baixar PDF
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
                                onClick={() => confirmAction('delete', proposal)}
                              >
                                Excluir
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Stack>
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
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogContent.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {dialogContent.body}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost" isDisabled={isConfirming}>
                Cancelar
              </Button>
              <Button
                colorScheme={dialogContent.confirmColor}
                onClick={executeAction}
                ml={3}
                isLoading={isConfirming}
                bg={dialogContent.confirmColor === 'red' ? 'red.500' : undefined}
                _hover={dialogContent.confirmColor === 'red' ? { bg: 'red.600' } : undefined}
                color={dialogContent.confirmColor === 'red' ? 'white' : undefined}
              >
                {dialogContent.confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

export default PropostasPage
