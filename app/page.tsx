"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, DollarSign, PiggyBank, TrendingDown } from "lucide-react"
import { FinanceChart } from "@/components/finance-chart"
import { RecentTransactions } from "@/components/recent-transactions"

export default function Dashboard() {
  const [financialData, setFinancialData] = useState({
    totalBalance: 15420.5,
    monthlyIncome: 5800.0,
    monthlyExpenses: 3240.75,
    savings: 8950.25,
    goals: 3,
    debts: 2450.0,
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Visão Geral</h1>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {financialData.totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +12.5% em relação ao mês passado
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {financialData.monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Salário e outras fontes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Mensais</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {financialData.monthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -5.2% em relação ao mês passado
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reserva de Emergência</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {financialData.savings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Meta: R$ 15.000,00 (59.7%)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FinanceChart />
          <RecentTransactions />
        </div>
      </main>
    </div>
  )
}
