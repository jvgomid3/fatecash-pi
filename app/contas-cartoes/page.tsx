"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Landmark, Edit, Trash2, Volume2, Upload, Sparkles } from "lucide-react"
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
import { useAuth } from "@/hooks/useAuth"

interface Account {
  id: number
  name: string
  type: "Conta Corrente" | "Poupança" | "Cartão de crédito"
  balance: number
  bank: string
  number: string
}

export interface IContaRequest {
  name: string
  type: "Conta Corrente" | "Poupança" | "Cartão de crédito"
  balance: number
  bank: string
  number: string
  userId: number
}

export interface IContaResponse {
  id: number
  name: string
  type: "Conta Corrente" | "Poupança" | "Cartão de crédito"
  balance: number
  bank: string

}

interface ExtractedReceipt {
  nome: string
  valor_total: number
  itens: Array<{
    nome: string
    quantidade: number
    valor: number
  }>
}

export default function ContasCartoesPage() {
  useAuth()

  const [accounts, setAccounts] = useState<IContaRequest[]>([])

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "" as "Conta Corrente" | "Poupança" | "Cartão de crédito" | "",
    balance: "",
    bank: "",
    number: "",
    userId: ""
  })

  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
  const storedId = localStorage.getItem("user_id")
  if (storedId) {
    const id = Number(storedId)
    setUserId(id)

    fetch(`http://localhost:3001/contas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar contas")
        return res.json()
      })
      .then((data: IContaResponse[]) => {
        setAccounts(data)
      })
      .catch((err) => {
        console.error("Erro ao carregar contas:", err)
      })
  } else {
    console.error("Usuário não autenticado.")
  }
}, [])

  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string>("")
  const [receiptError, setReceiptError] = useState<string>("")
  const [isExtractingReceipt, setIsExtractingReceipt] = useState(false)
  const [extractedReceipt, setExtractedReceipt] = useState<ExtractedReceipt | null>(null)
  const [isDraggingReceipt, setIsDraggingReceipt] = useState(false)
  const receiptInputRef = useRef<HTMLInputElement>(null)

  const { readPageContent } = useAccessibility()
  const { speak } = useSpeechSynthesis()

  const addAccount = async () => {
    if (!userId) {
      console.error("Usuário não autenticado.")
      return
    }

    if (newAccount.name && newAccount.type && newAccount.bank) {
      const payload = {
        name: newAccount.name,
        type: newAccount.type as "Conta Corrente" | "Poupança" | "Cartão de crédito",
        balance: Number.parseFloat(newAccount.balance) || 0,
        bank: newAccount.bank,
        number: newAccount.number || "**** ****",
        userId: userId,
      }

      try {
        const response = await fetch("http://localhost:3001/contas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Erro ao cadastrar conta")
        }

        const createdAccount = await response.json()

        // Atualiza a lista com a nova conta vinda do backend
        setAccounts([...accounts, createdAccount])
        setNewAccount({ name: "", type: "", balance: "", bank: "", number: "", userId: "" })
      } catch (error) {
        console.error("Erro ao adicionar conta:", error)
      }
    }
  }


  const editAccount = () => {
    if (editingAccount && newAccount.name && newAccount.type && newAccount.bank) {
      const updatedAccounts = accounts.map((account) =>
        account.id === editingAccount.id
          ? {
            ...account,
            name: newAccount.name,
            type: newAccount.type as "Conta Corrente" | "Poupança" | "Cartão de crédito",
            balance: Number.parseFloat(newAccount.balance) || account.balance,
            bank: newAccount.bank,
            number: newAccount.number || "**** ****",
          }
          : account,
      )
      setAccounts(updatedAccounts)
      setEditingAccount(null)
      setIsEditDialogOpen(false)
      setNewAccount({ name: "", type: "", balance: "", bank: "", number: "", userId: "" })
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

  const setReceiptFromFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setReceiptError("Selecione uma imagem da nota fiscal (JPG, PNG, etc).")
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setReceiptFile(file)
    setReceiptPreview(previewUrl)
    setExtractedReceipt(null)
    setReceiptError("")

    // Permite selecionar o mesmo arquivo novamente e disparar onChange.
    if (receiptInputRef.current) {
      receiptInputRef.current.value = ""
    }
  }

  const handleReceiptFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setReceiptFromFile(file)
  }

  const handleReceiptDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingReceipt(true)
  }

  const handleReceiptDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingReceipt(false)
  }

  const handleReceiptDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingReceipt(false)

    const file = event.dataTransfer.files?.[0]
    if (!file) {
      return
    }

    setReceiptFromFile(file)
  }

  const openReceiptPicker = () => {
    receiptInputRef.current?.click()
  }

  const extractReceiptInfo = async () => {
    if (!receiptFile) {
      setReceiptError("Faça upload de uma imagem de nota fiscal primeiro.")
      return
    }

    setIsExtractingReceipt(true)
    setReceiptError("")

    try {
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          const result = reader.result
          if (typeof result !== "string") {
            reject(new Error("Falha ao ler imagem da nota fiscal."))
            return
          }

          const [, base64] = result.split(",")
          if (!base64) {
            reject(new Error("Formato inválido de imagem."))
            return
          }

          resolve(base64)
        }

        reader.onerror = () => reject(new Error("Erro ao processar arquivo de imagem."))
        reader.readAsDataURL(receiptFile)
      })

      const response = await fetch("/api/gemini/nota-fiscal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: receiptFile.type,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error ?? "Não foi possível extrair os dados da nota fiscal.")
      }

      setExtractedReceipt(payload.data as ExtractedReceipt)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado ao extrair dados da nota fiscal."
      setReceiptError(message)
    } finally {
      setIsExtractingReceipt(false)
    }
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "Conta Corrente":
        return "Conta Corrente"
      case "Conta Poupança":
        return "Poupança"
      case "Cartão de Crédito":
        return "Cartão de Crédito"
      default:
        return type
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Conta Corrente":
        return "bg-blue-100 text-blue-800"
      case "Conta Poupança":
        return "bg-green-100 text-green-800"
      case "Cartão de Crédito":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const readAccountInfo = (account: Account) => {
    const balanceType = account.type === "Cartão de crédito" ? "Fatura atual" : "Saldo disponível"
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
                      <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                      <SelectItem value="Conta Poupança">Poupança</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
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
                      <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                      <SelectItem value="Conta Poupança">Poupança</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
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
                    {account.type === "Cartão de crédito" ? (
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
                    {account.type === "Cartão de crédito" ? "Fatura Atual" : "Saldo Disponível"}
                  </p>
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {account.balance >= 0 ? "+" : ""}
                    R$ {Math.abs(account.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {account.type === "Cartão de crédito" && account.balance < 0 && (
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
                    .filter((acc) => acc.type !== "Cartão de crédito")
                    .reduce((sum, acc) => sum + acc.balance, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total em Cartões</p>
                <p className="text-2xl font-bold text-red-600">
                  R${" "}
                  {Math.abs(
                    accounts.filter((acc) => acc.type === "Cartão de crédito").reduce((sum, acc) => sum + acc.balance, 0),
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

        <Card>
          <CardHeader>
            <CardTitle>Digitalizar Nota Fiscal com IA (Gemini)</CardTitle>
            <CardDescription>Faça upload de uma notinha fiscal para extrair nome, itens e valor total.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt-upload">Upload da nota fiscal</Label>
              <input
                id="receipt-upload"
                ref={receiptInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReceiptFileChange}
              />
              <div
                role="button"
                tabIndex={0}
                onClick={openReceiptPicker}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openReceiptPicker()
                  }
                }}
                onDragOver={handleReceiptDragOver}
                onDragLeave={handleReceiptDragLeave}
                onDrop={handleReceiptDrop}
                className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                  isDraggingReceipt
                    ? "border-green-500 bg-green-50"
                    : "border-muted-foreground/30 bg-muted/30 hover:border-green-400 hover:bg-green-50/70"
                }`}
                aria-label="Arraste ou selecione imagem da nota fiscal"
              >
                <Upload
                  className={`h-7 w-7 transition-transform duration-200 ${isDraggingReceipt ? "scale-110 text-green-600" : "text-muted-foreground group-hover:scale-105 group-hover:text-green-600"}`}
                />
                <p className="text-sm font-medium">Arraste a nota fiscal aqui ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground">Formatos aceitos: JPG, PNG, WEBP</p>
                {receiptFile && <p className="text-xs font-medium text-green-700">Arquivo: {receiptFile.name}</p>}
              </div>
            </div>

            {receiptPreview && (
              <div className="rounded-md border p-2">
                <img
                  src={receiptPreview || "/placeholder.svg"}
                  alt="Pré-visualização da nota fiscal"
                  className="max-h-80 w-full object-contain rounded-md"
                />
              </div>
            )}

            <Button onClick={extractReceiptInfo} disabled={!receiptFile || isExtractingReceipt} className="w-full">
              {isExtractingReceipt ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Extraindo dados com Gemini...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Digitalizar Nota Fiscal
                </>
              )}
            </Button>

            {receiptError && <p className="text-sm text-red-600">{receiptError}</p>}

            {extractedReceipt && (
              <div className="rounded-md border p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-semibold">{extractedReceipt.nome}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Itens</p>
                  <div className="space-y-2">
                    {extractedReceipt.itens.map((item, index) => (
                      <div key={`${item.nome}-${index}`} className="flex items-center justify-between rounded-sm border p-2 text-sm">
                        <span>{item.nome}</span>
                        <span>
                          {item.quantidade}x • {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                    ))}
                    {extractedReceipt.itens.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum item identificado na nota fiscal.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-semibold text-green-600">
                    {extractedReceipt.valor_total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
