'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import Image from 'next/image'

import type { HomeSettingsData } from '@/actions/settings/home'
import {
  buildHeroBackdropTint,
  buildHeroScrimBackground,
  isHeroBackdropVideoUrl,
} from '@/lib/hero-backdrop-styles'
import { cn } from '@/lib/utils'
import { IMAGE_SIZES } from '@/config/image-sizes'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface HeroImmersiveBackdropProps {
  settings: Partial<HomeSettingsData>
  isMobile: boolean
}

/**
 * Capa de fondo detrás del contenido del hero: imagen/GIF (Next Image) o vídeo nativo (Cloudinary).
 * Sin interactividad por puntero — animación viene del asset (vídeo/GIF).
 */
export function HeroImmersiveBackdrop({ settings, isMobile }: HeroImmersiveBackdropProps) {
  const { resolvedTheme } = useNextTheme()
  const videoRef = useRef<HTMLVideoElement>(null)

  const prefersDark = resolvedTheme === 'dark'

  const rawUrl = (isMobile && settings.heroBackdropMobileUrl) || settings.heroBackdropUrl || ''
  const mainUrl = settings.heroMainImageUrl || ''
  /** Prioridad: medio de fondo explícito; si no hay, una sola vez la imagen destacada como ambiente. */
  const backdropUrl = rawUrl || mainUrl

  const kind = settings.heroBackdropMediaKind ?? 'auto'
  const isVideo = backdropUrl ? isHeroBackdropVideoUrl(backdropUrl, kind) : false

  const objectFit = settings.heroBackdropObjectFit === 'contain' ? 'contain' : 'cover'
  const objectPosition =
    (isMobile && settings.heroBackdropMobileObjectPosition) ||
    settings.heroBackdropObjectPosition ||
    'center'

  const extent =
    (isMobile && settings.heroScrimMobileExtentPercent != null
      ? settings.heroScrimMobileExtentPercent
      : settings.heroScrimExtentPercent) ?? 45
  const opacity =
    (isMobile && settings.heroScrimMobileOpacity != null
      ? settings.heroScrimMobileOpacity
      : settings.heroScrimOpacity) ?? 80
  const feather = settings.heroScrimFeatherPercent ?? 50
  const edge = settings.heroScrimEdge ?? 'left'

  const scrim = useMemo(
    () =>
      buildHeroScrimBackground({
        edge,
        extentPercent: extent,
        opacityPercent: opacity,
        featherPercent: feather,
        colorLightHex: settings.heroScrimColor,
        colorDarkHex: settings.heroScrimColorDark,
        prefersDark,
      }),
    [
      edge,
      extent,
      opacity,
      feather,
      settings.heroScrimColor,
      settings.heroScrimColorDark,
      prefersDark,
    ]
  )

  const tint = buildHeroBackdropTint(settings.heroBackdropTintOpacity ?? 0)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !isVideo) return
    if (prefersReducedMotion()) {
      void v.pause()
      return
    }
    void v.play().catch(() => {
      /* autoplay bloqueado: poster sigue visible */
    })
  }, [isVideo, backdropUrl])

  if (!backdropUrl) return null

  const poster = settings.heroBackdropPosterUrl || undefined
  const loop = settings.heroBackdropLoop ?? true
  const muted = settings.heroBackdropMuted ?? true
  const playsInline = settings.heroBackdropPlaysInline ?? true

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-[-1] w-full max-w-full overflow-hidden supports-[width:1dvw]:w-[min(100dvw,100%)]'
      )}
      aria-hidden
    >
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            ref={videoRef}
            className={cn(
              'absolute inset-0 z-0 h-full w-full',
              objectFit === 'contain' ? 'object-contain' : 'object-cover'
            )}
            style={{ objectPosition }}
            src={backdropUrl}
            poster={poster}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload="metadata"
          />
        ) : (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes={IMAGE_SIZES.heroBackdrop}
            className={cn(
              'absolute inset-0 z-0 h-full w-full',
              objectFit === 'contain' ? 'object-contain' : 'object-cover'
            )}
            style={{ objectPosition }}
          />
        )}

        {tint ? <div className="absolute inset-0 z-[1]" style={{ backgroundColor: tint }} /> : null}

        {scrim ? (
          <div className="absolute inset-0 z-[2]" style={{ backgroundImage: scrim }} />
        ) : null}
      </div>
    </div>
  )
}
