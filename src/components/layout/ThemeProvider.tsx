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

    // Colors are now handled by CSS variables in globals.css to ensure consistency
    // Mapping DB values to legacy variables is disabled to prevent style conflicts
    /*
    if (themeValues['primary-color']) setVar('--primary-light', themeValues['primary-color'])
    ...
    */

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
