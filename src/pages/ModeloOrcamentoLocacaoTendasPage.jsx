import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClipboard,
  FiFileText,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiPackage,
  FiTruck,
  FiX,
} from 'react-icons/fi'
import OrcafastLogo from '../components/ui/OrcafastLogo'
import { applyPageSeo } from '../utils/seo'
import { trackEvent, trackGAEvent } from '../utils/tracking'
import '../styles/landing.css'
import '../styles/tentLanding.css'

const checklistItems = [
  'Nome do cliente e contato',
  'Data, horário e local do evento',
  'Itens alugados com quantidade e período',
  'Transporte, montagem e retirada',
  'Validade do orçamento e forma de pagamento',
]

const quoteItems = [
  { name: 'Tenda piramidal 10x10', details: '1 diária com montagem', value: 'R$ 1.200,00' },
  { name: 'Fechamento lateral cristal', details: '40 metros lineares', value: 'R$ 380,00' },
  { name: 'Piso modular', details: '100 m² para área coberta', value: 'R$ 900,00' },
  { name: 'Transporte, montagem e retirada', details: 'Equipe + deslocamento', value: 'R$ 450,00' },
]

const buildSteps = [
  {
    icon: FiClipboard,
    title: 'Comece pelo evento',
    text: 'Anote data, local, horário de montagem, tipo de evento e tudo que muda o preço.',
  },
  {
    icon: FiPackage,
    title: 'Liste os itens da locação',
    text: 'Separe tenda, cobertura, piso, fechamento, iluminação e qualquer estrutura adicional.',
  },
  {
    icon: FiTruck,
    title: 'Mostre serviços e condições',
    text: 'Inclua transporte, montagem, retirada, validade, pagamento e observações importantes.',
  },
  {
    icon: FiMessageCircle,
    title: 'Envie em um formato fácil de aprovar',
    text: 'PDF e link deixam o orçamento mais claro do que mensagem solta no WhatsApp.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que um orçamento de locação de tendas precisa ter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Precisa trazer dados do cliente, data e local do evento, itens alugados, serviços de montagem e retirada, valores, validade e condições de pagamento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso usar esse modelo para aluguel de estruturas para eventos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O mesmo formato funciona para coberturas, pisos, fechamentos, iluminação, mobiliário e outras estruturas de evento.',
      },
    },
    {
      '@type': 'Question',
      name: 'A OrçaFast gera PDF desse orçamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A OrçaFast ajuda a montar o orçamento e gerar um PDF profissional para enviar ao cliente.',
      },
    },
  ],
}

const ModeloOrcamentoLocacaoTendasPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(
    () =>
      applyPageSeo({
        title: 'Modelo de Orçamento para Locação de Tendas | OrçaFast',
        description:
          'Veja um exemplo de orçamento para aluguel de tendas, estruturas e itens de evento. Entenda o que incluir e teste a OrçaFast grátis.',
        path: '/modelo-orcamento-locacao-tendas',
        schema: faqSchema,
      }),
    []
  )

  const handleCtaClick = (ctaLocation) => {
    trackEvent('click_cta', {
      cta_location: ctaLocation,
      cta_label: 'Testar grátis',
      vertical: 'modelo_locacao_tendas',
    })
    trackGAEvent('clique_testar_gratis_modelo_locacao_tendas', {
      event_category: 'Botão',
      event_label: `Modelo locação de tendas - ${ctaLocation}`,
    })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="landing-page niche-landing model-page">
      <header className="niche-nav">
        <div className="niche-nav__inner">
          <Link to="/" className="niche-nav__logo" aria-label="Ir para a página inicial">
            <OrcafastLogo height="36px" />
          </Link>

          <nav className="niche-nav__links" aria-label="Navegação da página">
            <a href="#exemplo">Exemplo</a>
            <a href="#como-montar">Como montar</a>
            <a href="#checklist">Conferir</a>
            <Link to="/locacao-tendas">Página para locadoras</Link>
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
            <a href="#exemplo" onClick={closeMobileMenu}>
              Exemplo
            </a>
            <a href="#como-montar" onClick={closeMobileMenu}>
              Como montar
            </a>
            <a href="#checklist" onClick={closeMobileMenu}>
              Conferir
            </a>
            <Link to="/locacao-tendas" onClick={closeMobileMenu}>
              Página para locadoras
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
        <section className="niche-hero model-hero" aria-labelledby="model-title">
          <div className="niche-container niche-hero__grid">
            <div className="niche-hero__copy">
              <p className="niche-eyebrow">Exemplo prático</p>
              <h1 id="model-title">
                Modelo de orçamento para locação de tendas, pronto para usar como referência.
              </h1>
              <p className="niche-hero__subtitle">
                Veja o que colocar em um orçamento de aluguel de tendas e estruturas para eventos
                antes de mandar para o cliente.
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
                <a href="#exemplo" className="niche-secondary-cta">
                  Ver exemplo visual
                </a>
              </div>
            </div>

            <aside className="model-summary" aria-label="Resumo do modelo">
              <h2>O orçamento precisa deixar claro:</h2>
              <ul>
                {checklistItems.map((item) => (
                  <li key={item}>
                    <FiCheck aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="niche-section" id="exemplo" aria-labelledby="example-title">
          <div className="niche-container niche-example-grid">
            <div className="niche-section__header niche-section__header--left">
              <p className="niche-eyebrow">Exemplo visual</p>
              <h2 id="example-title">Um orçamento claro evita conversa confusa depois.</h2>
              <p>
                O cliente entende o que está incluso, o que será montado, quando será entregue e
                qual é o valor final. Isso deixa a negociação mais objetiva.
              </p>
            </div>

            <article className="example-quote" aria-label="Exemplo de orçamento de locação">
              <header className="example-quote__header">
                <div>
                  <span>Exemplo de orçamento</span>
                  <h3>Locação para casamento ao ar livre</h3>
                </div>
                <strong>R$ 2.930,00</strong>
              </header>

              <dl className="example-quote__details">
                <div>
                  <dt>
                    <FiCalendar aria-hidden="true" />
                    Data
                  </dt>
                  <dd>15/06/2026</dd>
                </div>
                <div>
                  <dt>
                    <FiMapPin aria-hidden="true" />
                    Local
                  </dt>
                  <dd>Santos-SP</dd>
                </div>
              </dl>

              <div className="example-quote__items">
                {quoteItems.map((item) => (
                  <div className="example-quote__item" key={item.name}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.details}</span>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <footer className="example-quote__footer">
                <p>Validade: 7 dias. Valores sujeitos a confirmação de agenda.</p>
                <span>
                  <FiFileText aria-hidden="true" />
                  Pronto para PDF
                </span>
              </footer>
            </article>
          </div>
        </section>

        <section
          className="niche-section niche-section--soft"
          id="como-montar"
          aria-labelledby="build-title"
        >
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Como montar</p>
              <h2 id="build-title">O formato simples que funciona para locação de tendas.</h2>
              <p>
                Um bom orçamento para eventos não precisa ser grande. Precisa ser claro, completo e
                fácil de enviar.
              </p>
            </div>

            <div className="niche-card-grid niche-card-grid--four">
              {buildSteps.map((step) => {
                const Icon = step.icon

                return (
                  <article className="niche-card" key={step.title}>
                    <Icon className="niche-card__icon" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="niche-proof" id="checklist" aria-labelledby="checklist-title">
          <div className="niche-container niche-proof__grid">
            <div>
              <p className="niche-eyebrow">Antes de enviar</p>
              <h2 id="checklist-title">Faça uma conferida rápida no orçamento.</h2>
              <p>
                Se a data, a montagem ou o frete ficarem de fora, o valor final pode mudar e gerar
                retrabalho. Use a lista como base antes de mandar o link.
              </p>
            </div>

            <aside className="niche-check-panel" aria-label="Checklist do orçamento">
              <h3>Conferir antes do envio</h3>
              <ul>
                {checklistItems.map((item) => (
                  <li key={item}>
                    <FiCheck aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="niche-section niche-section--faq" aria-labelledby="faq-title">
          <div className="niche-container">
            <div className="niche-section__header">
              <p className="niche-eyebrow">Dúvidas rápidas</p>
              <h2 id="faq-title">Sobre o modelo de orçamento.</h2>
            </div>

            <div className="niche-faq-list">
              <details>
                <summary>O que um orçamento de locação de tendas precisa ter?</summary>
                <p>
                  Dados do cliente, data e local do evento, itens alugados, montagem, retirada,
                  valores, validade e condições de pagamento.
                </p>
              </details>
              <details>
                <summary>Posso usar esse modelo para aluguel de estruturas para eventos?</summary>
                <p>
                  Pode sim. O formato funciona para coberturas, pisos, fechamentos, iluminação,
                  mobiliário e outros itens de evento.
                </p>
              </details>
              <details>
                <summary>A OrçaFast gera PDF desse orçamento?</summary>
                <p>
                  Gera. Você monta o orçamento na OrçaFast e envia um PDF profissional ou um link
                  pelo WhatsApp.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="niche-final-cta" aria-labelledby="final-cta-title">
          <div className="niche-container">
            <h2 id="final-cta-title">Transforme esse modelo em um orçamento real na OrçaFast.</h2>
            <p>
              Teste grátis e mande seu primeiro orçamento de locação de tendas com PDF, link e
              histórico organizado.
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

export default ModeloOrcamentoLocacaoTendasPage
