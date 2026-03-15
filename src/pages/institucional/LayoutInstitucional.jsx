import React from 'react';
import { Box, Container, Flex, HStack, Icon, Text, VStack, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiFileText, FiShield, FiHelpCircle, FiMenu } from 'react-icons/fi';
import logo from '../../assets/logo/logo-full.svg';

const menuItems = [
  { path: '/termos', label: 'Termos de Uso', icon: FiFileText },
  { path: '/privacidade', label: 'Política de Privacidade', icon: FiShield },
  { path: '/suporte', label: 'Suporte', icon: FiHelpCircle },
];

const SidebarContent = ({ activePath, onClick }) => (
  <VStack align="stretch" spacing={2} w="full">
    {menuItems.map((item) => {
      const isActive = activePath === item.path;
      return (
        <Box
          key={item.path}
          as={Link}
          to={item.path}
          onClick={onClick}
          p={3}
          borderRadius="lg"
          bg={isActive ? 'emerald.50' : 'transparent'}
          color={isActive ? 'emerald.600' : 'gray.600'}
          fontWeight={isActive ? 'semibold' : 'medium'}
          _hover={{ bg: isActive ? 'emerald.50' : 'gray.50', color: isActive ? 'emerald.600' : 'gray.900' }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          textDecoration="none"
        >
          <HStack spacing={3}>
            <Icon as={item.icon} boxSize={5} />
            <Text>{item.label}</Text>
          </HStack>
        </Box>
      );
    })}
  </VStack>
);

const LayoutInstitucional = ({ children }) => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = '#f8faf9'; // Fundo limpo
  const cardBg = '#ffffff';

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor="gray.100" position="sticky" top={0} zIndex={50}>
        <Container maxW="container.xl" py={4}>
          <Flex justify={{ base: 'space-between', md: 'center' }} align="center" position="relative">
            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              variant="ghost"
              icon={<FiMenu />}
              onClick={onOpen}
              aria-label="Menu Principal"
            />

            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="OrçaFast" style={{ height: '36px', width: 'auto' }} />
            </Link>

            {/* Placeholder para alinhar logo no centro no mobile */}
            <Box display={{ base: 'block', md: 'none' }} w={10} />
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8} align="start">
          {/* Sidebar Desktop */}
          <Box
            display={{ base: 'none', md: 'block' }}
            w="280px"
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            position="sticky"
            top="100px" // Abaixo do header
          >
            <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={4}>
              Documentação
            </Text>
            <SidebarContent activePath={location.pathname} />
          </Box>

          {/* Main Content */}
          <Box flex={1} w="full">
            <Box
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              p={{ base: 6, md: 10 }}
              minH="calc(100vh - 200px)"
            >
              {children}
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={2} />
          <DrawerHeader borderBottomWidth="1px" pt={6} pb={4}>
            <img src={logo} alt="OrçaFast" style={{ height: '32px', width: 'auto' }} />
          </DrawerHeader>
          <DrawerBody py={6}>
            <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={4}>
              Navegação
            </Text>
            <SidebarContent activePath={location.pathname} onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LayoutInstitucional;
