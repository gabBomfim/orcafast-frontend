import { IconButton, Icon } from '@chakra-ui/react'
import { FiMenu, FiX } from 'react-icons/fi'
import { useSidebar } from '../../contexts/SidebarContext'

const SidebarToggle = () => {
  const { isSidebarOpen, openSidebar, closeSidebar, isMobile } = useSidebar()
  
  if (!isMobile) {
    return null
  }

  return (
    <IconButton
      icon={<Icon as={isSidebarOpen ? FiX : FiMenu} boxSize={6} />}
      onClick={isSidebarOpen ? closeSidebar : openSidebar}
      variant="ghost"
      size="lg"
      aria-label="Toggle Menu"
      display={{ base: 'flex', lg: 'none' }}
      ml={-2}
    />
  )
}

export default SidebarToggle