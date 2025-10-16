import {
  Box,
  IconButton,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { useSidebar } from '../../contexts/SidebarContext'
import SidebarContent from './SidebarContent'

const Sidebar = () => {
  const { isCollapsed, toggleCollapse } = useSidebar()
  const bgColor = useColorModeValue('white', 'dark.500')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  return (
    <Box
      w={isCollapsed ? '60px' : '280px'}
      h="calc(100vh - 73px)"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      left="0"
      //top="60px"
      zIndex="10"
      transition="width 0.3s ease"
      overflow="hidden"
    >
      {/* Sidebar Content */}
      <SidebarContent isCollapsed={isCollapsed} />
    </Box>
  )
}

export default Sidebar