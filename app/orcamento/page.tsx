"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useAccessibility } from "@/hooks/use-accessibility"

interface BudgetCategory {
  id: number
  name: string
  budgeted: number
  spent: number
  color: string
}

export default function OrcamentoPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 1, name: "Alimentação", budgeted: 800, spent: 650, color: "#ef4444" },
    { id: 2, name: "Transporte", budgeted: 400, spent: 380, color: "#f97316" },
    { id: 3, name: "Moradia", budgeted: 1200, spent: 1200, color: "#eab308" },
    { id: 4, name: "Saúde", budgeted: 300, spent: 150, color: "#22c55e" },
    { id: 5, name: "Lazer", budgeted: 500, spent: 420, color: "#3b82f6" },
    { id: 6, name: "Educação", budgeted: 200, spent: 180, color: "#8b5cf6" },
    { id: 7, name: "Outros", budgeted: 300, spent: 260, color: "#6b7280" },
  ])

  const { readPageContent } = useAccessibility()

  useEffect(() => {
    const timer = setTimeout(() => {
      readPageContent()
    }, 1000)
    return () => clearTimeout(timer)
  }, [readPageContent])

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const overallProgress = (totalSpent / totalBudgeted) * 100

  const pieData = categories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Orçamento Mensal</h1>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Painel de controle de orçamento mensal">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalBudgeted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Planejado para este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Gasto Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">{overallProgress.toFixed(1)}% do orçamento usado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {(totalBudgeted - totalSpent).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Restante do orçamento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Gastos</CardTitle>
              <CardDescription>Como você está gastando seu dinheiro</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      "Gasto",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias de Orçamento</CardTitle>
              <CardDescription>Progresso por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const progress = (category.spent / category.budgeted) * 100
                  const isOverBudget = progress > 100

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className={`text-sm ${isOverBudget ? "text-red-600" : "text-muted-foreground"}`}>
                          R$ {category.spent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / R${" "}
                          {category.budgeted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(progress, 100)}
                        className="h-2"
                        style={{
                          backgroundColor: isOverBudget ? "#fee2e2" : undefined,
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.toFixed(1)}% usado</span>
                        {isOverBudget && <span className="text-red-600 font-medium">Acima do orçamento!</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
