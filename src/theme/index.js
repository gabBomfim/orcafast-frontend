import { extendTheme } from '@chakra-ui/react'

// Cores alinhadas com a landing page (#00d97e)
const colors = {
  primary: {
    50: '#e6fff5',
    100: '#ccffe8',
    200: '#99ffd1',
    300: '#66ffba',
    400: '#33ffa3',
    500: '#00d97e', // Cor principal da landing
    600: '#00b368', // Cor dark da landing
    700: '#009c5a',
    800: '#00804a',
    900: '#006639',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  accent: {
    50: '#fff9e6',
    100: '#fff3cc',
    200: '#ffe799',
    300: '#ffdb66',
    400: '#ffcf33',
    500: '#ffc107', // Cor do badge da landing
    600: '#f59e0b',
    700: '#d97706',
    800: '#b45309',
    900: '#92400e',
  },
  emerald: {
    50: '#e6fff5',
    100: '#ccffe8',
    200: '#99ffd1',
    300: '#66ffba',
    400: '#33ffa3',
    500: '#00d97e', // Mesma cor da primary
    600: '#00b368',
    700: '#009c5a',
    800: '#00804a',
    900: '#006639',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Cores dark da landing para possíveis usos
  dark: {
    50: '#1f3a52',
    100: '#1a3347',
    200: '#152b3c',
    300: '#0f1f3a', // Gradiente final da landing
    400: '#0d1b33',
    500: '#0a1628', // Gradiente inicial da landing
    600: '#081220',
    700: '#060e18',
    800: '#040a10',
    900: '#020608',
  }
}

// Fonts alinhadas com a landing page
const fonts = {
  heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

// Componentes customizados com a identidade da landing
const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '12px',
      letterSpacing: '-0.2px',
    },
    variants: {
      solid: {
        bg: 'linear-gradient(135deg, #00d97e 0%, #00b368 100%)',
        color: 'white',
        _hover: {
          bg: 'linear-gradient(135deg, #00e689 0%, #00c774 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 217, 126, 0.3)',
        },
        _active: {
          transform: 'translateY(0)',
        },
        boxShadow: '0 4px 12px rgba(0, 217, 126, 0.2)',
        transition: 'all 0.2s ease',
      },
      gradient: {
        background: 'linear-gradient(135deg, #00d97e 0%, #00b368 100%)',
        color: 'white',
        _hover: {
          background: 'linear-gradient(135deg, #00e689 0%, #00c774 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(0, 217, 126, 0.4)',
        },
        _active: {
          transform: 'translateY(0)',
        },
        boxShadow: '0 8px 24px rgba(0, 217, 126, 0.3)',
        transition: 'all 0.2s ease',
      },
      outline: {
        borderColor: 'gray.200',
        color: 'gray.700',
        borderWidth: '1px',
        _hover: {
          bg: 'gray.50',
          borderColor: 'primary.500',
          color: 'primary.500',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease',
      },
      ghost: {
        color: 'gray.600',
        _hover: {
          bg: 'gray.100',
          color: 'gray.800',
        },
      }
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: '16px',
        bg: 'white',
        border: '1px solid',
        borderColor: 'gray.100',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 24px rgba(0, 217, 126, 0.08)',
          borderColor: 'primary.100',
        },
        transition: 'all 0.3s ease',
      }
    }
  },
  Badge: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '6px',
      px: 2,
      py: 1,
      fontSize: 'xs',
      letterSpacing: '0.3px',
    },
    variants: {
      approved: {
        bg: 'green.50',
        color: 'green.700',
        borderColor: 'green.200',
        border: '1px solid',
      },
      viewed: {
        bg: 'blue.50',
        color: 'blue.700',
        borderColor: 'blue.200',
        border: '1px solid',
      },
      sent: {
        bg: 'yellow.50',
        color: 'yellow.700',
        borderColor: 'yellow.200',
        border: '1px solid',
      },
      rejected: {
        bg: 'red.50',
        color: 'red.700',
        borderColor: 'red.200',
        border: '1px solid',
      },
      draft: {
        bg: 'gray.100',
        color: 'gray.700',
        borderColor: 'gray.200',
        border: '1px solid',
      }
    }
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'gray.200',
          _hover: {
            borderColor: 'gray.300',
          },
          _focus: {
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px rgba(0, 217, 126, 0.3)',
          },
        },
      },
      filled: {
        field: {
          bg: 'white',
          color: 'gray.900',
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
            bg: 'white',
          },
          _focus: {
            borderColor: 'emerald.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-emerald-500)',
            bg: 'white',
            color: 'gray.900',
          },
          _active: {
            bg: 'white',
            color: 'gray.900',
          },
          _placeholder: {
            color: 'gray.500',
          },
        },
      },
    },
  },
}

// Configurações globais
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// Estilos globais com suporte a dark mode
const styles = {
  global: (props) => ({
    '*::placeholder': {
      color: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
    },
  }),
}

// Breakpoints responsivos
const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
}

const theme = extendTheme({
  colors,
  fonts,
  components,
  config,
  styles,
  breakpoints,
})

export default theme
