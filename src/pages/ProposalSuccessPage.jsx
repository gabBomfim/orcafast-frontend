import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Divider,
} from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiDownload,
  FiList,
  FiUser,
  FiDollarSign,
  FiFileText,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Container from '../components/layout/Container'
import { proposalService } from '../services'

const ProposalSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.900', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const successBg = useColorModeValue('green.50', 'green.900')
  const successColor = useColorModeValue('green.600', 'green.300')

  const [initialData] = useState(() => {
    return location.state || JSON.parse(sessionStorage.getItem('pending_proposal_success') || '{}')
  })

  const { proposalId, proposalData, isEdit } = initialData

  useEffect(() => {
    // Redireciona se não houver dados
    if (!proposalId || !proposalData) {
      navigate('/dashboard/propostas')
    } else {
      sessionStorage.removeItem('pending_proposal_success')
    }
  }, [proposalId, proposalData, navigate])

  const handleWhatsAppShare = async () => {
    setIsSendingWhatsApp(true)

    try {
      // Atualiza o status do orçamento para "enviado" (status 2)
      await proposalService.updateStatus(proposalId, 2)

      // Constrói a URL pública do orçamento (será ajustada quando o backend fornecer o UUID)
      const proposalUrl = `${window.location.origin}/proposta/${proposalId}`

      // Mensagem personalizada
      const message = `Olá ${proposalData.clientName}!

Seu orçamento "${proposalData.title}" está pronto!

Valor: R$ ${proposalData.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Visualize os detalhes completos aqui:
${proposalUrl}

Qualquer dúvida, estou à disposição!`

      // URL do WhatsApp Web (sem número específico - permite escolher o contato)
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`

      // Abre em nova guia
      window.open(whatsappUrl, '_blank')

      toast({
        title: 'Orçamento marcado como enviado',
        description: 'Selecione o contato no WhatsApp para enviar.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.response?.data?.message || 'Não foi possível marcar como enviada.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSendingWhatsApp(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await proposalService.downloadPDF(proposalId)

      // Cria blob e faz download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `proposta-${proposalId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Download concluído',
        description: 'O PDF do orçamento foi baixado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao baixar PDF',
        description: error.response?.data?.message || 'Não foi possível baixar o PDF.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGoToList = () => {
    navigate('/dashboard/propostas')
  }

  if (!proposalId || !proposalData) {
    return null
  }

  return (
    <Container maxW="container.md">
      <Center minH="70vh">
        <Card
          shadow="xl"
          border="0"
          bg={bgColor}
          borderRadius="2xl"
          w="full"
          animation="fadeIn 0.5s ease-in"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="stretch">
              {/* Ícone de Sucesso */}
              <Center>
                <Box
                  w={20}
                  h={20}
                  bg={successBg}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animation="bounceIn 0.6s ease-out"
                >
                  <Icon as={FiCheckCircle} w={10} h={10} color={successColor} />
                </Box>
              </Center>

              {/* Título */}
              <VStack spacing={2}>
                <Heading as="h1" size="xl" textAlign="center" color={textColor}>
                  {isEdit ? 'Orçamento atualizado!' : 'Orçamento criado!'}
                </Heading>
                <Text fontSize="lg" color={subTextColor} textAlign="center">
                  {isEdit
                    ? 'As alterações foram salvas com sucesso.'
                    : 'Seu orçamento foi criado e está pronto para ser enviado.'}
                </Text>
              </VStack>

              <Divider />

              {/* Informações do Orçamento */}
              <VStack spacing={4} align="stretch" bg={successBg} p={6} borderRadius="xl">
                <HStack spacing={3}>
                  <Icon as={FiUser} color={successColor} boxSize={5} />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" color={subTextColor} fontWeight="medium">
                      Cliente
                    </Text>
                    <Text fontSize="md" color={textColor} fontWeight="semibold">
                      {proposalData.clientName}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3}>
                  <Icon as={FiFileText} color={successColor} boxSize={5} />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" color={subTextColor} fontWeight="medium">
                      Título
                    </Text>
                    <Text fontSize="md" color={textColor} fontWeight="semibold">
                      {proposalData.title}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3}>
                  <Icon as={FiDollarSign} color={successColor} boxSize={5} />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" color={subTextColor} fontWeight="medium">
                      Valor Total
                    </Text>
                    <Text fontSize="lg" color={successColor} fontWeight="bold">
                      R${' '}
                      {proposalData.totalValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* Botões de Ação */}
              <VStack spacing={4} pt={4}>
                <Button
                  leftIcon={<Icon as={FaWhatsapp} />}
                  size="lg"
                  w="full"
                  onClick={handleWhatsAppShare}
                  bg="#25D366"
                  color="white"
                  _hover={{ bg: '#128C7E' }}
                  _active={{ bg: '#075E54' }}
                  isLoading={isSendingWhatsApp}
                  loadingText="Enviando..."
                >
                  Enviar via WhatsApp
                </Button>

                <Button
                  leftIcon={<Icon as={FiDownload} />}
                  variant="outline"
                  colorScheme="emerald"
                  size="lg"
                  w="full"
                  onClick={handleDownloadPDF}
                  isLoading={isDownloading}
                  loadingText="Baixando..."
                >
                  Baixar PDF
                </Button>

                <Button
                  leftIcon={<Icon as={FiList} />}
                  variant="ghost"
                  size="lg"
                  w="full"
                  onClick={handleGoToList}
                >
                  Ver todos os orçamentos
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Center>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </Container>
  )
}

export default ProposalSuccessPage

