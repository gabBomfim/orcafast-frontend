import {
  Box,
  IconButton,
  Icon,
} from '@chakra-ui/react'
import {
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { useSidebar } from '../../contexts/SidebarContext'
import SidebarContent from './SidebarContent'

const Sidebar = () => {
  const { isCollapsed, toggleCollapse } = useSidebar()

  return (
    <Box
      w={isCollapsed ? '60px' : '280px'}
      h="calc(100vh - 73px)"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
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