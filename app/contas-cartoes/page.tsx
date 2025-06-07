"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Landmark, Edit, Trash2, Volume2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

interface Account {
  id: number
  name: string
  type: "checking" | "savings" | "credit"
  balance: number
  bank: string
  number: string
}

export default function ContasCartoesPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      name: "Conta Corrente Principal",
      type: "checking",
      balance: 5420.5,
      bank: "Banco do Brasil",
      number: "**** 1234",
    },
    {
      id: 2,
      name: "Poupança",
      type: "savings",
      balance: 8950.25,
      bank: "Caixa Econômica",
      number: "**** 5678",
    },
    {
      id: 3,
      name: "Cartão Nubank",
      type: "credit",
      balance: -1250.0,
      bank: "Nubank",
      number: "**** 9012",
    },
    {
      id: 4,
      name: "Cartão Itaú",
      type: "credit",
      balance: -850.75,
      bank: "Itaú",
      number: "**** 3456",
    },
  ])

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "",
    balance: "",
    bank: "",
    number: "",
  })

  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { readPageContent } = useAccessibility()
  const { speak } = useSpeechSynthesis()

  const addAccount = () => {
    if (newAccount.name && newAccount.type && newAccount.bank) {
      const account: Account = {
        id: Date.now(),
        name: newAccount.name,
        type: newAccount.type as "checking" | "savings" | "credit",
        balance: Number.parseFloat(newAccount.balance) || 0,
        bank: newAccount.bank,
        number: newAccount.number || "**** ****",
      }
      setAccounts([...accounts, account])
      setNewAccount({ name: "", type: "", balance: "", bank: "", number: "" })
    }
  }

  const editAccount = () => {
    if (editingAccount && newAccount.name && newAccount.type && newAccount.bank) {
      const updatedAccounts = accounts.map((account) =>
        account.id === editingAccount.id
          ? {
              ...account,
              name: newAccount.name,
              type: newAccount.type as "checking" | "savings" | "credit",
              balance: Number.parseFloat(newAccount.balance) || account.balance,
              bank: newAccount.bank,
              number: newAccount.number || "**** ****",
            }
          : account,
      )
      setAccounts(updatedAccounts)
      setEditingAccount(null)
      setIsEditDialogOpen(false)
      setNewAccount({ name: "", type: "", balance: "", bank: "", number: "" })
    }
  }

  const startEdit = (account: Account) => {
    setEditingAccount(account)
    setNewAccount({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      bank: account.bank,
      number: account.number,
    })
    setIsEditDialogOpen(true)
  }

  const deleteAccount = (id: number) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "checking":
        return "Conta Corrente"
      case "savings":
        return "Poupança"
      case "credit":
        return "Cartão de Crédito"
      default:
        return type
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-800"
      case "savings":
        return "bg-green-100 text-green-800"
      case "credit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const readAccountInfo = (account: Account) => {
    const balanceType = account.type === "credit" ? "Fatura atual" : "Saldo disponível"
    const accountText = `${account.name}. Tipo: ${getAccountTypeLabel(account.type)}. 
    Banco: ${account.bank}. Número: ${account.number}. 
    ${balanceType}: ${Math.abs(account.balance).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`

    speak(accountText)
  }

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
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Contas e Cartões</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Conta</DialogTitle>
                <DialogDescription>Cadastre uma nova conta bancária ou cartão de crédito.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Conta</Label>
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Ex: Conta Corrente Santander"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Conta Corrente</SelectItem>
                      <SelectItem value="savings">Poupança</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    value={newAccount.bank}
                    onChange={(e) => setNewAccount({ ...newAccount, bank: e.target.value })}
                    placeholder="Ex: Banco do Brasil"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número da Conta/Cartão</Label>
                  <Input
                    id="number"
                    value={newAccount.number}
                    onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
                    placeholder="**** 1234"
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Saldo Inicial (R$)</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <Button onClick={addAccount} className="w-full">
                  Adicionar Conta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Conta</DialogTitle>
                <DialogDescription>Atualize as informações da sua conta bancária ou cartão.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome da Conta</Label>
                  <Input
                    id="edit-name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Ex: Conta Corrente Santander"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Conta Corrente</SelectItem>
                      <SelectItem value="savings">Poupança</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-bank">Banco</Label>
                  <Input
                    id="edit-bank"
                    value={newAccount.bank}
                    onChange={(e) => setNewAccount({ ...newAccount, bank: e.target.value })}
                    placeholder="Ex: Banco do Brasil"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-number">Número da Conta/Cartão</Label>
                  <Input
                    id="edit-number"
                    value={newAccount.number}
                    onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
                    placeholder="**** 1234"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-balance">Saldo Atual (R$)</Label>
                  <Input
                    id="edit-balance"
                    type="number"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <Button onClick={editAccount} className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6" role="main" aria-label="Gerenciamento de contas bancárias e cartões">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {account.type === "credit" ? (
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Landmark className="h-5 w-5 text-blue-600" />
                    )}
                    <Badge className={getAccountTypeColor(account.type)}>{getAccountTypeLabel(account.type)}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => readAccountInfo(account)}
                      aria-label={`Ler informações da conta ${account.name}`}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(account)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteAccount(account.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <CardDescription>
                  {account.bank} • {account.number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {account.type === "credit" ? "Fatura Atual" : "Saldo Disponível"}
                  </p>
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {account.balance >= 0 ? "+" : ""}
                    R$ {Math.abs(account.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {account.type === "credit" && account.balance < 0 && (
                    <p className="text-xs text-red-600">Vencimento: 15/02/2024</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Visão geral de todas as suas contas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total em Contas</p>
                <p className="text-2xl font-bold text-green-600">
                  R${" "}
                  {accounts
                    .filter((acc) => acc.type !== "credit")
                    .reduce((sum, acc) => sum + acc.balance, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total em Cartões</p>
                <p className="text-2xl font-bold text-red-600">
                  R${" "}
                  {Math.abs(
                    accounts.filter((acc) => acc.type === "credit").reduce((sum, acc) => sum + acc.balance, 0),
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Patrimônio Líquido</p>
                <p className="text-2xl font-bold">
                  R${" "}
                  {accounts
                    .reduce((sum, acc) => sum + acc.balance, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
