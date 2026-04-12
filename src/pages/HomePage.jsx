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
  FiClock,
  FiTrendingUp,
  FiStar,
  FiFileText
} from 'react-icons/fi';
import logoFull from '../assets/logo/logo-full.svg';
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
            <img src={logoFull} alt="OrçaFast" style={{ height: '36px', width: 'auto' }} />
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu">
            <a href="#recursos" className="nav-link">Recursos</a>
            <a href="#como-funciona" className="nav-link">Como funciona</a>
            <a href="#precos" className="nav-link">Preços</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="nav-btn-secondary" style={{ textDecoration: 'none' }}>
              Entrar
            </Link>
            <Link to="/onboarding/create-client" className="nav-btn-primary" style={{ textDecoration: 'none' }}>
              Teste grátis
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
            <a href="#recursos" className="mobile-link">Recursos</a>
            <a href="#como-funciona" className="mobile-link">Como funciona</a>
            <a href="#precos" className="mobile-link">Preços</a>
            <Link
              to="/login"
              className="mobile-link"
              style={{ textDecoration: 'none' }}
            >
              Entrar
            </Link>
            <Link
              to="/onboarding/create-client"
              className="nav-btn-primary"
              style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              Teste grátis
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <Badge className="hero-badge">
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} style={{ width: '1rem', height: '1rem', fill: 'var(--primary)', color: 'var(--primary)' }} />
                ))}
              </div>
              <span>O jeito mais simples de enviar um orçamento profissional</span>
            </Badge>

            <div>
              <h1 className="hero-title">
                Orça rápido,
                <span className="hero-title-accent"> fecha negócio fácil</span>
              </h1>

              <p className="hero-subtitle">
                Crie o orçamento, envie e acompanhe a resposta. Direto ao ponto.
              </p>
            </div>

            <div className="hero-cta">
              <Link
                to="/onboarding/create-client"
                className="cta-primary"
                style={{ textDecoration: 'none' }}
              >
                Começar grátis
                <FiArrowRight />
              </Link>
              {/* <button className="cta-secondary">
                Ver demonstração
              </button> */}
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>Teste grátis por 7 dias</span>
              </div>
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>Cancele a qualquer momento</span>
              </div>
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>É rápido, é direto</span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="hero-mockup">
            <div className="dashboard-card">
              <div className="dashboard-header">
                <h3 className="dashboard-title">Dashboard</h3>
                {/* <span className="dashboard-time">Atualizado agora</span> */}
              </div>

              <div className="dashboard-stats">
                <div className="stat-box">
                  <div className="stat-label">
                    <FiDollarSign style={{ width: '1rem', height: '1rem' }} />
                    <span>Orçamentos fechados</span>
                  </div>
                  <p className="stat-value">R$ 7.300</p>
                </div>
                <div className="stat-box">
                  <div className="stat-label">
                    <FiTrendingUp style={{ width: '1rem', height: '1rem' }} />
                    <span>Fechados</span>
                  </div>
                  <p className="stat-value">2 hoje</p>
                </div>
              </div>

              <div className="dashboard-proposals">
                <div className="proposal-item">
                  <div className="proposal-left">
                    <div className="proposal-icon approved">
                      <span style={{ fontSize: '0.75rem' }}>✓</span>
                    </div>
                    <div>
                      <p className="proposal-title">Orçamento #1234</p>
                      <p className="proposal-status">Fechado</p>
                    </div>
                  </div>
                  <span className="proposal-value approved">R$ 2.500</span>
                </div>
                <div className="proposal-item">
                  <div className="proposal-left">
                    <div className="proposal-icon approved">
                      <span style={{ fontSize: '0.75rem' }}>✓</span>
                    </div>
                    <div>
                      <p className="proposal-title">Orçamento #1233</p>
                      <p className="proposal-status">Fechado</p>
                    </div>
                  </div>
                  <span className="proposal-value approved">R$ 4.800</span>
                </div>
              </div>

              <div className="floating-badge">
                Rápido de criar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="stats-section">
        <div className="stats-container">
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
                <div className="stat-number">R$ 49,90</div>
                <div className="stat-label">Plano mais popular</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section id="como-funciona" className="how-section">
        <div className="section-header">
          <span className="section-category">Como funciona</span>
          <h2 className="section-title">Processo simples em 3 etapas para fechar mais negócios.</h2>
        </div>

        <div className="steps-container">
          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-header">
                <span className="step-number">01</span>
                <div className="step-icon-wrapper">
                  <FiFileText className="step-icon" />
                </div>
              </div>
              <h3 className="step-title">Criar</h3>
              <p className="step-description">
                Monte seu orçamento com itens, valores e descrições — do jeito que você trabalha.
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-header">
                <span className="step-number">02</span>
                <div className="step-icon-wrapper">
                  <FiSend className="step-icon" />
                </div>
              </div>
              <h3 className="step-title">Enviar</h3>
              <p className="step-description">
                Compartilhe por link ou WhatsApp em um único clique.
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-header">
                <span className="step-number">03</span>
                <div className="step-icon-wrapper">
                  <FiEye className="step-icon" />
                </div>
              </div>
              <h3 className="step-title">Acompanhar</h3>
              <p className="step-description">
                Saiba em tempo real quando seu orçamento foi visualizado.
              </p>
            </CardContent>
          </Card>

          <Card className="step-card">
            <CardContent className="step-content">
              <div className="step-header">
                <span className="step-number">04</span>
                <div className="step-icon-wrapper">
                  <FiDollarSign className="step-icon" />
                </div>
              </div>
              <h3 className="step-title">Fechar</h3>
              <p className="step-description">
                Acompanhe a resposta e marque o orçamento como aprovado.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="features-section">
        <div className="section-header">
          <span className="section-category">Recursos</span>
          <h2 className="section-title">Todos os seus orçamentos em um lugar só.</h2>
          <p className="section-subtitle">Veja quantos orçamentos foram enviados, visualizados e aprovados. Simples assim.</p>
        </div>

        <div className="features-container">
          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiBarChart className="feature-icon" />
              </div>
              <h3 className="feature-title">Tudo no mesmo lugar</h3>
              <p className="feature-description">
                Seus clientes, orçamentos e histórico de envios organizados num só painel.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiEye className="feature-icon" />
              </div>
              <h3 className="feature-title">Saiba quando o cliente abriu</h3>
              <p className="feature-description">
                Quando você envia o link do orçamento, a OrçaFast te avisa assim que o destinatário visualizar. Chega de ficar no escuro esperando retorno.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiShield className="feature-icon" />
              </div>
              <h3 className="feature-title">Seus dados seguros com a OrçaFast</h3>
              <p className="feature-description">
                As informações dos seus clientes ficam guardadas com segurança. Você acessa de qualquer dispositivo, sem risco de perder nada.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="pricing-section">
        <div className="section-header">
          <span className="section-category">Preços</span>
          <h2 className="section-title">Preços simples, sem surpresas.</h2>
          <p className="section-subtitle">Comece grátis e evolua conforme seu negócio cresce.</p>
        </div>

        <div className="pricing-container">
          <Card className="pricing-card pricing-card-popular">
            <Badge className="popular-badge">MAIS POPULAR</Badge>
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Autônomo</h3>
              <p className="pricing-description">Para quem trabalha por conta própria.</p>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">49,90</span>
                <span className="price-period">/mês</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Orçamentos ilimitados</li>
                <li><FiCheck className="feature-check" /> Orçamento com a sua marca</li>
                <li><FiCheck className="feature-check" /> Painel com seus indicadores</li>
                <li><FiCheck className="feature-check" /> Metas financeiras</li>
                <li><FiCheck className="feature-check" /> Suporte rápido</li>
              </ul>
              <Link
                to="/onboarding/create-client"
                className="pricing-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Começar grátis
              </Link>
            </CardContent>
          </Card>

          <Card className="pricing-card">
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Equipe</h3>
              <p className="pricing-description">Para negócios com equipe de vendas.</p>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">97,90</span>
                <span className="price-period">/mês</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Orçamentos ilimitados</li>
                <li><FiCheck className="feature-check" /> Orçamento com a sua marca</li>
                <li><FiCheck className="feature-check" /> Painel com seus indicadores</li>
                <li><FiCheck className="feature-check" /> Metas financeiras</li>
                <li><FiCheck className="feature-check" /> Suporte rápido</li>
                <li><FiCheck className="feature-check" /> Toda a equipe na mesma assinatura</li>
                <li><FiCheck className="feature-check" /> Veja o desempenho de cada um</li>
                <li><FiCheck className="feature-check" /> Gerencie sua equipe</li>
                <li><FiCheck className="feature-check" /> Metas financeiras para a equipe</li>
              </ul>
              <Link
                to="/register?plan=business"
                className="pricing-btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Assinar plano Equipe
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Feche negócios.
            <br />
            A OrçaFast cuida do resto.</h2>
          <p className="cta-subtitle">
            Cria sua conta agora. É rápido, é direto e você já sai com o primeiro orçamento pronto.
          </p>
          <Link
            to="/onboarding/create-client"
            className="cta-btn-final"
            style={{ textDecoration: 'none' }}
          >
            Começar grátis
            <FiArrowRight />
          </Link>
          <div className="cta-trust flex flex-col">
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Teste grátis por 7 dias</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Crie seu primeiro orçamento em minutos</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Aumente suas aprovações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoFull} alt="OrçaFast" style={{ height: '32px', width: 'auto' }} />
            </div>
            <p className="footer-tagline">Orçamentos profissionais em minutos</p>
          </div>

          <div className="footer-links">
            <Link to="/termos" className="footer-link">Termos de uso</Link>
            <Link to="/privacidade" className="footer-link">Privacidade</Link>
            <Link to="/suporte" className="footer-link">Suporte</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 OrçaFast. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
