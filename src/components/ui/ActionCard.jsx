import {
  Box,
  VStack,
  Icon,
  Text,
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
  const isDashed = variant === 'dashed'
  
  const CardContent = (
    <Box
      bg="white"
      p={8}
      borderRadius="16px"
      border="2px"
      borderColor="gray.200"
      borderStyle={isDashed ? 'dashed' : 'solid'}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.1)',
        borderColor: isDashed ? 'emerald.500' : 'emerald.200',
      }}
      onClick={onClick}
      {...props}
    >
      <VStack spacing={4}>
        <Box
          w={14}
          h={14}
          bg={isDashed ? 'linear-gradient(135deg, rgba(0, 217, 126, 0.1) 0%, rgba(0, 217, 126, 0.05) 100%)' : 'gray.50'}
          border={isDashed ? '1px solid' : 'none'}
          borderColor={isDashed ? 'emerald.200' : 'transparent'}
          borderRadius="14px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.3s ease"
          sx={{
            'div:hover > &': {
              transform: isDashed ? 'scale(1.1) rotate(5deg)' : 'scale(1.05)',
            }
          }}
        >
          <Icon 
            as={icon} 
            boxSize={7} 
            color={isDashed ? 'emerald.500' : 'gray.600'} 
            strokeWidth={2}
          />
        </Box>
        <VStack spacing={1} textAlign="center">
          <Text 
            fontWeight="700" 
            color={isDashed ? 'emerald.500' : 'gray.800'}
            letterSpacing="-0.3px"
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500" fontWeight="500">
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
