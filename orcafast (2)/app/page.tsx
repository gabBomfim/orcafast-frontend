import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Zap,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  Send,
  Eye,
  DollarSign,
  BarChart3,
  Target,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrçaFast</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Como funciona
            </a>
            <a href="#precos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Preços
            </a>
            <a href="#contato" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Contato
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-6 rounded-lg shadow-sm">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge
            variant="secondary"
            className="mb-8 bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-6 py-3 text-base rounded-full"
          >
            ✨ Mais de 1.000 propostas enviadas este mês
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-10 leading-tight text-gray-900">
            Orça rápido,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              fecha fácil
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            A plataforma mais simples para criar, enviar e acompanhar propostas profissionais. Sem enrolação, sem
            complexidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xl px-16 py-6 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Começar grátis
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-gray-700 border-2 border-gray-300 hover:border-gray-400 text-xl px-16 py-6 font-semibold rounded-2xl bg-transparent hover:bg-gray-50"
            >
              Ver demonstração
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 text-lg text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              Grátis para sempre
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              Pronto em 2 minutos
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            <div className="space-y-4">
              <div className="text-5xl font-bold text-white">3 cliques</div>
              <div className="text-gray-300 text-lg">Para enviar proposta</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-white">2 min</div>
              <div className="text-gray-300 text-lg">Tempo médio de setup</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-white">85%</div>
              <div className="text-gray-300 text-lg">Taxa de aprovação</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-emerald-400">R$ 29</div>
              <div className="text-gray-300 text-lg">Plano Pro por mês</div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-32 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">Como funciona</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Processo simples em 4 etapas para fechar mais negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Criar</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Cadastre clientes e crie propostas profissionais em minutos
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Send className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enviar</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Compartilhe por WhatsApp, email ou link direto</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Eye className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Acompanhar</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Veja quando foi visualizada e receba notificações</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <DollarSign className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ser pago</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Cliente aprova e você recebe o pagamento</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">Dashboard que funciona</h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Acompanhe suas métricas e tome decisões baseadas em dados reais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-800 border-gray-700 text-center p-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-semibold text-white mb-4">Métricas em tempo real</CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed">
                Visualize aprovações, valores e performance das suas propostas
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-center p-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-semibold text-white mb-4">Controle total</CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed">
                Gerencie clientes, propostas e pagamentos em um só lugar
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-center p-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-semibold text-white mb-4">Dados seguros</CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed">
                Suas informações protegidas com criptografia de ponta
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">Propostas que convertem mais</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Interface simples, resultados profissionais. Aumente suas aprovações sem complicação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Zap className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">Criação rápida</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Selecione o cliente, adicione os itens e envie. Nossa interface elimina a complexidade.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <TrendingUp className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">Acompanhamento</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Veja em tempo real quando sua proposta foi visualizada e aprovada pelo cliente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Clock className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">Economia de tempo</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Reduza de horas para minutos o tempo gasto criando e enviando propostas profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="precos" className="py-32 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">Preços simples e transparentes</h2>
            <p className="text-2xl text-gray-300">Comece grátis e evolua conforme seu negócio cresce</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-white font-semibold">Gratuito</CardTitle>
                <div className="text-6xl font-bold text-white mt-6">R$ 0</div>
                <CardDescription className="text-gray-300 mt-4 text-lg">Para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Até 5 propostas/mês</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Templates básicos</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Suporte por email</span>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full mt-10 border-gray-600 hover:border-gray-500 bg-transparent text-white py-4 text-lg font-semibold rounded-xl"
                  >
                    Começar grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-emerald-600 to-emerald-700 border-emerald-500 relative shadow-2xl scale-105">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-emerald-700 px-6 py-3 text-base font-bold rounded-full">
                  Mais popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-white font-semibold">Pro</CardTitle>
                <div className="text-6xl font-bold text-white mt-6">R$ 29</div>
                <CardDescription className="text-emerald-100 mt-4 text-lg">Por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-white mr-4 flex-shrink-0" />
                  <span className="text-white">Propostas ilimitadas</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-white mr-4 flex-shrink-0" />
                  <span className="text-white">Sem marca OrçaFast</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-white mr-4 flex-shrink-0" />
                  <span className="text-white">Dashboard completo</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-white mr-4 flex-shrink-0" />
                  <span className="text-white">Suporte prioritário</span>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full mt-10 bg-white hover:bg-gray-100 text-emerald-700 py-4 text-lg font-bold shadow-lg rounded-xl">
                    Começar teste grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-white font-semibold">Business</CardTitle>
                <div className="text-6xl font-bold text-white mt-6">R$ 59</div>
                <CardDescription className="text-gray-300 mt-4 text-lg">Para equipes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Tudo do Pro</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Até 5 usuários</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">Templates customizados</span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-200">API integração</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-10 border-gray-600 hover:border-gray-500 bg-transparent text-white py-4 text-lg font-semibold rounded-xl"
                >
                  Falar com vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gray-900">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-10 text-white">Pronto para aumentar suas aprovações?</h2>
          <p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Junte-se a mais de 1.000 profissionais que já usam o OrçaFast para fechar mais negócios
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-2xl px-20 py-8 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
            >
              Começar grátis agora
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </Link>
          <p className="text-lg text-gray-400 mt-12">
            Sem cartão de crédito • Configuração em 2 minutos • Suporte em português
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">OrçaFast</span>
            </div>

            <div className="flex items-center space-x-10 text-lg text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Termos de uso
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Suporte
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-16 pt-10 text-center text-lg text-gray-500">
            © 2024 OrçaFast. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
