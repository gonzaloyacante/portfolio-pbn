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

    // Helper to set variable with priority (important)
    const setVar = (key: string, value: string) => {
      root.style.setProperty(key, value, 'important')
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
    if (themeValues['heading-font-size'])
      setVar('--font-size-heading', `${themeValues['heading-font-size']}px`)

    if (themeValues['script-font']) setVar('--font-script', themeValues['script-font'])
    if (themeValues['script-font-size'])
      setVar('--font-size-script', `${themeValues['script-font-size']}px`)

    if (themeValues['body-font']) setVar('--font-body', themeValues['body-font'])
    if (themeValues['body-font-size'])
      setVar('--font-size-body', `${themeValues['body-font-size']}px`)

    if (themeValues['brand-font']) setVar('--font-brand', themeValues['brand-font'])
    if (themeValues['brand-font-size'])
      setVar('--font-size-brand', `${themeValues['brand-font-size']}px`)

    if (themeValues['portfolio-font']) setVar('--font-portfolio', themeValues['portfolio-font'])
    if (themeValues['portfolio-font-size'])
      setVar('--font-size-portfolio', `${themeValues['portfolio-font-size']}px`)

    if (themeValues['signature-font']) setVar('--font-signature', themeValues['signature-font'])
    if (themeValues['signature-font-size'])
      setVar('--font-size-signature', `${themeValues['signature-font-size']}px`)

    if (themeValues['border-radius']) setVar('--radius', `${themeValues['border-radius']}px`)
  }, [themeValues, resolvedTheme])

  return <>{children}</>
}
