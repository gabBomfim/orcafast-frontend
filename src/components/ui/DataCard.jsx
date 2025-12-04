import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
} from '@chakra-ui/react'

const DataCard = ({ 
  title, 
  subtitle, 
  children, 
  headerAction,
  ...props 
}) => {
  return (
    <Card
      bg="white"
      borderRadius="16px"
      border="1px"
      borderColor="gray.100"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
        borderColor: 'emerald.100',
      }}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <CardHeader>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              {title && (
                <Heading size="md" color="gray.900" fontWeight="800" letterSpacing="-0.5px">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text color="gray.600" mt={1} fontWeight="500" fontSize="sm">
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
