import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
} from '@chakra-ui/react'

const StatsCard = ({
  title,
  value,
  helpText,
  icon,
  colorScheme = 'primary',
  onClick,
  isActive = false,
  valueFontSize = '2xl',
  ...props
}) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="16px"
      border="1px"
      borderColor={isActive ? `${colorScheme}.500` : 'gray.100'}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.3s ease"
      _hover={onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
        borderColor: 'emerald.100',
      } : {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
        borderColor: 'emerald.100',
      }}
      {...props}
    >
      <Flex align="center" justify="space-between">
        <Stat>
          <StatLabel fontSize="sm" fontWeight="600" color="gray.600">
            {title}
          </StatLabel>
          <StatNumber
            fontSize={valueFontSize}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.5px"
          >
            {value}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="xs" color="gray.500" fontWeight="500">
              {helpText}
            </StatHelpText>
          )}
        </Stat>
        {icon && (
          <Icon
            as={icon}
            boxSize={7}
            color={`${colorScheme}.500`}
            strokeWidth={1.5}
          />
        )}
      </Flex>
    </Box>
  )
}

export default StatsCard
