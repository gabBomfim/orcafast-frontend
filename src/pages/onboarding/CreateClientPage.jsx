import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react'
import {
  FiUser,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiInfo,
} from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import { useOnboarding } from '../../contexts/OnboardingContext'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const { updateClientData } = useOnboarding()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const phone = formData.get('phone')
    const email = formData.get('email')
    
    // Validação: pelo menos telefone ou email deve ser fornecido
    if (!phone && !email) {
      // Como não temos toast no onboarding, vamos usar alert por enquanto
      alert('Adicione pelo menos o telefone ou e-mail do cliente.')
      return
    }
    
    const clientData = {
      name: formData.get('name'),
      phone: phone || null,
      email: email || null
    }

    updateClientData(clientData)
    navigate('/onboarding/create-proposal')
  }

  return (
    <OnboardingLayout currentStep={1} totalSteps={4} stepTitle="Criar Cliente">
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
            <Icon as={FiUser} w={10} h={10} color="emerald.600" />
          </Flex>
          <Heading as="h1" size="xl" fontWeight="bold" color="gray.900" mb={4}>
            Cadastrar cliente
          </Heading>
          <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
            Vamos começar cadastrando seu primeiro cliente. É rápido e simples!
          </Text>
        </CardHeader>

        <CardBody>
          <VStack as="form" spacing={8} w="full" onSubmit={handleSubmit}>
            <VStack spacing={6} w="full">
              <VStack align="start" spacing={2} w="full">
                <Text
                  htmlFor="name"
                  fontSize="lg"
                  fontWeight="semibold"
                  color="gray.700"
                >
                  Nome do cliente
                </Text>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ex: João Silva"
                    borderRadius="xl"
                    py={6}
                    fontSize="lg"
                  />
                </InputGroup>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <VStack align="start" spacing={2} w="full">
                  <Text
                    htmlFor="phone"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    Telefone *
                  </Text>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      borderRadius="xl"
                      py={6}
                      fontSize="lg"
                      required
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 11) {
                          if (value.length <= 2) {
                            e.target.value = value
                          } else if (value.length <= 7) {
                            e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`
                          } else {
                            e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
                          }
                        }
                      }}
                    />
                  </InputGroup>
                </VStack>

                <VStack align="start" spacing={2} w="full">
                  <Text
                    htmlFor="email"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    E-mail
                  </Text>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="cliente@email.com"
                      borderRadius="xl"
                      py={6}
                      fontSize="lg"
                    />
                  </InputGroup>
                </VStack>
              </SimpleGrid>
            </VStack>

            <Alert
              status="info"
              variant="subtle"
              borderRadius="xl"
              flexDirection="row"
              alignItems="center"
              colorScheme="blue"
            >
              <AlertIcon as={FiInfo} boxSize={6} />
              <Box>
                <AlertTitle fontWeight="semibold">Dica profissional</AlertTitle>
                <AlertDescription>
                  Adicione o Telefone do WhatsApp para enviar a proposta.
                </AlertDescription>
              </Box>
            </Alert>

            <HStack w="full" pt={4}>
              <Button
                as={RouterLink}
                to="/"
                size="lg"
                variant="ghost"
                flex={1}
                py={6}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                colorScheme="emerald"
                flex={1}
                py={6}
                rightIcon={<Icon as={FiArrowRight} />}
              >
                Próximo
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </OnboardingLayout>
  )
}

export default CreateClientPage
