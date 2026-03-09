import { useState, useEffect } from 'react'
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Input,
    Text,
    VStack,
    InputGroup,
    InputRightElement,
    IconButton,
    Spinner,
    useToast,
} from '@chakra-ui/react'
import { authService } from '../../services'
import {
    FiZap,
    FiEye,
    FiEyeOff,
    FiLock,
    FiCheckCircle,
    FiXCircle,
    FiAlertTriangle,
} from 'react-icons/fi'

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const toast = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [flowState, setFlowState] = useState('form') // "form" | "loading" | "success" | "error" | "expired"
    const [errorMessage, setErrorMessage] = useState('')

    // Get email and token from URL
    const email = searchParams.get('email') || ''
    const token = searchParams.get('token') || ''

    useEffect(() => {
        if (!email || !token) {
            setFlowState('expired')
        }
    }, [email, token])

    const validatePassword = () => {
        if (password.length < 8) {
            setErrorMessage('A senha deve ter pelo menos 8 caracteres.')
            return false
        }
        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')

        if (!validatePassword()) {
            setFlowState('error')
            return
        }

        setFlowState('loading')

        try {
            const res = await authService.resetPassword({
                token,
                email,
                password,
                password_confirmation: confirmPassword
            })

            toast({
                title: 'Senha redefinida!',
                description: res.data?.message || 'Sua nova senha foi salva.',
                status: 'success',
                duration: 4000,
                isClosable: true,
            })

            setFlowState('success')

            // Navigate to login after 2s so they see the success screen
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            toast({
                title: 'Erro ao redefinir senha',
                description: error.response?.data?.message || 'Ocorreu um erro. O link pode ter expirado.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setFlowState('error')
        }
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        if (password.length === 0) return { label: '', color: '', width: '0%' }
        if (password.length < 6) return { label: 'Fraca', color: 'red.500', width: '33%' }
        if (password.length < 10) return { label: 'Média', color: 'amber.500', width: '66%' }
        return { label: 'Forte', color: 'emerald.500', width: '100%' }
    }

    const strength = getPasswordStrength()
    const passwordsMatch = password && confirmPassword && password === confirmPassword

    return (
        <Flex minH="100vh" bg="#f8fafc" direction="column" align="center" justify="center" px={4} py={8}>
            {/* Logo */}
            <Flex as={RouterLink} to="/" align="center" gap={2} mb={10} _hover={{ textDecoration: 'none' }}>
                <Flex w={10} h={10} bg="emerald.50" rounded="xl" align="center" justify="center">
                    <Icon as={FiZap} w={6} h={6} color="emerald.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">
                    OrçaFast
                </Text>
            </Flex>

            {/* Card Container */}
            <Box w="full" maxW="sm">
                {/* State: Expired Token */}
                {flowState === 'expired' && (
                    <Box textAlign="center">
                        <Flex w={20} h={20} bg="red.50" rounded="full" align="center" justify="center" mx="auto" mb={6}>
                            <Icon as={FiAlertTriangle} w={10} h={10} color="red.500" />
                        </Flex>

                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={3}>
                            Link expirado
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mb={6}>
                            Este link de recuperação expirou ou já foi utilizado. Por segurança, os links são válidos por apenas 60 minutos.
                        </Text>

                        <RouterLink to="/esqueci-senha" style={{ display: 'block', width: '100%' }}>
                            <Button
                                w="full"
                                h={12}
                                bg="emerald.500"
                                _hover={{ bg: 'emerald.600', shadow: 'xl' }}
                                color="white"
                                fontWeight="semibold"
                                fontSize="sm"
                                rounded="xl"
                                shadow="lg"
                                transition="all"
                            >
                                Solicitar novo link
                            </Button>
                        </RouterLink>

                        <RouterLink to="/login" style={{ display: 'block' }}>
                            <Text mt={4} fontSize="sm" color="gray.500" _hover={{ color: 'gray.900' }} transition="colors">
                                Voltar para o login
                            </Text>
                        </RouterLink>
                    </Box>
                )}

                {/* State: Form */}
                {(flowState === 'form' || flowState === 'loading' || flowState === 'error') && (
                    <>
                        {/* Header */}
                        <Box textAlign="center" mb={8}>
                            <Flex w={16} h={16} bg="emerald.50" rounded="2xl" align="center" justify="center" mx="auto" mb={4}>
                                <Icon as={FiLock} w={8} h={8} color="emerald.500" />
                            </Flex>
                            <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                                Criar nova senha
                            </Heading>
                            <Text color="gray.500" fontSize="sm">
                                Sua nova senha deve ter pelo menos 8 caracteres.
                            </Text>
                        </Box>

                        {/* Error message */}
                        {flowState === 'error' && errorMessage && (
                            <Flex bg="red.50" border="1px" borderColor="red.100" rounded="xl" p={4} mb={6} align="start" gap={3}>
                                <Icon as={FiXCircle} w={5} h={5} color="red.500" flexShrink={0} mt="2px" />
                                <Text fontSize="sm" color="red.600">{errorMessage}</Text>
                            </Flex>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                {/* Email field (read-only) */}
                                <Box>
                                    <Text as="label" display="block" fontSize="xs" fontWeight="medium" color="gray.500" mb={1.5}>
                                        E-mail
                                    </Text>
                                    <Input
                                        type="email"
                                        value={email}
                                        isReadOnly
                                        h={12}
                                        px={4}
                                        bg="gray.100" // Light gray (using Tailwind secondary/50 logic approx)
                                        rounded="xl"
                                        border="0"
                                        color="gray.500"
                                        fontSize="sm"
                                        cursor="not-allowed"
                                    />
                                </Box>

                                {/* New password field */}
                                <Box>
                                    <Text as="label" display="block" fontSize="xs" fontWeight="medium" color="gray.500" mb={1.5}>
                                        Nova senha
                                    </Text>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            isDisabled={flowState === 'loading'}
                                            h={12}
                                            pl={4}
                                            pr={12}
                                            bg="gray.100"
                                            rounded="xl"
                                            border="0"
                                            color="gray.900"
                                            _placeholder={{ color: 'gray.500' }}
                                            _focus={{ outline: 'none', ring: 2, ringColor: 'emerald.200' }}
                                            transition="all"
                                            fontSize="sm"
                                            _disabled={{ opacity: 0.5 }}
                                            required
                                        />
                                        <InputRightElement h={12} w={12}>
                                            <IconButton
                                                variant="unstyled"
                                                color="gray.500"
                                                _hover={{ color: 'gray.900' }}
                                                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                                                tabIndex={-1}
                                            />
                                        </InputRightElement>
                                    </InputGroup>

                                    {/* Password strength */}
                                    {password.length > 0 && (
                                        <Box mt={2}>
                                            <Box h={1} bg="gray.200" rounded="full" overflow="hidden">
                                                <Box
                                                    h="full"
                                                    bg={strength.color}
                                                    transition="all 0.3s"
                                                    w={strength.width}
                                                />
                                            </Box>
                                            <Text
                                                fontSize="xs"
                                                mt={1}
                                                color={
                                                    strength.color === 'emerald.500' ? 'emerald.500' :
                                                        strength.color === 'amber.500' ? 'orange.400' :
                                                            'red.500'
                                                }
                                            >
                                                Senha {strength.label.toLowerCase()}
                                            </Text>
                                        </Box>
                                    )}
                                </Box>

                                {/* Confirm password field */}
                                <Box>
                                    <Text as="label" display="block" fontSize="xs" fontWeight="medium" color="gray.500" mb={1.5}>
                                        Confirmar nova senha
                                    </Text>
                                    <InputGroup>
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Digite a senha novamente"
                                            isDisabled={flowState === 'loading'}
                                            h={12}
                                            pl={4}
                                            pr={12}
                                            bg="gray.100"
                                            rounded="xl"
                                            border="0"
                                            color="gray.900"
                                            _placeholder={{ color: 'gray.500' }}
                                            _focus={{
                                                outline: 'none',
                                                ring: 2,
                                                ringColor: confirmPassword && !passwordsMatch ? 'red.200' : 'emerald.200'
                                            }}
                                            ring={confirmPassword ? 2 : undefined}
                                            ringColor={confirmPassword && !passwordsMatch ? 'red.200' : passwordsMatch ? 'emerald.200' : undefined}
                                            transition="all"
                                            fontSize="sm"
                                            _disabled={{ opacity: 0.5 }}
                                            required
                                        />
                                        <InputRightElement h={12} w={12}>
                                            <IconButton
                                                variant="unstyled"
                                                color="gray.500"
                                                _hover={{ color: 'gray.900' }}
                                                icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                                                tabIndex={-1}
                                            />
                                        </InputRightElement>
                                    </InputGroup>

                                    {/* Match indicator */}
                                    {confirmPassword && (
                                        <Flex align="center" gap={1.5} mt={2}>
                                            {passwordsMatch ? (
                                                <>
                                                    <Icon as={FiCheckCircle} w={3.5} h={3.5} color="emerald.500" />
                                                    <Text fontSize="xs" color="emerald.500">Senhas coincidem</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon as={FiXCircle} w={3.5} h={3.5} color="red.500" />
                                                    <Text fontSize="xs" color="red.500">Senhas não coincidem</Text>
                                                </>
                                            )}
                                        </Flex>
                                    )}
                                </Box>

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    isDisabled={flowState === 'loading' || !password || !confirmPassword}
                                    w="full"
                                    h={12}
                                    bg="emerald.500"
                                    _hover={{ bg: 'emerald.600', shadow: 'xl' }}
                                    color="white"
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    rounded="xl"
                                    shadow="lg"
                                    transition="all"
                                    mt={6}
                                    _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                                >
                                    {flowState === 'loading' ? (
                                        <Flex align="center">
                                            <Spinner size="sm" mr={2} />
                                            Salvando...
                                        </Flex>
                                    ) : (
                                        "Salvar nova senha"
                                    )}
                                </Button>
                            </VStack>
                        </form>
                    </>
                )}

                {/* State: Success */}
                {flowState === 'success' && (
                    <Box textAlign="center">
                        <Flex w={20} h={20} bg="emerald.50" rounded="full" align="center" justify="center" mx="auto" mb={6}>
                            <Icon as={FiCheckCircle} w={10} h={10} color="emerald.500" />
                        </Flex>

                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={3}>
                            Senha alterada com sucesso!
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mb={8}>
                            Sua nova senha foi salva. Use-a para acessar sua conta.
                        </Text>

                        <RouterLink to="/login" style={{ display: 'block', width: '100%' }}>
                            <Button
                                w="full"
                                h={12}
                                bg="emerald.500"
                                _hover={{ bg: 'emerald.600', shadow: 'xl' }}
                                color="white"
                                fontWeight="semibold"
                                fontSize="sm"
                                rounded="xl"
                                shadow="lg"
                                transition="all"
                            >
                                Fazer login
                            </Button>
                        </RouterLink>
                    </Box>
                )}
            </Box>

            {/* Footer */}
            <Text fontSize="xs" color="gray.500" textAlign="center" mt={12} maxW="sm">
                Precisa de ajuda?{' '}
                <RouterLink to="/suporte" style={{ textDecoration: 'underline' }}>
                    <Box as="span" _hover={{ color: 'gray.900' }}>
                        Entre em contato com o suporte
                    </Box>
                </RouterLink>
            </Text>
        </Flex>
    )
}

export default ResetPasswordPage
