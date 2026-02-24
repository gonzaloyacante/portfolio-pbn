'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────────────────────

type Language = 'es' | 'en'

interface TranslationResult {
  translatedText: string
  fromCache: boolean
}

// ── Chrome Translator API types (Chrome 138+) ─────────────────────────────────
// Declarados aquí para no requerir @types/dom-chromium-ai en tsconfig.
interface ChromeTranslatorCapabilities {
  available: 'no' | 'readily' | 'after-download'
}

interface ChromeTranslator {
  translate(text: string): Promise<string>
  translateStreaming(text: string): ReadableStream<string>
  destroy(): void
}

interface ChromeTranslatorFactory {
  availability(options: {
    sourceLanguage: string
    targetLanguage: string
  }): Promise<ChromeTranslatorCapabilities>
  create(options: {
    sourceLanguage: string
    targetLanguage: string
    monitor?: (m: EventTarget) => void
  }): Promise<ChromeTranslator>
}

declare global {
  interface Window {
    Translator?: ChromeTranslatorFactory
  }
}

// ── MyMemory fallback API (completamente gratuita, sin API key) ───────────────
async function translateWithMyMemory(text: string, from: Language, to: Language): Promise<string> {
  // MyMemory: 5000 chars/día gratuito sin registro. Sin API key.
  const url = new URL('https://api.mymemory.translated.world/get')
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `${from}|${to}`)

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`)

  const data = (await res.json()) as {
    responseStatus: number
    responseData: { translatedText: string }
  }

  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory error: ${data.responseStatus}`)
  }

  return data.responseData.translatedText
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function usePageTranslation() {
  const pathname = usePathname()
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'es'
    return (localStorage.getItem('pbn-lang') as Language) ?? 'es'
  })
  const [isTranslating, setIsTranslating] = useState(false)

  // Caché de traducciones en memoria (evita re-llamadas por la misma sesión)
  const translationCache = useRef<Map<string, string>>(new Map())

  // Instancia reutilizable del Chrome Translator (se crea una vez por sesión)
  const chromeTranslatorRef = useRef<ChromeTranslator | null>(null)

  /** Detecta y prepara el Chrome Translator API (Chrome 138+). */
  const getChromeTranslator = useCallback(
    async (from: Language, to: Language): Promise<ChromeTranslator | null> => {
      if (typeof window === 'undefined' || !window.Translator) return null

      // Reutilizar instancia existente
      if (chromeTranslatorRef.current) return chromeTranslatorRef.current

      try {
        const availability = await window.Translator.availability({
          sourceLanguage: from,
          targetLanguage: to,
        })

        if (availability.available === 'no') return null

        const translator = await window.Translator.create({
          sourceLanguage: from,
          targetLanguage: to,
          // Monitor de progreso de descarga del modelo
          monitor: (m) => {
            m.addEventListener('downloadprogress', (e) => {
              const evt = e as ProgressEvent
              const pct = Math.round((evt.loaded / evt.total) * 100)
              console.debug(`[Translator] Descargando modelo: ${pct}%`)
            })
          },
        })

        chromeTranslatorRef.current = translator
        return translator
      } catch (err) {
        console.warn('[Translator] Chrome API no disponible:', err)
        return null
      }
    },
    []
  )

  /** Traduce un texto dado de `from` a `to`. Usa caché. */
  const translate = useCallback(
    async (text: string, from: Language, to: Language): Promise<TranslationResult> => {
      if (!text.trim() || from === to) {
        return { translatedText: text, fromCache: false }
      }

      const cacheKey = `${from}→${to}:${text}`
      const cached = translationCache.current.get(cacheKey)
      if (cached) return { translatedText: cached, fromCache: true }

      let translated: string

      // Intentar Chrome Translator API primero (on-device, gratis, rápido)
      const chromeTranslator = await getChromeTranslator(from, to)
      if (chromeTranslator) {
        translated = await chromeTranslator.translate(text)
      } else {
        // Fallback: MyMemory API (gratuita, requiere red)
        translated = await translateWithMyMemory(text, from, to)
      }

      translationCache.current.set(cacheKey, translated)
      return { translatedText: translated, fromCache: false }
    },
    [getChromeTranslator]
  )

  /** Traduce un array de textos en batch (una sola llamada a la API). */
  const translateBatch = useCallback(
    async (texts: string[], from: Language, to: Language): Promise<string[]> => {
      // Para MyMemory, hacer las llamadas en paralelo (throttled)
      const results = await Promise.allSettled(texts.map((text) => translate(text, from, to)))
      return results.map((r, i) => (r.status === 'fulfilled' ? r.value.translatedText : texts[i]))
    },
    [translate]
  )

  /**
   * Alterna el idioma de la página entre 'es' y 'en'.
   * Traduce todos los nodos de texto dentro del `<main>` del documento.
   */
  const toggleLanguage = useCallback(async () => {
    const newLang: Language = currentLang === 'es' ? 'en' : 'es'

    setIsTranslating(true)

    try {
      // Recolectar todos los nodos de texto del contenido principal
      const mainEl =
        document.querySelector('main') ??
        document.querySelector('[data-translate]') ??
        document.body

      // Guardar textos originales en español en atributos data- si aún no existen
      if (newLang === 'en') {
        // Primera vez: guardar originales → traducir
        await translateDOMTree(mainEl, 'es', 'en', translateBatch)
      } else {
        // Vuelta a español: restaurar desde data-original
        restoreDOMTree(mainEl)
      }

      setCurrentLang(newLang)
      localStorage.setItem('pbn-lang', newLang)
      document.documentElement.lang = newLang
    } catch (err) {
      console.error('[Translator] Error al traducir página:', err)
    } finally {
      setIsTranslating(false)
    }
  }, [currentLang, translateBatch])

  /**
   * Re-traduce automáticamente cuando el pathname cambia en Next.js App Router.
   * El DOM de <main> se reemplaza en cada navegación: sin este efecto la página
   * nueva quedaría en español aunque el usuario hubiera elegido inglés.
   * Se espera 120ms para que Next.js hidrate el nuevo contenido antes de traducir.
   */
  useEffect(() => {
    if (currentLang !== 'en') return

    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return
      setIsTranslating(true)
      try {
        const mainEl =
          document.querySelector('main') ??
          document.querySelector('[data-translate]') ??
          document.body
        await translateDOMTree(mainEl, 'es', 'en', translateBatch)
      } catch (err) {
        console.error('[Translator] Error al re-traducir tras navegación:', err)
      } finally {
        if (!cancelled) setIsTranslating(false)
      }
    }, 120)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return {
    currentLang,
    isTranslating,
    toggleLanguage,
    translate,
  }
}

// ── Helpers de DOM ─────────────────────────────────────────────────────────────

// Tags a omitir al recorrer el DOM
const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'NOSCRIPT',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'BUTTON',
  'NAV',
  'HEAD',
  'META',
  'LINK',
  'TIME',
])

/** Determina si un nodo de texto debe omitirse en la traducción. */
function shouldSkipTextNode(node: Node): boolean {
  const parent = node.parentElement
  if (!parent) return true
  if (SKIP_TAGS.has(parent.tagName)) return true
  if (parent.closest('nav, [data-no-translate]')) return true
  return (node.textContent ?? '').trim().length < 3
}

/** Devuelve true si el elemento tiene exactamente un Text node como hijo. */
function hasSingleTextNode(el: Element): boolean {
  return el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE
}

/** Guarda el texto original en data-original y devuelve el texto recortado. */
function extractAndSaveOriginal(node: Text): string {
  const original = node.textContent ?? ''
  if (!node.parentElement?.dataset.original) {
    node.parentElement?.setAttribute('data-original', original)
  }
  return original.trim()
}

/** Aplica un texto traducido preservando el espacio en blanco original. */
function applyTranslationToNode(node: Text, translatedText: string): void {
  const orig = node.textContent ?? ''
  const leading = orig.match(/^\s*/)?.[0] ?? ''
  const trailing = orig.match(/\s*$/)?.[0] ?? ''
  node.textContent = leading + translatedText + trailing
}

/** Recorre el árbol DOM, extrae textos y los traduce en batch. */
async function translateDOMTree(
  root: Element,
  from: Language,
  to: Language,
  translateBatch: (texts: string[], from: Language, to: Language) => Promise<string[]>
): Promise<void> {
  // Recopilar nodos de texto con contenido útil
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkipTextNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    },
  })

  let node = walker.nextNode()
  while (node) {
    textNodes.push(node as Text)
    node = walker.nextNode()
  }

  if (textNodes.length === 0) return

  // Guardar textos originales (para poder restaurar al volver a 'es')
  const originalTexts: string[] = textNodes.map(extractAndSaveOriginal)

  // Traducir en batch
  const translated = await translateBatch(originalTexts, from, to)

  // Aplicar traducciones preservando whitespace
  textNodes.forEach((n, i) => applyTranslationToNode(n, translated[i]))
}

/** Restaura los textos originales (vuelta a español). */
function restoreDOMTree(root: Element): void {
  const elements = root.querySelectorAll('[data-original]')
  elements.forEach((el) => {
    const original = el.getAttribute('data-original')
    if (original && hasSingleTextNode(el)) {
      el.childNodes[0].textContent = original
    }
    el.removeAttribute('data-original')
  })
}
