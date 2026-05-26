import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiFileText,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiPackage,
  FiRepeat,
  FiSend,
  FiTruck,
  FiX,
} from 'react-icons/fi'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { applyPageSeo } from '../utils/seo'
import { trackEvent, trackGAEvent } from '../utils/tracking'
import '../styles/landing.css'
import '../styles/tentLanding.css'

const painPoints = [
  {
    icon: FiClock,
    title: 'Resposta lenta perde pedido bom',
    text: 'O cliente pede preço de tenda, cobertura, palco e montagem. Se a resposta demora, ele chama outra empresa.',
  },
  {
    icon: FiMessageCircle,
    title: 'Pedido espalhado no WhatsApp',
    text: 'Medida, data, local e itens extras ficam perdidos entre áudios, fotos e mensagens antigas.',
  },
  {
    icon: FiCalendar,
    title: 'Evento sem organização clara',
    text: 'Quando a agenda fica manual, é fácil misturar datas, horários de montagem e detalhes do evento.',
  },
  {
    icon: FiFileText,
    title: 'Planilha que não acompanha o ritmo',
    text: 'Excel ajuda no começo, mas trava quando chegam vários pedidos no mesmo dia.',
  },
  {
    icon: FiAlertCircle,
    title: 'Erro em valor e item custa caro',
    text: 'Uma tenda errada, frete esquecido ou montagem fora do preço pode comer a margem do serviço.',
  },
  {
    icon: FiRepeat,
    title: 'Orçamento antigo difícil de reaproveitar',
    text: 'Sem histórico fácil, você acaba refazendo do zero um pedido parecido com outro que já enviou.',
  },
]

const benefits = [
  {
    icon: FiPackage,
    title: 'Monte o orçamento no ritmo do atendimento',
    text: 'Inclua tenda, cobertura, piso, fechamento, iluminação, transporte e montagem em poucos minutos.',
  },
  {
    icon: FiRepeat,
    title: 'Reaproveite estruturas que você sempre aluga',
    text: 'Pedidos parecidos viram ponto de partida para responder mais rápido, sem começar do zero toda vez.',
  },
  {
    icon: FiFileText,
    title: 'Envie um PDF com cara profissional',
    text: 'O cliente recebe tudo organizado: itens, valores, validade e dados da sua empresa.',
  },
  {
    icon: FiCalendar,
    title: 'Organize pedidos e eventos no mesmo lugar',
    text: 'Fica mais fácil acompanhar o que foi enviado, visualizado e fechado para cada data.',
  },
  {
    icon: FiSend,
    title: 'Atendimento mais ágil no WhatsApp',
    text: 'Copie o link ou mande direto pelo WhatsApp enquanto o cliente ainda está interessado.',
  },
]

const workflowSteps = [
  {
    icon: FiPackage,
    title: 'Selecione os itens da locação',
    text: 'Escolha tendas, estruturas, acessórios e serviços ligados ao evento.',
  },
  {
    icon: FiCopy,
    title: 'Monte o orçamento',
    text: 'Ajuste quantidade, período, entrega, montagem e observações importantes.',
  },
  {
    icon: FiFileText,
    title: 'Gere PDF profissional',
    text: 'Mostre um orçamento organizado, fácil de ler e com a sua marca.',
  },
  {
    icon: FiMessageCircle,
    title: 'Envie no WhatsApp',
    text: 'Compartilhe em poucos cliques e acompanhe quando o cliente abrir.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'A OrçaFast serve para aluguel de tendas com montagem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Você pode montar orçamentos com itens de locação, serviços de montagem, transporte, validade e observações do evento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Consigo enviar o orçamento pelo WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A OrçaFast gera um link do orçamento e facilita o envio pelo WhatsApp para agilizar o atendimento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dá para gerar orçamento em PDF para locação de tendas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O sistema gera PDF profissional para você enviar ao cliente ou guardar no histórico da empresa.',
      },
    },
  ],
}

const LocacaoTendasPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(
    () =>
      applyPageSeo({
        title: 'Orçamentos para Locação de Tendas | OrcaFast',
        description:
          'Crie orçamentos profissionais para aluguel de tendas e estruturas para eventos em minutos. Organize pedidos e envie tudo pelo WhatsApp.',
        path: '/locacao-tendas',
        schema: faqSchema,
      }),
    []
  )

  const handleCtaClick = (ctaLocation) => {
    trackEvent('click_cta', {
      cta_location: ctaLocation,
      cta_label: 'Testar grátis',
      vertical: 'locacao_tendas',
    })
    trackGAEvent('clique_testar_gratis_locacao_tendas', {
      event_category: 'Botão',
      event_label: `Locação de tendas - ${ctaLocation}`,
    })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="landing-page niche-landing">
      <header className="niche-nav">
        <div className="niche-nav__inner">
          <Link to="/" className="niche-nav__logo" aria-label="Ir para a página inicial">
            <OrcafastLogo height="36px" />
          </Link>

          <nav className="niche-nav__links" aria-label="Navegação da página">
            <a href="#dores">Dores</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
            <Link to="/modelo-orcamento-locacao-tendas">Ver modelo</Link>
          </nav>

          <div className="niche-nav__actions">
            <Link to="/login" className="niche-link-button">
              Entrar
            </Link>
            <Link
              to="/register"
              className="niche-primary-button"
              onClick={() => handleCtaClick('nav_desktop')}
            >
              Testar grátis
            </Link>
          </div>

          <button
            className="niche-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="niche-mobile-menu" aria-label="Navegação mobile">
            <a href="#dores" onClick={closeMobileMenu}>
              Dores
            </a>
            <a href="#beneficios" onClick={closeMobileMenu}>
              Benefícios
            </a>
            <a href="#como-funciona" onClick={closeMobileMenu}>
              Como funciona
            </a>
            <Link to="/modelo-orcamento-locacao-tendas" onClick={closeMobileMenu}>
              Ver modelo
            </Link>
            <Link to="/login" onClick={closeMobileMenu}>
              Entrar
            </Link>
            <Link
              to="/register"
              className="niche-primary-button niche-primary-button--full"
              onClick={() => {
                closeMobileMenu()
                handleCtaClick('nav_mobile')
              }}
            >
              Testar grátis
            </Link>
          </nav>
        )}
      </header>

      <main>
        <section className="niche-hero" aria-labelledby="locacao-tendas-title">
          <div className="niche-container niche-hero__grid">
            <div className="niche-hero__copy">
              <p className="niche-eyebrow">Para locação de tendas e eventos</p>
              <h1 id="locacao-tendas-title">
                Envie orçamentos profissionais para locação de tendas em minutos.
              </h1>
              <p className="niche-hero__subtitle">
                Ideal para empresas de aluguel de tendas, coberturas e estruturas para eventos.
              </p>

              <div className="niche-hero__actions">
                <Link
                  to="/register"
                  className="niche-cta"
                  onClick={() => handleCtaClick('hero')}
                >
                  Testar grátis
                  <FiArrowRight aria-hidden="true" />
                </Link>
                <Link to="/modelo-orcamento-locacao-tendas" className="niche-secondary-cta">
                  Ver modelo de orçamento
                </Link>
              </div>

              <ul className="niche-trust-list" aria-label="Destaques do teste grátis">
                <li>
                  <FiCheck aria-hidden="true" />
                  7 dias grátis sem cartão
                </li>
                <li>
                  <FiCheck aria-hidden="true" />
                  PDF profissional
                </li>
                <li>
                  <FiCheck aria-hidden="true" />
                  Envio por WhatsApp
                </li>
              </ul>
            </div>

            <figure className="niche-system-shot" aria-label="Mockup do sistema OrçaFast">
              <div className="niche-shot__bar">
                <span />
                <span />
                <span />
              </div>
              <div className="niche-shot__content">
                <div className="niche-shot__header">
                  <div>
                    <span>Orçamento pronto</span>
                    <strong>Locação tenda 10x10</strong>
                  </div>
                  <span className="niche-status">Enviado</span>
                </div>

                <div className="niche-shot__event">
                  <div>
                    <FiCalendar aria-hidden="true" />
                    <span>Evento: 15/06</span>
                  </div>
                  <div>
                    <FiMapPin aria-hidden="true" />
                    <span>Montagem em Santos-SP</span>
                  </div>
                </div>

                <div className="niche-shot__items">
                  <div>
                    <span>Tenda piramidal 10x10</span>
                    <strong>R$ 1.200,00</strong>
                  </div>
                  <div>
                    <span>Fechamento lateral</span>
                    <strong>R$ 380,00</strong>
                  </div>
                  <div>
                    <span>Transporte e montagem</span>
                    <strong>R$ 450,00</strong>
                  </div>
                </div>

                <div className="niche-shot__total">
                  <span>Total do orçamento</span>
                  <strong>R$ 2.030,00</strong>
                </div>

                <div className="niche-shot__actions">
                  <span>
                    <FiFileText aria-hidden="true" />
                    PDF
                  </span>
                  <span>
                    <FiMessageCircle aria-hidden="true" />
                    WhatsApp
                  </span>
                </div>
              </div>
              <figcaption>Prévia de um orçamento de locação dentro da OrçaFast.</figcaption>
            </figure>
          </div>
        </section>

        <section className="niche-section" id="dores" aria-labelledby="pain-title">
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Dores do dia a dia</p>
              <h2 id="pain-title">Quem aluga tenda precisa responder rápido e sem bagunça.</h2>
              <p>
                O pedido chega com urgência, muda de medida, troca de data e ainda pede item extra.
                A OrçaFast ajuda a organizar esse atendimento sem deixar tudo espalhado.
              </p>
            </div>

            <div className="niche-card-grid niche-card-grid--three">
              {painPoints.map((item) => {
                const Icon = item.icon

                return (
                  <article className="niche-card" key={item.title}>
                    <Icon className="niche-card__icon" aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section
          className="niche-section niche-section--soft"
          id="beneficios"
          aria-labelledby="benefits-title"
        >
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Benefícios</p>
              <h2 id="benefits-title">Mais velocidade para vender locação de tendas.</h2>
              <p>
                O foco é tirar o orçamento da conversa solta e transformar em um documento claro,
                bonito e pronto para enviar.
              </p>
            </div>

            <div className="niche-benefit-list">
              {benefits.map((item) => {
                const Icon = item.icon

                return (
                  <article className="niche-benefit" key={item.title}>
                    <div className="niche-benefit__icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="niche-section" id="como-funciona" aria-labelledby="workflow-title">
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Como funciona</p>
              <h2 id="workflow-title">Do pedido no WhatsApp ao PDF enviado.</h2>
              <p>Um fluxo simples para orçamento locação tendas, coberturas e estruturas.</p>
            </div>

            <ol className="niche-flow">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon

                return (
                  <li className="niche-flow__item" key={step.title}>
                    <span className="niche-flow__number">{String(index + 1).padStart(2, '0')}</span>
                    <Icon className="niche-flow__icon" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        <section className="niche-proof" aria-labelledby="proof-title">
          <div className="niche-container niche-proof__grid">
            <div>
              <p className="niche-eyebrow">Feito para evento real</p>
              <h2 id="proof-title">Orçamento para eventos sem cara de improviso.</h2>
              <p>
                Um pedido de aluguel de estruturas para eventos quase sempre tem detalhe: metragem,
                local de montagem, tempo de uso, entrega, retirada e validade. Colocar tudo em um
                orçamento claro ajuda o cliente a decidir com mais segurança.
              </p>
            </div>

            <aside className="niche-check-panel" aria-label="Itens comuns no orçamento">
              <h3>O que dá para organizar</h3>
              <ul>
                <li>
                  <FiCheck aria-hidden="true" />
                  Tendas, coberturas e fechamentos
                </li>
                <li>
                  <FiCheck aria-hidden="true" />
                  Piso, iluminação e mobiliário
                </li>
                <li>
                  <FiCheck aria-hidden="true" />
                  Transporte, montagem e retirada
                </li>
                <li>
                  <FiCheck aria-hidden="true" />
                  Validade, observações e condições
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="niche-section niche-section--faq" aria-labelledby="faq-title">
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Dúvidas rápidas</p>
              <h2 id="faq-title">Antes de testar a OrçaFast.</h2>
            </div>

            <div className="niche-faq-list">
              <details>
                <summary>A OrçaFast serve para aluguel de tendas com montagem?</summary>
                <p>
                  Serve sim. Você pode colocar itens de locação, montagem, transporte, validade e
                  observações do evento no mesmo orçamento.
                </p>
              </details>
              <details>
                <summary>Consigo enviar o orçamento pelo WhatsApp?</summary>
                <p>
                  Consegue. A OrçaFast gera um link do orçamento e facilita o envio para agilizar o
                  atendimento.
                </p>
              </details>
              <details>
                <summary>Dá para gerar orçamento em PDF para locação de tendas?</summary>
                <p>
                  Dá sim. Você gera um PDF profissional para enviar ao cliente ou guardar no
                  histórico da empresa.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="niche-final-cta" aria-labelledby="final-cta-title">
          <div className="niche-container">
            <h2 id="final-cta-title">Teste a OrçaFast com a rotina da sua empresa de locação.</h2>
            <p>
              Crie sua conta, cadastre seus itens mais usados e envie o primeiro orçamento em
              minutos. Simples, direto e pensado para quem precisa responder rápido.
            </p>
            <Link
              to="/register"
              className="niche-cta"
              onClick={() => handleCtaClick('cta_final')}
            >
              Testar grátis
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="niche-footer">
        <div className="niche-container niche-footer__inner">
          <div>
            <OrcafastLogo height="32px" />
            <p>Orçamentos profissionais em minutos.</p>
          </div>
          <nav aria-label="Links institucionais">
            <Link to="/termos">Termos de uso</Link>
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/suporte">Suporte</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default LocacaoTendasPage
