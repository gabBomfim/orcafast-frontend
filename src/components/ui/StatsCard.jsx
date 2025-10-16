import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'

const StatsCard = ({ 
  title, 
  value, 
  helpText, 
  icon, 
  colorScheme = 'primary',
  onClick,
  isActive = false,
  ...props 
}) => {
  const bgColor = useColorModeValue('white', 'whiteAlpha.100')
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const activeBorderColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.300`)
  const textColor = useColorModeValue('gray.900', 'white')
  const labelColor = useColorModeValue('gray.600', 'whiteAlpha.700')
  const helpTextColor = useColorModeValue('gray.500', 'whiteAlpha.600')
  
  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="16px"
      border="1px"
      borderColor={isActive ? activeBorderColor : 'gray.100'}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.3s ease"
      _hover={onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
        borderColor: 'primary.100',
      } : {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
        borderColor: 'primary.100',
      }}
      {...props}
    >
      <Flex align="center" justify="space-between">
        <Stat>
          <StatLabel fontSize="sm" fontWeight="600" color={labelColor}>
            {title}
          </StatLabel>
          <StatNumber 
            fontSize="2xl" 
            fontWeight="800" 
            color={textColor}
            letterSpacing="-0.5px"
          >
            {value}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="xs" color={helpTextColor} fontWeight="500">
              {helpText}
            </StatHelpText>
          )}
        </Stat>
        {icon && (
          <Icon 
            as={icon} 
            boxSize={10} 
            color={`${colorScheme}.500`} 
            strokeWidth={1.5}
          />
        )}
      </Flex>
    </Box>
  )
}

export default StatsCard
