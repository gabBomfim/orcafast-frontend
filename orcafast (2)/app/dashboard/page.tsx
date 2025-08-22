"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Users,
  FileText,
  DollarSign,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  MessageSquare,
  Settings,
  Crown,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [stats] = useState({
    totalProposals: 24,
    approvedProposals: 18,
    totalRevenue: 15420,
    viewedProposals: 22,
    pendingProposals: 4,
  })

  const [recentProposals] = useState([
    {
      id: 1,
      client: "João Silva",
      service: "Instalação Elétrica",
      value: 850,
      status: "approved",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      client: "Maria Santos",
      service: "Manutenção Hidráulica",
      value: 420,
      status: "viewed",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      client: "Pedro Costa",
      service: "Pintura Residencial",
      value: 1200,
      status: "sent",
      createdAt: "2024-01-13",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprovado</Badge>
      case "viewed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Visualizado</Badge>
      case "sent":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Enviado</Badge>
      default:
        return <Badge variant="secondary">Rascunho</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 orcafast-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">OrçaFast</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" size="sm">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Pro
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Olá, Carlos! 👋</h1>
          <p className="text-muted-foreground">
            Você já faturou <span className="font-semibold text-primary">R$ {stats.totalRevenue.toLocaleString()}</span>{" "}
            este mês
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/propostas/nova">
            <Card className="orcafast-hover cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary">Nova Proposta</h3>
                  <p className="text-sm text-muted-foreground">Criar em 3 cliques</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/clientes">
            <Card className="orcafast-hover cursor-pointer">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Clientes</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar contatos</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/propostas">
            <Card className="orcafast-hover cursor-pointer">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Propostas</h3>
                  <p className="text-sm text-muted-foreground">Ver todas</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="orcafast-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">R$ {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card className="orcafast-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.approvedProposals}</div>
              <p className="text-xs text-muted-foreground">
                Taxa de {Math.round((stats.approvedProposals / stats.totalProposals) * 100)}% de aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="orcafast-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizadas</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.viewedProposals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProposals - stats.viewedProposals} ainda não visualizadas
              </p>
            </CardContent>
          </Card>

          <Card className="orcafast-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendingProposals}</div>
              <p className="text-xs text-muted-foreground">Aguardando resposta</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Proposals */}
        <Card className="orcafast-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Propostas Recentes</CardTitle>
                <CardDescription>Suas últimas propostas enviadas</CardDescription>
              </div>
              <Link href="/dashboard/propostas">
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{proposal.client}</p>
                        <p className="text-sm text-muted-foreground">{proposal.service}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">R$ {proposal.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{proposal.createdAt}</p>
                    </div>
                    {getStatusBadge(proposal.status)}
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
