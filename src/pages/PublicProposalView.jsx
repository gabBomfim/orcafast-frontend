import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Center,
  Spinner,
  Badge,
  Button,
  Flex,
  Icon,
} from '@chakra-ui/react'
import { FiClock, FiAlertCircle } from 'react-icons/fi'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { proposalService } from '../services'

const PublicProposalView = () => {
  const { token } = useParams()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data } = await proposalService.getPublicProposal(token)
        setProposal(data)
      } catch (err) {
        if (err.response?.status === 410) {
          setIsExpired(true)
          setError(err.response.data.message || 'Este orçamento expirou.')
        } else {
          setError('Orçamento não encontrado ou link expirado.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProposal()
  }, [token])

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="emerald.500" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center minH="100vh" p={4} bg="gray.50" flexDir="column">
        <Box mb={12}>
          <OrcafastLogo variant="full" height="40px" />
        </Box>
        
        <VStack spacing={6} p={10} bg="white" borderRadius="3xl" shadow="2xl" maxW="440px" textAlign="center" border="1px" borderColor="gray.100">
          <Box bg={isExpired ? "orange.50" : "red.50"} p={6} borderRadius="full">
            <Icon 
              as={isExpired ? FiClock : FiAlertCircle} 
              color={isExpired ? "orange.500" : "red.500"} 
              boxSize={10} 
            />
          </Box>
          <VStack spacing={3}>
            <Heading size="lg" color="gray.900" fontWeight="bold">
              {isExpired ? 'Orçamento Expirado' : 'Ops!'}
            </Heading>
            <Text color="gray.600" fontSize="md" px={4}>
              {error}
            </Text>
          </VStack>
          <Button
            as="a"
            href="https://orcafast.com.br"
            colorScheme="emerald"
            variant="link"
            size="md"
            height="40px"
            fontWeight="bold"
            mt={4}
          >
            Voltar para o site
          </Button>
        </VStack>
      </Center>
    )
  }

  const { title, client, company, items, total_value, discount, subtotal, default_proposal_terms, created_at, valid_until } = proposal
  const fmt = (n) => {
    const val = typeof n === 'string' ? parseFloat(n) : n
    return val?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="container.lg" bg="white" p={12} borderRadius="2xl" shadow="xl">
        {/* Header - Empresa */}
        <Flex justify="space-between" align="start" mb={8} direction={{ base: 'column', md: 'row' }} gap={6}>
          <Box>
            {company.logo_url && (
              <Image src={company.logo_url} h="60px" mb={4} fallbackSrc="https://via.placeholder.com/150x60?text=LOGO" />
            )}
            <Heading size="md" color="gray.900">{company.name}</Heading>
            <Text color="gray.600" fontSize="sm">{company.email}</Text>
            {company.phone && <Text color="gray.600" fontSize="sm">{company.phone}</Text>}
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Heading size="lg" color="emerald.600" mb={1}>ORÇAMENTO</Heading>
            <VStack align={{ base: 'start', md: 'end' }} spacing={0}>
              <Text color="gray.500" fontSize="sm">Data: {new Date(created_at).toLocaleDateString('pt-BR')}</Text>
              {valid_until && (
                <Text color="red.500" fontSize="sm" fontWeight="medium">
                  Válido até: {new Date(valid_until).toLocaleDateString('pt-BR')}
                </Text>
              )}
            </VStack>
          </Box>
        </Flex>

        <Divider mb={8} />

        {/* Info - Cliente */}
        <Box mb={8} bg="emerald.50" p={6} borderRadius="xl" borderWidth="1px" borderColor="emerald.100">
          <Heading size="xs" color="emerald.700" mb={3} textTransform="uppercase">Orçamento para:</Heading>
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">{client.name}</Text>
            {client.company && <Text fontSize="sm" color="gray.600">{client.company}</Text>}
            {client.phone && <Text fontSize="sm" color="gray.600">{client.phone}</Text>}
            {client.email && <Text fontSize="sm" color="gray.600">{client.email}</Text>}
          </VStack>
        </Box>

        <VStack align="start" spacing={2} mb={6}>
          <Heading size="md" color="gray.900">{title}</Heading>
        </VStack>

        {/* Itens */}
        <Box overflowX="auto" mb={8}>
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Descrição</Th>
                <Th isNumeric>Qtd</Th>
                <Th isNumeric>Unitário</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, idx) => {
                const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
                return (
                  <Tr key={idx}>
                    <Td fontWeight="medium">{item.description}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>R$ {fmt(item.unit_price)}</Td>
                    <Td isNumeric fontWeight="semibold">R$ {fmt(itemTotal)}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>

        {/* Resumo Financeiro */}
        <Flex justify="flex-end" mb={8}>
          <VStack align="stretch" spacing={3} w={{ base: 'full', md: '250px' }}>
            <HStack justify="space-between">
              <Text color="gray.600">Subtotal:</Text>
              <Text fontWeight="medium">R$ {fmt(subtotal)}</Text>
            </HStack>
            {parseFloat(discount) > 0 && (
              <HStack justify="space-between">
                <Text color="gray.600">Desconto ({parseFloat(discount)}%):</Text>
                <Text fontWeight="medium" color="red.500">- R$ {fmt(parseFloat(subtotal) * parseFloat(discount) / 100)}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Total:</Text>
              <Text fontSize="xl" fontWeight="bold" color="emerald.600">R$ {fmt(total_value)}</Text>
            </HStack>
          </VStack>
        </Flex>

        {/* Termos e Rodapé */}
        {(company.default_proposal_terms || proposal.terms) && (
          <Box mb={12}>
            <Heading size="sm" mb={3} color="gray.900">Termos e Condições:</Heading>
            <Box bg="gray.50" p={4} borderRadius="lg" fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
              {proposal.terms || company.default_proposal_terms}
            </Box>
          </Box>
        )}

        <Box textAlign="center" pt={8} borderTop="1px" borderColor="gray.100">
          <Text color="gray.400" fontSize="xs">Documento gerado digitalmente por OrçaFast</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default PublicProposalView
