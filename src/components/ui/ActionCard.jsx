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
  const bgColor = useColorModeValue('white', 'whiteAlpha.100')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')
  const iconBgColor = useColorModeValue('gray.50', 'whiteAlpha.50')
  const textColor = useColorModeValue('gray.800', 'white')
  const subtitleColor = useColorModeValue('gray.500', 'whiteAlpha.700')
  const iconColor = useColorModeValue('gray.600', 'whiteAlpha.800')
  
  const isDashed = variant === 'dashed'
  
  const CardContent = (
    <Box
      bg={bgColor}
      p={8}
      borderRadius="16px"
      border="2px"
      borderColor={borderColor}
      borderStyle={isDashed ? 'dashed' : 'solid'}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.1)',
        borderColor: isDashed ? 'primary.500' : 'primary.200',
      }}
      onClick={onClick}
      {...props}
    >
      <VStack spacing={4}>
        <Box
          w={14}
          h={14}
          bg={isDashed ? 'linear-gradient(135deg, rgba(0, 217, 126, 0.1) 0%, rgba(0, 217, 126, 0.05) 100%)' : iconBgColor}
          border={isDashed ? '1px solid' : 'none'}
          borderColor={isDashed ? 'primary.200' : 'transparent'}
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
            color={isDashed ? 'primary.500' : iconColor} 
            strokeWidth={2}
          />
        </Box>
        <VStack spacing={1} textAlign="center">
          <Text 
            fontWeight="700" 
            color={isDashed ? 'primary.500' : textColor}
            letterSpacing="-0.3px"
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color={subtitleColor} fontWeight="500">
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
