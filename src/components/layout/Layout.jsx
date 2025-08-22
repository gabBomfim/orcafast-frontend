import { Box, useColorModeValue } from '@chakra-ui/react'
import Header from './Header'

const Layout = ({ 
  children, 
  headerTitle, 
  showBackButton = false, 
  headerRightContent 
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header 
        title={headerTitle}
        showBackButton={showBackButton}
        rightContent={headerRightContent}
      />
      <Box>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
