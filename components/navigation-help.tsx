"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Keyboard } from "lucide-react"

export function NavigationHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-20 right-4 z-40" aria-label="Ajuda de navegação">
          <HelpCircle className="h-4 w-4 mr-2" />
          Ajuda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Guia de Navegação e Acessibilidade
          </DialogTitle>
          <DialogDescription>
            Aprenda a navegar no Fatecash usando teclado e recursos de acessibilidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atalhos de Teclado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Abrir/Fechar menu de navegação</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + M</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ir para Visão Geral</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + 1</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ir para Metas</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + 2</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ir para Planejamento</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + 3</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ler conteúdo da página atual</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + R</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Parar leitura de voz</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + S</kbd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navegação por Teclado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Tab:</strong> Navegar para o próximo elemento interativo
                </p>
                <p>
                  <strong>Shift + Tab:</strong> Navegar para o elemento anterior
                </p>
                <p>
                  <strong>Enter ou Espaço:</strong> Ativar botões e links
                </p>
                <p>
                  <strong>Setas:</strong> Navegar em menus e listas
                </p>
                <p>
                  <strong>Esc:</strong> Fechar diálogos e menus
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos de Acessibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Leitura de Voz:</strong> Clique no ícone de volume nos cards para ouvir as informações
                </p>
                <p>
                  <strong>Alto Contraste:</strong> Ative nas configurações para melhor visibilidade
                </p>
                <p>
                  <strong>Texto Grande:</strong> Aumente o tamanho da fonte nas configurações
                </p>
                <p>
                  <strong>Reduzir Animações:</strong> Minimize efeitos visuais que podem causar desconforto
                </p>
                <p>
                  <strong>Modo Leitor de Tela:</strong> Otimizações especiais para usuários de leitores de tela
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compatibilidade com Leitores de Tela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>O Fatecash é compatível com os principais leitores de tela:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>NVDA (Windows)</li>
                  <li>JAWS (Windows)</li>
                  <li>VoiceOver (macOS/iOS)</li>
                  <li>TalkBack (Android)</li>
                  <li>Orca (Linux)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
