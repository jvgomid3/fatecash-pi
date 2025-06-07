"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect } from "react"
import { useAccessibility } from "@/hooks/use-accessibility"

const transactions = [
  { id: 1, description: "Salário", amount: 5800.0, type: "income", date: "2024-01-15", account: "Conta Corrente BB" },
  {
    id: 2,
    description: "Supermercado Extra",
    amount: -320.5,
    type: "expense",
    date: "2024-01-14",
    account: "Cartão Nubank",
  },
  {
    id: 3,
    description: "Transferência Poupança",
    amount: -1000.0,
    type: "transfer",
    date: "2024-01-13",
    account: "Conta Corrente BB",
  },
  {
    id: 4,
    description: "Conta de Luz",
    amount: -180.75,
    type: "expense",
    date: "2024-01-13",
    account: "Conta Corrente BB",
  },
  {
    id: 5,
    description: "Freelance Design",
    amount: 800.0,
    type: "income",
    date: "2024-01-12",
    account: "Conta Corrente BB",
  },
  { id: 6, description: "Combustível", amount: -150.0, type: "expense", date: "2024-01-11", account: "Cartão Itaú" },
  { id: 7, description: "Restaurante", amount: -85.3, type: "expense", date: "2024-01-10", account: "Cartão Nubank" },
  { id: 8, description: "Farmácia", amount: -45.9, type: "expense", date: "2024-01-09", account: "Conta Corrente BB" },
]

const accounts = [
  { name: "Conta Corrente BB", balance: 5420.5, change: 12.5 },
  { name: "Poupança Caixa", balance: 8950.25, change: 2.1 },
  { name: "Cartão Nubank", balance: -1250.0, change: -8.3 },
  { name: "Cartão Itaú", balance: -850.75, change: 15.2 },
]

export default function CarteiraPage() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
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
          <h1 className="text-xl font-semibold">Minha Carteira</h1>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Visão consolidada da carteira financeira">
        <Card>
          <CardHeader>
            <CardTitle>Patrimônio Total</CardTitle>
            <CardDescription>Saldo consolidado de todas as suas contas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8.7% em relação ao mês passado
              </span>
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {accounts.map((account, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {account.balance >= 0 ? "+" : ""}
                  R$ {Math.abs(account.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {account.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={account.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {account.change >= 0 ? "+" : ""}
                    {account.change}%
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
            <CardDescription>Últimas transações em todas as suas contas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : transaction.type === "transfer"
                            ? "bg-blue-100"
                            : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      ) : transaction.type === "transfer" ? (
                        <ArrowUp className="h-5 w-5 text-blue-600 rotate-45" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.account}</p>
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
      </main>
    </div>
  )
}
