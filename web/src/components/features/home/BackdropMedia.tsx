import type { CSSProperties } from 'react'
import type { HomeSettingsData } from '@/actions/settings/home'
import { cn } from '@/lib/utils'

interface BackdropMediaProps {
  settings: HomeSettingsData | null
  className?: string
}

/**
 * Detecta si una URL apunta a un vídeo basándose en la extensión del archivo o
 * el path de Cloudinary (`/video/upload/`).
 */
function isLikelyVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || /\/video\/upload\//.test(url)
}

/**
 * Renderiza el fondo del hero:
 * - Si `heroImmersiveEnabled === false` → no renderiza nada
 * - Si la URL es un vídeo (según `heroBackdropMediaKind` o auto-detección) → `<video>`
 * - Si es imagen / GIF → `<div>` con `background-image`
 *
 * Antes los atributos de video (`loop`, `muted`, `playsInline`, `heroBackdropObjectFit`,
 * `heroBackdropMediaKind`) estaban en form/schema/DB pero ningún render los consumía.
 * Ahora todos son funcionales.
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

  const isVideo = kind === 'video' || (kind === 'auto' && isLikelyVideoUrl(url))

  if (isVideo) {
    return (
      <video
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

  // Imagen o GIF → background-image
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
