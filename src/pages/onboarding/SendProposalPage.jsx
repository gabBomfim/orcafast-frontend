import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiShare2,
  FiArrowLeft,
  FiMessageSquare,
  FiMail,
  FiLink,
} from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import LoginModal from '../../components/ui/LoginModal'

const SendProposalPage = () => {
  const navigate = useNavigate()
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose } = useDisclosure()

  const handleSend = () => {
    // Mostra o modal de cadastro/login antes de enviar
    onLoginModalOpen()
  }

  const handleLoginSuccess = () => {
    // Esta função será chamada após o login bem-sucedido
    // O modal já redireciona para /dashboard, então podemos fazer algo adicional aqui se necessário
  }

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      stepTitle="Enviar Proposta"
    >
      <Card
        shadow="xl"
        border="0"
        bg="whiteAlpha.900"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
      >
        <CardHeader textAlign="center" pb={8}>
          <Flex
            w={20}
            h={20}
            bg="emerald.100"
            borderRadius="3xl"
            align="center"
            justify="center"
            mx="auto"
            mb={6}
          >
            <Icon as={FiShare2} w={10} h={10} color="emerald.600" />
          </Flex>
          <Heading as="h1" size="xl" fontWeight="bold" color="gray.900" mb={4}>
            Tudo pronto para enviar!
          </Heading>
          <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
            Para enviar e acompanhar sua proposta, crie uma conta ou faça login.
          </Text>
        </CardHeader>

        <CardBody>
          <VStack spacing={6} w="full">
            <Button
              w="full"
              size="lg"
              colorScheme="whatsapp"
              py={8}
              leftIcon={<Icon as={FiMessageSquare} boxSize={6} />}
              onClick={handleSend}
            >
              <Text as="span" flex="1" textAlign="left">
                Enviar pelo WhatsApp
              </Text>
            </Button>
            <Button
              w="full"
              size="lg"
              colorScheme="gray"
              variant="outline"
              py={8}
              leftIcon={<Icon as={FiMail} boxSize={6} />}
              onClick={handleSend}
            >
              <Text as="span" flex="1" textAlign="left">
                Enviar por E-mail
              </Text>
            </Button>
            <Button
              w="full"
              size="lg"
              colorScheme="gray"
              variant="outline"
              py={8}
              leftIcon={<Icon as={FiLink} boxSize={6} />}
              onClick={handleSend}
            >
              <Text as="span" flex="1" textAlign="left">
                Copiar link da proposta
              </Text>
            </Button>

            <HStack w="full" pt={4}>
              <Button
                as={RouterLink}
                to="/onboarding/create-proposal"
                size="lg"
                variant="ghost"
                flex={1}
                py={6}
                leftIcon={<Icon as={FiArrowLeft} />}
              >
                Voltar
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
        onSuccess={handleLoginSuccess}
      />
    </OnboardingLayout>
  )
}

export default SendProposalPage
