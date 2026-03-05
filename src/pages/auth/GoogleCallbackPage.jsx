import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, Spinner, Text, VStack, useToast } from '@chakra-ui/react'
import { storage } from '../../utils/storage'

const GoogleCallbackPage = () => {
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const error = params.get('error')

        if (error || !token) {
            toast({
                title: 'Falha no login com Google',
                description: 'Não foi possível autenticar com o Google. Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            navigate('/login?error=google_failed')
            return
        }

        // Salva o token usando a mesma chave do login normal (auth_token via storage.setToken)
        storage.setToken(token)

        // Busca os dados do usuário com o token recém-recebido
        fetch(`${import.meta.env.VITE_API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Falha ao buscar usuário')
                return res.json()
            })
            .then((user) => {
                storage.setUser(user)
                navigate('/dashboard')
            })
            .catch(() => {
                storage.clear()
                toast({
                    title: 'Erro ao carregar dados do usuário',
                    description: 'Tente fazer login novamente.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                navigate('/login?error=google_failed')
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Center minH="100vh" bg="gray.50">
            <VStack spacing={4}>
                <Spinner size="xl" color="emerald.500" thickness="3px" />
                <Text color="gray.600" fontSize="sm">
                    Autenticando com Google...
                </Text>
            </VStack>
        </Center>
    )
}

export default GoogleCallbackPage
