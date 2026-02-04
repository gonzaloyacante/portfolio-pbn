'use client'

import { useEffect } from 'react'

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

    // Create URL
    const families = fontNames.map((f) => f.replace(/ /g, '+')).join('&family=')
    // Use &display=swap for better loading
    const url = `https://fonts.googleapis.com/css2?family=${families}&display=swap`

    // Check if already exists
    const existingLink = document.querySelector(`link[href="${url}"]`)
    if (existingLink) return

    // Inject
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Optional: Cleanup not really needed as we want fonts to persist usually,
    // but in editor it might pile up. For now let's keep it simple.
  }, [fonts])

  return null
}
