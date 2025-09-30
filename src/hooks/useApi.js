import { useState, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      successMessage,
      errorMessage = 'Ocorreu um erro. Tente novamente.',
      showSuccessToast = true,
      showErrorToast = true
    } = options

    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      
      if (showSuccessToast && successMessage) {
        toast({
          title: 'Sucesso',
          description: successMessage,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || errorMessage
      setError(errorMsg)

      if (showErrorToast) {
        toast({
          title: 'Erro',
          description: errorMsg,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }

      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return { loading, error, execute }
}
