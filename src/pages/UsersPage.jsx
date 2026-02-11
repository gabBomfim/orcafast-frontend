import { Box, Heading, Text } from '@chakra-ui/react'
import Container from '../components/layout/Container'

const UsersPage = () => {
    return (
        <Container>
            <Box textAlign="center" py={10} px={6}>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Gerenciamento de Usuários
                </Heading>
                <Text color={'gray.500'}>
                    Esta funcionalidade é exclusiva do plano Business e estará disponível em breve.
                </Text>
            </Box>
        </Container>
    )
}

export default UsersPage
