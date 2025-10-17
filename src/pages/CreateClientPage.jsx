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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiUser,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiInfo,
  FiBriefcase,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import { clientService } from '../services'
import { useState } from 'react'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.target)
    
    const phone = formData.get('phone')
    const email = formData.get('email')
    
    // Validação: pelo menos telefone ou email deve ser fornecido
    if (!phone && !email) {
      toast({
        title: 'Contato obrigatório',
        description: 'Adicione pelo menos o telefone ou e-mail do cliente.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }
    
    const clientData = {
      name: formData.get('name'),
      phone: phone || null,
      email: email || null,
      company: formData.get('company') || null,
    }

    try {
      await clientService.create(clientData)
      
      toast({
        title: 'Cliente cadastrado!',
        description: 'O cliente foi cadastrado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/dashboard/clientes')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar cliente'
      toast({
        title: 'Erro',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md">
      <Card
        shadow="xl"
        border="0"
        bg={bgColor}
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
          <Heading as="h1" size="xl" fontWeight="bold" color={textColor} mb={4}>
            Cadastrar cliente
          </Heading>
          <Text fontSize="lg" color={subTextColor} lineHeight="relaxed">
            Cadastre um novo cliente para suas propostas
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
                  color={textColor}
                >
                  Nome do cliente *
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
                    required
                  />
                </InputGroup>
              </VStack>

              <VStack align="start" spacing={2} w="full">
                <Text
                  htmlFor="company"
                  fontSize="lg"
                  fontWeight="semibold"
                  color={textColor}
                >
                  Empresa
                </Text>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBriefcase} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Ex: Silva Construções"
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
                  color={textColor}
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
                    color={textColor}
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
                onClick={() => navigate('/dashboard/clientes')}
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
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                Salvar Cliente
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default CreateClientPage
