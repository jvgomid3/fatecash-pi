"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", receitas: 5800, gastos: 3200, saldo: 2600 },
  { month: "Fev", receitas: 5800, gastos: 3400, saldo: 2400 },
  { month: "Mar", receitas: 6200, gastos: 3100, saldo: 3100 },
  { month: "Abr", receitas: 5800, gastos: 3600, saldo: 2200 },
  { month: "Mai", receitas: 6000, gastos: 3300, saldo: 2700 },
  { month: "Jun", receitas: 5800, gastos: 3241, saldo: 2559 },
]

export function FinanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo Financeiro</CardTitle>
        <CardDescription>Receitas vs Gastos nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]}
            />
            <Line type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={2} name="Receitas" />
            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} name="Gastos" />
            <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} name="Saldo" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
