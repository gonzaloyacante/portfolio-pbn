"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export function useDesignSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await apiClient.getDesignSettings()
      setSettings(data)
      applyDesignSettings(data)
    } catch (error) {
      console.error("Error loading design settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyDesignSettings = (settings: any) => {
    if (!settings) return

    const root = document.documentElement

    // Colores
    root.style.setProperty("--cms-primary-color", settings.primaryColor)
    root.style.setProperty("--cms-secondary-color", settings.secondaryColor)
    root.style.setProperty("--cms-background-color", settings.backgroundColor)
    root.style.setProperty("--cms-text-color", settings.textColor)
    root.style.setProperty("--cms-accent-color", settings.accentColor)

    // Tipografía
    root.style.setProperty("--cms-heading-font", settings.headingFont)
    root.style.setProperty("--cms-body-font", settings.bodyFont)
    root.style.setProperty("--cms-heading-size", settings.headingSize)
    root.style.setProperty("--cms-body-size", settings.bodySize)
    root.style.setProperty("--cms-line-height", settings.lineHeight)

    // Espaciados
    root.style.setProperty("--cms-container-max-width", settings.containerMaxWidth)
    root.style.setProperty("--cms-section-padding", settings.sectionPadding)
    root.style.setProperty("--cms-element-spacing", settings.elementSpacing)
    root.style.setProperty("--cms-border-radius", settings.borderRadius)

    // Efectos
    root.style.setProperty("--cms-box-shadow", settings.boxShadow)
    root.style.setProperty("--cms-hover-transform", settings.hoverTransform)
    root.style.setProperty("--cms-transition-speed", settings.transitionSpeed)
  }

  const refresh = () => {
    loadSettings()
  }

  return { settings, loading, refresh }
}
