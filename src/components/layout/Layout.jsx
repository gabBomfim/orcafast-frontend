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
  const bgColor = useColorModeValue('gray.50', 'dark.500')
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900')
  const headingColor = useColorModeValue('gray.900', 'white')
  const { isCollapsed } = useSidebar()

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
        title={headerTitle}
        showBackButton={showBackButton}
        rightContent={headerRightContent}
      />
      
      <Sidebar />
      
      <Box 
        as="main"
        ml={{ base: 0, lg: isCollapsed ? '80px' : '280px' }}
        pt="73px"
        transition="margin-left 0.2s ease-in-out"
        p={{ base: 4, md: 6 }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout