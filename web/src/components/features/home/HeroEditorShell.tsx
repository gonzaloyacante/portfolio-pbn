'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeroEditorShellProps {
  settings: HomeSettingsData | null
  children: ReactNode
  className?: string
}

function toBackgroundUrl(url?: string | null) {
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

/**
 * Shell que envuelve al HeroContent en el editor para replicar el backdrop.
 * Solo se usa en el editor (la pública usa HomePage.tsx).
 */
export function HeroEditorShell({ settings, children, className }: HeroEditorShellProps) {
  // Backdrop: SOLO campos del backdrop. La imagen destacada es OTRA cosa.
  const desktopBackgroundUrl =
    settings?.heroBackdropUrl || settings?.heroBackdropPosterUrl || undefined

  const homeBackgroundStyle = {
    '--public-home-background-image': toBackgroundUrl(desktopBackgroundUrl),
    '--public-home-background-position': settings?.heroBackdropObjectPosition || 'center',
  } as React.CSSProperties

  return (
    <div
      className={cn(
        'public-home-page relative isolate h-full w-full transition-colors duration-500',
        className
      )}
      style={homeBackgroundStyle}
    >
      <div
        aria-hidden
        className="public-home-page-background pointer-events-none absolute inset-0"
      />
      {children}
    </div>
  )
}
