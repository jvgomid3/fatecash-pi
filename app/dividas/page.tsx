"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Calendar, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Debt {
  id: number
  name: string
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  dueDate: string
  interestRate: number
  type: string
}

export default function DividasPage() {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: 1,
      name: "Financiamento do Carro",
      totalAmount: 25000,
      remainingAmount: 18500,
      monthlyPayment: 650,
      dueDate: "2026-12-31",
      interestRate: 1.2,
      type: "Financiamento",
    },
    {
      id: 2,
      name: "Cartão de Crédito Nubank",
      totalAmount: 2500,
      remainingAmount: 1250,
      monthlyPayment: 300,
      dueDate: "2024-06-15",
      interestRate: 12.5,
      type: "Cartão",
    },
    {
      id: 3,
      name: "Empréstimo Pessoal",
      totalAmount: 8000,
      remainingAmount: 3200,
      monthlyPayment: 450,
      dueDate: "2024-12-31",
      interestRate: 2.8,
      type: "Empréstimo",
    },
  ])

  const [newDebt, setNewDebt] = useState({
    name: "",
    totalAmount: "",
    remainingAmount: "",
    monthlyPayment: "",
    dueDate: "",
    interestRate: "",
    type: "",
  })

  const addDebt = () => {
    if (newDebt.name && newDebt.totalAmount && newDebt.remainingAmount) {
      const debt: Debt = {
        id: Date.now(),
        name: newDebt.name,
        totalAmount: Number.parseFloat(newDebt.totalAmount),
        remainingAmount: Number.parseFloat(newDebt.remainingAmount),
        monthlyPayment: Number.parseFloat(newDebt.monthlyPayment) || 0,
        dueDate: newDebt.dueDate,
        interestRate: Number.parseFloat(newDebt.interestRate) || 0,
        type: newDebt.type || "Outros",
      }
      setDebts([...debts, debt])
      setNewDebt({
        name: "",
        totalAmount: "",
        remainingAmount: "",
        monthlyPayment: "",
        dueDate: "",
        interestRate: "",
        type: "",
      })
    }
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  const getDebtTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "financiamento":
        return "bg-blue-100 text-blue-800"
      case "cartão":
        return "bg-red-100 text-red-800"
      case "empréstimo":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Controle de Dívidas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Dívida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Dívida</DialogTitle>
                <DialogDescription>Cadastre uma nova dívida para acompanhar o progresso de quitação.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Dívida</Label>
                  <Input
                    id="name"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                    placeholder="Ex: Financiamento da Casa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalAmount">Valor Total (R$)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={newDebt.totalAmount}
                      onChange={(e) => setNewDebt({ ...newDebt, totalAmount: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="remainingAmount">Valor Restante (R$)</Label>
                    <Input
                      id="remainingAmount"
                      type="number"
                      value={newDebt.remainingAmount}
                      onChange={(e) => setNewDebt({ ...newDebt, remainingAmount: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyPayment">Parcela Mensal (R$)</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      value={newDebt.monthlyPayment}
                      onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Taxa de Juros (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                      placeholder="0,0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Data de Quitação</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newDebt.dueDate}
                      onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Input
                      id="type"
                      value={newDebt.type}
                      onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                      placeholder="Ex: Financiamento, Cartão"
                    />
                  </div>
                </div>
                <Button onClick={addDebt} className="w-full">
                  Adicionar Dívida
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Total de Dívidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {debts.length} dívida{debts.length !== 1 ? "s" : ""} ativa{debts.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Parcelas Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                R$ {totalMonthlyPayments.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Comprometimento mensal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {debts.length > 0
                  ? (
                      (debts.reduce((sum, debt) => sum + (debt.totalAmount - debt.remainingAmount), 0) /
                        debts.reduce((sum, debt) => sum + debt.totalAmount, 0)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Das dívidas quitadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {debts.map((debt) => {
            const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
            const monthsRemaining = debt.monthlyPayment > 0 ? Math.ceil(debt.remainingAmount / debt.monthlyPayment) : 0

            return (
              <Card key={debt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getDebtTypeColor(debt.type)}>{debt.type}</Badge>
                    <span className="text-sm text-muted-foreground">{debt.interestRate}% a.m.</span>
                  </div>
                  <CardTitle className="text-lg">{debt.name}</CardTitle>
                  <CardDescription>
                    Quitação prevista: {new Date(debt.dueDate).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso de Quitação</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Restante</p>
                      <p className="font-medium text-red-600">
                        R$ {debt.remainingAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parcela Mensal</p>
                      <p className="font-medium">
                        R$ {debt.monthlyPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Total</p>
                      <p className="font-medium">
                        R$ {debt.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meses Restantes</p>
                      <p className="font-medium">{monthsRemaining > 0 ? `${monthsRemaining} meses` : "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {debts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma dívida cadastrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Parabéns! Você não possui dívidas cadastradas no momento.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Dívida
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
