"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSpeechSynthesis } from "./use-speech-synthesis"

export function useAccessibility() {
  const { speak, stop } = useSpeechSynthesis()
  const router = useRouter()
  const pathname = usePathname()

  // Função para ler o conteúdo da página
  const readPageContent = useCallback(() => {
    const main = document.querySelector("main")
    if (main) {
      const headings = main.querySelectorAll("h1, h2, h3")
      const content = Array.from(headings)
        .map((heading) => heading.textContent)
        .filter(Boolean)
        .join(". ")

      if (content) {
        speak(`Página atual: ${content}`)
      }
    }
  }, [speak])

  // Função para ler valores monetários de forma mais natural
  const readMonetaryValue = useCallback((value: number) => {
    const formatted = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    return formatted.replace("R$", "reais")
  }, [])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Verificar se Alt está pressionado
      if (event.altKey) {
        switch (event.key) {
          case "m":
          case "M":
            event.preventDefault()
            // Trigger do sidebar
            const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement
            if (sidebarTrigger) {
              sidebarTrigger.click()
              speak("Menu de navegação")
            }
            break

          case "1":
            event.preventDefault()
            router.push("/")
            speak("Navegando para Visão Geral")
            break

          case "2":
            event.preventDefault()
            router.push("/metas")
            speak("Navegando para Metas")
            break

          case "3":
            event.preventDefault()
            router.push("/planejamento")
            speak("Navegando para Planejamento")
            break

          case "4":
            event.preventDefault()
            router.push("/carteira")
            speak("Navegando para Carteira")
            break

          case "5":
            event.preventDefault()
            router.push("/orcamento")
            speak("Navegando para Orçamento")
            break

          case "6":
            event.preventDefault()
            router.push("/dividas")
            speak("Navegando para Dívidas")
            break

          case "7":
            event.preventDefault()
            router.push("/contas-cartoes")
            speak("Navegando para Contas e Cartões")
            break

          case "r":
          case "R":
            event.preventDefault()
            readPageContent()
            break

          case "s":
          case "S":
            event.preventDefault()
            stop()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router, speak, stop, readPageContent])

  // Anunciar mudanças de página
  useEffect(() => {
    const pageNames: Record<string, string> = {
      "/": "Visão Geral",
      "/metas": "Metas Financeiras",
      "/planejamento": "Planejamento Financeiro",
      "/carteira": "Minha Carteira",
      "/orcamento": "Orçamento",
      "/dividas": "Controle de Dívidas",
      "/contas-cartoes": "Contas e Cartões",
    }

    const pageName = pageNames[pathname] || "Página"
    speak(`${pageName} carregada`)
  }, [pathname, speak])

  return {
    readPageContent,
    readMonetaryValue,
    speak,
    stop,
  }
}
