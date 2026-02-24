import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    Icon,
    Flex,
    Avatar,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import {
    FiUsers, FiPlus, FiLock, FiMoreVertical,
    FiEdit2, FiTrash2, FiMail,
} from 'react-icons/fi'
import Container from '../components/layout/Container'
import { useSubscription } from '../hooks/useSubscription'

// ─── Mock users — will be replaced by API later ──────────────────────────────
const MOCK_USERS = [
    { id: 1, name: 'Gabriel Bomfim', email: 'gabriel@bomfimsolutions.com', role: 'Admin', status: 'Ativo', avatarBg: 'emerald.500' },
    { id: 2, name: 'Maria Silva', email: 'maria@bomfimsolutions.com', role: 'Membro', status: 'Ativo', avatarBg: 'blue.400' },
    { id: 3, name: 'Carlos Santos', email: 'carlos@bomfimsolutions.com', role: 'Membro', status: 'Pendente', avatarBg: 'orange.400' },
]

// ─── Lock overlay (same pattern as SettingsGoals / SettingsProfile) ───────────
const UpgradeOverlay = () => (
    <Flex
        position="absolute"
        top={0} left={0} right={0} bottom={0}
        bg="whiteAlpha.700"
        zIndex={20}
        align="center"
        justify="center"
        borderRadius="2xl"
        backdropFilter="blur(4px)"
    >
        <VStack
            spacing={4}
            bg="white"
            p={8}
            borderRadius="2xl"
            shadow="xl"
            border="1px"
            borderColor="gray.100"
            maxW="sm"
            textAlign="center"
        >
            <Flex
                w={16} h={16}
                bg="purple.50"
                borderRadius="2xl"
                align="center"
                justify="center"
            >
                <Icon as={FiLock} color="purple.500" boxSize={8} />
            </Flex>
            <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                    Recurso exclusivo Business
                </Text>
                <Text fontSize="sm" color="gray.600">
                    Gerencie múltiplos usuários na sua conta com o plano Business. Defina funções, permissões e mantenha sua equipe organizada.
                </Text>
            </Box>
            <Button
                w="full"
                colorScheme="purple"
                onClick={() => window.location.href = '/dashboard/configuracoes/assinatura'}
            >
                Fazer Upgrade para Business
            </Button>
        </VStack>
    </Flex>
)

// ─── Main component ───────────────────────────────────────────────────────────
const UsersPage = () => {
    const { isBusiness } = useSubscription()

    return (
        <Container maxW="container.xl">
            <Box position="relative">
                {/* Lock overlay for Free and Pro */}
                {!isBusiness && <UpgradeOverlay />}

                <VStack align="stretch" spacing={6}>
                    {/* Header */}
                    <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        align={{ base: 'start', sm: 'center' }}
                        gap={4}
                    >
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                Usuários
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={1}>
                                Gerencie os membros da sua equipe
                            </Text>
                        </Box>

                        <Button
                            leftIcon={<Icon as={FiPlus} />}
                            colorScheme="green"
                            bg="green.400"
                            color="white"
                            rounded="xl"
                            fontWeight="medium"
                            shadow="md"
                            _hover={{ bg: 'green.500', transform: 'translateY(-1px)', shadow: 'lg' }}
                            transition="all 0.2s"
                            isDisabled={!isBusiness}
                        >
                            Convidar Usuário
                        </Button>
                    </Flex>

                    {/* Stats */}
                    <HStack spacing={4}>
                        <Card flex={1} bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                            <CardBody p={5}>
                                <Flex align="center" gap={4}>
                                    <Flex w={12} h={12} bg="emerald.50" rounded="xl" align="center" justify="center" flexShrink={0}>
                                        <Icon as={FiUsers} boxSize={6} color="emerald.500" />
                                    </Flex>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                            {MOCK_USERS.length}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">Usuários ativos</Text>
                                    </Box>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card flex={1} bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                            <CardBody p={5}>
                                <Flex align="center" gap={4}>
                                    <Flex w={12} h={12} bg="orange.50" rounded="xl" align="center" justify="center" flexShrink={0}>
                                        <Icon as={FiMail} boxSize={6} color="orange.400" />
                                    </Flex>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                            {MOCK_USERS.filter(u => u.status === 'Pendente').length}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">Convites pendentes</Text>
                                    </Box>
                                </Flex>
                            </CardBody>
                        </Card>
                    </HStack>

                    {/* Users Table */}
                    <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200" overflow="hidden">
                        <Table variant="simple">
                            <Thead bg="gray.50">
                                <Tr>
                                    <Th fontSize="xs" color="gray.500" fontWeight="semibold" py={4}>Usuário</Th>
                                    <Th fontSize="xs" color="gray.500" fontWeight="semibold" py={4}>Função</Th>
                                    <Th fontSize="xs" color="gray.500" fontWeight="semibold" py={4}>Status</Th>
                                    <Th w="60px" />
                                </Tr>
                            </Thead>
                            <Tbody>
                                {MOCK_USERS.map((u) => (
                                    <Tr key={u.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                                        <Td py={4}>
                                            <HStack spacing={3}>
                                                <Avatar
                                                    size="sm"
                                                    name={u.name}
                                                    bg={u.avatarBg}
                                                    color="white"
                                                />
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                                        {u.name}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.500">{u.email}</Text>
                                                </Box>
                                            </HStack>
                                        </Td>
                                        <Td>
                                            <Badge
                                                bg={u.role === 'Admin' ? 'emerald.50' : 'gray.100'}
                                                color={u.role === 'Admin' ? 'emerald.700' : 'gray.600'}
                                                px={2.5}
                                                py={0.5}
                                                rounded="full"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                            >
                                                {u.role}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge
                                                bg={u.status === 'Ativo' ? 'green.50' : 'orange.50'}
                                                color={u.status === 'Ativo' ? 'green.600' : 'orange.500'}
                                                px={2.5}
                                                py={0.5}
                                                rounded="full"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                            >
                                                {u.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    icon={<Icon as={FiMoreVertical} />}
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label="Ações"
                                                    rounded="lg"
                                                    isDisabled={!isBusiness}
                                                />
                                                <MenuList rounded="xl" py={1} shadow="lg">
                                                    <MenuItem icon={<Icon as={FiEdit2} boxSize={4} />} fontSize="sm">
                                                        Editar função
                                                    </MenuItem>
                                                    <MenuItem icon={<Icon as={FiTrash2} boxSize={4} />} fontSize="sm" color="red.500">
                                                        Remover
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Card>
                </VStack>
            </Box>
        </Container>
    )
}

export default UsersPage
