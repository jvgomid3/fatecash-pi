"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

const monthlyData = [
  { month: "Jan", receita: 5800, gastos: 3200, economia: 2600 },
  { month: "Fev", receita: 5800, gastos: 3400, economia: 2400 },
  { month: "Mar", receita: 6200, gastos: 3100, economia: 3100 },
  { month: "Abr", receita: 5800, gastos: 3600, economia: 2200 },
  { month: "Mai", receita: 6000, gastos: 3300, economia: 2700 },
  { month: "Jun", receita: 5800, gastos: 3241, economia: 2559 },
  { month: "Jul", receita: 5800, gastos: 3200, economia: 2600 },
  { month: "Ago", receita: 5800, gastos: 3100, economia: 2700 },
  { month: "Set", receita: 6000, gastos: 3300, economia: 2700 },
  { month: "Out", receita: 5800, gastos: 3400, economia: 2400 },
  { month: "Nov", receita: 5800, gastos: 3200, economia: 2600 },
  { month: "Dez", receita: 6200, gastos: 3500, economia: 2700 },
]

export default function PlanejamentoPage() {
  useAuth()
  
  const { readPageContent } = useAccessibility()

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
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Meu Planejamento</h1>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Planejamento financeiro mensal e anual">
        <Tabs defaultValue="mensal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="mensal">Planejamento Mensal</TabsTrigger>
            <TabsTrigger value="anual">Planejamento Anual</TabsTrigger>
          </TabsList>

          <TabsContent value="mensal" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Receita Prevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 5.800,00</div>
                  <p className="text-xs text-muted-foreground">Para este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Gastos Planejados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ 3.200,00</div>
                  <p className="text-xs text-muted-foreground">Orçamento mensal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Economia Esperada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">R$ 2.600,00</div>
                  <p className="text-xs text-muted-foreground">44.8% da receita</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição Mensal Planejada</CardTitle>
                <CardDescription>Como você planeja usar sua renda este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Moradia (Aluguel + Contas)</span>
                    <span className="font-bold">R$ 1.200,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Alimentação</span>
                    <span className="font-bold">R$ 800,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Transporte</span>
                    <span className="font-bold">R$ 400,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Lazer e Entretenimento</span>
                    <span className="font-bold">R$ 500,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Saúde</span>
                    <span className="font-bold">R$ 300,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                    <span className="font-medium text-green-800">Poupança/Investimentos</span>
                    <span className="font-bold text-green-800">R$ 2.600,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anual" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Receita Anual Prevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 70.800,00</div>
                  <p className="text-xs text-muted-foreground">Projeção para 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Gastos Anuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ 39.600,00</div>
                  <p className="text-xs text-muted-foreground">Orçamento anual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Economia Anual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">R$ 31.200,00</div>
                  <p className="text-xs text-muted-foreground">44.1% da receita</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Projeção Anual</CardTitle>
                <CardDescription>Planejamento financeiro para os próximos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      ]}
                    />
                    <Bar dataKey="receita" fill="#22c55e" name="Receita" />
                    <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                    <Bar dataKey="economia" fill="#3b82f6" name="Economia" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
