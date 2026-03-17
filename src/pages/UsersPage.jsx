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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    useToast,
    Spinner,
    Center,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import {
    FiUsers, FiPlus, FiLock, FiMoreVertical,
    FiEdit2, FiTrash2, FiMail, FiSearch, FiChevronDown, FiAlertCircle
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import Container from '../components/layout/Container'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../hooks/useAuth'
import { teamUserService } from '../services'

// ─── Role Mapping (Reflects Laravel UserRole Enum) ───────────────────────────
const ROLE_MAP = {
    1: { label: 'Administrador Master', color: 'red' },
    2: { label: 'Cliente', color: 'blue' },
    3: { label: 'Administrador', color: 'purple' },
    4: { label: 'Membro', color: 'green' },
}

const getRoleBadge = (roleId) => {
    const role = ROLE_MAP[roleId] || { label: 'Usuário', color: 'gray' }
    return (
        <Badge variant="subtle" colorScheme={role.color} rounded="full" px={2.5}>
            {role.label}
        </Badge>
    )
}

// ─── Lock Overlay (Business Required) ────────────────────────────────────────
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

// ─── Restrict Access Overlay (Permission Required) ────────────────────────────
const RestrictedOverlay = () => (
    <Flex
        position="absolute"
        top={0} left={0} right={0} bottom={0}
        bg="whiteAlpha.700"
        zIndex={30}
        align="center"
        justify="center"
        borderRadius="2xl"
        backdropFilter="blur(8px)"
    >
        <VStack
            spacing={4}
            bg="white"
            p={10}
            borderRadius="2xl"
            shadow="2xl"
            border="1px"
            borderColor="red.100"
            maxW="md"
            textAlign="center"
        >
            <Flex
                w={20} h={20}
                bg="red.50"
                borderRadius="full"
                align="center"
                justify="center"
            >
                <Icon as={FiAlertCircle} color="red.500" boxSize={10} />
            </Flex>
            <Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
                    Acesso Restrito
                </Text>
                <Text color="gray.600">
                    Apenas os **Administradores** da conta podem gerenciar a equipe. Entre em contato com o administrador da sua empresa para solicitar permissão.
                </Text>
            </Box>
            <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => window.history.back()}
            >
                Voltar para o Dashboard
            </Button>
        </VStack>
    </Flex>
)

const UsersPage = () => {
    const { isBusiness } = useSubscription()
    const { getCurrentUser } = useAuth()
    const toast = useToast()
    const cancelRef = useRef()
    const user = getCurrentUser()

    // Access Control: Only Owner (3) or SaaS Admin (1)
    const canManageTeam = user?.role === 3 || user?.role === 1

    // State
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '' })
    const [errors, setErrors] = useState({})

    // Modals
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    useEffect(() => {
        if (isBusiness) {
            fetchUsers()
        } else {
            setLoading(false)
        }
    }, [isBusiness])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await teamUserService.list()
            setUsers(res.data || [])
        } catch (error) {
            toast({
                title: 'Erro ao carregar usuários',
                description: error.response?.data?.message || 'Tente novamente mais tarde',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!selectedUser && !formData.email) newErrors.email = 'E-mail é obrigatório'
        if (selectedUser && !formData.name) newErrors.name = 'Nome é obrigatório'
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setIsSaving(true)
            if (selectedUser) {
                // Ao atualizar, enviamos apenas o nome (e-mail não é editável na listagem)
                await teamUserService.update(selectedUser.id, { name: formData.name })
                toast({ title: 'Membro atualizado com sucesso', status: 'success' })
            } else {
                await teamUserService.store({ email: formData.email })
                toast({
                    title: 'Convite enviado com sucesso',
                    description: 'Um e-mail com o link de acesso foi enviado para o colaborador.',
                    status: 'success'
                })
            }
            onFormClose()
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Erro ao processar solicitação',
                description: error.response?.data?.message || 'Verifique os dados e tente novamente',
                status: 'error',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await teamUserService.destroy(selectedUser.id)
            toast({ title: 'Membro desativado com sucesso', status: 'success' })
            onDeleteClose()
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Erro ao desativar membro',
                description: error.response?.data?.message || 'Tente novamente',
                status: 'error',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const openCreateModal = () => {
        setSelectedUser(null)
        setFormData({ name: '', email: '' })
        setErrors({})
        onFormOpen()
    }

    const openEditModal = (user) => {
        setSelectedUser(user)
        setFormData({ name: user.name, email: user.email })
        setErrors({})
        onFormOpen()
    }

    const openDeleteDialog = (user) => {
        setSelectedUser(user)
        onDeleteOpen()
    }

    if (loading) {
        return (
            <Center h="50vh">
                <Spinner size="xl" color="primary.500" thickness="4px" />
            </Center>
        )
    }

    return (
        <Container maxW="container.xl">
            <Box position="relative">
                {!isBusiness && <UpgradeOverlay />}
                {!canManageTeam && <RestrictedOverlay />}

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
                            variant="gradient"
                            onClick={openCreateModal}
                            isDisabled={!isBusiness}
                        >
                            Convidar Usuário
                        </Button>
                    </Flex>

                    {/* Stats Card */}
                    <Card flex={1} bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                        <CardBody p={5}>
                            <Flex align="center" gap={4}>
                                <Flex w={12} h={12} bg="emerald.50" rounded="xl" align="center" justify="center" flexShrink={0}>
                                    <Icon as={FiUsers} boxSize={6} color="emerald.500" />
                                </Flex>
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                        {users.length}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">Membros ativos</Text>
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Table Card */}
                    <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead bg="gray.50">
                                    <Tr>
                                        <Th fontSize="xs" py={4}>Usuário</Th>
                                        <Th fontSize="xs" py={4} display={{ base: 'none', md: 'table-cell' }}>Cargo</Th>
                                        <Th fontSize="xs" py={4}>Status</Th>
                                        <Th w="60px" />
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={4} textAlign="center" py={10}>
                                                <VStack spacing={2}>
                                                    <Icon as={FiUsers} boxSize={8} color="gray.300" />
                                                    <Text color="gray.500">Nenhum membro encontrado.</Text>
                                                </VStack>
                                            </Td>
                                        </Tr>
                                    ) : (
                                        users.map((u) => (
                                            <Tr key={u.id} _hover={{ bg: 'gray.50' }}>
                                                <Td py={4}>
                                                    <HStack spacing={3}>
                                                        <Avatar size="sm" name={u.name} src={u.avatar} bg="emerald.500" />
                                                        <Box>
                                                            <Text fontSize="sm" fontWeight="semibold" color="gray.800">{u.name}</Text>
                                                            <Text fontSize="xs" color="gray.500">{u.email}</Text>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td display={{ base: 'none', md: 'table-cell' }}>
                                                    {getRoleBadge(u.role)}
                                                </Td>
                                                <Td>
                                                    <Badge colorScheme="green" rounded="full">
                                                        Ativo
                                                    </Badge>
                                                </Td>
                                                <Td textAlign="right">
                                                    <Menu isLazy>
                                                        <MenuButton
                                                            as={Button}
                                                            size="sm"
                                                            variant="outline"
                                                            rightIcon={<Icon as={FiChevronDown} />}
                                                            bg="gray.50"
                                                            borderColor="gray.200"
                                                            _hover={{ bg: 'gray.100' }}
                                                            isDisabled={!isBusiness}
                                                            px={4}
                                                        >
                                                            Opções
                                                        </MenuButton>
                                                        <MenuList shadow="xl" borderRadius="xl">
                                                            <MenuItem
                                                                icon={<Icon as={FiEdit2} />}
                                                                onClick={() => openEditModal(u)}
                                                            >
                                                                Editar
                                                            </MenuItem>
                                                            {u.id !== user?.id && (
                                                                <MenuItem
                                                                    icon={<Icon as={FiTrash2} />}
                                                                    color="red.500"
                                                                    onClick={() => openDeleteDialog(u)}
                                                                >
                                                                    Remover
                                                                </MenuItem>
                                                            )}
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        ))
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    </Card>
                </VStack>
            </Box>

            {/* Modal de Convidar/Editar */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="2xl" mx={4}>
                    <ModalHeader borderBottom="1px" borderColor="gray.100">
                        {selectedUser ? 'Editar Membro' : 'Convidar Membro'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <VStack spacing={4}>
                            {selectedUser && (
                                <FormControl isInvalid={errors.name}>
                                    <FormLabel fontSize="sm" fontWeight="semibold">Nome Completo</FormLabel>
                                    <Input
                                        placeholder="Ex: João Silva"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                            )}

                            <FormControl isInvalid={errors.email} isReadOnly={!!selectedUser} variant={selectedUser ? 'filled' : 'outline'}>
                                <FormLabel fontSize="sm" fontWeight="semibold">E-mail</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="email@empresa.com"
                                    value={formData.email}
                                    style={{ backgroundColor: '#f5f5f5' }}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {selectedUser && (
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        O e-mail não pode ser alterado após o convite.
                                    </Text>
                                )}
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            {!selectedUser && (
                                <Text fontSize="xs" color="gray.500" textAlign="center">
                                    O colaborador receberá um e-mail com um **link mágico** para criar sua própria conta e senha.
                                </Text>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter bg="gray.50" borderBottomRadius="2xl">
                        <Button variant="ghost" mr={3} onClick={onFormClose} isDisabled={isSaving}>
                            Cancelar
                        </Button>
                        <Button
                            variant="gradient"
                            onClick={handleSubmit}
                            isLoading={isSaving}
                            loadingText="Salvando..."
                        >
                            {selectedUser ? 'Atualizar' : 'Enviar Convite'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Dialog de Confirmação de Remoção */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
            >
                <AlertDialogOverlay backdropFilter="blur(4px)">
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remover Membro
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja remover **{selectedUser?.name}** da sua equipe?
                            O acesso do usuário será revogado imediatamente.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose} isDisabled={isDeleting}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                bg="red.500"
                                color="white"
                                onClick={handleDelete}
                                ml={3}
                                isLoading={isDeleting}
                            >
                                Sim, remover
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Mobile FAB */}
            {isBusiness && (
                <Button
                    position="fixed"
                    bottom="24px"
                    right="24px"
                    zIndex={100}
                    variant="gradient"
                    size="lg"
                    height="56px"
                    borderRadius="full"
                    boxShadow="0 12px 32px rgba(0, 217, 126, 0.4)"
                    display={{ base: 'flex', md: 'none' }}
                    leftIcon={<Icon as={FiPlus} boxSize={5} />}
                    onClick={openCreateModal}
                    px={6}
                    fontWeight="bold"
                    _active={{ transform: 'scale(0.95)' }}
                >
                    Convidar
                </Button>
            )}
        </Container>
    )
}

export default UsersPage
