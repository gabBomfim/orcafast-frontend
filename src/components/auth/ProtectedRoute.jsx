import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { Box, Button, Icon } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { useSubscription } from '../../hooks/useSubscription'
import { useToast } from '@chakra-ui/react'

const ProtectedRoute = () => {
  const token = storage.getToken()
  const location = useLocation()
  const { isCollapsed } = useSidebar()
  const { canCreateProposal } = useSubscription()
  const navigate = useNavigate()
  const toast = useToast()

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

  if (!token) {
    return <Navigate to="/login" replace />
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
        title: 'Nova Proposta',
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
            Nova Proposta
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
      </Box>
    </Box>
  )
}

export default ProtectedRoute
