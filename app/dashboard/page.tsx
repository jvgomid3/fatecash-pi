"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, DollarSign, PiggyBank } from "lucide-react"
import { FinanceChart } from "@/components/finance-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { AccessibleFinancialCard } from "@/components/accessible-financial-card"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useAuth } from "@/hooks/useAuth"


export interface IContaResponse {
  id: number
  name: string
  type: "Conta Corrente" | "Poupança" | "Cartão de crédito"
  balance: number
  bank: string
  number: string
}

export default function Dashboard() {
  useAuth()

  const { readPageContent } = useAccessibility()

  const [financialData, setFinancialData] = useState({
    totalBalance: 15420.5,
    monthlyIncome: 5800.0,
    monthlyExpenses: 3240.75,
    savings: 8950.25,
    goals: 3,
    debts: 2450.0,
  })

  // Anunciar carregamento da página
  // useEffect(() => {
  //   const userId = localStorage.getItem("user_id")

  //   if (!userId) {
  //     console.error("Usuário não autenticado ou ID ausente.")
  //     return
  //   }

  //   const fetchDashboardData = async () => {
  //     try {
  //       const token = localStorage.getItem("token")

  //       const response = await fetch(`http://localhost:3001/dashboard/${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       if (!response.ok) {
  //         throw new Error("Erro ao buscar dados da dashboard")
  //       }

  //       const data = await response.json()
  //       setFinancialData(data)
  //     } catch (error) {
  //       console.error("Erro:", error)
  //     }
  //   }

  //   fetchDashboardData()

  //   const timer = setTimeout(() => {
  //     readPageContent()
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [readPageContent])

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    const token = localStorage.getItem("token")

    if (!userId || !token) {
      console.error("Usuário não autenticado ou ID/token ausente.")
      return
    }

    const fetchDashboardData = async () => {
      try {
        // Requisição para dashboard (outros dados financeiros)
        // const dashboardRes = await fetch(`http://localhost:3001/dashboard/${userId}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })

        // if (!dashboardRes.ok) throw new Error("Erro ao buscar dados da dashboard")

        // const dashboardData = await dashboardRes.json()

        // Requisição para contas
        const contasRes = await fetch(`http://localhost:3001/contas/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!contasRes.ok) throw new Error("Erro ao buscar contas")

        const contas: IContaResponse[] = await contasRes.json()

        // Somar os balances de contas do tipo "Conta Corrente" ou "Poupança"
        const saldoTotal = contas
          .filter(conta => conta.type === "Conta Corrente" || conta.type === "Conta Poupança")
          .reduce((acc, conta) => acc + conta.balance, 0)

        setFinancialData({
          totalBalance: saldoTotal, // sobrescreve com o saldo real
          monthlyIncome: 5800.0,
          monthlyExpenses: 3240.75,
          savings: 8950.25,
          goals: 3,
          debts: 2450.0,
        })
      } catch (error) {
        console.error("Erro:", error)
      }
    }

    fetchDashboardData()

    const timer = setTimeout(() => {
      readPageContent()
    }, 1000)

    return () => clearTimeout(timer)
  }, [readPageContent])

  if (!financialData) {
    return <p className="p-6">Carregando dados financeiros...</p>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger data-sidebar="trigger" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Visão Geral</h1>

        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Painel principal de visão geral financeira">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Resumo financeiro">
          <AccessibleFinancialCard
            title="Saldo Total"
            value={financialData.totalBalance}
            change={12.5}
            changeLabel="em relação ao mês passado"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />

          <AccessibleFinancialCard
            title="Receita Mensal"
            value={financialData.monthlyIncome}
            description="Salário e outras fontes"
            icon={<ArrowUp className="h-4 w-4 text-green-600" />}
          />

          <AccessibleFinancialCard
            title="Gastos Mensais"
            value={financialData.monthlyExpenses}
            change={-5.2}
            changeLabel="em relação ao mês passado"
            icon={<ArrowDown className="h-4 w-4 text-red-600" />}
          />

          <AccessibleFinancialCard
            title="Reserva de Emergência"
            value={financialData.savings}
            description="Meta: R$ 15.000,00 (59.7%)"
            icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2" role="region" aria-label="Gráficos e transações">
          <FinanceChart />
          <RecentTransactions />
        </div>
      </main>
    </div>
  )
}
