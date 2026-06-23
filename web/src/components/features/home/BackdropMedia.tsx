import type { CSSProperties } from 'react'
import type { HomeSettingsData } from '@/actions/settings/home'
import { isHeroBackdropVideoUrl } from '@/lib/hero-backdrop-styles'
import { cn } from '@/lib/utils'

interface BackdropMediaProps {
  settings: HomeSettingsData | null
  className?: string
}

/**
 * Renderiza el fondo del hero:
 * - Si `heroImmersiveEnabled === false` → no renderiza nada
 * - Si la URL es un vídeo (según `heroBackdropMediaKind` o auto-detección) → `<video>`
 * - Si es imagen / GIF → `<div>` con `background-image`
 *
 * El `key={url}` fuerza remount cuando cambia la URL — sin esto el browser
 * puede quedarse con el video anterior en cache y no reproducir el nuevo.
 */
function BackdropMedia({ settings, className }: BackdropMediaProps) {
  const immersive = settings?.heroImmersiveEnabled ?? true
  if (!immersive) return null

  const url = settings?.heroBackdropUrl ?? settings?.heroBackdropPosterUrl ?? null
  if (!url) return null

  const kind = settings?.heroBackdropMediaKind ?? 'auto'
  const fit = settings?.heroBackdropObjectFit ?? 'cover'
  const position = settings?.heroBackdropObjectPosition ?? 'center'
  const loop = settings?.heroBackdropLoop ?? true
  const muted = settings?.heroBackdropMuted ?? true
  const inline = settings?.heroBackdropPlaysInline ?? true
  const poster = settings?.heroBackdropPosterUrl ?? null

  const isVideo = isHeroBackdropVideoUrl(url, kind)

  if (isVideo) {
    return (
      <video
        key={url}
        className={className}
        style={
          {
            objectFit: fit === 'contain' ? 'contain' : 'cover',
            objectPosition: position,
          } as CSSProperties
        }
        src={url}
        poster={poster ?? undefined}
        autoPlay
        loop={loop}
        muted={muted}
        playsInline={inline}
        aria-hidden
      />
    )
  }

  return (
    <div
      aria-hidden
      className={cn('bg-no-repeat', className)}
      style={{
        backgroundImage: `url("${url.replace(/"/g, '\\"')}")`,
        backgroundSize: fit === 'contain' ? 'contain' : 'cover',
        backgroundPosition: position,
      }}
    />
  )
}

export default BackdropMedia
