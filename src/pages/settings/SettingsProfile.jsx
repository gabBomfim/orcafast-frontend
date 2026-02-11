import { useState } from 'react'
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
} from '@chakra-ui/react'
import { FiUpload, FiBriefcase, FiUser, FiKey, FiPhone, FiSave, FiLock } from 'react-icons/fi'
import { useSubscription } from '../../hooks/useSubscription'

const SettingsProfile = () => {
    const { canCustomizeBranding } = useSubscription()
    const [logo, setLogo] = useState(null)
    const [formData, setFormData] = useState({
        nomeEmpresa: '',
        nomeCompleto: '',
        chavePix: '',
        telefone: '',
        condicoesPadrao: '',
    })

    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogo(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
    }

    const handleSave = () => {
        console.log('Salvando dados:', formData)
        // TODO: Implementar lógica de salvamento
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
                        <VStack spacing={3} mb={8}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                Seu Logo
                            </Text>
                            <FormControl>
                                <FormLabel
                                    htmlFor="logo-upload"
                                    cursor="pointer"
                                    m={0}
                                    _hover={{ opacity: 0.8 }}
                                >
                                    <Center
                                        w="112px"
                                        h="112px"
                                        rounded="2xl"
                                        bg="gray.50"
                                        border="2px dashed"
                                        borderColor={logo ? 'transparent' : 'gray.300'}
                                        transition="all 0.2s"
                                        _hover={{
                                            borderColor: logo ? 'transparent' : 'green.400',
                                        }}
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        {logo ? (
                                            <Image src={logo} alt="Logo" w="full" h="full" objectFit="cover" />
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
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        display="none"
                                    />
                                </FormLabel>
                            </FormControl>
                            {logo && (
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => setLogo(null)}
                                >
                                    Remover logo
                                </Button>
                            )}
                        </VStack>

                        {/* Form Fields */}
                        <VStack spacing={5}>
                            {/* Nome da Empresa */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Nome da Empresa (Fantasia)
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center
                                        w="48px"
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Icon as={FiBriefcase} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.nomeEmpresa}
                                        onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                                        placeholder="Ex: Studio Design"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Nome Completo */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Seu Nome Completo
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center
                                        w="48px"
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Icon as={FiUser} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.nomeCompleto}
                                        onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                                        placeholder="Ex: Maria Antonieta Silva"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Chave PIX */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Chave PIX{' '}
                                    <Text as="span" fontWeight="normal" color="gray.500">
                                        (opcional)
                                    </Text>
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center
                                        w="48px"
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Icon as={FiKey} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.chavePix}
                                        onChange={(e) => handleInputChange('chavePix', e.target.value)}
                                        placeholder="CPF, CNPJ, e-mail ou chave aleatória"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                                <FormHelperText fontSize="xs" color="gray.500" mt={1.5}>
                                    Será exibido no orçamento para facilitar o pagamento
                                </FormHelperText>
                            </FormControl>

                            {/* Telefone/WhatsApp */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Telefone / WhatsApp
                                </FormLabel>
                                <HStack spacing={0}>
                                    <Center
                                        w="48px"
                                        h="48px"
                                        bg="gray.50"
                                        roundedLeft="xl"
                                        borderY="1px"
                                        borderLeft="1px"
                                        borderColor="gray.200"
                                    >
                                        <Icon as={FiPhone} boxSize={5} color="gray.500" />
                                    </Center>
                                    <Input
                                        value={formData.telefone}
                                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                                        placeholder="(11) 99999-9999"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.200"
                                        roundedRight="xl"
                                        roundedLeft="none"
                                        h="48px"
                                        _focus={{
                                            borderColor: 'green.400',
                                            boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                        }}
                                    />
                                </HStack>
                            </FormControl>

                            {/* Condições Padrão do Orçamento */}
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.800">
                                    Condições Padrão do Orçamento
                                </FormLabel>
                                <Textarea
                                    value={formData.condicoesPadrao}
                                    onChange={(e) => handleInputChange('condicoesPadrao', e.target.value)}
                                    placeholder="Ex: Pagamento: 50% na aprovação e 50% na conclusão. Aceitamos Pix/Cartão. Orçamento válido por 15 dias."
                                    bg="gray.50"
                                    border="1px"
                                    borderColor="gray.200"
                                    rounded="xl"
                                    minH="120px"
                                    resize="vertical"
                                    _focus={{
                                        borderColor: 'green.400',
                                        boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                    }}
                                />
                                <FormHelperText fontSize="xs" color="gray.500" mt={1.5}>
                                    Este texto será exibido automaticamente no rodapé de todos os seus orçamentos, como regras de pagamento e validade.
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
                                _hover={{
                                    bg: 'green.500',
                                    transform: 'translateY(-2px)',
                                    shadow: 'xl',
                                }}
                                transition="all 0.2s"
                                onClick={handleSave}
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
