import {
  Box,
  Flex,
  Icon,
  Text,
  Badge,
  Container,
  Progress,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  stepTitle,
}) => {
  const progressPercent = ((currentStep / totalSteps) * 100).toFixed(0)

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="gray.900" color="white" py={8}>
        <Container maxW="container.md">
          <VStack spacing={6}>
            <RouterLink to="/">
              <Flex align="center">
                <Flex
                  w={10}
                  h={10}
                  bg="whiteAlpha.200"
                  borderRadius="lg"
                  align="center"
                  justify="center"
                  mr={3}
                >
                  <Icon as={FiZap} color="emerald.400" w={6} h={6} />
                </Flex>
                <Text fontSize="2xl" fontWeight="bold">
                  OrçaFast
                </Text>
              </Flex>
            </RouterLink>
            <Heading as="h1" size="lg">
              {stepTitle}
            </Heading>
            <VStack w="full" spacing={2}>
              <Progress
                value={progressPercent}
                size="sm"
                colorScheme="emerald"
                borderRadius="full"
                w="full"
                bg="gray.700"
              />
              <Flex w="full" justify="space-between">
                <Text fontSize="xs" color="gray.400">
                  Progresso
                </Text>
                <Badge
                  colorScheme="emerald"
                  variant="subtle"
                  borderRadius="full"
                  fontSize="xs"
                >
                  Etapa {currentStep} de {totalSteps}
                </Badge>
              </Flex>
            </VStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.md" py={12}>
        {children}
      </Container>
    </Box>
  )
}

export default OnboardingLayout
