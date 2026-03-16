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
import { FiCrop, FiArrowLeft, FiLogOut, FiUser, FiBriefcase } from 'react-icons/fi'
import OrcafastLogo from '../ui/OrcafastLogo'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { useSidebar } from '../../contexts/SidebarContext'
import SidebarToggle from './SidebarToggle'

const Header = ({ title, showBackButton = false, rightContent }) => {
  const { logout, getCurrentUser } = useAuth()
  const user = getCurrentUser()
  const { toggleCollapse, isMobile, closeSidebar } = useSidebar()
  const isAdmin = user?.role === 3 || user?.role === 1
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
              px={{ base: 2, md: 4 }}
            >
              <Text display={{ base: 'none', md: 'block' }}>Dashboard</Text>
            </Button>
          )}

          <HStack spacing={3} display={{ base: rightContent ? 'none' : 'flex', md: 'flex' }}>
            <OrcafastLogo
              variant="full"
              height="32px"
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/dashboard'}
            />
          </HStack>
        </HStack>

        {/* Center/Compact Title on mobile if logo is hidden */}
        {rightContent && (
          <Box
            display={{ base: 'block', md: 'none' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            <OrcafastLogo 
              variant="full" 
              height="24px" 
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/dashboard'}
            />
          </Box>
        )}

        {/* Right side */}
        <HStack spacing={3}>
          {/* Action button slot — varies by page */}
          {rightContent}

          {/* Upgrade button — only for Free / Pro — and only for Admins */}
          {!rightContent && isFree && isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Icon as={FiCrop} />}
                as={Link}
                to="/dashboard/configuracoes/assinatura"
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Upgrade Pro
              </Button>
              <Button
                variant="outline"
                size="sm"
                as={Link}
                to="/dashboard/configuracoes/assinatura"
                display={{ base: 'inline-flex', md: 'none' }}
                colorScheme="emerald"
                px={2}
              >
                <Icon as={FiCrop} />
              </Button>
            </>
          )}
          {!rightContent && isPro && isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Icon as={FiCrop} />}
                as={Link}
                to="/dashboard/configuracoes/assinatura"
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Upgrade Business
              </Button>
              <Button
                variant="outline"
                size="sm"
                as={Link}
                to="/dashboard/configuracoes/assinatura"
                display={{ base: 'inline-flex', md: 'none' }}
                colorScheme="emerald"
                px={2}
              >
                <Icon as={FiCrop} />
              </Button>
            </>
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
                <Text fontSize="sm" fontWeight="medium" display={{ base: 'none', sm: 'block' }}>
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
              {isAdmin && (
                <MenuItem
                  as={Link}
                  to="/dashboard/configuracoes/empresa"
                  icon={<Icon as={FiBriefcase} />}
                >
                  Perfil da Empresa
                </MenuItem>
              )}
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