/**
 * OrçaFast — Componentes de Feedback de Formulário
 *
 * Componentes disponíveis:
 *
 * 1. <FormFeedback>        — bloco de alerta (erro, sucesso, aviso, info)
 * 2. <FieldError>          — erro inline abaixo do input
 * 3. <FieldHint>           — dica sutil abaixo do input
 *
 * Uso rápido:
 *   import { FormFeedback, FieldError, FieldHint } from '../components/ui/FormFeedback'
 *   import { formMessages } from '../utils/formMessages'
 *
 *   <FormFeedback type="error" message={formMessages.auth.wrongPassword} />
 *   <FieldError message={formMessages.invalid.email} />
 *   <FieldHint message={infoMessages.tip.whatsapp} />
 */

import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  CloseButton,
} from '@chakra-ui/react'
import { FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'

// ─── Mapeamentos internos ─────────────────────────────────────────────────────

const STATUS_MAP = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
}

const ICON_MAP = {
  error: FiAlertCircle,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
}

const COLOR_MAP = {
  error: 'red.600',
  success: 'emerald.600',
  warning: 'orange.600',
  info: 'gray.600',
}

// ─── FormFeedback ─────────────────────────────────────────────────────────────

/**
 * Bloco de feedback para o topo de formulários ou em cards de destaque.
 *
 * Props:
 * @param {'error'|'success'|'warning'|'info'} type  — tipo do alerta
 * @param {string}  message                           — texto exibido
 * @param {string}  [title]                           — título opcional
 * @param {boolean} [dismissible]                     — exibe botão de fechar
 * @param {() => void} [onDismiss]                    — callback ao fechar
 * @param {{ label: string, onClick: () => void }} [action] — botão de ação
 *
 * Exemplo:
 *   <FormFeedback
 *     type="error"
 *     message="Esse e-mail já tá cadastrado. Tenta fazer login."
 *     action={{ label: 'Fazer login', onClick: () => navigate('/login') }}
 *     dismissible
 *     onDismiss={() => setShowError(false)}
 *   />
 */
export const FormFeedback = ({
  type = 'info',
  message,
  title,
  dismissible = false,
  onDismiss,
  action,
}) => {
  return (
    <Alert
      status={STATUS_MAP[type]}
      borderRadius="xl"
      alignItems="flex-start"
      gap={3}
      py={3}
      px={4}
    >
      <AlertIcon mt="2px" />
      <Box flex={1}>
        {title && (
          <AlertTitle fontSize="sm" fontWeight="bold" mb={0.5}>
            {title}
          </AlertTitle>
        )}
        <AlertDescription fontSize="sm">{message}</AlertDescription>
        {action && (
          <Button
            variant="link"
            size="sm"
            mt={1}
            p={0}
            height="auto"
            color={COLOR_MAP[type]}
            fontWeight="medium"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </Box>
      {dismissible && onDismiss && (
        <CloseButton size="sm" onClick={onDismiss} alignSelf="flex-start" />
      )}
    </Alert>
  )
}

// ─── FieldError ───────────────────────────────────────────────────────────────

/**
 * Mensagem de erro inline — aparece logo abaixo do input com erro.
 *
 * Props:
 * @param {string} message — texto do erro
 *
 * Exemplo:
 *   <Input isInvalid={!!errors.email} ... />
 *   <FieldError message={formMessages.invalid.email} />
 */
export const FieldError = ({ message }) => {
  if (!message) return null
  return (
    <Flex align="center" gap={1.5} mt={1.5} role="alert">
      <Icon as={FiAlertCircle} color="red.500" boxSize={3.5} flexShrink={0} />
      <Text fontSize="xs" color="red.600" lineHeight="short">
        {message}
      </Text>
    </Flex>
  )
}

// ─── FieldHint ────────────────────────────────────────────────────────────────

/**
 * Dica ou informação adicional abaixo do input — tom sutil, antes do erro.
 *
 * Props:
 * @param {string} message — texto da dica
 *
 * Exemplo:
 *   <Input name="phone" ... />
 *   <FieldHint message={infoMessages.tip.whatsapp} />
 */
export const FieldHint = ({ message }) => {
  if (!message) return null
  return (
    <Flex align="center" gap={1.5} mt={1.5}>
      <Icon as={FiInfo} color="gray.400" boxSize={3.5} flexShrink={0} />
      <Text fontSize="xs" color="gray.500" lineHeight="short">
        {message}
      </Text>
    </Flex>
  )
}
