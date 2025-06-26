"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, AlertTriangle, Calendar, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAccessibility } from "@/hooks/use-accessibility"
import { AccessibleDebtCard } from "@/components/accessible-debt-card"
import { useAuth } from "@/hooks/useAuth"

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

export interface IDebtRequest {
  name: string
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  dueDate: string
  interestRate: number
  type: string
  userId: number
}

export interface IDebtResponse {
  id: number
  name: string
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  dueDate: string
  interestRate: number
  type: string
  userId: number
}

export default function DividasPage() {
  useAuth()

  const [debts, setDebts] = useState<Debt[]>([])

  const [newDebt, setNewDebt] = useState({
    name: "",
    totalAmount: "",
    remainingAmount: "",
    monthlyPayment: "",
    dueDate: "",
    interestRate: "",
    type: "",
  })

  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("user_id")
    if (storedId) {
      const id = Number(storedId)
      setUserId(id)

      fetch(`http://localhost:3001/dividas/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar dividas")
          return res.json()
        })
        .then((data: IDebtResponse[]) => {
          setDebts(data)
        })
        .catch((err) => {
          console.error("Erro ao carregar dividas:", err)
        })
    } else {
      console.error("Usuário não autenticado.")
    }
  }, [])

  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { readPageContent } = useAccessibility()

  const addDebt = async () => {
    if (!userId) {
      console.error("Usuário não autenticado.")
      return
    }

    if (newDebt.name && newDebt.totalAmount && newDebt.remainingAmount) {
      const payload = {
        name: newDebt.name,
        totalAmount: Number(newDebt.totalAmount),
        remainingAmount: Number(newDebt.remainingAmount),
        monthlyPayment: Number(newDebt.monthlyPayment),
        dueDate: newDebt.dueDate,
        interestRate: Number(newDebt.interestRate),
        type: newDebt.type,
        userId: userId,
      }

      try {
        const response = await fetch("http://localhost:3001/dividas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Erro ao cadastrar divida")
        }

        const createdDebt = await response.json()

        
        setDebts([...debts, createdDebt])
        setNewDebt({
        name: "",
        totalAmount: "",
        remainingAmount: "",
        monthlyPayment: "",
        dueDate: "",
        interestRate: "",
        type: "",
      })
      } catch (error) {
        console.error("Erro ao adicionar divida:", error)
      }
    }
  }

  const editDebt = () => {
    if (editingDebt && newDebt.name && newDebt.totalAmount && newDebt.remainingAmount) {
      const updatedDebts = debts.map((debt) =>
        debt.id === editingDebt.id
          ? {
            ...debt,
            name: newDebt.name,
            totalAmount: Number.parseFloat(newDebt.totalAmount),
            remainingAmount: Number.parseFloat(newDebt.remainingAmount),
            monthlyPayment: Number.parseFloat(newDebt.monthlyPayment) || 0,
            dueDate: newDebt.dueDate,
            interestRate: Number.parseFloat(newDebt.interestRate) || 0,
            type: newDebt.type || "Outros",
          }
          : debt,
      )
      setDebts(updatedDebts)
      setEditingDebt(null)
      setIsEditDialogOpen(false)
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

  const startEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setNewDebt({
      name: debt.name,
      totalAmount: debt.totalAmount.toString(),
      remainingAmount: debt.remainingAmount.toString(),
      monthlyPayment: debt.monthlyPayment.toString(),
      dueDate: debt.dueDate,
      interestRate: debt.interestRate.toString(),
      type: debt.type,
    })
    setIsEditDialogOpen(true)
  }

  const deleteDebt = (id: number) => {
    setDebts(debts.filter((debt) => debt.id !== id))
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

  useEffect(() => {
    const timer = setTimeout(() => {
      readPageContent()
    }, 1000)
    return () => clearTimeout(timer)
  }, [readPageContent])

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
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Dívida</DialogTitle>
                <DialogDescription>Atualize as informações da sua dívida.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome da Dívida</Label>
                  <Input
                    id="edit-name"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                    placeholder="Ex: Financiamento da Casa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-totalAmount">Valor Total (R$)</Label>
                    <Input
                      id="edit-totalAmount"
                      type="number"
                      value={newDebt.totalAmount}
                      onChange={(e) => setNewDebt({ ...newDebt, totalAmount: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-remainingAmount">Valor Restante (R$)</Label>
                    <Input
                      id="edit-remainingAmount"
                      type="number"
                      value={newDebt.remainingAmount}
                      onChange={(e) => setNewDebt({ ...newDebt, remainingAmount: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-monthlyPayment">Parcela Mensal (R$)</Label>
                    <Input
                      id="edit-monthlyPayment"
                      type="number"
                      value={newDebt.monthlyPayment}
                      onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-interestRate">Taxa de Juros (%)</Label>
                    <Input
                      id="edit-interestRate"
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
                    <Label htmlFor="edit-dueDate">Data de Quitação</Label>
                    <Input
                      id="edit-dueDate"
                      type="date"
                      value={newDebt.dueDate}
                      onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type">Tipo</Label>
                    <Input
                      id="edit-type"
                      value={newDebt.type}
                      onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                      placeholder="Ex: Financiamento, Cartão"
                    />
                  </div>
                </div>
                <Button onClick={editDebt} className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Controle e gerenciamento de dívidas">
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
          {debts.map((debt) => (
            <AccessibleDebtCard key={debt.id} debt={debt} onEdit={startEdit} onDelete={deleteDebt} />
          ))}
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
