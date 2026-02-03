'use client'

import { useEffect } from 'react'

interface FontConfig {
  name?: string | null
  url?: string | null
}

interface FontLoaderProps {
  fonts: FontConfig[]
}

/**
 * Loads fonts dynamically into the document head
 */
export function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    fonts.forEach((font) => {
      if (!font.name || !font.url) return

      // Check if font is already loaded to avoid duplicates
      if (document.querySelector(`link[data-font="${font.name}"]`)) return

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = font.url
      link.setAttribute('data-font', font.name)
      document.head.appendChild(link)
    })
  }, [fonts])

  return null
}
