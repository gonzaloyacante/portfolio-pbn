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

    // Map DB keys to CSS variables
    // Light Mode
    if (themeValues['primary-color']) setVar('--primary-light', themeValues['primary-color'])
    if (themeValues['secondary-color']) setVar('--secondary-light', themeValues['secondary-color'])
    if (themeValues['accent-color']) setVar('--accent-light', themeValues['accent-color'])
    if (themeValues['background-color']) setVar('--background-light', themeValues['background-color'])
    if (themeValues['text-color']) setVar('--text-light', themeValues['text-color'])
    if (themeValues['card-bg-color']) setVar('--card-bg-light', themeValues['card-bg-color'])

    // Dark Mode
    if (themeValues['dark-primary-color']) setVar('--primary-dark', themeValues['dark-primary-color'])
    if (themeValues['dark-secondary-color']) setVar('--secondary-dark', themeValues['dark-secondary-color'])
    if (themeValues['dark-accent-color']) setVar('--accent-dark', themeValues['dark-accent-color'])
    if (themeValues['dark-background-color']) setVar('--background-dark', themeValues['dark-background-color'])
    if (themeValues['dark-text-color']) setVar('--text-dark', themeValues['dark-text-color'])
    if (themeValues['dark-card-bg-color']) setVar('--card-bg-dark', themeValues['dark-card-bg-color'])

    // Fonts & Layout (Universal)
    if (themeValues['heading-font']) setVar('--font-heading', themeValues['heading-font'])
    if (themeValues['script-font']) setVar('--font-script', themeValues['script-font'])
    if (themeValues['body-font']) setVar('--font-body', themeValues['body-font'])
    if (themeValues['border-radius']) setVar('--radius', `${themeValues['border-radius']}px`)

  }, [themeValues, resolvedTheme])

  return <>{children}</>
}
