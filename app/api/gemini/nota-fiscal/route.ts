import { NextResponse } from "next/server"

export const runtime = "nodejs"

interface GeminiItem {
  nome?: unknown
  quantidade?: unknown
  valor?: unknown
}

interface GeminiResult {
  nome?: unknown
  valor_total?: unknown
  itens?: unknown
}

interface NormalizedReceipt {
  nome: string
  valor_total: number
  itens: Array<{
    nome: string
    quantidade: number
    valor: number
  }>
  source: "gemini"
}

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function normalizeResult(raw: GeminiResult): NormalizedReceipt {
  const itens = Array.isArray(raw.itens)
    ? raw.itens.map((item) => {
        const typedItem = item as GeminiItem
        return {
          nome: String(typedItem?.nome ?? "Item sem nome"),
          quantidade: parseNumber(typedItem?.quantidade) || 1,
          valor: parseNumber(typedItem?.valor),
        }
      })
    : []

  return {
    nome: String(raw.nome ?? "Nota fiscal"),
    valor_total: parseNumber(raw.valor_total),
    itens,
    source: "gemini",
  }
}

async function tryGeminiExtraction(
  apiKey: string,
  imageBase64: string,
  mimeType: string,
): Promise<{ data: NormalizedReceipt | null; errors: string[] }> {
  const prompt =
    'Extraia os dados desta nota fiscal e retorne SOMENTE JSON valido no formato: {"nome":"nome do estabelecimento","valor_total":123.45,"itens":[{"nome":"nome do item","quantidade":2,"valor":30.00}]}. Regras: "valor" deve ser UNITARIO, "valor_total" deve ser o total final da nota e "nome" deve ser o estabelecimento exatamente como aparece.'

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  }

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
  ]
  const errors: string[] = []

  for (const model of modelsToTry) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      const text = await response.text()
      errors.push(`${model}: ${text}`)
      continue
    }

    const payload = await response.json()
    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText || typeof rawText !== "string") {
      errors.push(`${model}: resposta sem JSON em texto`)
      continue
    }

    try {
      const parsed = JSON.parse(rawText) as GeminiResult
      return { data: normalizeResult(parsed), errors }
    } catch {
      errors.push(`${model}: JSON invalido retornado pelo modelo`)
    }
  }

  return { data: null, errors }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY nao configurada no servidor." }, { status: 500 })
    }

    const { imageBase64, mimeType } = (await req.json()) as {
      imageBase64?: string
      mimeType?: string
    }

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Envie imageBase64 e mimeType." }, { status: 400 })
    }

    const { data, errors } = await tryGeminiExtraction(apiKey, imageBase64, mimeType)

    if (!data) {
      const hasQuotaError = errors.some((err) => err.toLowerCase().includes("quota") || err.includes("429"))
      const hasInvalidImageError = errors.some(
        (err) => err.includes("INVALID_ARGUMENT") || err.toLowerCase().includes("unable to process input image"),
      )
      const message = hasQuotaError
        ? "Quota da API Gemini excedida para esta chave. Gere outra chave/projeto com billing ativo para continuar."
        : hasInvalidImageError
          ? "Nao foi possivel ler esta imagem da nota fiscal. Tente uma foto mais nitida, com boa luz e sem cortes."
          : "Nao foi possivel extrair a nota via Gemini com os modelos disponiveis."

      return NextResponse.json(
        {
          error: message,
          details: errors,
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada ao processar nota fiscal."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
