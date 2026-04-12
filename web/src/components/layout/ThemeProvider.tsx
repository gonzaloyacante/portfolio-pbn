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

    const set = (cssVar: string, value: string | undefined) => {
      if (value) root.style.setProperty(cssVar, value)
    }

    // Colors — select light or dark variant based on current mode
    set('--primary', isDark ? themeValues['--dark-primary'] : themeValues['--primary'])
    set('--secondary', isDark ? themeValues['--dark-secondary'] : themeValues['--secondary'])
    set('--accent', isDark ? themeValues['--dark-accent'] : themeValues['--accent'])
    set('--background', isDark ? themeValues['--dark-background'] : themeValues['--background'])
    set('--foreground', isDark ? themeValues['--dark-foreground'] : themeValues['--foreground'])
    set('--card', isDark ? themeValues['--dark-card-bg'] : themeValues['--card-bg'])

    // Typography (universal — same for both modes)
    set('--font-heading', themeValues['--font-heading'])
    set('--font-script', themeValues['--font-script'])
    set('--font-body', themeValues['--font-body'])
    set('--font-brand', themeValues['--font-brand'])
    set('--font-portfolio', themeValues['--font-portfolio'])
    set('--font-signature', themeValues['--font-signature'])

    // Font sizes
    set('--font-heading-size', themeValues['--font-heading-size'])
    set('--font-script-size', themeValues['--font-script-size'])
    set('--font-body-size', themeValues['--font-body-size'])

    // Border radius
    set('--radius', themeValues['--radius'])
  }, [themeValues, resolvedTheme])

  return <>{children}</>
}
