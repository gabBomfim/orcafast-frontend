import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react'
import { useSidebar } from '../../contexts/SidebarContext'
import SidebarContent from './SidebarContent'

const Sidebar = () => {
  const { isCollapsed, isSidebarOpen, closeSidebar } = useSidebar()

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        isOpen={isSidebarOpen}
        placement="left"
        onClose={closeSidebar}
        returnFocusOnClose={false}
        onOverlayClick={closeSidebar}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="white">
          <SidebarContent isCollapsed={false} onItemClick={closeSidebar} />
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        as="nav"
        display={{ base: 'none', lg: 'block' }}
        w={isCollapsed ? '80px' : '280px'}
        h="100vh"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        position="fixed"
        top="0"
        left="0"
        zIndex={1000}
        transition="width 0.2s ease-in-out"
        pt="73px"
        overflowY="auto"
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </Box>
    </>
  )
}

export default Sidebar