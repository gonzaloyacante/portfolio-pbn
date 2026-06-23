'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import BackdropMedia from './BackdropMedia'

interface HeroEditorShellProps {
  settings: HomeSettingsData | null
  children: ReactNode
  className?: string
}

/**
 * Shell que envuelve al HeroContent en el editor para replicar el backdrop.
 * Solo se usa en el editor (la pública usa HomePage.tsx).
 */
export function HeroEditorShell({ settings, children, className }: HeroEditorShellProps) {
  return (
    <div
      className={cn(
        'public-home-page relative isolate h-full w-full transition-colors duration-500',
        className
      )}
    >
      <BackdropMedia
        settings={settings}
        className="public-home-page-background pointer-events-none absolute inset-0"
      />
      {children}
    </div>
  )
}
