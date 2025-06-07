"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Edit, Trash2, Volume2 } from "lucide-react"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

interface Goal {
  id: number
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

interface AccessibleGoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: number) => void
}

export function AccessibleGoalCard({ goal, onEdit, onDelete }: AccessibleGoalCardProps) {
  const { speak } = useSpeechSynthesis()

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const readGoalInfo = () => {
    const progressText = `Meta ${goal.title}. Categoria: ${goal.category}. 
    Progresso: ${progress.toFixed(1)} por cento. 
    Valor atual: ${goal.currentAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Valor restante: ${remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Meta total: ${goal.targetAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Data limite: ${new Date(goal.deadline).toLocaleDateString("pt-BR")}`

    speak(progressText)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Target className="h-5 w-5 text-primary" />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={readGoalInfo}
              aria-label={`Ler informações da meta ${goal.title}`}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(goal)} aria-label={`Editar meta ${goal.title}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              aria-label={`Excluir meta ${goal.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{goal.category}</span>
          </div>
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
            <p className="font-medium">R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
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
}
