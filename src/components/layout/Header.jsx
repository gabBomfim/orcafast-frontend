import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiZap, FiSettings, FiCrop, FiArrowLeft, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const Header = ({ title, showBackButton = false, rightContent }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { logout, getCurrentUser } = useAuth()

  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="50"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        backdropFilter="blur(8px)"
        bg={`${bgColor}F5`}
      >
        <Flex
          maxW="container.xl"
          mx="auto"
          px={4}
          py={4}
          align="center"
          justify="space-between"
        >
          {/* Left side */}
          <HStack spacing={4}>
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
              {!showBackButton && (
                <Flex
                  w={8}
                  h={8}
                  bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                  borderRadius="lg"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiZap} color="white" boxSize={5} />
                </Flex>
              )}
              <Text fontSize="xl" fontWeight="bold" color="primary.500">
                {title || 'OrçaFast'}
              </Text>
            </HStack>
          </HStack>

          {/* Right side */}
          <HStack spacing={3}>
            {rightContent || (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Icon as={FiCrop} />}
                >
                  Upgrade Pro
                </Button>
                
                {/* User Menu */}
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
                    <MenuItem icon={<Icon as={FiUser} />}>
                      Meu Perfil
                    </MenuItem>
                    <MenuItem icon={<Icon as={FiSettings} />}>
                      Configurações
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
              </>
            )}
          </HStack>
        </Flex>
      </Box>
    </>
  )
}

export default Header