'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Moon, Sun } from 'lucide-react'
import { BRAND, STATUS_COLORS } from '@/lib/design-tokens'
import { ROUTES } from '@/config/routes'

// ── WCAG contrast helpers ───────────────────────────────────────────────────

function hexToRgbNorm(hex: string): [number, number, number] {
  const n = hex.replace('#', '')
  const full =
    n.length === 3
      ? n
          .split('')
          .map((c) => c + c)
          .join('')
      : n
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ]
}

function relativeLuminance(hex: string): number {
  try {
    const [r, g, b] = hexToRgbNorm(hex)
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  } catch {
    return 0
  }
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1) + 0.05
  const l2 = relativeLuminance(hex2) + 0.05
  return l1 > l2 ? l1 / l2 : l2 / l1
}

function wcagLabel(ratio: number): { text: string; ok: boolean } {
  if (ratio >= 7) return { text: `AAA · ${ratio.toFixed(1)}:1`, ok: true }
  if (ratio >= 4.5) return { text: `AA · ${ratio.toFixed(1)}:1`, ok: true }
  if (ratio >= 3) return { text: `AA Large · ${ratio.toFixed(1)}:1`, ok: true }
  return { text: `Falla · ${ratio.toFixed(1)}:1`, ok: false }
}

// ── Shadow helper (lógica idéntica a AboutProfileImage) ─────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = hex.replace('#', '')
  const full =
    n.length === 3
      ? n
          .split('')
          .map((c) => c + c)
          .join('')
      : n
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function buildShadow(
  enabled: boolean,
  hex: string | null | undefined,
  opacity: number | null | undefined,
  blur: number | null | undefined,
  spread: number | null | undefined,
  ox: number | null | undefined,
  oy: number | null | undefined
): string {
  if (!enabled) return 'none'
  const alpha = (opacity ?? 35) / 100
  const safeHex = hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex) ? hex : BRAND.primary
  const { r, g, b } = hexToRgb(safeHex)
  return `${ox ?? 0}px ${oy ?? 8}px ${blur ?? 24}px ${spread ?? 0}px rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ── Clip paths (idéntica lógica a AboutBioSection) ──────────────────────────

const CLIP_PATHS: Record<string, string | undefined> = {
  ellipse: 'ellipse(50% 45% at 50% 50%)',
  circle: 'circle(48% at 50% 50%)',
  rounded: undefined,
  none: undefined,
}

// ── Component ────────────────────────────────────────────────────────────────

export interface AboutBioPreviewProps {
  bioTitle: string
  bioTitleFont?: string | null
  bioTitleFontUrl?: string | null
  bioTitleFontSize?: number | null
  bioTitleColor?: string | null
  bioTitleColorDark?: string | null
  profileImageUrl?: string | null
  profileImageShape?: string | null
  shadowEnabled?: boolean | null
  shadowColor?: string | null
  shadowOpacity?: number | null
  shadowBlur?: number | null
  shadowSpread?: number | null
  shadowOffsetX?: number | null
  shadowOffsetY?: number | null
  illustrationUrl?: string | null
  illustrationMaxPx?: number | null
}

export function AboutBioPreview({
  bioTitle,
  bioTitleFont,
  bioTitleFontUrl,
  bioTitleFontSize,
  bioTitleColor,
  bioTitleColorDark,
  profileImageUrl,
  profileImageShape,
  shadowEnabled,
  shadowColor,
  shadowOpacity,
  shadowBlur,
  shadowSpread,
  shadowOffsetX,
  shadowOffsetY,
  illustrationUrl,
  illustrationMaxPx,
}: AboutBioPreviewProps) {
  const [isDark, setIsDark] = useState(false)

  // Carga la tipografía elegida igual que lo hace AboutBioColumn
  const fontUrl = bioTitleFontUrl?.trim() || ''
  const fontName = bioTitleFont?.trim() || ''

  useEffect(() => {
    if (!fontUrl) return
    const alreadyLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (el) => el.getAttribute('href') === fontUrl
    )
    if (alreadyLoaded) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }, [fontUrl])

  // Colores base del modo seleccionado (BRAND defaults — mismos que usa la web pública)
  const bg = isDark ? BRAND.darkBackground : BRAND.background
  const fg = isDark ? BRAND.darkForeground : BRAND.foreground

  // Color del título (lógica idéntica a AboutBioColumn)
  const lightColor = bioTitleColor?.trim() || BRAND.primary
  const darkColor = bioTitleColorDark?.trim() || bioTitleColor?.trim() || BRAND.darkPrimary
  const titleColor = isDark ? darkColor : lightColor

  // Contraste WCAG: título sobre fondo de página
  const { text: wcagText, ok: wcagOk } = wcagLabel(contrastRatio(titleColor, bg))

  // Tipografía y tamaño (lógica idéntica a AboutBioColumn)
  const fontFamily =
    fontName.length > 0
      ? `"${fontName}", var(--font-script), cursive`
      : 'var(--font-script), cursive'
  const fontSize =
    bioTitleFontSize != null ? `${bioTitleFontSize}px` : 'clamp(1.75rem, 4vw, 2.25rem)'

  // Forma e imagen de perfil (lógica idéntica a AboutProfileImage)
  const shapeKey = profileImageShape ?? 'ellipse'
  const clipPath = CLIP_PATHS[shapeKey]
  const borderRadius = shapeKey === 'rounded' ? '2.5rem' : shapeKey === 'none' ? '0' : undefined
  const boxShadow = buildShadow(
    shadowEnabled ?? true,
    shadowColor,
    shadowOpacity,
    shadowBlur,
    shadowSpread,
    shadowOffsetX,
    shadowOffsetY
  )

  const illSize = illustrationMaxPx ?? 112

  return (
    <div className="space-y-2">
      {/* Encabezado del panel */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Vista previa — Sobre Mí</p>
          <p className="text-muted-foreground text-xs">Actualiza en tiempo real · sin guardar</p>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={ROUTES.public.about}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            title="Ver página en la web"
          >
            <ExternalLink className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setIsDark((d) => !d)}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>

      {/* Tarjeta de preview */}
      <div
        className="rounded-card overflow-hidden border p-4 shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: bg,
          color: fg,
          borderColor: `${fg}28`,
        }}
      >
        {/* Fila superior: título + ilustración */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            className="leading-tight"
            style={{
              fontFamily,
              fontSize,
              color: titleColor,
              maxWidth: '68%',
              margin: 0,
            }}
          >
            {bioTitle || 'Hola, soy Paola.'}
          </h2>

          {illustrationUrl && (
            <div
              className="shrink-0 overflow-hidden"
              style={{ width: Math.min(illSize, 80), height: Math.min(illSize, 80) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={illustrationUrl}
                alt="Ilustración decorativa"
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Foto de perfil + líneas de bio simuladas */}
        <div className="flex gap-4">
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              width: 88,
              height: 117,
              clipPath,
              borderRadius,
              boxShadow,
              backgroundColor: `${BRAND.primary}33`,
            }}
          >
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center text-center text-[10px] leading-tight font-medium"
                style={{ color: `${BRAND.primary}cc` }}
              >
                Foto
                <br />
                de perfil
              </div>
            )}
          </div>

          {/* Líneas de texto simuladas */}
          <div className="flex flex-1 flex-col justify-center gap-2 py-2">
            {[100, 88, 95, 75, 90].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full"
                style={{ width: `${w}%`, backgroundColor: `${fg}28` }}
              />
            ))}
          </div>
        </div>

        {/* Badge de contraste WCAG */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <span className="text-muted-foreground text-[10px]">Contraste título/fondo:</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: `${wcagOk ? STATUS_COLORS.success : STATUS_COLORS.danger}22`,
              color: wcagOk ? STATUS_COLORS.success : STATUS_COLORS.danger,
            }}
          >
            {wcagText}
          </span>
        </div>
      </div>
    </div>
  )
}
