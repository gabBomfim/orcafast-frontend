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
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiZap,
  FiTrendingUp,
  FiDollarSign,
  FiChevronRight,
  FiChevronLeft,
  FiAward,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useSidebar } from '../../contexts/SidebarContext'

const SidebarContent = ({ isCollapsed = false, onItemClick = () => {} }) => {
  const { logout, getCurrentUser } = useAuth()
  const { toggleCollapse } = useSidebar()
  const location = useLocation()
  const user = getCurrentUser()
  
  // Dark mode colors
  const userBgColor = useColorModeValue('gray.50', 'whiteAlpha.100')
  const userNameColor = useColorModeValue('gray.900', 'white')
  const userRoleColor = useColorModeValue('gray.500', 'whiteAlpha.600')
  const sectionTitleColor = useColorModeValue('gray.500', 'whiteAlpha.600')
  const buttonTextColor = useColorModeValue('gray.700', 'whiteAlpha.900')
  const buttonIconColor = useColorModeValue('gray.600', 'whiteAlpha.700')
  const activeTextColor = useColorModeValue('primary.600', 'primary.400')
  const activeBgColor = useColorModeValue('primary.50', 'whiteAlpha.200')
  const hoverBgColor = useColorModeValue('gray.50', 'whiteAlpha.100')
  const upgradeBorderColor = useColorModeValue('primary.400', 'primary.500')
  const upgradeTextColor = useColorModeValue('gray.800', 'white')
  const upgradeSubtextColor = useColorModeValue('gray.600', 'whiteAlpha.700')

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiUsers, label: 'Clientes', path: '/dashboard/clientes' },
    { icon: FiFileText, label: 'Propostas', path: '/dashboard/propostas' },
  ]

  const quickActions = [
    { icon: FiTrendingUp, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: FiDollarSign, label: 'Financeiro', path: '/dashboard/financeiro' },
  ]

  const handleLogout = () => {
    logout()
    onItemClick()
  }

  const renderButton = (item, isActive = false) => (
    <Box key={item.path} position="relative">
      <Button
        as={Link}
        to={item.path}
        variant="ghost"
        size="sm"
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        leftIcon={
          <Icon 
            as={item.icon} 
            boxSize={4}
            color={isActive ? activeTextColor : buttonIconColor}
          />
        }
        color={isActive ? activeTextColor : buttonTextColor}
        bg={isActive ? activeBgColor : 'transparent'}
        _hover={{ 
          bg: isActive ? activeBgColor : hoverBgColor,
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
        leftIconSpacing={isCollapsed ? 0 : 3}
        minW={isCollapsed ? '60px' : 'auto'}
      >
        {!isCollapsed && item.label}
      </Button>
      
      {/* Active indicator */}
      {isActive && (
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="3px"
          bg="primary.500"
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
          <HStack spacing={3} p={3} bg={userBgColor} borderRadius="lg" mb={4}>
            <Avatar
              size="sm"
              name={user?.name}
              bg="primary.500"
              color="white"
            />
            <Box flex="1" minW={0}>
              <Text fontWeight="semibold" fontSize="sm" color={userNameColor} isTruncated>
                {user?.name}
              </Text>
              <Text fontSize="xs" color={userRoleColor} isTruncated>
                Admin
              </Text>
            </Box>
          </HStack>
        </Collapse>

        {/* Upgrade Pro Card */}
        <Collapse in={!isCollapsed}>
          <Box
          mt={1}
            bg="transparent"
            border="1px"
            borderColor={upgradeBorderColor}
            borderRadius="lg"
            p={3}
            cursor="pointer"
            _hover={{ 
              borderColor: 'primary.500',
              boxShadow: '0 2px 8px rgba(0, 217, 126, 0.15)',
              transform: 'translateY(-1px)'
            }}
            transition="all 0.2s ease"
            position="relative"
            overflow="hidden"
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
                  <Text fontSize="sm" fontWeight="bold" color={upgradeTextColor}>
                    Upgrade Pro
                  </Text>
                  <Badge
                    bg="primary.100"
                    color="primary.700"
                    px={1.5}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="2xs"
                    fontWeight="semibold"
                  >
                    Premium
                  </Badge>
                </HStack>
                <Text fontSize="xs" color={upgradeSubtextColor}>
                  Recursos ilimitados
                </Text>
              </VStack>
              
              <Icon 
                as={FiChevronRight} 
                color="primary.500" 
                boxSize={4}
                transition="transform 0.2s"
                _groupHover={{ transform: 'translateX(2px)' }}
              />
            </HStack>
          </Box>
        </Collapse>
      </Box>

      {/* Main Menu */}
      <VStack spacing={4} align="stretch" flex="1">
        <VStack spacing={1} align="stretch">
          {!isCollapsed && (
            <Text fontSize="xs" fontWeight="semibold" color={sectionTitleColor} px={4} mb={2} letterSpacing="wide">
              PRINCIPAL
            </Text>
          )}
          {menuItems.map((item) => 
            renderButton(item, location.pathname === item.path)
          )}
        </VStack>

        <Divider opacity={0.2} />

        <VStack spacing={1} align="stretch">
          {!isCollapsed && (
            <Text fontSize="xs" fontWeight="semibold" color={sectionTitleColor} px={4} mb={2} letterSpacing="wide">
              AÇÕES RÁPIDAS
            </Text>
          )}
          {quickActions.map((item) => renderButton(item))}
        </VStack>
      </VStack>

      <Divider opacity={0.2} />

      {/* Settings & Logout */}
      <VStack spacing={1} align="stretch" mt={4} pb={2}>
        <Button
          variant="ghost"
          size="sm"
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
          leftIcon={<Icon as={FiSettings} boxSize={4} />}
          color={buttonTextColor}
          _hover={{ bg: hoverBgColor }}
          onClick={onItemClick}
          h="40px"
          w="full"
          borderRadius="lg"
          transition="all 0.2s"
          pl={isCollapsed ? 0 : 4}
          pr={isCollapsed ? 0 : 4}
          fontSize="sm"
          leftIconSpacing={isCollapsed ? 0 : 3}
          minW={isCollapsed ? '60px' : 'auto'}
        >
          {!isCollapsed && 'Configurações'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
          leftIcon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} boxSize={4} />}
          color={buttonIconColor}
          _hover={{ bg: hoverBgColor, transform: 'translateX(2px)' }}
          onClick={toggleCollapse}
          h="40px"
          w="full"
          borderRadius="lg"
          transition="all 0.2s"
          pl={isCollapsed ? 0 : 4}
          pr={isCollapsed ? 0 : 4}
          fontSize="sm"
          leftIconSpacing={isCollapsed ? 0 : 3}
          minW={isCollapsed ? '60px' : 'auto'}
        >
          {!isCollapsed && (isCollapsed ? 'Expandir' : 'Recolher')}
        </Button>
      </VStack>
    </Flex>
  )
}

export default SidebarContent