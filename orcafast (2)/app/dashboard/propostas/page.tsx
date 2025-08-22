"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Eye,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PropostasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [proposals] = useState([
    {
      id: 1,
      client: "João Silva",
      service: "Instalação Elétrica Residencial",
      value: 2850,
      status: "approved",
      createdAt: "2024-01-15",
      viewedAt: "2024-01-15",
      validUntil: "2024-02-15",
    },
    {
      id: 2,
      client: "Maria Santos",
      service: "Manutenção Hidráulica",
      value: 420,
      status: "viewed",
      createdAt: "2024-01-14",
      viewedAt: "2024-01-14",
      validUntil: "2024-02-14",
    },
    {
      id: 3,
      client: "Pedro Costa",
      service: "Pintura Residencial Completa",
      value: 3200,
      status: "sent",
      createdAt: "2024-01-13",
      viewedAt: null,
      validUntil: "2024-02-13",
    },
    {
      id: 4,
      client: "Ana Oliveira",
      service: "Reforma de Banheiro",
      value: 1800,
      status: "rejected",
      createdAt: "2024-01-12",
      viewedAt: "2024-01-12",
      validUntil: "2024-02-12",
    },
    {
      id: 5,
      client: "Carlos Mendes",
      service: "Instalação de Ar Condicionado",
      value: 950,
      status: "draft",
      createdAt: "2024-01-11",
      viewedAt: null,
      validUntil: "2024-02-11",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        )
      case "viewed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Eye className="w-3 h-3 mr-1" />
            Visualizado
          </Badge>
        )
      case "sent":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Send className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Rascunho
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return proposals.length
    return proposals.filter((p) => p.status === status).length
  }

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary">Propostas</span>
            </div>
          </div>

          <Link href="/dashboard/propostas/nova">
            <Button className="orcafast-hover">
              <Plus className="w-4 h-4 mr-2" />
              Nova Proposta
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-colors ${
              statusFilter === "all" ? "ring-2 ring-primary" : "hover:bg-muted/50"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{getStatusCount("all")}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              statusFilter === "approved" ? "ring-2 ring-green-500" : "hover:bg-muted/50"
            }`}
            onClick={() => setStatusFilter("approved")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getStatusCount("approved")}</div>
              <div className="text-sm text-muted-foreground">Aprovadas</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              statusFilter === "viewed" ? "ring-2 ring-blue-500" : "hover:bg-muted/50"
            }`}
            onClick={() => setStatusFilter("viewed")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getStatusCount("viewed")}</div>
              <div className="text-sm text-muted-foreground">Visualizadas</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              statusFilter === "sent" ? "ring-2 ring-yellow-500" : "hover:bg-muted/50"
            }`}
            onClick={() => setStatusFilter("sent")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount("sent")}</div>
              <div className="text-sm text-muted-foreground">Enviadas</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              statusFilter === "draft" ? "ring-2 ring-gray-500" : "hover:bg-muted/50"
            }`}
            onClick={() => setStatusFilter("draft")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{getStatusCount("draft")}</div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 orcafast-shadow">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar propostas por cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <Card className="orcafast-shadow">
          <CardHeader>
            <CardTitle>Suas Propostas</CardTitle>
            <CardDescription>
              {filteredProposals.length} proposta{filteredProposals.length !== 1 ? "s" : ""} encontrada
              {filteredProposals.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{proposal.client}</h3>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{proposal.service}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Criada: {proposal.createdAt}</span>
                          {proposal.viewedAt && <span>Visualizada: {proposal.viewedAt}</span>}
                          <span>Válida até: {proposal.validUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary text-lg">R$ {proposal.value.toLocaleString("pt-BR")}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {proposal.status === "draft" ? (
                        <Link href={`/dashboard/propostas/nova?edit=${proposal.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Continuar
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Reenviar WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
