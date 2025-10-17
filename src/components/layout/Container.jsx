import { Container as ChakraContainer } from '@chakra-ui/react'

const Container = ({ children, maxW = "container.xl", ...props }) => {
  return (
    <ChakraContainer
      maxW={maxW}
      mx="auto"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 4, md: 6 }}
      {...props}
    >
      {children}
    </ChakraContainer>
  )
}

export default Container
