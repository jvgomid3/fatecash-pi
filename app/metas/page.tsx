"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAccessibility } from "@/hooks/use-accessibility"
import { AccessibleGoalCard } from "@/components/accessible-goal-card"
import { useAuth } from "@/hooks/useAuth"

interface Goal {
  id: number
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export default function MetasPage() {
  useAuth()
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Viagem para Europa",
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: "2024-12-31",
      category: "Viagem",
    },
    {
      id: 2,
      title: "Carro Novo",
      targetAmount: 45000,
      currentAmount: 12000,
      deadline: "2025-06-30",
      category: "Veículo",
    },
    {
      id: 3,
      title: "Reserva de Emergência",
      targetAmount: 20000,
      currentAmount: 8950,
      deadline: "2024-08-31",
      category: "Emergência",
    },
  ])

  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    category: "",
  })

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { readPageContent } = useAccessibility()

  const addGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now(),
        title: newGoal.title,
        targetAmount: Number.parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category || "Geral",
      }
      setGoals([...goals, goal])
      setNewGoal({ title: "", targetAmount: "", deadline: "", category: "" })
    }
  }

  const editGoal = () => {
    if (editingGoal && newGoal.title && newGoal.targetAmount) {
      const updatedGoals = goals.map((goal) =>
        goal.id === editingGoal.id
          ? {
              ...goal,
              title: newGoal.title,
              targetAmount: Number.parseFloat(newGoal.targetAmount),
              deadline: newGoal.deadline,
              category: newGoal.category || "Geral",
            }
          : goal,
      )
      setGoals(updatedGoals)
      setEditingGoal(null)
      setIsEditDialogOpen(false)
      setNewGoal({ title: "", targetAmount: "", deadline: "", category: "" })
    }
  }

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
    })
    setIsEditDialogOpen(true)
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id))
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
          <h1 className="text-xl font-semibold">Metas Financeiras</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>Defina uma nova meta financeira para acompanhar seu progresso.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Viagem para o Japão"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor Objetivo (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Data Limite</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    placeholder="Ex: Viagem, Veículo, Casa"
                  />
                </div>
                <Button onClick={addGoal} className="w-full">
                  Criar Meta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Meta</DialogTitle>
                <DialogDescription>Atualize as informações da sua meta financeira.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Título da Meta</Label>
                  <Input
                    id="edit-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Viagem para o Japão"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount">Valor Objetivo (R$)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-deadline">Data Limite</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Input
                    id="edit-category"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    placeholder="Ex: Viagem, Veículo, Casa"
                  />
                </div>
                <Button onClick={editGoal} className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Gerenciamento de metas financeiras">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <AccessibleGoalCard key={goal.id} goal={goal} onEdit={startEdit} onDelete={deleteGoal} />
          ))}
        </div>
      </main>
    </div>
  )
}
