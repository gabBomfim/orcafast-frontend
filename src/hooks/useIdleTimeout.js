import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from './useAuth'

const EVENTS = ['mousemove', 'keydown', 'click', 'scroll']
const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutos em milissegundos

/**
 * Hook customizado para monitorar a inatividade do usuário.
 * Caso o usuário fique inativo por mais de 30 minutos, o hook dispara a função de logout.
 */
export const useIdleTimeout = () => {
  const { logout } = useAuth()
  const timeoutRef = useRef(null)

  const resetTimer = useCallback(() => {
    // Limpa o timer anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Define um novo timer
    timeoutRef.current = setTimeout(() => {
      console.log('Tempo de inatividade atingido. Deslogando usuário por segurança...')
      logout() // Executa a requisição de logout, limpa o storage e redireciona
    }, TIMEOUT_MS)
  }, [logout])

  useEffect(() => {
    // Inicia o timer logo que o componente é montado
    resetTimer()

    // Registra os event listeners (equivalente ao onMounted no Vue)
    EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    // Limpeza ao desmontar (equivalente ao onUnmounted no Vue)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [resetTimer])
}
