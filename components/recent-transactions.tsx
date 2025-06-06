"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

const transactions = [
  {
    id: 1,
    description: "Salário",
    amount: 5800.0,
    type: "income",
    date: "2024-01-15",
    category: "Trabalho",
  },
  {
    id: 2,
    description: "Supermercado",
    amount: -320.5,
    type: "expense",
    date: "2024-01-14",
    category: "Alimentação",
  },
  {
    id: 3,
    description: "Conta de Luz",
    amount: -180.75,
    type: "expense",
    date: "2024-01-13",
    category: "Utilidades",
  },
  {
    id: 4,
    description: "Freelance",
    amount: 800.0,
    type: "income",
    date: "2024-01-12",
    category: "Trabalho Extra",
  },
  {
    id: 5,
    description: "Combustível",
    amount: -150.0,
    type: "expense",
    date: "2024-01-11",
    category: "Transporte",
  },
]

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Suas últimas movimentações financeiras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : ""}
                  R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
