"use client"

import { createContext, useContext, ReactNode } from "react"
import { useDesignSettings } from "@/hooks/use-design-settings"

interface DesignContextValue {
  settings: any
  loading: boolean
  refresh: () => void
}

const DesignContext = createContext<DesignContextValue | undefined>(undefined)

export function DesignProvider({ children }: { children: ReactNode }) {
  const designSettings = useDesignSettings()

  return (
    <DesignContext.Provider value={designSettings}>
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (!context) {
    throw new Error("useDesign must be used within DesignProvider")
  }
  return context
}
