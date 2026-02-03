'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  themeValues?: Record<string, string>
}

export default function ThemeProvider({ children, themeValues }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!themeValues) return

    const root = document.documentElement
    const isDark = resolvedTheme === 'dark'

    // Helper to set variable
    const setVar = (key: string, value: string) => {
      root.style.setProperty(key, value)
    }

    // Dynamic Color Injection based on Theme Mode
    if (isDark) {
      // Dark Mode Mapping
      if (themeValues['dark-primary-color']) setVar('--primary', themeValues['dark-primary-color'])
      if (themeValues['dark-secondary-color'])
        setVar('--secondary', themeValues['dark-secondary-color'])
      if (themeValues['dark-accent-color']) setVar('--accent', themeValues['dark-accent-color'])
      if (themeValues['dark-background-color'])
        setVar('--background', themeValues['dark-background-color'])
      if (themeValues['dark-text-color']) setVar('--foreground', themeValues['dark-text-color'])
      if (themeValues['dark-card-bg-color']) setVar('--card', themeValues['dark-card-bg-color'])
      // Border logic specifically for dark mode if needed, usually same color as border/input
      // We can map border to a dimmer version of foreground or specific color if we had it
      // For now, let's ensure border contrast is okay.
    } else {
      // Light Mode Mapping
      if (themeValues['primary-color']) setVar('--primary', themeValues['primary-color'])
      if (themeValues['secondary-color']) setVar('--secondary', themeValues['secondary-color'])
      if (themeValues['accent-color']) setVar('--accent', themeValues['accent-color'])
      if (themeValues['background-color']) setVar('--background', themeValues['background-color'])
      if (themeValues['text-color']) setVar('--foreground', themeValues['text-color'])
      if (themeValues['card-bg-color']) setVar('--card', themeValues['card-bg-color'])
    }

    // Fonts & Layout (Universal - Always apply)
    if (themeValues['heading-font']) setVar('--font-heading', themeValues['heading-font'])
    if (themeValues['script-font']) setVar('--font-script', themeValues['script-font'])
    if (themeValues['body-font']) setVar('--font-body', themeValues['body-font'])
    if (themeValues['brand-font']) setVar('--font-brand', themeValues['brand-font'])
    if (themeValues['portfolio-font']) setVar('--font-portfolio', themeValues['portfolio-font'])
    if (themeValues['signature-font']) setVar('--font-signature', themeValues['signature-font'])

    if (themeValues['border-radius']) setVar('--radius', `${themeValues['border-radius']}px`)
  }, [themeValues, resolvedTheme])

  return <>{children}</>
}
