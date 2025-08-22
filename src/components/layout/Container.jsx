import { Container as ChakraContainer } from '@chakra-ui/react'

const Container = ({ children, ...props }) => {
  return (
    <ChakraContainer
      maxW="container.xl"
      mx="auto"
      px={4}
      py={8}
      {...props}
    >
      {children}
    </ChakraContainer>
  )
}

export default Container
