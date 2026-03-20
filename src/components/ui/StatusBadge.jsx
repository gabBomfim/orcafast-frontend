import { Badge, Icon, HStack } from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiEye,
  FiSend,
  FiXCircle,
  FiClock
} from 'react-icons/fi'

const StatusBadge = ({ status, customLabel }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          colorScheme: 'green',
          icon: FiCheckCircle,
          text: 'Fechado'
        }
      case 'viewed':
        return {
          colorScheme: 'blue',
          icon: FiEye,
          text: 'O cliente já viu'
        }
      case 'sent':
        return {
          colorScheme: 'yellow',
          icon: FiSend,
          text: 'Já mandou'
        }
      case 'rejected':
        return {
          colorScheme: 'red',
          icon: FiXCircle,
          text: 'Não fechou'
        }
      case 'draft':
        return {
          colorScheme: 'gray',
          icon: FiClock,
          text: 'Pra mandar'
        }
      default:
        return {
          colorScheme: 'gray',
          icon: FiClock,
          text: 'Desconhecido'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant="subtle"
      px={2}
      py={1}
      borderRadius="md"
    >
      <HStack spacing={1}>
        <Icon as={config.icon} boxSize={3} />
        <span>{customLabel || config.text}</span>
      </HStack>
    </Badge>
  )
}

export default StatusBadge
