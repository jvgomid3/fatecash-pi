"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Plus, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Goal {
  id: number
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export default function MetasPage() {
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
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const remaining = goal.targetAmount - goal.currentAmount

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{goal.category}</span>
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>Meta até {new Date(goal.deadline).toLocaleDateString("pt-BR")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Atual</p>
                      <p className="font-medium text-green-600">
                        R$ {goal.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Faltam</p>
                      <p className="font-medium">
                        R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Meta Total</p>
                    <p className="text-xl font-bold">
                      R$ {goal.targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
