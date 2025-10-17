import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { Box, useColorModeValue, Button, Icon } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import { useSidebar } from '../../contexts/SidebarContext'

const ProtectedRoute = () => {
  const token = storage.getToken()
  const location = useLocation()
  const bgColor = useColorModeValue('gray.50', 'dark.500')
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900')
  const headingColor = useColorModeValue('gray.900', 'white')
  const { isCollapsed } = useSidebar()

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
        title: 'Propostas', 
        showBackButton: true,
        rightContent: (
          <Button
            as={Link}
            to="/dashboard/propostas/nova"
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
      bg={bgColor} 
      color={textColor}
      sx={{
        'h1, h2, h3, h4, h5, h6': {
          color: headingColor,
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
