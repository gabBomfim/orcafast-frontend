"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Send, Eye, Save, Zap, MessageSquare, Calculator } from "lucide-react"
import Link from "next/link"

interface ProposalItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
  discount: number
}

export default function NovaPropostaPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [items, setItems] = useState<ProposalItem[]>([
    { id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0 },
  ])

  const [clients] = useState([
    { id: "1", name: "João Silva", email: "joao@email.com" },
    { id: "2", name: "Maria Santos", email: "maria@email.com" },
    { id: "3", name: "Pedro Costa", email: "pedro@email.com" },
  ])

  const addItem = () => {
    const newItem: ProposalItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof ProposalItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateItemTotal = (item: ProposalItem) => {
    const subtotal = item.quantity * item.unitPrice
    const discountAmount = (subtotal * item.discount) / 100
    return subtotal - discountAmount
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 orcafast-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Nova Proposta</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: Cliente */}
        <Card className="mb-6 orcafast-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary text-primary-foreground">1</Badge>
              <CardTitle>Selecionar Cliente</CardTitle>
            </div>
            <CardDescription>Escolha o cliente para esta proposta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Cliente</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Link href="/dashboard/clientes/novo">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Itens */}
        <Card className="mb-6 orcafast-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary text-primary-foreground">2</Badge>
                <div>
                  <CardTitle>Itens da Proposta</CardTitle>
                  <CardDescription>Adicione os serviços ou produtos</CardDescription>
                </div>
              </div>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <Label htmlFor={`description-${item.id}`}>Descrição</Label>
                      <Textarea
                        id={`description-${item.id}`}
                        placeholder="Ex: Instalação de tomadas e interruptores"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`quantity-${item.id}`}>Quantidade</Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`unitPrice-${item.id}`}>Valor Unitário</Label>
                      <Input
                        id={`unitPrice-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor={`discount-${item.id}`}>Desconto (%)</Label>
                      <Input
                        id={`discount-${item.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, "discount", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <div className="w-full p-3 bg-primary/5 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total do item:</span>
                          <span className="font-semibold text-primary">
                            R$ {calculateItemTotal(item).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Resumo e Envio */}
        <Card className="orcafast-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary text-primary-foreground">3</Badge>
              <CardTitle>Resumo e Envio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea id="notes" placeholder="Informações adicionais sobre a proposta..." rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="validity">Validade da Proposta</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="60">60 dias</SelectItem>
                        <SelectItem value="90">90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-primary/5 rounded-lg p-6 border">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-primary">Total da Proposta</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        R${" "}
                        {items
                          .reduce((total, item) => total + item.quantity * item.unitPrice, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descontos:</span>
                      <span className="text-accent">
                        -R${" "}
                        {(
                          items.reduce((total, item) => total + item.quantity * item.unitPrice, 0) - calculateTotal()
                        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total:</span>
                      <span>R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full orcafast-hover" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Proposta
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
