import {
  Box,
  VStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const ActionCard = ({ 
  icon, 
  title, 
  subtitle, 
  to, 
  variant = 'default',
  onClick,
  ...props 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  const isDashed = variant === 'dashed'
  
  const CardContent = (
    <Box
      bg={bgColor}
      p={8}
      borderRadius="xl"
      border="2px"
      borderColor={borderColor}
      borderStyle={isDashed ? 'dashed' : 'solid'}
      boxShadow="0 4px 6px -1px rgba(22, 78, 99, 0.1), 0 2px 4px -1px rgba(22, 78, 99, 0.06)"
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
        borderColor: isDashed ? 'primary.400' : borderColor,
      }}
      onClick={onClick}
      {...props}
    >
      <VStack spacing={4}>
        <Box
          w={12}
          h={12}
          bg={isDashed ? 'primary.50' : 'gray.50'}
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon 
            as={icon} 
            boxSize={6} 
            color={isDashed ? 'primary.500' : 'gray.600'} 
          />
        </Box>
        <VStack spacing={1} textAlign="center">
          <Text 
            fontWeight="semibold" 
            color={isDashed ? 'primary.500' : 'gray.700'}
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  )

  if (to) {
    return (
      <Link to={to}>
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

export default ActionCard
