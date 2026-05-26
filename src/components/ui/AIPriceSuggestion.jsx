import { useState } from 'react'
import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Spinner,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react'
import { HiSparkles } from 'react-icons/hi'
import { proposalService } from '../../services'
import { userLocation } from '../../utils/location'
import { formMessages } from '../../utils/formMessages'

const CONFIDENCE_COLOR = {
  alta: 'emerald.600',
  media: 'blue.600',
  baixa: 'orange.600',
}

const CONFIDENCE_LABEL = {
  alta: 'Confiança alta',
  media: 'Confiança média',
  baixa: 'Confiança baixa',
}

/**
 * Botão + card de sugestão de preço com IA.
 *
 * Props:
 *  - description: string — descrição do serviço/item (3+ chars pra liberar)
 *  - onApply: (price: number) => void — recebe o preço sugerido cru (float)
 *  - disabled?: boolean
 */
const AIPriceSuggestion = ({ description, onApply, disabled = false }) => {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState(null)

  const trimmedDescription = (description || '').trim()
  const canSuggest = !disabled && !isLoading && trimmedDescription.length >= 3

  const handleSuggest = async () => {
    if (!canSuggest) return
    setIsLoading(true)
    try {
      const location = await userLocation.ensure()
      const { data: response } = await proposalService.pricingSuggestion({
        description: trimmedDescription,
        location,
      })
      const data = response.data || response
      setSuggestion(data)
      onApply(Number(data.suggested_price))
    } catch (error) {
      const msg =
        error.response?.data?.errors?.ai?.[0] ||
        error.response?.data?.errors?.description?.[0] ||
        error.response?.data?.message ||
        formMessages.system.aiUnavailable
      toast({
        title: msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => setSuggestion(null)

  if (suggestion) {
    return (
      <Box
        mt={2}
        bg="emerald.50"
        border="1px solid"
        borderColor="emerald.200"
        borderRadius="xl"
        p={3}
      >
        <Flex justify="space-between" align="start" gap={2}>
          <HStack spacing={2}>
            <Icon as={HiSparkles} color="emerald.600" boxSize={4} />
            <Text fontSize="xs" fontWeight="bold" color="emerald.700" textTransform="uppercase" letterSpacing="wider">
              Sugestão da IA
            </Text>
            <Text fontSize="xs" color={CONFIDENCE_COLOR[suggestion.confidence] || 'gray.500'} fontWeight="medium">
              · {CONFIDENCE_LABEL[suggestion.confidence] || ''}
            </Text>
          </HStack>
          <CloseButton size="sm" onClick={handleDismiss} aria-label="Ignorar sugestão" />
        </Flex>

        {suggestion.reasoning && (
          <Text fontSize="sm" color="gray.700" mt={2}>
            {suggestion.reasoning}
          </Text>
        )}

        <Text fontSize="xs" color="gray.500" mt={1}>
          {formMessages.ai.rangeLabel(suggestion.range_min, suggestion.range_max)}
        </Text>

        {Array.isArray(suggestion.factors) && suggestion.factors.length > 0 && (
          <HStack mt={2} spacing={1.5} flexWrap="wrap">
            {suggestion.factors.map((factor, idx) => (
              <Tag
                key={idx}
                size="sm"
                bg="white"
                color="emerald.700"
                border="1px solid"
                borderColor="emerald.200"
                borderRadius="md"
                fontSize="xs"
              >
                {factor}
              </Tag>
            ))}
          </HStack>
        )}

        <Text fontSize="xs" color="gray.500" mt={2} fontStyle="italic">
          {suggestion.based_on_history > 0
            ? formMessages.ai.basedOnHistory(suggestion.based_on_history)
            : formMessages.ai.fromMarket}
        </Text>
      </Box>
    )
  }

  return (
    <Button
      type="button"
      onClick={handleSuggest}
      isDisabled={!canSuggest}
      size="xs"
      variant="ghost"
      color="emerald.600"
      _hover={{ bg: 'emerald.50' }}
      borderRadius="md"
      px={2}
      mt={1}
      leftIcon={isLoading ? <Spinner size="xs" /> : <Icon as={HiSparkles} boxSize={3.5} />}
    >
      {isLoading ? 'Calculando...' : 'Sugerir preço com IA'}
    </Button>
  )
}

export default AIPriceSuggestion
