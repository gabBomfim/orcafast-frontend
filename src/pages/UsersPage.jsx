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
    Divider,
} from '@chakra-ui/react'
import {
    FiUsers, FiPlus, FiLock, FiMoreVertical,
    FiEdit2, FiTrash2, FiAlertCircle
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import Container from '../components/layout/Container'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../hooks/useAuth'
import { teamUserService } from '../services'

// ─── Role Mapping ─────────────────────────────────────────────────────────────
const ROLE_MAP = {
    1: { label: 'Administrador Master', color: 'red' },
    2: { label: 'Cliente', color: 'blue' },
    3: { label: 'Administrador', color: 'purple' },
    4: { label: 'Membro', color: 'green' },
}

const getRoleBadge = (roleId) => {
    const role = ROLE_MAP[roleId] || { label: 'Membro', color: 'gray' }
    return (
        <Badge variant="subtle" colorScheme={role.color} rounded="full" px={2.5} fontSize="xs">
            {role.label}
        </Badge>
    )
}

// ─── Lock Overlay (Plano Equipe Necessário) ───────────────────────────────────
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
            mx={4}
        >
            <Flex w={16} h={16} bg="purple.50" borderRadius="2xl" align="center" justify="center">
                <Icon as={FiLock} color="purple.500" boxSize={8} />
            </Flex>
            <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                    Recurso exclusivo do plano Equipe
                </Text>
                <Text fontSize="sm" color="gray.600">
                    Com o plano Equipe você adiciona membros, define funções e mantém todo mundo no mesmo lugar.
                </Text>
            </Box>
            <Button
                w="full"
                size="md"
                height="40px"
                minW="120px"
                colorScheme="purple"
                borderRadius="xl"
                onClick={() => window.location.href = '/dashboard/configuracoes/assinatura'}
            >
                Fazer upgrade para Equipe
            </Button>
        </VStack>
    </Flex>
)

// ─── Restricted Overlay (Sem Permissão) ──────────────────────────────────────
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
            p={8}
            borderRadius="2xl"
            shadow="2xl"
            border="1px"
            borderColor="red.100"
            maxW="sm"
            textAlign="center"
            mx={4}
        >
            <Flex w={16} h={16} bg="red.50" borderRadius="full" align="center" justify="center">
                <Icon as={FiAlertCircle} color="red.500" boxSize={8} />
            </Flex>
            <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                    Acesso restrito
                </Text>
                <Text fontSize="sm" color="gray.600">
                    Só os administradores da conta podem gerenciar a equipe. Fale com o admin da sua empresa.
                </Text>
            </Box>
            <Button
                w="full"
                size="md"
                height="40px"
                minW="120px"
                colorScheme="gray"
                variant="outline"
                borderRadius="xl"
                onClick={() => window.history.back()}
            >
                Voltar
            </Button>
        </VStack>
    </Flex>
)

// ─── Member Card (Mobile) ─────────────────────────────────────────────────────
const MemberCard = ({ u, currentUserId, hasAccess, onEdit, onDelete }) => (
    <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
        <CardBody p={4}>
            <Flex align="center" gap={3}>
                <Avatar size="md" name={u.name} src={u.avatar} bg="emerald.500" color="white" flexShrink={0} />
                <Box flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800" noOfLines={1}>{u.name}</Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>{u.email}</Text>
                    <HStack spacing={2} mt={1}>
                        {getRoleBadge(u.role)}
                        <Badge colorScheme="green" rounded="full" fontSize="xs">Ativo</Badge>
                    </HStack>
                </Box>
                <Menu isLazy>
                    <MenuButton
                        as={IconButton}
                        icon={<Icon as={FiMoreVertical} />}
                        size="md"
                        height="40px"
                        variant="ghost"
                        colorScheme="gray"
                        isDisabled={!hasAccess}
                        flexShrink={0}
                    />
                    <MenuList shadow="xl" borderRadius="xl">
                        <MenuItem icon={<Icon as={FiEdit2} />} onClick={() => onEdit(u)}>
                            Editar
                        </MenuItem>
                        {u.id !== currentUserId && (
                            <MenuItem icon={<Icon as={FiTrash2} />} color="red.500" onClick={() => onDelete(u)}>
                                Remover
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Flex>
        </CardBody>
    </Card>
)

// ─── Main ─────────────────────────────────────────────────────────────────────
const UsersPage = () => {
    const { isBusiness, onTrial } = useSubscription()
    const { getCurrentUser } = useAuth()
    const toast = useToast()
    const cancelRef = useRef()
    const user = getCurrentUser()

    const canManageTeam = user?.role === 3 || user?.role === 1
    const hasAccess = isBusiness || onTrial

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [formData, setFormData] = useState({ name: '', email: '' })
    const [errors, setErrors] = useState({})

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    useEffect(() => {
        if (hasAccess && canManageTeam) {
            fetchUsers()
        } else {
            setLoading(false)
        }
    }, [hasAccess, canManageTeam])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await teamUserService.list()
            setUsers(res.data || [])
        } catch {
            toast({
                title: 'Ih, algo deu errado aqui.',
                description: 'A gente já sabe e tá resolvendo. Tenta de novo em instantes.',
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
        if (!selectedUser && !formData.email) newErrors.email = 'Esqueceu o e-mail do membro.'
        if (selectedUser && !formData.name) newErrors.name = 'Esqueceu o nome do membro.'
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Esse e-mail não tá certo.'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setIsSaving(true)
            if (selectedUser) {
                await teamUserService.update(selectedUser.id, { name: formData.name })
                toast({ title: 'Membro atualizado.', status: 'success', duration: 3000 })
            } else {
                await teamUserService.store({ email: formData.email })
                toast({
                    title: 'Convite enviado!',
                    description: 'O membro vai receber um link por e-mail para entrar na equipe.',
                    status: 'success',
                    duration: 5000,
                })
            }
            onFormClose()
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Não consegui salvar.',
                description: error.response?.data?.message || 'Confira os dados e tente novamente.',
                status: 'error',
                duration: 5000,
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await teamUserService.destroy(selectedUser.id)
            toast({ title: 'Membro removido da equipe.', status: 'success', duration: 3000 })
            onDeleteClose()
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Não consegui remover.',
                description: error.response?.data?.message || 'Tenta de novo.',
                status: 'error',
                duration: 4000,
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

    const openEditModal = (member) => {
        setSelectedUser(member)
        setFormData({ name: member.name, email: member.email })
        setErrors({})
        onFormOpen()
    }

    const openDeleteDialog = (member) => {
        setSelectedUser(member)
        onDeleteOpen()
    }

    if (loading) {
        return (
            <Center h="50vh">
                <Spinner size="xl" color="emerald.500" thickness="3px" />
            </Center>
        )
    }

    return (
        <Container maxW="container.xl">
            <Box position="relative">
                {!hasAccess && <UpgradeOverlay />}
                {!canManageTeam && <RestrictedOverlay />}

                <VStack align="stretch" spacing={6}>
                    {/* Header */}
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">Equipe</Text>
                            <Text fontSize="sm" color="gray.500" mt={0.5}>
                                {users.length} {users.length === 1 ? 'membro ativo' : 'membros ativos'}
                            </Text>
                        </Box>

                        <Button
                            leftIcon={<Icon as={FiPlus} />}
                            variant="gradient"
                            size="md"
                            height="40px"
                            minW="120px"
                            display={{ base: 'none', md: 'inline-flex' }}
                            onClick={openCreateModal}
                            isDisabled={!hasAccess}
                        >
                            Convidar membro
                        </Button>
                    </Flex>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                            <CardBody py={12}>
                                <VStack spacing={3}>
                                    <Flex w={16} h={16} bg="gray.50" rounded="2xl" align="center" justify="center">
                                        <Icon as={FiUsers} boxSize={8} color="gray.300" />
                                    </Flex>
                                    <Text fontWeight="semibold" color="gray.600">Sua equipe tá vazia.</Text>
                                    <Text fontSize="sm" color="gray.400" textAlign="center" maxW="xs">
                                        Manda um convite pra começar. É só colocar o e-mail do membro.
                                    </Text>
                                    <Button
                                        leftIcon={<Icon as={FiPlus} />}
                                        variant="gradient"
                                        size="md"
                                        height="40px"
                                        minW="120px"
                                        mt={2}
                                        onClick={openCreateModal}
                                        isDisabled={!hasAccess}
                                    >
                                        Convidar membro
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Members List */}
                    {users.length > 0 && (
                        <VStack spacing={3} align="stretch">
                            {users.map((u) => (
                                <MemberCard
                                    key={u.id}
                                    u={u}
                                    currentUserId={user?.id}
                                    hasAccess={hasAccess}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteDialog}
                                />
                            ))}
                        </VStack>
                    )}
                </VStack>
            </Box>

            {/* FAB Mobile */}
            {hasAccess && (
                <Button
                    position="fixed"
                    bottom="24px"
                    right="24px"
                    zIndex={100}
                    variant="gradient"
                    size="md"
                    height="40px"
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

            {/* Modal Convidar / Editar */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="2xl" mx={4}>
                    <ModalHeader borderBottom="1px" borderColor="gray.100" pb={4}>
                        {selectedUser ? 'Editar membro' : 'Convidar membro'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <VStack spacing={4}>
                            {selectedUser && (
                                <FormControl isInvalid={!!errors.name}>
                                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Nome completo</FormLabel>
                                    <Input
                                        variant="app"
                                        placeholder="Ex: João Silva"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                            )}

                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">E-mail</FormLabel>
                                <Input
                                    variant="app"
                                    type="email"
                                    placeholder="email@empresa.com"
                                    value={formData.email}
                                    isReadOnly={!!selectedUser}
                                    bg={selectedUser ? 'gray.50' : 'white'}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {selectedUser && (
                                    <Text fontSize="xs" color="gray.400" mt={1}>
                                        O e-mail não pode ser alterado depois do convite.
                                    </Text>
                                )}
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            {!selectedUser && (
                                <Box w="full" p={3} bg="blue.50" rounded="xl" border="1px" borderColor="blue.100">
                                    <Text fontSize="xs" color="blue.700" textAlign="center">
                                        O membro vai receber um link por e-mail para criar a conta dele.
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter bg="gray.50" borderBottomRadius="2xl" gap={2}>
                        <Button variant="ghost" onClick={onFormClose} isDisabled={isSaving} borderRadius="xl">
                            Cancelar
                        </Button>
                        <Button
                            variant="gradient"
                            onClick={handleSubmit}
                            isLoading={isSaving}
                            loadingText="Salvando..."
                            borderRadius="xl"
                        >
                            {selectedUser ? 'Salvar' : 'Enviar convite'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Dialog Remover Membro */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
            >
                <AlertDialogOverlay backdropFilter="blur(4px)">
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remover membro?
                        </AlertDialogHeader>
                        <AlertDialogBody color="gray.600">
                            Tem certeza que quer remover <strong>{selectedUser?.name}</strong> da equipe?
                            O acesso vai ser cortado na hora.
                        </AlertDialogBody>
                        <AlertDialogFooter gap={2}>
                            <Button ref={cancelRef} onClick={onDeleteClose} isDisabled={isDeleting} borderRadius="xl">
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                isLoading={isDeleting}
                                loadingText="Removendo..."
                                borderRadius="xl"
                            >
                                Sim, remover
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    )
}

export default UsersPage
