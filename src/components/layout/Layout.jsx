import { Box, useColorModeValue } from '@chakra-ui/react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSidebar } from '../../contexts/SidebarContext'

const Layout = ({ 
  children, 
  headerTitle, 
  showBackButton = false, 
  headerRightContent 
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isCollapsed } = useSidebar()

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header ocupa 100% da largura */}
      <Header 
        title={headerTitle}
        showBackButton={showBackButton}
        rightContent={headerRightContent}
      />
      
      {/* Sidebar inicia abaixo do header */}
      <Box position="relative" display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>
      
      {/* Conteúdo principal */}
      <Box 
        ml={{ base: 0, lg: isCollapsed ? '60px' : '280px' }}
        transition="margin-left 0.3s ease"
        minH="calc(100vh - 73px)"
        pt={4}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout