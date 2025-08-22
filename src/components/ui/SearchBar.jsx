import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

const SearchBar = ({ 
  placeholder = "Buscar...", 
  value, 
  onChange, 
  ...props 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      boxShadow="0 4px 6px -1px rgba(22, 78, 99, 0.1), 0 2px 4px -1px rgba(22, 78, 99, 0.06)"
      mb={6}
      {...props}
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" boxSize={4} />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          border="none"
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
        />
      </InputGroup>
    </Box>
  )
}

export default SearchBar
