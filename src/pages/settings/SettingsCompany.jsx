import { useState, useEffect, useRef } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Card,
    CardBody,
    Icon,
    FormHelperText,
    Image,
    Center,
    Flex,
    Spinner,
    useToast,
} from '@chakra-ui/react'
import { FiUpload, FiBriefcase, FiKey, FiPhone, FiSave, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import { useSubscription } from '../../hooks/useSubscription'
import { useAuth } from '../../hooks/useAuth'
import { companyService } from '../../services'
import { maskPhone, unmaskPhone } from '../../utils/mask'
import Container from '../../components/layout/Container'

const SettingsCompany = () => {
    const { canCustomizeBranding } = useSubscription()
    const { getCurrentUser } = useAuth()
    const toast = useToast()
    const fileInputRef = useRef(null)
    const user = getCurrentUser()

    const isAdmin = user?.role === 3 || user?.role === 1

    // State
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeletingLogo, setIsDeletingLogo] = useState(false)

    const [logoUrl, setLogoUrl] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        document: '',
        pix_key: '',
        phone: '',
        default_proposal_terms: '',
    })

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await companyService.get()
                setFormData({
                    name: data.name ?? '',
                    document: data.document ?? '',
                    pix_key: data.pix_key ?? '',
                    phone: maskPhone(data.phone ?? ''),
                    default_proposal_terms: data.default_proposal_terms ?? '',
                })
                setLogoUrl(data.logo_url ?? null)
            } catch (err) {
                toast({
                    title: 'Erro ao carregar dados',
                    description: err.response?.data?.message || 'Tente novamente',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            } finally {
                setIsLoadingData(false)
            }
        }
        if (isAdmin) load()
        else setIsLoadingData(false)
    }, [isAdmin])

    const handleInputChange = (field, value) => {
        const newValue = field === 'phone' ? maskPhone(value) : value
        setFormData(prev => ({ ...prev, [field]: newValue }))
    }

    const handleLogoSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleRemoveLogo = async () => {
        if (logoFile) {
            setLogoFile(null)
            setLogoPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setIsDeletingLogo(true)
        try {
            await companyService.deleteLogo()
            setLogoUrl(null)
            toast({
                title: 'Logo removido com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            toast({
                title: 'Erro ao remover logo',
                description: err.response?.data?.message || 'Tente novamente',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setIsDeletingLogo(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const fd = new FormData()
            fd.append('name', formData.name)
            if (formData.document) fd.append('document', formData.document)
            if (formData.pix_key) fd.append('pix_key', formData.pix_key)
            if (formData.phone) fd.append('phone', unmaskPhone(formData.phone))
            if (formData.default_proposal_terms)
                fd.append('default_proposal_terms', formData.default_proposal_terms)
            if (logoFile) fd.append('logo', logoFile)

            const { data } = await companyService.update(fd)

            setLogoUrl(data.logo_url ?? logoUrl)
            setLogoFile(null)
            setLogoPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''

            toast({
                title: 'Dados salvos com sucesso!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.upgrade_required) {
                toast({
                    title: 'Plano não inclui este recurso',
                    description: 'Faça upgrade para o plano Pro ou Business para personalizar os dados da empresa.',
                    status: 'warning',
                    duration: 6000,
                    isClosable: true,
                })
                return
            }
            toast({
                title: 'Erro ao salvar',
                description: err.response?.data?.message || 'Verifique os dados e tente novamente',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!isAdmin) {
        return (
            <Container>
                <Center h="50vh">
                    <VStack spacing={4}>
                        <Icon as={FiAlertCircle} boxSize={12} color="red.400" />
                        <Text fontWeight="bold">Acesso restrito a administradores.</Text>
                    </VStack>
                </Center>
            </Container>
        )
    }

    if (isLoadingData) {
        return (
            <Flex h="300px" align="center" justify="center">
                <Spinner size="xl" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    const displayLogo = logoPreview || logoUrl
    const hasLogo = !!displayLogo

    return (
        <Container maxW="container.md">
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Perfil da Empresa
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Essas informações aparecerão nos seus orçamentos
                </Text>
            </Box>

            <Box position="relative">
                {!canCustomizeBranding && (
                    <Flex
                        position="absolute"
                        top={0} left={0} right={0} bottom={0}
                        bg="whiteAlpha.600"
                        zIndex={20}
                        align="flex-start"
                        justify="center"
                        pt={32}
                        borderRadius="2xl"
                        backdropFilter="blur(3px)"
                    >
                        <VStack spacing={4} bg="white" p={8} borderRadius="2xl" shadow="xl" border="1px" borderColor="gray.100" maxW="sm" textAlign="center">
                            <Box p={3} bg="emerald.50" borderRadius="xl">
                                <Icon as={FiBriefcase} color="emerald.500" boxSize={8} />
                            </Box>
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                                    Personalização da Marca
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Destaque sua empresa com logo e informações personalizadas nos orçamentos. Disponível no plano Pro e Business.
                                </Text>
                            </Box>
                            <Button
                                w="full"
                                colorScheme="emerald"
                                onClick={() => window.location.href = '/dashboard/configuracoes/assinatura'}
                            >
                                Fazer Upgrade
                            </Button>
                        </VStack>
                    </Flex>
                )}

                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                    <CardBody p={6}>
                        <VStack spacing={3} mb={8} alignItems="center" w="full">
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">Seu Logo</Text>
                            <FormControl>
                                <FormLabel
                                    htmlFor="logo-upload"
                                    cursor="pointer"
                                    m={0}
                                    display="flex"
                                    justifyContent="center"
                                    _hover={{ opacity: 0.8 }}
                                >
                                    <Center
                                        w="120px" h="120px"
                                        rounded="2xl"
                                        bg="gray.50"
                                        border="2px dashed"
                                        borderColor={hasLogo ? 'transparent' : 'gray.300'}
                                        overflow="hidden"
                                    >
                                        {hasLogo ? (
                                            <Image src={displayLogo} alt="Logo" w="full" h="full" objectFit="cover" />
                                        ) : (
                                            <VStack spacing={2}>
                                                <Icon as={FiUpload} boxSize={6} color="gray.400" />
                                                <Text fontSize="xs" color="gray.500">Upload</Text>
                                            </VStack>
                                        )}
                                    </Center>
                                    <Input
                                        ref={fileInputRef}
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoSelect}
                                        display="none"
                                    />
                                </FormLabel>
                            </FormControl>
                            {hasLogo && (
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="red"
                                    leftIcon={<Icon as={FiTrash2} />}
                                    onClick={handleRemoveLogo}
                                    isLoading={isDeletingLogo}
                                >
                                    Remover logo
                                </Button>
                            )}
                        </VStack>

                        <VStack spacing={5}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium">Nome da Empresa (Fantasia)</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Ex: Studio Design"
                                    h="48px"
                                    rounded="xl"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">CNPJ / CPF</FormLabel>
                                <Input
                                    value={formData.document}
                                    onChange={(e) => handleInputChange('document', e.target.value)}
                                    placeholder="Ex: 12.345.678/0001-99"
                                    h="48px"
                                    rounded="xl"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Chave PIX</FormLabel>
                                <Input
                                    value={formData.pix_key}
                                    onChange={(e) => handleInputChange('pix_key', e.target.value)}
                                    placeholder="CPF, e-mail ou chave aleatória"
                                    h="48px"
                                    rounded="xl"
                                />
                                <FormHelperText fontSize="xs">Exibido no orçamento para facilitar o pagamento</FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Telefone / WhatsApp</FormLabel>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    h="48px"
                                    rounded="xl"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Condições Padrão do Orçamento</FormLabel>
                                <Textarea
                                    value={formData.default_proposal_terms}
                                    onChange={(e) => handleInputChange('default_proposal_terms', e.target.value)}
                                    placeholder="Ex: Pagamento 50% na aprovação..."
                                    minH="120px"
                                    rounded="xl"
                                />
                            </FormControl>
                        </VStack>

                        <Button
                            w="full"
                            mt={8}
                            colorScheme="emerald"
                            bg="emerald.500"
                            _hover={{ bg: 'emerald.600' }}
                            size="lg"
                            leftIcon={<Icon as={FiSave} />}
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Salvar Alterações
                        </Button>
                    </CardBody>
                </Card>
            </Box>
        </Container>
    )
}

export default SettingsCompany
