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
              <span>O novo padrão em orçamentos</span>
            </Badge>

            <div>
              <h1 className="hero-title">
                Orça rápido,
                <span className="hero-title-accent"> fecha fácil</span>
              </h1>

              <p className="hero-subtitle">
                A plataforma mais simples para criar, enviar e acompanhar orçamentos profissionais.
                Sem enrolação, sem complexidade.
              </p>
            </div>

            <div className="hero-cta">
              <Link
                to="/onboarding/create-client"
                className="cta-primary"
                style={{ textDecoration: 'none' }}
              >
                Começar teste grátis
                <FiArrowRight />
              </Link>
              {/* <button className="cta-secondary">
                Ver demonstração
              </button> */}
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>Teste grátis de 7 dias</span>
              </div>
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>Cancele a qualquer momento</span>
              </div>
              <div className="trust-item">
                <FiCheck className="trust-icon" />
                <span>Pronto em 2 minutos</span>
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
                    <FiClock style={{ width: '1rem', height: '1rem' }} />
                    <span>Tempo médio</span>
                  </div>
                  <p className="stat-value">2 min</p>
                </div>
                <div className="stat-box">
                  <div className="stat-label">
                    <FiTrendingUp style={{ width: '1rem', height: '1rem' }} />
                    <span>Taxa aprovação</span>
                  </div>
                  <p className="stat-value">85%</p>
                </div>
              </div>

              <div className="dashboard-proposals">
                <div className="proposal-item">
                  <div className="proposal-left">
                    <div className="proposal-icon">
                      <FiDollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                    <div>
                      <p className="proposal-title">Orçamento #1234</p>
                      <p className="proposal-status">Cliente visualizou</p>
                    </div>
                  </div>
                  <span className="proposal-value">R$ 2.500</span>
                </div>
                <div className="proposal-item">
                  <div className="proposal-left">
                    <div className="proposal-icon approved">
                      <span style={{ fontSize: '0.75rem' }}>✓</span>
                    </div>
                    <div>
                      <p className="proposal-title">Orçamento #1233</p>
                      <p className="proposal-status">Aprovada</p>
                    </div>
                  </div>
                  <span className="proposal-value approved">R$ 4.800</span>
                </div>
              </div>

              <div className="floating-badge">
                3 cliques para criar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
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
                <div className="stat-number">R$ 29</div>
                <div className="stat-label">Plano mais popular</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="how-section">
        <div className="section-header">
          <span className="section-category">Como funciona</span>
          <h2 className="section-title">Processo simples em 4 etapas para fechar mais negócios</h2>
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
                Monte seu orçamento em minutos com templates prontos e personalizáveis
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
                Compartilhe por email, WhatsApp ou PDF em um único clique
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
                Saiba em tempo real quando seu orçamento foi visualizado
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
              <h3 className="step-title">Feche</h3>
              <p className="step-description">
                Permita que seus clientes aprovem orçamentos com um único clique
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="features-section">
        <div className="section-header">
          <span className="section-category">Recursos</span>
          <h2 className="section-title">Controle absoluto sobre o seu funil de vendas</h2>
          <p className="section-subtitle">Acompanhe taxas de conversão, identifique gargalos e status de cada orçamento</p>
        </div>

        <div className="features-container">
          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiBarChart className="feature-icon" />
              </div>
              <h3 className="feature-title">Gestão centralizada</h3>
              <p className="feature-description">
                Organize sua base de clientes e histórico de orçamentos de forma inteligente. Nunca mais perca um orçamento em planilhas ou PDFs antigos.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="feature-content">
              <div className="feature-icon-wrapper">
                <FiSettings className="feature-icon" />
              </div>
              <h3 className="feature-title">Segurança e estabilidade</h3>
              <p className="feature-description">
                Seus dados financeiros e as informações dos seus clientes são protegidos com criptografia de ponta e infraestrutura robusta.
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
      <section id="precos" className="pricing-section">
        <div className="section-header">
          <span className="section-category">Preços</span>
          <h2 className="section-title">Preços simples, sem surpresas.</h2>
          <p className="section-subtitle">Comece grátis e evolua conforme seu negócio cresce</p>
        </div>

        <div className="pricing-container">
          <Card className="pricing-card pricing-card-popular">
            <Badge className="popular-badge">MAIS POPULAR</Badge>
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Pro</h3>
              <p className="pricing-description">Perfeito para freelancers e autônomos.</p>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">29</span>
                <span className="price-period">/mês</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Orçamentos ilimitados</li>
                <li><FiCheck className="feature-check" /> Template profissional</li>
                <li><FiCheck className="feature-check" /> Analytics avançado</li>
                <li><FiCheck className="feature-check" /> Definição de metas</li>
                <li><FiCheck className="feature-check" /> Suporte prioritário</li>
              </ul>
              <Link
                to="/onboarding/create-client"
                className="pricing-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Começar teste grátis (7 dias)
              </Link>
            </CardContent>
          </Card>

          <Card className="pricing-card">
            <CardContent className="pricing-content">
              <h3 className="pricing-plan">Business</h3>
              <p className="pricing-description">O poder total para equipes e agências.</p>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">79</span>
                <span className="price-period">/mês</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheck className="feature-check" /> Orçamentos ilimitados</li>
                <li><FiCheck className="feature-check" /> Template profissional</li>
                <li><FiCheck className="feature-check" /> Analytics avançado</li>
                <li><FiCheck className="feature-check" /> Suporte prioritário</li>
                <li><FiCheck className="feature-check" /> Múltiplos usuários</li>
                <li><FiCheck className="feature-check" /> Relatórios de equipe</li>
                <li><FiCheck className="feature-check" /> Gerenciamento de equipe</li>
                <li><FiCheck className="feature-check" /> Definição de metas para equipe</li>
              </ul>
              <Link
                to="/register?plan=business"
                className="pricing-btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Assinar plano Business
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Pronto para elevar o nível do seu negócio?</h2>
          <p className="cta-subtitle">
            Junte-se aos profissionais que usam a OrçaFast para modernizar a apresentação de seus serviços.
          </p>
          <Link
            to="/onboarding/create-client"
            className="cta-btn-final"
            style={{ textDecoration: 'none' }}
          >
            Começar agora
            <FiArrowRight />
          </Link>
          <div className="cta-trust">
            <span>✓ Comece grátis</span>
            <span>•</span>
            <span>✓ Crie seu primeiro orçamento em minutos</span>
            <span>•</span>
            <span>✓ Aumente suas aprovações</span>
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
