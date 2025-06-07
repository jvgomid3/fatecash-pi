"use client"

import { useState, useEffect, useCallback } from "react"

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void
  stop: () => void
  pause: () => void
  resume: () => void
  speaking: boolean
  supported: boolean
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  setVolume: (volume: number) => void
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Procurar por voz em português brasileiro
        const ptBrVoice = availableVoices.find((voice) => voice.lang.includes("pt-BR") || voice.lang.includes("pt"))
        if (ptBrVoice && !selectedVoice) {
          setSelectedVoice(ptBrVoice)
        }
      }

      updateVoices()
      window.speechSynthesis.onvoiceschanged = updateVoices
    }
  }, [selectedVoice])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return

      // Parar qualquer fala em andamento
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      utterance.lang = "pt-BR"

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [supported, selectedVoice, rate, pitch, volume],
  )

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
  }, [supported])

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice)
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    supported,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  }
}
