'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  themeValues?: Record<string, string>
}

export default function ThemeProvider({ children, themeValues }: ThemeProviderProps) {
  useEffect(() => {
    if (!themeValues) return

    // Aplicar todos los valores del tema como CSS variables
    const root = document.documentElement

    Object.entries(themeValues).forEach(([key, value]) => {
      // Convertir key de snake_case a kebab-case para CSS
      const cssKey = key.replace(/_/g, '-')
      root.style.setProperty(`--${cssKey}`, value)

      // También setear compatibilidad con variables antiguas
      if (key === 'color_background') {
        root.style.setProperty('--color-bg', value)
        root.style.setProperty('--color-pink-light', value)
      }
      if (key === 'color_primary') {
        root.style.setProperty('--color-primary', value)
        // No sobreescribir --color-wine con primary, ya que primary suele ser rosa
        // root.style.setProperty('--color-wine', value)
        root.style.setProperty('--color-makeup', value)
      }
      if (key === 'color_accent') {
        root.style.setProperty('--color-accent', value)
        // No sobreescribir --color-pink-hot con accent (oscuro)
        // root.style.setProperty('--color-pink-hot', value)
        root.style.setProperty('--color-portfolio', value)
      }
    })
  }, [themeValues])

  return <>{children}</>
}
