import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './theme'

import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import PropostasPage from './pages/PropostasPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import EmailVerificationPage from './pages/auth/EmailVerificationPage'
import InitialDashboardPage from './pages/InitialDashboardPage'
import CreateClientPage from './pages/CreateClientPage'
import CreateProposalPage from './pages/CreateProposalPage'
import ProposalSuccessPage from './pages/ProposalSuccessPage'

// Onboarding pages — DISABLED (flow removed, kept for future reactivation)
// import OnboardingCreateClientPage from './pages/onboarding/CreateClientPage'
// import OnboardingCreateProposalPage from './pages/onboarding/CreateProposalPage'
import SendProposalPage from './pages/onboarding/SendProposalPage'
import InviteAcceptPage from './pages/InviteAcceptPage'
import PublicProposalView from './pages/PublicProposalView'

// Settings pages
import SettingsProfile from './pages/settings/SettingsProfile'
import SettingsCompany from './pages/settings/SettingsCompany'
import SettingsGoals from './pages/settings/SettingsGoals'
import SettingsSubscription from './pages/settings/SettingsSubscription'
import UsersPage from './pages/UsersPage'

// Institucional
import TermosDeUsoPage from './pages/institucional/TermosDeUsoPage'
import PoliticaPrivacidadePage from './pages/institucional/PoliticaPrivacidadePage'
import SuportePage from './pages/institucional/SuportePage'

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
              <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
              <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<GoogleCallbackPage />} />
              <Route path="/verificar-email" element={<EmailVerificationPage />} />
              {/* ONBOARDING FLOW DISABLED — kept for future reactivation */}
              {/* <Route path="/onboarding/create-client" element={<OnboardingCreateClientPage />} /> */}
              {/* <Route path="/onboarding/create-proposal" element={<OnboardingCreateProposalPage />} /> */}
              {/* <Route path="/onboarding/send-proposal" element={<SendProposalPage />} /> */}
              <Route path="/share/proposta/:token" element={<PublicProposalView />} />
              <Route path="/invite/:token" element={<InviteAcceptPage />} />

              {/* Institucional Routes */}
              <Route path="/termos" element={<TermosDeUsoPage />} />
              <Route path="/privacidade" element={<PoliticaPrivacidadePage />} />
              <Route path="/suporte" element={<SuportePage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/initial-dashboard" element={<InitialDashboardPage />} />
                <Route path="/dashboard/clientes" element={<ClientesPage />} />
                <Route path="/dashboard/clientes/novo" element={<CreateClientPage />} />
                <Route path="/dashboard/propostas" element={<PropostasPage />} />
                <Route path="/dashboard/propostas/nova" element={<CreateProposalPage />} />
                <Route path="/dashboard/propostas/sucesso" element={<ProposalSuccessPage />} />
                <Route path="/dashboard/orcamentos/:id/enviar" element={<SendProposalPage />} />

                {/* Settings Routes */}
                <Route path="/dashboard/configuracoes/perfil" element={<SettingsProfile />} />
                <Route path="/dashboard/configuracoes/empresa" element={<SettingsCompany />} />
                <Route path="/dashboard/configuracoes/metas" element={<SettingsGoals />} />
                <Route path="/dashboard/configuracoes/assinatura" element={<SettingsSubscription />} />
                <Route path="/dashboard/usuarios" element={<UsersPage />} />
              </Route>
            </Routes>
          </Router>
        </SidebarProvider>
      </OnboardingProvider>
    </ChakraProvider>
  )
}

export default App