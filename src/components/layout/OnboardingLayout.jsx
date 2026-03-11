import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'
import OrcafastLogo from '../ui/OrcafastLogo'
import { Link as RouterLink } from 'react-router-dom'

const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  contentWidth,
}) => {
  return (
    <Flex minH="100vh" bg="gray.50" direction="column">
      {/* Header with progress */}
      <Box w="full" py={6} px={4}>
        <Box maxW="lg" mx="auto">
          {/* Logo */}
          <Flex
            justify="center"
            mb={8}
          >
            <OrcafastLogo
              variant="full"
              height="40px"
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/'}
            />
          </Flex>

          {/* Progress bar */}
          <Flex align="center" gap={2} mb={2}>
            {[...Array(totalSteps)].map((_, index) => (
              <Box
                key={index}
                h="4px"
                flex={1}
                borderRadius="full"
                bg={index < currentStep ? 'emerald.500' : 'gray.200'}
                transition="all 0.3s"
              />
            ))}
          </Flex>
          <Text fontSize="xs" color="gray.500" textAlign="right">
            Etapa {currentStep} de {totalSteps}
          </Text>
        </Box>
      </Box>

      {/* Main content */}
      <Flex flex={1} align="start" justify="center" px={4} pb={8}>
        <Box w="full" maxW={contentWidth || 'lg'}>
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}

export default OnboardingLayout
