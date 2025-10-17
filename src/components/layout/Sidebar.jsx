import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useSidebar } from '../../contexts/SidebarContext'
import SidebarContent from './SidebarContent'

const Sidebar = () => {
  const { isCollapsed, isSidebarOpen, closeSidebar } = useSidebar()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
        <DrawerContent bg={bgColor}>
          <SidebarContent isCollapsed={false} onLinkClick={closeSidebar} />
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        as="nav"
        display={{ base: 'none', lg: 'block' }}
        w={isCollapsed ? '80px' : '280px'}
        h="100vh"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
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