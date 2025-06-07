"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import type { ReactNode } from "react"

interface AccessibleFinancialCardProps {
  title: string
  description?: string
  value: number
  change?: number
  changeLabel?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
}

export function AccessibleFinancialCard({
  title,
  description,
  value,
  change,
  changeLabel,
  icon,
  children,
  className,
}: AccessibleFinancialCardProps) {
  const { speak } = useSpeechSynthesis()

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const readCardContent = () => {
    let content = `${title}: ${formatCurrency(value)}`

    if (change !== undefined && changeLabel) {
      const changeText = change >= 0 ? "aumento" : "diminuição"
      content += `. ${changeText} de ${Math.abs(change)}% ${changeLabel}`
    }

    if (description) {
      content += `. ${description}`
    }

    speak(content)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={readCardContent}
          aria-label={`Ler informações de ${title}`}
          className="h-8 w-8 p-0"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" role="text" aria-label={`Valor: ${formatCurrency(value)}`}>
          {formatCurrency(value)}
        </div>
        {change !== undefined && changeLabel && (
          <p
            className={`text-xs text-muted-foreground ${change >= 0 ? "text-green-600" : "text-red-600"}`}
            role="text"
            aria-label={`${change >= 0 ? "Aumento" : "Diminuição"} de ${Math.abs(change)}% ${changeLabel}`}
          >
            {change >= 0 ? "+" : ""}
            {change}% {changeLabel}
          </p>
        )}
        {description && <CardDescription>{description}</CardDescription>}
        {children}
      </CardContent>
    </Card>
  )
}
