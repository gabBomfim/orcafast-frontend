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

// Onboarding pages
import CreateClientPage from './pages/onboarding/CreateClientPage'
import CreateProposalPage from './pages/onboarding/CreateProposalPage'
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
              <Route path="/onboarding/create-client" element={<CreateClientPage />} />
              <Route path="/onboarding/create-proposal" element={<CreateProposalPage />} />
              <Route path="/onboarding/send-proposal" element={<SendProposalPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/initial-dashboard" element={<InitialDashboardPage />} />
                <Route path="/dashboard/clientes" element={<ClientesPage />} />
                <Route path="/dashboard/propostas" element={<PropostasPage />} />
              </Route>
            </Routes>
          </Router>
        </SidebarProvider>
      </OnboardingProvider>
    </ChakraProvider>
  )
}

export default App