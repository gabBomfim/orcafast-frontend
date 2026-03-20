import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
} from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OnboardingLayout from '../../components/layout/OnboardingLayout'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { maskPhone, unmaskPhone } from '../../utils/mask'
import { useState } from 'react'
import { FieldError } from '../../components/ui/FormFeedback'
import { formMessages } from '../../utils/formMessages'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const { updateClientData, guestData } = useOnboarding()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const phone = unmaskPhone(formData.get('phone'))
    const email = formData.get('email')

    const clientData = {
      name: formData.get('name'),
      phone: phone || null,
      email: email || null
    }

    if (!validate()) return
    updateClientData(clientData)
    navigate('/onboarding/create-proposal')
  }

  const [name, setName] = useState(guestData?.client?.name || '')
  const [phone, setPhone] = useState(guestData?.client?.phone ? maskPhone(guestData.client.phone) : '')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!name.trim()) next.name = formMessages.required.name
    const digits = phone.replace(/\D/g, '')
    if (!digits) next.phone = formMessages.required.phone
    else if (digits.length < 10) next.phone = formMessages.invalid.phone
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Botão habilitado quando nome tem texto e telefone tem pelo menos 10 dígitos
  const isFormValid = name.trim().length > 0 && phone.replace(/\D/g, '').length >= 10

  return (
    <OnboardingLayout currentStep={1} totalSteps={3}>
      {/* Icon and title */}
      <VStack textAlign="center" mb={8}>
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
          Quem é o cliente?
        </Heading>
        <Text color="gray.600">
          Vamos colocar os dados de quem vai receber o orçamento.
        </Text>
      </VStack>

      {/* Form */}
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
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
            Nome do cliente <Text as="span" color="red.500">*</Text>
          </Text>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ex: João Silva"
            defaultValue={guestData?.client?.name || ''}
            isInvalid={!!errors.name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
            }}
          />
          <FieldError message={errors.name} />
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
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
              Telefone <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              defaultValue={guestData?.client?.phone ? maskPhone(guestData.client.phone) : ''}
              isInvalid={!!errors.phone}
              onChange={(e) => {
                const masked = maskPhone(e.target.value)
                e.target.value = masked
                setPhone(masked)
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
              }}
            />
            <FieldError message={errors.phone} />
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
              defaultValue={guestData?.client?.email || ''}
            />
          </Box>
        </SimpleGrid>

        {/* Tip */}
        {/* <Flex
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
              Dica
            </Text>
            <Text fontSize="sm" color="gray.600">
              Adicione o telefone do WhatsApp para enviar o orçamento diretamente.
            </Text>
          </Box>
        </Flex> */}

        {/* Navigation */}
        <Flex align="center" justify="space-between" w="full" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
          <Button
            as={RouterLink}
            to="/"
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
            //isDisabled={name === '' || phone === ''}
            isDisabled={!isFormValid}
            rightIcon={<Icon as={FiChevronRight} w={4} h={4} />}
          >
            Continuar
          </Button>
        </Flex>
      </VStack>
    </OnboardingLayout>
  )
}

export default CreateClientPage
