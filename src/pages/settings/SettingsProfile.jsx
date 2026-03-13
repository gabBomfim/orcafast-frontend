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
import { FiUpload, FiBriefcase, FiUser, FiKey, FiPhone, FiSave, FiTrash2 } from 'react-icons/fi'
import { useSubscription } from '../../hooks/useSubscription'
import { companyService } from '../../services'
import { maskPhone, unmaskPhone } from '../../utils/mask'

const SettingsProfile = () => {
    const { canCustomizeBranding } = useSubscription()
    const toast = useToast()
    const fileInputRef = useRef(null)

    // State
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeletingLogo, setIsDeletingLogo] = useState(false)

    // Logo: can be a remote URL (string) or a local File object (for preview)
    const [logoUrl, setLogoUrl] = useState(null)   // existing URL from API
    const [logoFile, setLogoFile] = useState(null)  // newly selected File
    const [logoPreview, setLogoPreview] = useState(null) // local blob preview

    const [formData, setFormData] = useState({
        name: '',
        document: '',
        pix_key: '',
        phone: '',
        default_proposal_terms: '',
    })

    // ─── Fetch company data on mount ────────────────────────────────────────────
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
        load()
    }, [])

    // ─── Handlers ───────────────────────────────────────────────────────────────
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
        // If logo hasn't been saved yet (only local preview), just clear state
        if (logoFile) {
            setLogoFile(null)
            setLogoPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        // Otherwise, call DELETE /api/company/logo
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
            // Always send multipart/form-data (required for file uploads)
            const fd = new FormData()
            fd.append('name', formData.name)
            if (formData.document) fd.append('document', formData.document)
            if (formData.pix_key) fd.append('pix_key', formData.pix_key)
            if (formData.phone) fd.append('phone', unmaskPhone(formData.phone))
            if (formData.default_proposal_terms)
                fd.append('default_proposal_terms', formData.default_proposal_terms)
            if (logoFile) fd.append('logo', logoFile)

            const { data } = await companyService.update(fd)

            // Update logo state from server response
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
            // Handle plan gate (Free plan)
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

    // ─── Computed display logo ───────────────────────────────────────────────────
    const displayLogo = logoPreview || logoUrl
    const hasLogo = !!displayLogo

    // ─── Loading skeleton ────────────────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <Flex h="300px" align="center" justify="center">
                <Spinner size="xl" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    return (
        <Box maxW="2xl" mx="auto" p={6}>
            {/* Header */}
            <Box mb={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Dados da Empresa
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                    Essas informações aparecerão nos seus orçamentos
                </Text>
            </Box>

            {/* Form Card */}
            <Box position="relative">
                {!canCustomizeBranding && (
                    <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
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
                                onClick={() => window.open('https://orcafast.com.br/precos', '_blank')}
                            >
                                Fazer Upgrade
                            </Button>
                        </VStack>
                    </Flex>
                )}

                <Card bg="white" shadow="sm" rounded="2xl" border="1px" borderColor="gray.200">
                    <CardBody p={6}>
                        {/* Logo Upload */}
                        <VStack spacing={3} mb={8} alignItems="center" w="full">
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                Seu Logo
                            </Text>
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
                                        w="112px"
                                        h="112px"
                                        rounded="2xl"
                                        bg="gray.50"
                                        border="2px dashed"
                                        borderColor={hasLogo ? 'transparent' : 'gray.300'}
                                        transition="all 0.2s"
                                        _hover={{ borderColor: hasLogo ? 'transparent' : 'green.400' }}
                                        overflow="hidden"
                                        position="relative"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {hasLogo ? (
                                            <Image src={displayLogo} alt="Logo" w="full" h="full" objectFit="cover" />
                                        ) : (
                                            <VStack spacing={2}>
                                                <Icon as={FiUpload} boxSize={6} color="gray.400" />
                                                <Text fontSize="xs" color="gray.500">
                                                    Fazer upload
                                                </Text>
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
                                    loadingText="Removendo..."
                                >
                                    Remover logo
                                </Button>
                            )}
                        </VStack>

                        {/* Form Fields */}
                        <VStack spacing={5}>
                            {/* Nome da Empresa */}
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Nome da Empresa (Fantasia)
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="white" roundedLeft="xl"
                                        sx={{ border: '1.5px solid #E2E8F0', borderRight: 'none' }}
                                    >
                                        <Icon as={FiBriefcase} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Ex: Studio Design"
                                        bg="white"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        sx={{ border: '1.5px solid #E2E8F0' }}
                                        _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 2px #00d97e' }}
                                        _hover={{ borderColor: 'gray.300' }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Documento (CNPJ/CPF) */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    CNPJ / CPF{' '}
                                    <Text as="span" fontWeight="normal" color="gray.500">(opcional)</Text>
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="white" roundedLeft="xl"
                                        sx={{ border: '1.5px solid #E2E8F0', borderRight: 'none' }}
                                    >
                                        <Icon as={FiUser} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.document}
                                        onChange={(e) => handleInputChange('document', e.target.value)}
                                        placeholder="Ex: 12.345.678/0001-99"
                                        bg="white"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        sx={{ border: '1.5px solid #E2E8F0' }}
                                        _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 2px #00d97e' }}
                                        _hover={{ borderColor: 'gray.300' }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Chave PIX */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Chave PIX{' '}
                                    <Text as="span" fontWeight="normal" color="gray.500">(opcional)</Text>
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="white" roundedLeft="xl"
                                        sx={{ border: '1.5px solid #E2E8F0', borderRight: 'none' }}
                                    >
                                        <Icon as={FiKey} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.pix_key}
                                        onChange={(e) => handleInputChange('pix_key', e.target.value)}
                                        placeholder="CPF, CNPJ, e-mail ou chave aleatória"
                                        bg="white"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        sx={{ border: '1.5px solid #E2E8F0' }}
                                        _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 2px #00d97e' }}
                                        _hover={{ borderColor: 'gray.300' }}
                                    />
                                </HStack>
                                <FormHelperText fontSize="xs" color="gray.500" mt={1.5}>
                                    Será exibido no orçamento para facilitar o pagamento
                                </FormHelperText>
                            </FormControl>

                            {/* Telefone */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Telefone / WhatsApp
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center w="48px" h="48px" bg="white" roundedLeft="xl"
                                        sx={{ border: '1.5px solid #E2E8F0', borderRight: 'none' }}
                                    >
                                        <Icon as={FiPhone} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="(11) 99999-9999"
                                        bg="white"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        sx={{ border: '1.5px solid #E2E8F0' }}
                                        _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 2px #00d97e' }}
                                        _hover={{ borderColor: 'gray.300' }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Condições Padrão */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Condições Padrão do Orçamento
                                </FormLabel>
                                <Textarea
                                    value={formData.default_proposal_terms}
                                    onChange={(e) => handleInputChange('default_proposal_terms', e.target.value)}
                                    placeholder="Ex: Pagamento: 50% na aprovação e 50% na conclusão. Aceitamos Pix/Cartão. Orçamento válido por 15 dias."
                                    minH="120px"
                                    resize="vertical"
                                />
                                <FormHelperText fontSize="xs" color="gray.500" mt={1.5}>
                                    Este texto será exibido automaticamente no rodapé de todos os seus orçamentos.
                                </FormHelperText>
                            </FormControl>
                        </VStack>

                        {/* Save Button */}
                        <HStack justify="flex-end" mt={8}>
                            <Button
                                leftIcon={<Icon as={FiSave} />}
                                colorScheme="green"
                                bg="green.400"
                                color="white"
                                size="lg"
                                px={6}
                                rounded="xl"
                                fontWeight="medium"
                                shadow="lg"
                                _hover={{ bg: 'green.500', transform: 'translateY(-2px)', shadow: 'xl' }}
                                transition="all 0.2s"
                                onClick={handleSave}
                                isLoading={isSaving}
                                loadingText="Salvando..."
                            >
                                Salvar Alterações
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>
            </Box>
        </Box>
    )
}

export default SettingsProfile
