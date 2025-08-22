import { extendTheme } from '@chakra-ui/react'

// Cores baseadas no design do V0
const colors = {
  primary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#164e63', // Cor principal
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Cor secundária/accent
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  accent: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Mesmo que secondary
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
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
  }
}

// Fonts baseadas no V0
const fonts = {
  heading: '"Work Sans", system-ui, sans-serif',
  body: '"Open Sans", system-ui, sans-serif',
}

// Componentes customizados
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
        },
        transition: 'all 0.2s ease-in-out',
      },
      gradient: {
        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        color: 'white',
        _hover: {
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
        },
        transition: 'all 0.2s ease-in-out',
      },
      hover: {
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
        },
        transition: 'all 0.2s ease-in-out',
      }
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: '0 4px 6px -1px rgba(22, 78, 99, 0.1), 0 2px 4px -1px rgba(22, 78, 99, 0.06)',
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 15px -3px rgba(22, 78, 99, 0.1), 0 4px 6px -2px rgba(22, 78, 99, 0.05)',
        },
        transition: 'all 0.2s ease-in-out',
      }
    }
  },
  Badge: {
    variants: {
      approved: {
        bg: 'green.100',
        color: 'green.800',
        borderColor: 'green.200',
        border: '1px solid',
      },
      viewed: {
        bg: 'blue.100',
        color: 'blue.800',
        borderColor: 'blue.200',
        border: '1px solid',
      },
      sent: {
        bg: 'yellow.100',
        color: 'yellow.800',
        borderColor: 'yellow.200',
        border: '1px solid',
      },
      rejected: {
        bg: 'red.100',
        color: 'red.800',
        borderColor: 'red.200',
        border: '1px solid',
      },
      draft: {
        bg: 'gray.100',
        color: 'gray.800',
        borderColor: 'gray.200',
        border: '1px solid',
      }
    }
  }
}

// Configurações globais
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Estilos globais
const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.600',
    },
  },
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
