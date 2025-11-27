'use client'

import { useEffect } from 'react'
import { getSiteConfig } from '@/actions/settings.actions'

interface ThemeProviderProps {
  children: React.ReactNode
  initialConfig?: {
    bgColor: string
    primaryColor: string
    accentColor: string
  } | null
}

export default function ThemeProvider({ children, initialConfig }: ThemeProviderProps) {
  useEffect(() => {
    const applyTheme = (config: { bgColor: string; primaryColor: string; accentColor: string }) => {
      const body = document.body
      if (config.bgColor) body.style.setProperty('--color-bg', config.bgColor)
      if (config.primaryColor) body.style.setProperty('--color-primary', config.primaryColor)
      if (config.accentColor) body.style.setProperty('--color-accent', config.accentColor)
    }

    // Apply initial config if available
    if (initialConfig) {
      applyTheme(initialConfig)
    }

    // Fetch latest config on mount as requested
    const fetchConfig = async () => {
      try {
        const config = await getSiteConfig()
        if (config) {
          applyTheme(config)
        }
      } catch (error) {
        console.error('Failed to load theme config:', error)
      }
    }

    fetchConfig()
  }, [initialConfig])

  return <>{children}</>
}
