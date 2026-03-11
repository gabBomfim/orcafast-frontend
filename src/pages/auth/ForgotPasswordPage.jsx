import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Input,
    Text,
    VStack,
    Spinner,
    useToast,
} from '@chakra-ui/react'
import { authService } from '../../services'
import {
    FiArrowLeft,
    FiMail,
    FiCheckCircle,
    FiAlertTriangle,
} from 'react-icons/fi'
import OrcafastLogo from '../../components/ui/OrcafastLogo'

const ForgotPasswordPage = () => {
    const toast = useToast()
    const [email, setEmail] = useState('')
    const [flowState, setFlowState] = useState('form') // 'form' | 'loading' | 'success' | 'google-conflict'

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) return

        setFlowState('loading')

        try {
            const res = await authService.forgotPassword(email)
            toast({
                title: 'Verifique seu e-mail',
                description: res.data?.message || 'Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            setFlowState('success')
        } catch (error) {
            if (error.response?.status === 422) {
                const emailErrors = error.response?.data?.errors?.email
                if (emailErrors && emailErrors.length > 0) {
                    toast({
                        title: 'Conta Google',
                        description: emailErrors[0],
                        status: 'warning',
                        duration: 6000,
                        isClosable: true,
                    })
                    setFlowState('google-conflict')
                    return
                }
            }

            toast({
                title: 'Erro ao enviar o link',
                description: error.response?.data?.message || 'Ocorreu um erro ao tentar recuperar a senha.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            setFlowState('form')
        }
    }

    return (
        <Flex minH="100vh" bg="#f8fafc" direction="column" align="center" justify="center" px={4} py={8}>
            {/* Logo */}
            <OrcafastLogo
                variant="full"
                height="40px"
                style={{ cursor: 'pointer', marginBottom: '2.5rem' }}
                onClick={() => window.location.href = '/'}
            />

            {/* Card Container */}
            <Box w="full" maxW="sm">
                {/* State: Form (default) */}
                {(flowState === 'form' || flowState === 'loading') && (
                    <>
                        {/* Header */}
                        <Box textAlign="center" mb={8}>
                            <Flex w={16} h={16} bg="emerald.50" rounded="2xl" align="center" justify="center" mx="auto" mb={4}>
                                <Icon as={FiMail} w={8} h={8} color="emerald.500" />
                            </Flex>
                            <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                                Esqueceu sua senha?
                            </Heading>
                            <Text color="gray.500" fontSize="sm">
                                Digite o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                            </Text>
                        </Box>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                {/* Email field */}
                                <Box>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                        isDisabled={flowState === 'loading'}
                                        h={12}
                                        px={4}
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
                                </Box>

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    isDisabled={flowState === 'loading' || !email}
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
                                    _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                                >
                                    {flowState === 'loading' ? (
                                        <Flex align="center">
                                            <Spinner size="sm" mr={2} />
                                            Enviando...
                                        </Flex>
                                    ) : (
                                        "Enviar link de recuperação"
                                    )}
                                </Button>
                            </VStack>
                        </form>

                        {/* Back to login */}
                        <Flex
                            as={RouterLink}
                            to="/login"
                            align="center"
                            justify="center"
                            gap={2}
                            mt={6}
                            fontSize="sm"
                            color="gray.500"
                            _hover={{ color: 'gray.900' }}
                            transition="colors"
                        >
                            <Icon as={FiArrowLeft} w={4} h={4} />
                            Voltar para o login
                        </Flex>
                    </>
                )}

                {/* State: Success */}
                {flowState === 'success' && (
                    <Box textAlign="center">
                        {/* Success icon */}
                        <Flex w={20} h={20} bg="emerald.50" rounded="full" align="center" justify="center" mx="auto" mb={6}>
                            <Icon as={FiCheckCircle} w={10} h={10} color="emerald.500" />
                        </Flex>

                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={3}>
                            Verifique sua caixa de entrada
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mb={2}>
                            Enviamos um e-mail para:
                        </Text>
                        <Text color="gray.900" fontWeight="medium" fontSize="sm" mb={4}>
                            {email}
                        </Text>

                        {/* Info card */}
                        <Box bg="emerald.50" border="1px" borderColor="emerald.100" rounded="xl" p={4} mb={6}>
                            <Text fontSize="sm" color="gray.600">
                                Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes. Verifique também sua pasta de spam.
                            </Text>
                        </Box>

                        {/* Back to login */}
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
                                Voltar para o login
                            </Button>
                        </RouterLink>

                        {/* Resend option */}
                        <Box as="button"
                            onClick={() => setFlowState("form")}
                            mt={4}
                            fontSize="sm"
                            color="gray.500"
                            _hover={{ color: 'emerald.500' }}
                            transition="colors"
                        >
                            Não recebeu? Tentar outro e-mail
                        </Box>
                    </Box>
                )}

                {/* State: Google Conflict */}
                {flowState === 'google-conflict' && (
                    <Box textAlign="center">
                        {/* Warning icon */}
                        <Flex w={20} h={20} bg="yellow.100" rounded="full" align="center" justify="center" mx="auto" mb={6}>
                            <Icon as={FiAlertTriangle} w={10} h={10} color="yellow.600" />
                        </Flex>

                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={3}>
                            Conta criada via Google
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mb={6}>
                            Identificamos que esta conta foi criada usando o Google. Você não precisa de senha para acessá-la.
                        </Text>

                        {/* Warning card */}
                        <Box bg="yellow.50" border="1px" borderColor="yellow.200" rounded="xl" p={4} mb={6}>
                            <Text fontSize="sm" color="yellow.800">
                                Use o botão abaixo para fazer login diretamente com sua conta Google.
                            </Text>
                        </Box>

                        {/* Google login button */}
                        <Button
                            w="full"
                            h={12}
                            bg="gray.100"
                            _hover={{ bg: 'gray.200' }}
                            rounded="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={3}
                            fontWeight="medium"
                            color="gray.900"
                            transition="all"
                            fontSize="sm"
                            mb={4}
                            onClick={() => { window.location.href = import.meta.env.VITE_GOOGLE_REDIRECT_URL }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Fazer login com Google
                        </Button>

                        {/* Back to login */}
                        <Flex
                            as={RouterLink}
                            to="/login"
                            align="center"
                            justify="center"
                            gap={2}
                            fontSize="sm"
                            color="gray.500"
                            _hover={{ color: 'gray.900' }}
                            transition="colors"
                        >
                            <Icon as={FiArrowLeft} w={4} h={4} />
                            Voltar para o login
                        </Flex>
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

export default ForgotPasswordPage
