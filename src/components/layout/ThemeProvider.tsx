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

    // Helper to set variable
    const setVar = (key: string, value: string) => {
      root.style.setProperty(key, value)
    }

    // Light theme colors
    if (themeValues['primary-color']) setVar('--primary', themeValues['primary-color'])
    if (themeValues['secondary-color']) setVar('--secondary', themeValues['secondary-color'])
    if (themeValues['accent-color']) setVar('--accent', themeValues['accent-color'])
    if (themeValues['background-color']) setVar('--background', themeValues['background-color'])
    if (themeValues['text-color']) setVar('--foreground', themeValues['text-color'])
    if (themeValues['card-bg-color']) setVar('--card', themeValues['card-bg-color'])

    // Dark theme colors
    if (themeValues['dark-primary-color']) {
      setVar('--dark-primary', themeValues['dark-primary-color'])
    }
    if (themeValues['dark-secondary-color']) {
      setVar('--dark-secondary', themeValues['dark-secondary-color'])
    }
    if (themeValues['dark-accent-color']) {
      setVar('--dark-accent', themeValues['dark-accent-color'])
    }
    if (themeValues['dark-background-color']) {
      setVar('--dark-background', themeValues['dark-background-color'])
    }
    if (themeValues['dark-text-color']) {
      setVar('--dark-foreground', themeValues['dark-text-color'])
    }
    if (themeValues['dark-card-bg-color']) {
      setVar('--dark-card', themeValues['dark-card-bg-color'])
    }

    // Fonts & Layout (Universal)
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
