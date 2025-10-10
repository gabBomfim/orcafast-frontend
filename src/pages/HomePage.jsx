import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiUsers,
  FiSend,
  FiEye,
  FiDollarSign,
  FiBarChart,
  FiSettings,
  FiShield,
  FiCheck,
  FiMenu,
  FiX,
  FiZap,
  FiClock,
  FiTrendingUp,
  FiStar
} from 'react-icons/fi';
import '../styles/landing.css';

// Componentes auxiliares
const Card = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const Badge = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <div className="logo-icon">
              <FiTrendingUp className="logo-arrow" />
            </div>
            <span className="logo-text">OrçaFast</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="nav-menu">
            <a href="#features" className="nav-link">Recursos</a>
            <a href="#how-it-works" className="nav-link">Como funciona</a>
            <a href="#pricing" className="nav-link">Preços</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="nav-btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'inline-block' }}>
              Entrar
            </Link>
            <Link to="/onboarding/create-client" className="nav-btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Começar grátis
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" className="mobile-link">Recursos</a>
            <a href="#how-it-works" className="mobile-link">Como funciona</a>
            <a href="#pricing" className="mobile-link">Preços</a>
            <Link 
                to="/onboarding/create-client"
              className="nav-btn-primary"
              style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '1rem' }}
              >
                Começar grátis
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <Badge className="hero-badge">
            <FiStar className="mr-1 h-3 w-3" />
            MAIS DE 1.000 PROPOSTAS ENVIADAS ESTE MÊS
          </Badge>

          <h1 className="hero-title">
                Orça rápido,
            <span className="hero-title-accent"> fecha fácil</span>
          </h1>
          
          <p className="hero-subtitle">
            A plataforma mais simples para criar, enviar e acompanhar propostas profissionais. 
            Sem enrolação, sem complexidade.
          </p>

          <div className="hero-cta">
            <Link 
                  to="/onboarding/create-client"
              className="cta-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Começar grátis
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="cta-secondary" style={{ cursor: 'pointer' }}>
                  Ver demonstração
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Grátis para sempre</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Pronto em 2 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <Card className="stat-card">
            <CardContent className="stat-content">
              <FiZap className="stat-icon" />
              <div className="stat-text">
                <div className="stat-number">3 cliques</div>
                <div className="stat-label">Para criar proposta</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <FiClock className="stat-icon" />
              <div className="stat-text">
                <div className="stat-number">2 min</div>
                <div className="stat-label">Tempo médio de envio</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <FiTrendingUp className="stat-icon" />
              <div className="stat-text">
                <div className="stat-number">85%</div>
                <div className="stat-label">Taxa de aprovação</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <FiDollarSign className="stat-icon" />
              <div className="stat-text">
                <div className="stat-number">R$ 29</div>
                <div className="stat-label">Plano mais popular</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <div className="section-header">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle">Processo simples em 4 etapas para fechar mais negócios</p>
        </div>

        <div className="steps-container">
          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-icon-wrapper">
                <FiUsers className="step-icon" />
              </div>
              <div className="step-number">01</div>
              <h3 className="step-title">Criar</h3>
              <p className="step-description">
                Monte sua proposta em minutos com templates prontos e personalizáveis
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-icon-wrapper">
                <FiSend className="step-icon" />
              </div>
              <div className="step-number">02</div>
              <h3 className="step-title">Enviar</h3>
              <p className="step-description">
                Compartilhe por email, WhatsApp ou link em um único clique
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-icon-wrapper">
                <FiEye className="step-icon" />
              </div>
              <div className="step-number">03</div>
              <h3 className="step-title">Acompanhar</h3>
              <p className="step-description">
                Saiba em tempo real quando sua proposta foi visualizada
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-icon-wrapper">
                <FiDollarSign className="step-icon" />
              </div>
              <div className="step-number">04</div>
              <h3 className="step-title">Ser pago</h3>
              <p className="step-description">
                Receba aprovações mais rápido e feche mais negócios
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Dashboard que funciona</h2>
          <p className="section-subtitle">Acompanhe suas métricas e tome decisões baseadas em dados reais</p>
        </div>

        <div className="features-container">
          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiBarChart className="feature-icon" />
              </div>
              <h3 className="feature-title">Métricas em tempo real</h3>
              <p className="feature-description">
                Acompanhe taxa de abertura, tempo de visualização e status de cada proposta
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiSettings className="feature-icon" />
              </div>
              <h3 className="feature-title">Controle total</h3>
              <p className="feature-description">
                Gerencie todas as suas propostas em um único lugar, de forma simples e organizada
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiShield className="feature-icon" />
              </div>
              <h3 className="feature-title">Dados seguros</h3>
              <p className="feature-description">
                Seus dados e de seus clientes protegidos com criptografia de ponta a ponta
              </p>
            </CardContent>
                </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">Preços simples e transparentes</h2>
          <p className="section-subtitle">Comece grátis e evolua conforme seu negócio cresce</p>
        </div>

        <div className="pricing-container">
          <Card className="pricing-card">
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Gratuito</h3>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">0</span>
                <span className="price-period">/mês</span>
              </div>
              <p className="pricing-description">Perfeito para começar</p>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Até 5 propostas/mês</li>
                <li><FiCheck className="feature-check" /> Templates básicos</li>
                <li><FiCheck className="feature-check" /> Rastreamento simples</li>
                <li><FiCheck className="feature-check" /> Suporte por email</li>
              </ul>
              <Link 
                      to="/onboarding/create-client"
                className="pricing-btn"
                style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem' }}
                    >
                      Começar grátis
              </Link>
            </CardContent>
              </Card>

          <Card className="pricing-card pricing-card-popular">
            <Badge className="popular-badge">MAIS POPULAR</Badge>
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Pro</h3>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">29</span>
                <span className="price-period">/mês</span>
              </div>
              <p className="pricing-description">Para profissionais</p>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Propostas ilimitadas</li>
                <li><FiCheck className="feature-check" /> Todos os templates</li>
                <li><FiCheck className="feature-check" /> Analytics avançado</li>
                <li><FiCheck className="feature-check" /> Marca personalizada</li>
                <li><FiCheck className="feature-check" /> Suporte prioritário</li>
              </ul>
              <Link 
                        to="/onboarding/create-client"
                className="pricing-btn-primary"
                style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
                      >
                        Começar teste grátis
              </Link>
            </CardContent>
                </Card>

          <Card className="pricing-card">
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Business</h3>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">79</span>
                <span className="price-period">/mês</span>
              </div>
              <p className="pricing-description">Para equipes</p>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Tudo do Pro</li>
                <li><FiCheck className="feature-check" /> Usuários ilimitados</li>
                <li><FiCheck className="feature-check" /> API de integração</li>
                <li><FiCheck className="feature-check" /> Gerenciamento de equipe</li>
                <li><FiCheck className="feature-check" /> Suporte 24/7</li>
              </ul>
              <button className="pricing-btn" style={{ border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                      Falar com vendas
              </button>
            </CardContent>
              </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Pronto para aumentar suas aprovações?</h2>
          <p className="cta-subtitle">
            Junte-se a mais de 1.000 profissionais que já usam o OrçaFast para fechar mais negócios
          </p>
          <Link 
              to="/onboarding/create-client"
            className="cta-btn-final"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Começar grátis agora
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="cta-trust">
            <span>Sem cartão de crédito</span>
            <span>•</span>
            <span>Configuração em 2 minutos</span>
            <span>•</span>
            <span>Suporte em português</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <FiTrendingUp className="logo-arrow" />
              </div>
              <span className="logo-text">OrçaFast</span>
            </div>
            <p className="footer-tagline">Orçamentos profissionais em minutos</p>
          </div>
          
          <div className="footer-links">
            <a href="#" className="footer-link">Termos de uso</a>
            <a href="#" className="footer-link">Privacidade</a>
            <a href="#" className="footer-link">Suporte</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 OrçaFast. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
