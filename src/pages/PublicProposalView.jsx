import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Center,
  Spinner,
  VStack,
  HStack,
  Text,
  Flex,
  Image,
  Icon,
  Button,
  useToast,
} from '@chakra-ui/react'
import {
  FiClock,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiCalendar,
  FiUser,
  FiCopy,
  FiCheck,
  FiBriefcase,
  FiGrid,
  FiDownload,
} from 'react-icons/fi'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { proposalService } from '../services'
import { formMessages, successMessages } from '../utils/formMessages'

const PublicProposalView = () => {
  const { token } = useParams()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isExpired, setIsExpired] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const toast = useToast()

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

  const fmt = (n) => {
    const val = typeof n === 'string' ? parseFloat(n) : n
    return val?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const handleDownloadPDF = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const response = await proposalService.downloadPublicPDF(token)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const idStr = String(proposal?.id ?? '').padStart(4, '0')
      link.download = `orcamento-${idStr}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast({
        title: successMessages.quote.downloaded,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: formMessages.system.serverError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyPix = async (pixKey) => {
    try {
      await navigator.clipboard.writeText(pixKey)
      setCopiedPix(true)
      setTimeout(() => setCopiedPix(false), 2000)
    } catch {
      // clipboard não disponível
    }
  }

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
          <Box bg={isExpired ? 'orange.50' : 'red.50'} p={6} borderRadius="full">
            <Icon
              as={isExpired ? FiClock : FiAlertCircle}
              color={isExpired ? 'orange.500' : 'red.500'}
              boxSize={10}
            />
          </Box>
          <VStack spacing={3}>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              {isExpired ? 'Orçamento Expirado' : 'Ops!'}
            </Text>
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

  const { title, client, company, items, total_value, discount, subtotal, created_at, valid_until } = proposal

  const CompanyIcon = (
    <Center w={12} h={12} bg="emerald.50" borderRadius="xl" flexShrink={0}>
      <Icon as={FiBriefcase} color="emerald.500" boxSize={6} />
    </Center>
  )

  return (
    <Box bg="gray.50" minH="100vh">
      <Box maxW="lg" mx="auto" px={4} py={6} pb={10}>
        <VStack spacing={4} align="stretch">

          {/* Company Header Card */}
          <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
            <Box p={5}>
              <HStack align="start" spacing={4}>
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    h={12}
                    w={12}
                    objectFit="contain"
                    borderRadius="xl"
                    flexShrink={0}
                    fallback={CompanyIcon}
                  />
                ) : CompanyIcon}
                <Box flex={1} minW={0}>
                  <Text fontWeight="bold" color="gray.900" noOfLines={1}>{company.name}</Text>
                  {company.document && (
                    <Text fontSize="xs" color="gray.500">{company.document}</Text>
                  )}
                </Box>
              </HStack>

              {(company.email || company.phone) && (
                <HStack mt={4} flexWrap="wrap" spacing={4}>
                  {company.email && (
                    <HStack spacing={1} color="gray.500">
                      <Icon as={FiMail} boxSize={3} />
                      <Text fontSize="xs">{company.email}</Text>
                    </HStack>
                  )}
                  {company.phone && (
                    <HStack spacing={1} color="gray.500">
                      <Icon as={FiPhone} boxSize={3} />
                      <Text fontSize="xs">{formatPhone(company.phone)}</Text>
                    </HStack>
                  )}
                </HStack>
              )}
            </Box>

            <Flex px={5} py={4} bg="gray.50" borderTop="1px" borderColor="gray.100" justify="space-between" align="center">
              <Box>
                <HStack spacing={1} color="gray.500" mt="0.5">
                  <Icon as={FiCalendar} boxSize={3} />
                  <Text fontSize="xs">Criado em {new Date(created_at).toLocaleDateString('pt-BR')}</Text>
                </HStack>
              </Box>
              {valid_until && (
                <Box textAlign="right">
                  <Text fontSize="xs" color="gray.500">Válido até</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="orange.500">
                    {new Date(valid_until).toLocaleDateString('pt-BR')}
                  </Text>
                </Box>
              )}
            </Flex>
          </Box>

          {/* Client Card */}
          <Box bg="emerald.50" borderRadius="2xl" border="1px" borderColor="emerald.100" p={5}>
            <Text fontSize="xs" fontWeight="semibold" color="emerald.600" textTransform="uppercase" letterSpacing="wider" mb={3}>
              Orçamento para
            </Text>
            <HStack align="start" spacing={3}>
              <Center w={10} h={10} bg="emerald.100" borderRadius="full" flexShrink={0}>
                <Icon as={FiUser} color="emerald.600" boxSize={5} />
              </Center>
              <Box flex={1} minW={0}>
                <Text fontWeight="bold" color="gray.900">{client.name}</Text>
                {client.company && <Text fontSize="xs" color="gray.500">{client.company}</Text>}
                <VStack align="start" spacing={1} mt={2}>
                  {client.phone && (
                    <HStack spacing="1.5" color="gray.500">
                      <Icon as={FiPhone} boxSize={3} />
                      <Text fontSize="xs">{formatPhone(client.phone)}</Text>
                    </HStack>
                  )}
                  {client.email && (
                    <HStack spacing="1.5" color="gray.500">
                      <Icon as={FiMail} boxSize={3} />
                      <Text fontSize="xs">{client.email}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </HStack>
          </Box>

          {/* Quote Details Card */}
          <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
            <Box p={5} borderBottom="1px" borderColor="gray.100">
              <Text fontWeight="bold" color="gray.900">{title}</Text>
              {proposal.description && (
                <Text fontSize="sm" color="gray.500" mt={1}>{proposal.description}</Text>
              )}
            </Box>

            {items.map((item, idx) => {
              const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
              return (
                <Flex
                  key={idx}
                  p={4}
                  justify="space-between"
                  align="center"
                  gap={4}
                  borderBottom={idx < items.length - 1 ? '1px' : undefined}
                  borderColor="gray.100"
                >
                  <Box flex={1} minW={0}>
                    <Text fontWeight="medium" color="gray.900" fontSize="sm">{item.description}</Text>
                    <Text fontSize="xs" color="gray.500" mt="0.5">
                      {item.quantity}x R$ {fmt(item.unit_price)}
                    </Text>
                  </Box>
                  <Text fontWeight="semibold" color="gray.900" fontSize="sm" flexShrink={0}>
                    R$ {fmt(itemTotal)}
                  </Text>
                </Flex>
              )
            })}

            <Box p={5} bg="gray.50" borderTop="1px" borderColor="gray.100">
              <VStack spacing={2} align="stretch">
                <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.500">Subtotal</Text>
                  <Text fontWeight="medium" color="gray.900">R$ {fmt(subtotal)}</Text>
                </Flex>
                {parseFloat(discount) > 0 && (
                  <Flex justify="space-between" fontSize="sm">
                    <Text color="gray.500">Desconto</Text>
                    <Text fontWeight="medium" color="red.500">
                      - R$ {fmt(parseFloat(subtotal) * parseFloat(discount) / 100)}
                    </Text>
                  </Flex>
                )}
                <Flex justify="space-between" align="center" pt={2} borderTop="1px" borderColor="gray.200">
                  <Text fontWeight="bold" color="gray.900">Total</Text>
                  <Text fontSize="xl" fontWeight="bold" color="emerald.600">R$ {fmt(total_value)}</Text>
                </Flex>
              </VStack>
            </Box>
          </Box>

          {/* PIX Card */}
          {company.pix_key && (
            <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" p={5}>
              <HStack align="center" spacing={3}>
                <Center w={10} h={10} bg="emerald.50" borderRadius="xl" flexShrink={0}>
                  <Icon as={FiGrid} color="emerald.500" boxSize={5} />
                </Center>
                <Box flex={1} minW={0}>
                  <Text fontWeight="semibold" color="gray.900" fontSize="sm">Chave Pix</Text>
                  <Text fontSize="xs" color="gray.500" mt="0.5" noOfLines={1}>{company.pix_key}</Text>
                </Box>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyPix(company.pix_key)}
                  borderRadius="xl"
                  fontSize="xs"
                  h={8}
                  flexShrink={0}
                  leftIcon={
                    <Icon
                      as={copiedPix ? FiCheck : FiCopy}
                      boxSize="3.5"
                      color={copiedPix ? 'emerald.500' : undefined}
                    />
                  }
                >
                  {copiedPix ? 'Copiado' : 'Copiar'}
                </Button>
              </HStack>
            </Box>
          )}

          {/* Terms Card */}
          {(company.default_proposal_terms || proposal.terms) && (
            <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.200" p={5}>
              <Text fontWeight="semibold" color="gray.900" fontSize="sm" mb={2}>Condições de Pagamento</Text>
              <Text fontSize="sm" color="gray.500" whiteSpace="pre-wrap">
                {proposal.terms || company.default_proposal_terms}
              </Text>
            </Box>
          )}

          
          {/* Download PDF */}
          <Button
            onClick={handleDownloadPDF}
            isLoading={downloading}
            loadingText="Gerando PDF..."
            variant="solid"
            colorScheme="emerald"
            size="lg"
            height="56px"
            borderRadius="2xl"
            fontWeight="bold"
            fontSize="md"
            leftIcon={<Icon as={FiDownload} boxSize={5} />}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
            transition="all 0.2s"
          >
            Baixar orçamento em PDF
          </Button>

          {/* Footer */}
          <Box pt={4} textAlign="center">
            <Text fontSize="xs" color="gray.400" mb={2}>Documento gerado por</Text>
            <Flex justify="center">
              <Box as="a" href="https://orcafast.com.br" target="_blank" rel="noopener noreferrer">
                <OrcafastLogo variant="full" height="28px" />
              </Box>
            </Flex>
          </Box>

        </VStack>
      </Box>
    </Box>
  )
}

export default PublicProposalView
