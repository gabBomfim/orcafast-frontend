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
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeBorderColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.300`)
  
  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="2px"
      borderColor={isActive ? activeBorderColor : borderColor}
      boxShadow="0 4px 6px -1px rgba(22, 78, 99, 0.1), 0 2px 4px -1px rgba(22, 78, 99, 0.06)"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.2s ease-in-out"
      _hover={onClick ? {
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
      } : {}}
      {...props}
    >
      <Flex align="center" justify="space-between">
        <Stat>
          <StatLabel fontSize="sm" fontWeight="medium" color="gray.600">
            {title}
          </StatLabel>
          <StatNumber 
            fontSize="2xl" 
            fontWeight="bold" 
            color={`${colorScheme}.500`}
          >
            {value}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="xs" color="gray.500">
              {helpText}
            </StatHelpText>
          )}
        </Stat>
        {icon && (
          <Icon 
            as={icon} 
            boxSize={8} 
            color={`${colorScheme}.400`} 
            opacity={0.6}
          />
        )}
      </Flex>
    </Box>
  )
}

export default StatsCard
