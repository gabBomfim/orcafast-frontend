import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

const DataCard = ({ 
  title, 
  subtitle, 
  children, 
  headerAction,
  ...props 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Card
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      boxShadow="0 4px 6px -1px rgba(22, 78, 99, 0.1), 0 2px 4px -1px rgba(22, 78, 99, 0.06)"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
      }}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <CardHeader>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              {title && (
                <Heading size="md" color="gray.700">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text color="gray.500" mt={1}>
                  {subtitle}
                </Text>
              )}
            </Box>
            {headerAction}
          </Box>
        </CardHeader>
      )}
      
      <CardBody pt={title || subtitle || headerAction ? 0 : 6}>
        {children}
      </CardBody>
    </Card>
  )
}

export default DataCard
