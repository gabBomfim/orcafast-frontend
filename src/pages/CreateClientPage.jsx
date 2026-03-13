import {
  Box,
  Button,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiUser,
  FiPhone,
  FiMail,
  FiChevronRight,
  FiMessageSquare,
  FiBriefcase,
  FiChevronLeft,
} from 'react-icons/fi'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import { clientService } from '../services'
import { useState, useEffect, useRef } from 'react'
import { maskPhone, unmaskPhone } from '../utils/mask'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = !!editId
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(isEditMode)
  const fetching = useRef(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })

  useEffect(() => {
    if (!isEditMode || fetching.current) return
    fetching.current = true

    const loadClient = async () => {
      try {
        const { data } = await clientService.get(editId)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: maskPhone(data.phone || ''),
          company: data.company || '',
        })
      } catch (error) {
        toast({
          title: 'Erro ao carregar cliente',
          description: error.response?.data?.message || 'Não foi possível carregar os dados do cliente',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        navigate('/dashboard/clientes')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadClient()
  }, [editId, isEditMode, navigate, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataObj = new FormData(e.target)

    let phone = formDataObj.get('phone')
    const email = formDataObj.get('email')

    // Remove formatação do telefone antes de enviar
    if (phone) {
      phone = unmaskPhone(phone)
    }

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
      name: formDataObj.get('name'),
      phone: phone || null,
      email: email || null,
      company: formDataObj.get('company') || null,
    }

    try {
      if (isEditMode) {
        await clientService.update(editId, clientData)
        toast({
          title: 'Cliente atualizado!',
          description: 'O cliente foi atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await clientService.create(clientData)
        toast({
          title: 'Cliente cadastrado!',
          description: 'O cliente foi cadastrado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

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
    <Flex minH="100vh" bg="gray.50" direction="column" py={8}>
      <Flex flex={1} align="start" justify="center" px={4}>
        <Box w="full" maxW="2xl">
          {isLoadingData ? (
            <Center py={12}>
              <Spinner size="lg" color="emerald.500" />
            </Center>
          ) : (
            <Box
              bg="white"
              borderRadius="2xl"
              p={10}
              boxShadow="sm"
              w="full"
            >
              {/* Icon and title */}
              <VStack textAlign="center" mb={10}>
                <Flex
                  w={16}
                  h={16}
                  bg="emerald.50"
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={FiUser} w={8} h={8} color="emerald.500" />
                </Flex>
                <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                  {isEditMode ? 'Editar cliente' : 'Cadastrar cliente'}
                </Heading>
                <Text color="gray.600">
                  {isEditMode ? 'Atualize os dados do cliente' : 'Cadastre um novo cliente para seus orçamentos'}
                </Text>
              </VStack>

              {/* Form */}
              <VStack as="form" onSubmit={handleSubmit} spacing={6}>
                <Box w="full">
                  <Text
                    as="label"
                    htmlFor="name"
                    display="block"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    mb={2}
                  >
                    Nome do cliente *
                  </Text>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Box>

                <Box w="full">
                  <Text
                    as="label"
                    htmlFor="company"
                    display="block"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    mb={2}
                  >
                    Empresa
                  </Text>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Ex: Silva Construções"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  <Box>
                    <Text
                      as="label"
                      htmlFor="phone"
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={2}
                    >
                      Telefone *
                    </Text>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: maskPhone(e.target.value) })
                      }}
                      required
                    />
                  </Box>

                  <Box>
                    <Text
                      as="label"
                      htmlFor="email"
                      display="block"
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.900"
                      mb={2}
                    >
                      E-mail
                    </Text>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="cliente@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                {/* Tip */}
                <Flex
                  bg="emerald.50"
                  border="1px"
                  borderColor="emerald.100"
                  borderRadius="xl"
                  p={4}
                  gap={3}
                  w="full"
                >
                  <Flex
                    w={8}
                    h={8}
                    bg="emerald.100"
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FiMessageSquare} w={4} h={4} color="emerald.600" />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.900" mb={1}>
                      Dica profissional
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Adicione o telefone do WhatsApp para enviar o orçamento diretamente.
                    </Text>
                  </Box>
                </Flex>

                {/* Navigation */}
                <Flex align="center" justify="space-between" w="full" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
                  <Button
                    onClick={() => navigate('/dashboard/clientes')}
                    variant="ghost"
                    leftIcon={<Icon as={FiChevronLeft} w={4} h={4} />}
                    color="gray.600"
                    _hover={{ color: 'gray.900' }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    h={12}
                    px={8}
                    bg="emerald.500"
                    _hover={{ bg: 'emerald.600' }}
                    color="white"
                    fontWeight="semibold"
                    fontSize="sm"
                    borderRadius="xl"
                    boxShadow="lg"
                    rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
                    isLoading={isLoading}
                    loadingText="Salvando..."
                  >
                    {isEditMode ? 'Atualizar Cliente' : 'Salvar Cliente'}
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export default CreateClientPage
