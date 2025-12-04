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
  Select,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from '@chakra-ui/react'
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
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

// Components
import Container from '../components/layout/Container'
import StatsCard from '../components/ui/StatsCard'
import DataCard from '../components/ui/DataCard'
import StatusBadge from '../components/ui/StatusBadge'
import Pagination from '../components/ui/Pagination'

import { proposalService } from '../services'

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
  
  // Date Filters
  const [datePreset, setDatePreset] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

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
  const toast = useToast()

  const fetchStatusCounts = useCallback(async () => {
    try {
      const baseParams = {
        page: 1,
        search: searchTerm || undefined,
        beginDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      }

      // Fetch counts for each status in parallel
      const [allRes, approvedRes, viewedRes, sentRes, draftRes] = await Promise.all([
        proposalService.list({ ...baseParams }), // All statuses for total
        proposalService.list({ ...baseParams, status: 4 }), // Approved
        proposalService.list({ ...baseParams, status: 3 }), // Viewed
        proposalService.list({ ...baseParams, status: 2 }), // Sent
        proposalService.list({ ...baseParams, status: 1 }), // Draft
      ])

      setStatusCounts({
        all: allRes.data.total,
        approved: approvedRes.data.total,
        viewed: viewedRes.data.total,
        sent: sentRes.data.total,
        draft: draftRes.data.total,
      })
    } catch (err) {
      // Silently fail for counts, don't break the UI
      console.error('Error fetching status counts:', err)
    }
  }, [searchTerm, dateRange.start, dateRange.end])

  const fetchProposals = async (page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        page,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : REVERSE_STATUS_MAP[statusFilter],
        beginDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      }

      const { data } = await proposalService.list(params)
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
        setError('Não foi possível carregar os orçamentos. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProposals(1)
      fetchStatusCounts()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, fetchStatusCounts])

  // Other filters
  useEffect(() => {
    fetchProposals(1)
    fetchStatusCounts()
  }, [statusFilter, dateRange.start, dateRange.end, fetchStatusCounts])

  // Initial load
  useEffect(() => {
    fetchProposals(1)
    fetchStatusCounts()
  }, [fetchStatusCounts])

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

  const executeAction = async () => {
    if (!selectedProposal) return
    setIsConfirming(true)

    try {
      if (actionType === 'delete') {
        await proposalService.delete(selectedProposal.id)
        toast({
          title: 'Orçamento excluído',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else if (actionType === 'approve') {
        await proposalService.updateStatus(selectedProposal.id, 4)
        toast({
          title: 'Orçamento aprovado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else if (actionType === 'reject') {
        await proposalService.updateStatus(selectedProposal.id, 5)
        toast({
          title: 'Orçamento reprovado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      fetchProposals(pagination.currentPage)
      fetchStatusCounts()
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
    fetchProposals(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppShare = async (proposal) => {
    setLoadingAction({ ...loadingAction, [proposal.id]: 'whatsapp' })
    
    try {
      // Only update status if NOT approved
      if (proposal.status !== 'approved') {
        await proposalService.updateStatus(proposal.id, 2)
      }
      
      const proposalUrl = `${window.location.origin}/proposta/${proposal.id}`
      const message = `Olá ${proposal.client}!

Seu orçamento "${proposal.service}" está pronto!

Valor: R$ ${proposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Visualize os detalhes completos aqui:
${proposalUrl}

Qualquer dúvida, estou à disposição!`
      
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      
      toast({
        title: proposal.status === 'approved' ? 'Abrindo WhatsApp' : 'Orçamento marcado como enviado',
        description: 'Selecione o contato no WhatsApp.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      fetchProposals(pagination.currentPage)
      fetchStatusCounts()
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
      setLoadingAction({ ...loadingAction, [proposalId]: null })
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
                title="Rascunhos"
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
                <Select value={datePreset} onChange={(e) => handleDatePresetChange(e.target.value)}>
                  <option value="all">Todo o período</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days">Últimos 30 dias</option>
                  <option value="thisMonth">Este mês</option>
                  <option value="custom">Personalizado</option>
                </Select>
              </FormControl>

              {(datePreset === 'custom') && (
                <>
                  <FormControl w={{ base: 'full', lg: 'auto' }}>
                    <FormLabel>De</FormLabel>
                    <Input 
                      type="date" 
                      value={dateRange.start} 
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
                    />
                  </FormControl>
                  <FormControl w={{ base: 'full', lg: 'auto' }}>
                    <FormLabel>Até</FormLabel>
                    <Input 
                      type="date" 
                      value={dateRange.end} 
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
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
                          </Box>

                          <HStack spacing={2}>
                            {/* Action Buttons */}
                            {proposal.status === 'draft' ? (
                              <Button
                                as={Link}
                                to={`/dashboard/propostas/nova?edit=${proposal.id}`}
                                variant="outline"
                                colorScheme="emerald"
                                size="sm"
                                leftIcon={<Icon as={FiEdit} />}
                              >
                                Continuar
                              </Button>
                            ) : proposal.status === 'approved' ? (
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => confirmAction('reject', proposal)}
                                leftIcon={<Icon as={FiXCircle} />}
                                _hover={{ bg: 'red.50', borderColor: 'red.500', color: 'red.600' }}
                              >
                                Reprovar orçamento
                              </Button>
                            ) : proposal.status === 'rejected' ? (
                              <Button
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                onClick={() => confirmAction('approve', proposal)}
                                leftIcon={<Icon as={FiCheckCircle} />}
                              >
                                Aprovar orçamento
                              </Button>
                            ) : (
                              // Status is sent or viewed
                              <HStack spacing={1}>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  variant="outline"
                                  onClick={() => confirmAction('approve', proposal)}
                                  leftIcon={<Icon as={FiCheckCircle} />}
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
                                >
                                  Reprovar orçamento
                                </Button>
                              </HStack>
                            )}

                            <Menu>
                              <MenuButton
                                as={Button}
                                variant="ghost"
                                size="sm"
                                isLoading={loadingAction[proposal.id] === 'whatsapp' || loadingAction[proposal.id] === 'download'}
                              >
                                <Icon as={FiMoreVertical} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem 
                                  icon={<Icon as={FaWhatsapp} color="#25D366" />}
                                  onClick={() => handleWhatsAppShare(proposal)}
                                >
                                  {proposal.status === 'draft' ? 'Enviar via WhatsApp' : 'Reenviar via WhatsApp'}
                                </MenuItem>
                                <MenuItem 
                                  icon={<Icon as={FiDownload} />}
                                  onClick={() => handleDownloadPDF(proposal.id)}
                                >
                                  Baixar PDF
                                </MenuItem>
                                <MenuItem icon={<Icon as={FiCopy} />}>
                                  Duplicar
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
                          </HStack>
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
