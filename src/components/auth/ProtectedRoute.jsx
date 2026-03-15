import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { Box, Button, Icon } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { useSubscription } from '../../hooks/useSubscription'
import { useToast, Spinner, Center, useDisclosure } from '@chakra-ui/react'
import { subscriptionService } from '../../services'
import { useState, useEffect } from 'react'
import WelcomePlanModal from '../ui/WelcomePlanModal'
import { useIdleTimeout } from '../../hooks/useIdleTimeout'

const ProtectedRoute = () => {
  const token = storage.getToken()
  const location = useLocation()
  const { isCollapsed } = useSidebar()
  const { canCreateProposal, subscribed, onTrial } = useSubscription()
  const navigate = useNavigate()
  const toast = useToast()

  const [isCheckingSub, setIsCheckingSub] = useState(true)
  const [subDataRefreshed, setSubDataRefreshed] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { isOpen: isWelcomeOpen, onOpen: onWelcomeOpen, onClose: onWelcomeClose } = useDisclosure()
  const [welcomePlanSlug, setWelcomePlanSlug] = useState('pro')

  // Inicia o monitoramento de inatividade (Idle Timeout - 30 min)
  useIdleTimeout()

  useEffect(() => {
    const checkSubscription = async () => {
      // If we already have subscription data, don't block the render
      if (storage.getSubscription()) {
        setIsCheckingSub(false)
        return
      }

      try {
        const { data } = await subscriptionService.getStatus()
        storage.setSubscription(data)
        setSubDataRefreshed(prev => !prev) // trigger re-render so useSubscription pulls new data
      } catch (e) {
        // failed to fetch, proceed with fallback
      } finally {
        setIsCheckingSub(false)
      }
    }

    if (token) {
      checkSubscription()
    } else {
      setIsCheckingSub(false)
    }
  }, [token])

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    if (success === '1' || success === 'true') {
      setSearchParams({})
    } else if (canceled === '1' || canceled === 'true') {
      toast({
        title: 'Ação cancelada',
        description: 'O processo de configuração do plano foi interrompido.',
        status: 'info',
        duration: 6000,
        isClosable: true,
      })
      setSearchParams({})
    }
  }, [searchParams, setSearchParams, toast])

  useEffect(() => {
    const pendingSlug = sessionStorage.getItem('show_welcome')
    const swapSuccess = sessionStorage.getItem('swap_success')

    if (!isCheckingSub) {
      if (swapSuccess === 'true') {
        sessionStorage.removeItem('swap_success')
        toast({
          title: 'Plano atualizado!',
          description: 'A diferença foi cobrada proporcionalmente no seu cartão.',
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
      }

      if (pendingSlug) {
        sessionStorage.removeItem('show_welcome')
        setWelcomePlanSlug(pendingSlug)
        onWelcomeOpen()
      }
    }
  }, [isCheckingSub, onWelcomeOpen, toast])

  const handleCreateProposal = (e) => {
    e.preventDefault()
    if (canCreateProposal) {
      navigate('/dashboard/propostas/nova')
    } else {
      toast({
        title: 'Limite atingido',
        description: 'Você atingiu o limite de propostas do seu plano. Faça um upgrade para continuar.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (isCheckingSub) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="emerald.500" thickness="3px" />
      </Center>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Global guard: force unsubscribed AND not-on-trial users to subscription page
  const hasAccess = subscribed || onTrial
  if (!hasAccess) {
    const allowedPaths = [
      '/dashboard/configuracoes/assinatura'
    ]
    if (!allowedPaths.includes(location.pathname)) {
      return <Navigate to="/dashboard/configuracoes/assinatura" replace />
    }
  }

  // Determina o título e configurações baseado na rota
  const getHeaderConfig = () => {
    const path = location.pathname

    // Rotas de cadastro/edição
    if (path === '/dashboard/clientes/novo') {
      return {
        title: 'Novo Cliente',
        showBackButton: true,
      }
    }
    if (path === '/dashboard/propostas/nova') {
      return {
        title: 'Novo orçamento',
        showBackButton: true,
      }
    }

    // Rotas de listagem
    if (path.includes('/clientes')) {
      return {
        title: 'Clientes',
        showBackButton: true,
        rightContent: (
          <Button
            as={Link}
            to="/dashboard/clientes/novo"
            leftIcon={<Icon as={FiPlus} />}
            variant="gradient"
          >
            Novo Cliente
          </Button>
        )
      }
    }
    if (path.includes('/propostas')) {
      return {
        title: 'Orçamentos',
        showBackButton: true,
        rightContent: (
          <Button
            onClick={handleCreateProposal}
            leftIcon={<Icon as={FiPlus} />}
            variant="gradient"
          >
            Novo orçamento
          </Button>
        )
      }
    }
    return { title: 'OrçaFast', showBackButton: false }
  }

  const headerConfig = getHeaderConfig()

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      color="gray.700"
      sx={{
        'h1, h2, h3, h4, h5, h6': {
          color: 'gray.900',
          fontWeight: '700',
          letterSpacing: '-0.5px',
        },
      }}
    >
      <Header
        title={headerConfig.title}
        showBackButton={headerConfig.showBackButton}
        rightContent={headerConfig.rightContent}
      />

      <Sidebar />

      <Box
        as="main"
        pl={{ base: 0, lg: isCollapsed ? '80px' : '280px' }}
        pt="73px"
        transition="padding-left 0.2s ease-in-out"
        minH="100vh"
        w="100%"
      >
        <Outlet />
        <WelcomePlanModal
          isOpen={isWelcomeOpen}
          onClose={onWelcomeClose}
          planSlug={welcomePlanSlug}
        />
      </Box>
    </Box>
  )
}

export default ProtectedRoute
