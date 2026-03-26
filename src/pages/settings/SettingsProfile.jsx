import { useState, useEffect } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    Card,
    CardBody,
    Icon,
    Flex,
    Center,
    useToast,
    Divider,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiLock, FiSave, FiKey } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/auth.service'
import Container from '../../components/layout/Container'

const SettingsProfile = () => {
    const { getCurrentUser, updateUser } = useAuth()
    const toast = useToast()
    const user = getCurrentUser()

    const [isSaving, setIsSaving] = useState(false)
    const [hasPassword, setHasPassword] = useState(user?.has_password !== false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    })

    useEffect(() => {
        authService.getCurrentUser().then(({ data }) => {
            updateUser(data)
            setHasPassword(data.has_password !== false)
        }).catch(() => {})
    }, [])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (formData.password && formData.password !== formData.password_confirmation) {
            toast({
                title: 'Erro na senha',
                description: 'A nova senha e a confirmação não coincidem.',
                status: 'error',
                duration: 4000,
            })
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                name: formData.name,
            }

            if (formData.password) {
                payload.password = formData.password
                payload.password_confirmation = formData.password_confirmation
            }

            const { data } = await authService.updateProfile(payload)

            // Update local storage/context user data
            if (data.user) {
                updateUser(data.user)
            }
            
            toast({
                title: 'Perfil atualizado!',
                description: 'Suas alterações foram salvas com sucesso.',
                status: 'success',
                duration: 3000,
            })

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                password: '',
                password_confirmation: '',
            }))
        } catch (err) {
            toast({
                title: 'Erro ao salvar',
                description: err.response?.data?.message || 'Verifique os dados e tente novamente',
                status: 'error',
                duration: 4000,
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Container maxW="container.md">
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Meu Perfil
                </Text>
            </Box>

            <VStack spacing={6} align="stretch">
                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                    <CardBody p={6}>
                        <VStack spacing={5} align="stretch">
                            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                                Seus dados
                            </Text>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium">Nome Completo</FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="gray.50" roundedLeft="xl" border="1px" borderColor="gray.200" borderRight="none">
                                        <Icon as={FiUser} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Seu nome"
                                        h="48px"
                                        roundedLeft="none"
                                        roundedRight="xl"
                                    />
                                </HStack>
                            </FormControl>

                            <FormControl isDisabled>
                                <FormLabel fontSize="sm" fontWeight="medium">E-mail</FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="gray.50" roundedLeft="xl" border="1px" borderColor="gray.200" borderRight="none">
                                        <Icon as={FiMail} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.email}
                                        h="48px"
                                        roundedLeft="none"
                                        roundedRight="xl"
                                        cursor="not-allowed"
                                    />
                                </HStack>
                                <Text fontSize="xs" color="gray.500" mt={2}>
                                    O e-mail não pode ser alterado.
                                </Text>
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {hasPassword && (
                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                    <CardBody p={6}>
                        <VStack spacing={5} align="stretch">
                            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                                Segurança e Senha
                            </Text>
                            
                            <Text fontSize="sm" color="gray.600">
                                Deixe em branco caso não deseje alterar sua senha atual.
                            </Text>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Nova Senha</FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="gray.50" roundedLeft="xl" border="1px" borderColor="gray.200" borderRight="none">
                                        <Icon as={FiKey} color="gray.500" />
                                    </Center>
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        h="48px"
                                        roundedLeft="none"
                                        roundedRight="xl"
                                    />
                                </HStack>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Confirmar Nova Senha</FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="gray.50" roundedLeft="xl" border="1px" borderColor="gray.200" borderRight="none">
                                        <Icon as={FiLock} color="gray.500" />
                                    </Center>
                                    <Input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                        placeholder="Repita a nova senha"
                                        h="48px"
                                        roundedLeft="none"
                                        roundedRight="xl"
                                    />
                                </HStack>
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>
                )}

                <Button
                    colorScheme="emerald"
                    bg="emerald.500"
                    _hover={{ bg: 'emerald.600' }}
                    size="md"
                    height="40px"
                    minW="120px"
                    leftIcon={<Icon as={FiSave} />}
                    onClick={handleSave}
                    isLoading={isSaving}
                    rounded="xl"
                    shadow="md"
                >
                    Salvar Alterações
                </Button>
            </VStack>
        </Container>
    )
}

export default SettingsProfile
