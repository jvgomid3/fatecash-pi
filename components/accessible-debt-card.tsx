"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Volume2 } from "lucide-react"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

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

interface AccessibleDebtCardProps {
  debt: Debt
  onEdit: (debt: Debt) => void
  onDelete: (id: number) => void
}

export function AccessibleDebtCard({ debt, onEdit, onDelete }: AccessibleDebtCardProps) {
  const { speak } = useSpeechSynthesis()

  const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
  const monthsRemaining = debt.monthlyPayment > 0 ? Math.ceil(debt.remainingAmount / debt.monthlyPayment) : 0

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

  const readDebtInfo = () => {
    const debtText = `Dívida ${debt.name}. Tipo: ${debt.type}. 
    Progresso de quitação: ${progress.toFixed(1)} por cento. 
    Valor restante: ${debt.remainingAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Parcela mensal: ${debt.monthlyPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Valor total: ${debt.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. 
    Taxa de juros: ${debt.interestRate} por cento ao mês. 
    Quitação prevista: ${new Date(debt.dueDate).toLocaleDateString("pt-BR")}. 
    Meses restantes: ${monthsRemaining > 0 ? `${monthsRemaining} meses` : "não calculado"}`

    speak(debtText)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={getDebtTypeColor(debt.type)}>{debt.type}</Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={readDebtInfo}
              aria-label={`Ler informações da dívida ${debt.name}`}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(debt)} aria-label={`Editar dívida ${debt.name}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(debt.id)}
              aria-label={`Excluir dívida ${debt.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{debt.interestRate}% a.m.</span>
          </div>
        </div>
        <CardTitle className="text-lg">{debt.name}</CardTitle>
        <CardDescription>Quitação prevista: {new Date(debt.dueDate).toLocaleDateString("pt-BR")}</CardDescription>
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
            <p className="font-medium">R$ {debt.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Meses Restantes</p>
            <p className="font-medium">{monthsRemaining > 0 ? `${monthsRemaining} meses` : "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
