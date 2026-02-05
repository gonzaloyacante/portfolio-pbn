'use client'

import { useEffect } from 'react'
import { buildSafeFontUrl } from '@/lib/security-client'

interface FontLoaderProps {
  fonts: (string | null | undefined)[]
}

/**
 * Loads Google Fonts dynamically based on proper names string.
 * This is crucial for the editor to show changes instantly.
 */
export function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    // Filter valid font names
    const fontNames = fonts
      .filter((f): f is string => !!f && f !== 'inherit')
      // Deduplicate
      .filter((value, index, self) => self.indexOf(value) === index)

    if (fontNames.length === 0) return

    // ✅ USAR HELPER SEGURO PARA CADA FUENTE
    fontNames.forEach((fontName) => {
      const url = buildSafeFontUrl(fontName)
      if (!url) return

      // Check if already exists
      const existingLink = document.querySelector(`link[href="${url}"]`)
      if (existingLink) return

      // Inject
      const link = document.createElement('link')
      link.href = url
      link.rel = 'stylesheet'
      link.crossOrigin = 'anonymous' // Security best practice
      document.head.appendChild(link)
    })

    // Cleanup logic not strictly needed for this version
  }, [fonts])

  return null
}
