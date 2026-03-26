import {
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Divider,
  Avatar,
  Collapse,
  Box,
  Flex,
  useDisclosure,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiTarget,
  FiMessageSquare,
  FiStar,
  FiLogOut,
  FiAward,
  FiChevronRight,
  FiChevronLeft,
  FiLock,
  FiBriefcase,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useSidebar } from '../../contexts/SidebarContext'
import { useSubscription } from '../../hooks/useSubscription'
import { openWhatsApp } from '../../utils/whatsapp'
import { FaWhatsapp } from 'react-icons/fa'

const SidebarContent = ({ isCollapsed = false, onItemClick = () => { } }) => {
  const { logout, getCurrentUser } = useAuth()
  const { toggleCollapse, isMobile, closeSidebar } = useSidebar()
  const { isFree, isPro, isBusiness, canSetFinancialGoals, canCustomizeBranding, subscribed, onTrial } = useSubscription()
  const location = useLocation()
  const user = getCurrentUser()
  const { isOpen: isSettingsOpen, onToggle: onSettingsToggle } = useDisclosure()
  const roleLabel = {
    1: 'Administrador',
    2: 'Cliente',
    3: 'Proprietário',
    4: 'Membro',
  }[user?.role] || 'Usuário'

  const hasAccess = subscribed || onTrial

  const menuItems = [
    { icon: FiHome, label: 'Início', path: '/dashboard', isLocked: !hasAccess },
    { icon: FiUsers, label: 'Clientes', path: '/dashboard/clientes', isLocked: !hasAccess },
    { icon: FiFileText, label: 'Orçamentos', path: '/dashboard/propostas', isLocked: !hasAccess },
  ]


  const settingsSubItems = [
    {
      icon: FiUser,
      label: 'Meu Perfil',
      path: '/dashboard/configuracoes/perfil',
      isLocked: !hasAccess || !canCustomizeBranding,
    },
    {
      icon: FiBriefcase,
      label: 'Perfil da Empresa',
      path: '/dashboard/configuracoes/empresa',
      isLocked: !hasAccess || !canCustomizeBranding,
      isHidden: user?.role !== 3 && user?.role !== 1,
    },
    {
      icon: FiTarget,
      label: 'Metas',
      path: '/dashboard/configuracoes/metas',
      isLocked: !hasAccess || !canSetFinancialGoals,
      isHidden: user?.role !== 3 && user?.role !== 1,
    },
    {
      icon: FiUsers,
      label: 'Equipe',
      path: '/dashboard/usuarios',
      isLocked: !subscribed || !isBusiness,
      isHidden: user?.role !== 3 && user?.role !== 1,
    },
    { 
      icon: FiStar, 
      label: 'Assinatura', 
      path: '/dashboard/configuracoes/assinatura', 
      isLocked: false,
      isHidden: user?.role !== 3 && user?.role !== 1,
    },
  ]

  const handleLogout = () => {
    logout()
    onItemClick()
  }

  // Auto-expand settings if on a settings page
  const isSettingsPage = location.pathname.startsWith('/dashboard/configuracoes')
  if (isSettingsPage && !isSettingsOpen) {
    onSettingsToggle()
  }

  const renderButton = (item, isActive = false) => (
    <Box key={item.path} position="relative">
      <Button
        as={Link}
        to={item.path}
        variant="ghost"
        size="md"
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        leftIcon={
          <Icon
            as={item.icon}
            boxSize={4}
            color={isActive ? 'emerald.600' : 'gray.600'}
          />
        }
        color={isActive ? 'emerald.600' : 'gray.700'}
        bg={isActive ? 'emerald.50' : 'transparent'}
        _hover={{
          bg: isActive ? 'emerald.50' : 'gray.50',
        }}
        fontWeight={isActive ? 'semibold' : 'normal'}
        onClick={onItemClick}
        h="40px"
        w="full"
        borderRadius="lg"
        transition="all 0.2s"
        pl={isCollapsed ? 0 : 4}
        pr={isCollapsed ? 0 : 4}
        fontSize="sm"
        iconSpacing={isCollapsed ? 0 : 3}
        minW={isCollapsed ? '60px' : 'auto'}
      >
        {!isCollapsed && (
          <Flex w="full" align="center">
            <Text as="span">{item.label}</Text>
            {item.isLocked && <Icon as={FiLock} ml="auto" color="gray.400" boxSize={3} />}
          </Flex>
        )}
      </Button>

      {/* Active indicator */}
      {isActive && (
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="3px"
          bg="emerald.500"
          borderRadius="0 2px 2px 0"
        />
      )}
    </Box>
  )

  return (
    <Flex direction="column" h="full" p={isCollapsed ? 2 : 4} pt={4}>
      {/* Header */}
      <Box mb={6}>
        {/* User Info */}
        <Collapse in={!isCollapsed}>
          <Box p={3} bg="gray.50" borderRadius="xl" mb={4}>
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name={user?.name || 'User'}
                bg="emerald.500"
                color="white"
                getInitials={(name) => {
                  if (!name) return 'U'
                  const parts = name.split(' ')
                  if (parts.length >= 2) {
                    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                  }
                  return name.substring(0, 2).toUpperCase()
                }}
              />
              <Box flex="1" minW={0}>
                <Text fontWeight="medium" fontSize="sm" color="gray.900" isTruncated>
                  {user?.name || 'Usuário'}
                </Text>
                <Text fontSize="xs" color="gray.500" isTruncated>
                  {roleLabel}
                </Text>

              </Box>
            </HStack>
          </Box>
        </Collapse>

        {/* Upgrade card — Free sees "Upgrade Pro", Pro sees "Upgrade Business", Business sees nothing — ONLY FOR ADMINS */}
        <Collapse in={!isCollapsed && (user?.role === 3 || user?.role === 1)}>
          {isFree && (
            <Box
              mt={1}
              bg="transparent"
              border="1px"
              borderColor="emerald.400"
              borderRadius="lg"
              p={3}
              as={Link}
              to="/dashboard/configuracoes/assinatura"
              cursor="pointer"
              _hover={{
                borderColor: 'emerald.500',
                boxShadow: '0 2px 8px rgba(0, 217, 126, 0.15)',
                transform: 'translateY(-1px)'
              }}
              transition="all 0.2s ease"
              position="relative"
              overflow="hidden"
              display="block"
            >
              {/* Background gradient overlay */}
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(to right, rgba(0, 217, 126, 0.03), rgba(0, 217, 126, 0.01))"
                borderRadius="lg"
                pointerEvents="none"
              />

              {/* Content */}
              <HStack spacing={3} position="relative" zIndex={1}>
                <Box
                  w={8}
                  h={8}
                  bg="linear-gradient(135deg, #00d97e 0%, #00b368 100%)"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  boxShadow="0 2px 8px rgba(0, 217, 126, 0.25)"
                >
                  <Icon as={FiAward} color="white" boxSize={4} />
                </Box>

                <VStack spacing={0} align="flex-start" flex={1}>
                  <HStack spacing={1.5}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      {isFree ? 'Upgrade Autônomo' : 'Upgrade Equipe'}
                    </Text>
                    <Badge
                      bg="emerald.100"
                      color="emerald.700"
                      px={1.5}
                      py={0.5}
                      borderRadius="sm"
                      fontSize="2xs"
                      fontWeight="semibold"
                    >
                      Premium
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.600">
                    Recursos ilimitados
                  </Text>
                </VStack>

                <Icon
                  as={FiChevronRight}
                  color="emerald.500"
                  boxSize={4}
                  transition="transform 0.2s"
                />
              </HStack>
            </Box>
          )}
        </Collapse>
      </Box>

      {/* Main Menu */}
      <VStack spacing={1} align="stretch" flex="1" overflowY="auto">
        {!isCollapsed && (
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={3} mb={2} letterSpacing="wide">
            PRINCIPAL
          </Text>
        )}
        {menuItems.map((item) =>
          renderButton(item, location.pathname === item.path)
        )}

        {/* Settings Accordion */}
        {!isCollapsed && (
          <Box mt={4}>
            <Button
              variant="ghost"
              size="md"
              justifyContent="flex-start"
              leftIcon={<Icon as={FiSettings} boxSize={4} />}
              rightIcon={
                <Icon
                  as={isSettingsOpen ? FiChevronUp : FiChevronDown}
                  boxSize={4}
                  transition="transform 0.2s"
                />
              }
              color={isSettingsPage ? 'emerald.600' : 'gray.700'}
              bg={isSettingsPage ? 'emerald.50' : 'transparent'}
              _hover={{
                bg: isSettingsPage ? 'emerald.50' : 'gray.50',
              }}
              onClick={onSettingsToggle}
              h="40px"
              w="full"
              borderRadius="lg"
              transition="all 0.2s"
              pl={4}
              pr={4}
              fontSize="sm"
              iconSpacing={3}
            >
              Configurações
            </Button>

            <Collapse in={isSettingsOpen} animateOpacity>
              <VStack spacing={1} align="stretch" mt={1} ml={4} pl={4} borderLeft="2px" borderColor="gray.200">
                {settingsSubItems.filter(item => !item.isHidden).map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Button
                      key={item.path}
                      as={Link}
                      to={item.path}
                      variant="ghost"
                      size="md"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={item.icon} boxSize={4} />}
                      color={isActive ? 'emerald.600' : 'gray.600'}
                      fontWeight={isActive ? 'medium' : 'normal'}
                      _hover={{
                        bg: 'gray.50',
                        color: 'gray.900'
                      }}
                      onClick={onItemClick}
                      h="40px"
                      w="full"
                      borderRadius="lg"
                      pl={3}
                      pr={3}
                      fontSize="sm"
                      iconSpacing={3}
                    >
                      {item.label}
                      {item.isLocked && (
                        <Icon as={FiLock} ml="auto" color="gray.400" boxSize={3} />
                      )}
                    </Button>
                  )
                })}
              </VStack>
            </Collapse>
          </Box>
        )}

        {isCollapsed && (
          <Button
            variant="ghost"
            size="md"
            justifyContent="center"
            leftIcon={<Icon as={FiSettings} boxSize={4} />}
            color={isSettingsPage ? 'emerald.600' : 'gray.700'}
            bg={isSettingsPage ? 'emerald.50' : 'transparent'}
            _hover={{ bg: 'gray.50' }}
            h="40px"
            w="full"
            borderRadius="lg"
            fontSize="sm"
          />
        )}
      </VStack>

      {/* Settings & Collapse/Logout Buttons at Bottom */}
      <Box borderTop="1px" borderColor="gray.200" pt={4} mt="auto">
        <VStack spacing={1} align="stretch">
          <Tooltip label={isCollapsed ? 'Suporte via WhatsApp' : ''} placement="right" hasArrow>
            <Button
              variant="ghost"
              size="md"
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              leftIcon={<Icon as={FaWhatsapp} boxSize={4} color="green.500" />}
              color="green.600"
              _hover={{ bg: 'green.50' }}
              onClick={() => openWhatsApp({ phone: '11961693447', message: 'Olá! Preciso de ajuda com a OrçaFast.' })}
              h="40px"
              w="full"
              borderRadius="lg"
              transition="all 0.2s"
              pl={isCollapsed ? 0 : 4}
              pr={isCollapsed ? 0 : 4}
              fontSize="sm"
              iconSpacing={isCollapsed ? 0 : 3}
            >
              {!isCollapsed && 'Suporte'}
            </Button>
          </Tooltip>
          <Button
            variant="ghost"
            size="md"
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            leftIcon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} boxSize={4} />}
            color="gray.600"
            _hover={{ bg: 'gray.50', transform: 'translateX(2px)' }}
            onClick={() => {
              if (isMobile) {
                closeSidebar()
              } else {
                toggleCollapse()
              }
            }}
            h="40px"
            w="full"
            borderRadius="lg"
            transition="all 0.2s"
            pl={isCollapsed ? 0 : 4}
            pr={isCollapsed ? 0 : 4}
            fontSize="sm"
            iconSpacing={isCollapsed ? 0 : 3}
          >
            {!isCollapsed && (isCollapsed ? 'Expandir' : 'Recolher')}
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}

export default SidebarContent
