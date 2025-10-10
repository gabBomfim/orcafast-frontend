import {
  Button,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
} from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import SidebarContent from './SidebarContent'

const SidebarToggle = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onOpen}
        leftIcon={<Icon as={FiMenu} />}
        display={{ base: 'flex', lg: 'none' }}
      >
        Menu
      </Button>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontSize="lg" fontWeight="bold" color="gray.900">
              Menu
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent isCollapsed={false} onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SidebarToggle