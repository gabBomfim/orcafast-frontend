import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './theme'

import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import PropostasPage from './pages/PropostasPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Onboarding pages
import CreateClientPage from './pages/onboarding/CreateClientPage'
import CreateProposalPage from './pages/onboarding/CreateProposalPage'
import SendProposalPage from './pages/onboarding/SendProposalPage'
import InitialDashboardPage from './pages/InitialDashboardPage'

// Contexts
import { OnboardingProvider } from './contexts/OnboardingContext'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <OnboardingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/clientes" element={<ClientesPage />} />
            <Route path="/dashboard/propostas" element={<PropostasPage />} />

            {/* Onboarding Routes */}
            <Route path="/onboarding/create-client" element={<CreateClientPage />} />
            <Route path="/onboarding/create-proposal" element={<CreateProposalPage />} />
            <Route path="/onboarding/send-proposal" element={<SendProposalPage />} />
            <Route path="/initial-dashboard" element={<InitialDashboardPage />} />
          </Routes>
        </Router>
      </OnboardingProvider>
    </ChakraProvider>
  )
}

export default App