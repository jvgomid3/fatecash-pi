"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accessibility, Volume2, VolumeX, Eye, Type } from "lucide-react"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

interface AccessibilitySettings {
  speechEnabled: boolean
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
}

export function AccessibilityPanel() {
  const { speak, stop, speaking, supported, voices, setVoice, setRate, setVolume } = useSpeechSynthesis()

  const [settings, setSettings] = useState<AccessibilitySettings>({
    speechEnabled: true,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
  })

  const [speechRate, setSpeechRate] = useState([1])
  const [speechVolume, setSpeechVolume] = useState([1])

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))

    // Aplicar configurações ao documento
    if (key === "highContrast") {
      document.documentElement.classList.toggle("high-contrast", value)
    }
    if (key === "largeText") {
      document.documentElement.classList.toggle("large-text", value)
    }
    if (key === "reducedMotion") {
      document.documentElement.classList.toggle("reduced-motion", value)
    }
    if (key === "screenReaderMode") {
      document.documentElement.classList.toggle("screen-reader-mode", value)
    }
  }

  const testSpeech = () => {
    speak("Olá! Este é um teste do sistema de leitura de voz do Fatecash. O sistema está funcionando corretamente.")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
          aria-label="Abrir painel de acessibilidade"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Configurações de Acessibilidade
          </SheetTitle>
          <SheetDescription>
            Personalize a experiência de acordo com suas necessidades de acessibilidade.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Leitura de Voz */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Volume2 className="h-5 w-5" />
                Leitura de Voz
              </CardTitle>
              <CardDescription>Configure o sistema de síntese de voz para leitura de conteúdo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-enabled">Ativar leitura de voz</Label>
                <Switch
                  id="speech-enabled"
                  checked={settings.speechEnabled}
                  onCheckedChange={(checked) => updateSetting("speechEnabled", checked)}
                />
              </div>

              {settings.speechEnabled && supported && (
                <>
                  <div className="space-y-2">
                    <Label>Voz</Label>
                    <Select
                      onValueChange={(value) => {
                        const voice = voices.find((v) => v.name === value)
                        if (voice) setVoice(voice)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma voz" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices
                          .filter((voice) => voice.lang.includes("pt") || voice.lang.includes("en"))
                          .map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Velocidade da fala: {speechRate[0]}</Label>
                    <Slider
                      value={speechRate}
                      onValueChange={(value) => {
                        setSpeechRate(value)
                        setRate(value[0])
                      }}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Volume: {Math.round(speechVolume[0] * 100)}%</Label>
                    <Slider
                      value={speechVolume}
                      onValueChange={(value) => {
                        setSpeechVolume(value)
                        setVolume(value[0])
                      }}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testSpeech} disabled={speaking} size="sm">
                      Testar Voz
                    </Button>
                    <Button onClick={stop} variant="outline" size="sm" disabled={!speaking}>
                      <VolumeX className="h-4 w-4 mr-2" />
                      Parar
                    </Button>
                  </div>
                </>
              )}

              {!supported && <p className="text-sm text-muted-foreground">Seu navegador não suporta síntese de voz.</p>}
            </CardContent>
          </Card>

          {/* Configurações Visuais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5" />
                Configurações Visuais
              </CardTitle>
              <CardDescription>Ajuste a aparência para melhor visibilidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">Alto contraste</Label>
                  <p className="text-sm text-muted-foreground">Aumenta o contraste das cores</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text">Texto grande</Label>
                  <p className="text-sm text-muted-foreground">Aumenta o tamanho da fonte</p>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting("largeText", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduced-motion">Reduzir animações</Label>
                  <p className="text-sm text-muted-foreground">Minimiza efeitos de movimento</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Modo Leitor de Tela */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5" />
                Leitor de Tela
              </CardTitle>
              <CardDescription>Otimizações para usuários de leitores de tela</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader-mode">Modo leitor de tela</Label>
                  <p className="text-sm text-muted-foreground">Ativa descrições detalhadas e navegação otimizada</p>
                </div>
                <Switch
                  id="screen-reader-mode"
                  checked={settings.screenReaderMode}
                  onCheckedChange={(checked) => updateSetting("screenReaderMode", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Atalhos de Teclado */}
          <Card>
            <CardHeader>
              <CardTitle>Atalhos de Teclado</CardTitle>
              <CardDescription>Navegue rapidamente usando o teclado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Abrir/Fechar menu</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + M</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Ir para Visão Geral</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + 1</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Ir para Metas</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + 2</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Ler página atual</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Parar leitura</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + S</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
