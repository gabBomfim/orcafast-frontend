import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiZap, FiCrop, FiArrowLeft, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import SidebarToggle from './SidebarToggle'

const Header = ({ title, showBackButton = false, rightContent }) => {
  const { logout, getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const { isFree, isPro } = useSubscription()

  const handleLogout = () => {
    logout()
  }

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={1100}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      backdropFilter="blur(8px)"
    >
      <Flex
        w="100%"
        px={4}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Left side */}
        <HStack spacing={4}>
          {/* Mobile Menu Toggle */}
          <SidebarToggle />

          {showBackButton && (
            <Button
              as={Link}
              to="/dashboard"
              variant="ghost"
              size="sm"
              leftIcon={<Icon as={FiArrowLeft} />}
            >
              Dashboard
            </Button>
          )}

          <HStack spacing={2}>
            <Flex
              w={8}
              h={8}
              bg="linear-gradient(135deg, #00d97e 0%, #00b368 100%)"
              borderRadius="lg"
              align="center"
              justify="center"
              boxShadow="0 4px 12px rgba(0, 217, 126, 0.3)"
            >
              <Icon as={FiZap} color="white" boxSize={5} />
            </Flex>
            <Text fontSize="xl" fontWeight="800" color="gray.900" letterSpacing="-0.5px">
              {title || 'OrçaFast'}
            </Text>
          </HStack>
        </HStack>

        {/* Right side */}
        <HStack spacing={3}>
          {/* Action button slot — varies by page */}
          {rightContent}

          {/* Upgrade button — only for Free / Pro */}
          {!rightContent && isFree && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Icon as={FiCrop} />}
              as={Link}
              to="/dashboard/configuracoes/assinatura"
            >
              Upgrade Pro
            </Button>
          )}
          {!rightContent && isPro && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Icon as={FiCrop} />}
              as={Link}
              to="/dashboard/configuracoes/assinatura"
            >
              Upgrade Business
            </Button>
          )}

          {/* User Menu — always visible on every page */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              p={2}
              borderRadius="full"
            >
              <HStack spacing={2}>
                <Avatar
                  size="sm"
                  name={user?.name}
                  bg="emerald.500"
                  color="white"
                />
                <Text fontSize="sm" fontWeight="medium">
                  {user?.name?.split(' ')[0]}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem
                as={Link}
                to="/dashboard/configuracoes/perfil"
                icon={<Icon as={FiUser} />}
              >
                Meu Perfil
              </MenuItem>
              <MenuItem
                icon={<Icon as={FiLogOut} />}
                onClick={handleLogout}
                color="red.500"
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

      </Flex>
    </Box>
  )
}

export default Header