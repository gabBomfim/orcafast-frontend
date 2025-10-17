import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './theme'

import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import PropostasPage from './pages/PropostasPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InitialDashboardPage from './pages/InitialDashboardPage'
import CreateClientPage from './pages/CreateClientPage'
import CreateProposalPage from './pages/CreateProposalPage'

// Onboarding pages
import OnboardingCreateClientPage from './pages/onboarding/CreateClientPage'
import OnboardingCreateProposalPage from './pages/onboarding/CreateProposalPage'
import SendProposalPage from './pages/onboarding/SendProposalPage'

// Contexts
import { OnboardingProvider } from './contexts/OnboardingContext'
import { SidebarProvider } from './contexts/SidebarContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <OnboardingProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding/create-client" element={<OnboardingCreateClientPage />} />
              <Route path="/onboarding/create-proposal" element={<OnboardingCreateProposalPage />} />
              <Route path="/onboarding/send-proposal" element={<SendProposalPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/initial-dashboard" element={<InitialDashboardPage />} />
                <Route path="/dashboard/clientes" element={<ClientesPage />} />
                <Route path="/dashboard/clientes/novo" element={<CreateClientPage />} />
                <Route path="/dashboard/propostas" element={<PropostasPage />} />
                <Route path="/dashboard/propostas/nova" element={<CreateProposalPage />} />
              </Route>
            </Routes>
          </Router>
        </SidebarProvider>
      </OnboardingProvider>
    </ChakraProvider>
  )
}

export default App