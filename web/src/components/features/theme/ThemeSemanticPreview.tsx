'use client'

import type { ThemeEditorData } from '@/lib/validations'
import { STATUS_COLORS } from '@/lib/design-tokens'

interface ThemeSemanticPreviewProps {
  values: ThemeEditorData
}

type PreviewMode = {
  label: string
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  card: string
  primaryForeground: string
}

function makeMode(values: ThemeEditorData, dark: boolean): PreviewMode {
  return dark
    ? {
        label: 'Modo oscuro',
        primary: values.darkPrimaryColor,
        secondary: values.darkSecondaryColor,
        accent: values.darkAccentColor,
        background: values.darkBackgroundColor,
        foreground: values.darkTextColor,
        card: values.darkCardBgColor,
        primaryForeground: values.darkBackgroundColor,
      }
    : {
        label: 'Modo claro',
        primary: values.primaryColor,
        secondary: values.secondaryColor,
        accent: values.accentColor,
        background: values.backgroundColor,
        foreground: values.textColor,
        card: values.cardBgColor,
        primaryForeground: values.cardBgColor,
      }
}

export function ThemeSemanticPreview({ values }: ThemeSemanticPreviewProps) {
  const light = makeMode(values, false)
  const dark = makeMode(values, true)

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Preview por capas</h3>
            <p className="text-muted-foreground text-xs">
              Muestra superficies reales: navegación, tarjetas, botones, formulario y tipografía.
            </p>
          </div>
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-semibold">
            Live
          </span>
        </div>
        <div className="space-y-4">
          <ModePreview mode={light} values={values} />
          <ModePreview mode={dark} values={values} />
        </div>
      </div>

      <div className="bg-muted/30 text-muted-foreground rounded-2xl border p-4 text-xs">
        Si algo no cambia acá cuando editás un token, hay bug de clase, token o seed. Ese caso va a
        la matriz “clase vs token vs DB”.
      </div>
    </div>
  )
}

function ModePreview({ mode, values }: { mode: PreviewMode; values: ThemeEditorData }) {
  const radius = `${Math.min(Math.max(values.borderRadius, 12), 48)}px`

  return (
    <section
      className="space-y-4 border p-4 shadow-sm"
      style={{
        backgroundColor: mode.background,
        color: mode.foreground,
        borderColor: colorMix(mode.foreground, mode.background, 18),
        borderRadius: radius,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h4
          className="text-sm font-bold"
          style={{ fontFamily: `"${values.headingFont}", sans-serif` }}
        >
          {mode.label}
        </h4>
        <TokenSwatches mode={mode} />
      </div>

      <LayerTitle title="Navegación" mode={mode} />
      <div className="flex flex-wrap gap-2">
        <NavPill label="Inicio" mode={mode} active />
        <NavPill label="Portfolio" mode={mode} />
        <NavPill label="Hover" mode={mode} hover />
      </div>

      <LayerTitle title="Superficie / tarjetas" mode={mode} />
      <div
        className="rounded-2xl border p-3"
        style={{
          backgroundColor: mode.card,
          borderColor: colorMix(mode.primary, mode.card, 30),
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: mode.accent, color: mode.primary }}
          >
            PB
          </div>
          <div className="min-w-0">
            <p
              className="font-semibold"
              style={{ fontFamily: `"${values.headingFont}", sans-serif` }}
            >
              Tarjeta pública
            </p>
            <p
              className="text-xs"
              style={{
                color: colorMix(mode.foreground, mode.background, 68),
                fontFamily: `"${values.bodyFont}", sans-serif`,
              }}
            >
              Usa card, texto y borde. No debería depender del color de navegación.
            </p>
          </div>
        </div>
      </div>

      <LayerTitle title="Botones y enlaces" mode={mode} />
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-3 py-2 text-xs font-bold"
          style={{ backgroundColor: mode.primary, color: mode.primaryForeground }}
        >
          Principal
        </span>
        <span
          className="rounded-full border px-3 py-2 text-xs font-bold"
          style={{ borderColor: mode.primary, color: mode.primary }}
        >
          Secundario
        </span>
        <span className="text-xs font-bold underline" style={{ color: mode.primary }}>
          Link de texto
        </span>
      </div>

      <LayerTitle title="Formulario" mode={mode} />
      <div
        className="rounded-xl border px-3 py-2 text-xs"
        style={{
          backgroundColor: mode.card,
          borderColor: colorMix(mode.primary, mode.background, 38),
          color: colorMix(mode.foreground, mode.background, 74),
          fontFamily: `"${values.bodyFont}", sans-serif`,
        }}
      >
        Campo formulario
      </div>

      <LayerTitle title="Tipografías" mode={mode} />
      <div>
        <p
          className="text-base font-bold"
          style={{ fontFamily: `"${values.headingFont}", sans-serif` }}
        >
          Títulos / Cuerpo / Marca
        </p>
        <p className="text-xs" style={{ fontFamily: `"${values.bodyFont}", sans-serif` }}>
          Texto de cuerpo para descripciones.
        </p>
        <p
          className="text-2xl"
          style={{ color: mode.primary, fontFamily: `"${values.scriptFont}", cursive` }}
        >
          Firma decorativa
        </p>
      </div>

      <LayerTitle title="Contraste WCAG" mode={mode} />
      <div className="flex flex-wrap gap-1.5">
        <ContrastBadge fg={mode.foreground} bg={mode.background} label="Texto/fondo" />
        <ContrastBadge fg={mode.primary} bg={mode.background} label="Primary/fondo" />
        <ContrastBadge fg={mode.primaryForeground} bg={mode.primary} label="Botón" />
      </div>
    </section>
  )
}

function LayerTitle({ title, mode }: { title: string; mode: PreviewMode }) {
  return (
    <p
      className="text-xs font-extrabold"
      style={{ color: colorMix(mode.foreground, mode.background, 76) }}
    >
      {title}
    </p>
  )
}

function NavPill({
  label,
  mode,
  active = false,
  hover = false,
}: {
  label: string
  mode: PreviewMode
  active?: boolean
  hover?: boolean
}) {
  const background = active ? mode.primary : hover ? mode.accent : mode.card
  const color = active ? mode.primaryForeground : mode.foreground

  return (
    <span
      className="rounded-full border px-3 py-2 text-xs font-bold"
      style={{
        backgroundColor: background,
        borderColor: colorMix(mode.primary, mode.background, 30),
        color,
      }}
    >
      {label}
    </span>
  )
}

function TokenSwatches({ mode }: { mode: PreviewMode }) {
  return (
    <div className="flex gap-1" aria-label={`Muestras ${mode.label}`}>
      {[mode.background, mode.card, mode.secondary, mode.accent, mode.primary].map((color, idx) => (
        <span
          // idx en la key porque varios swatches pueden compartir el mismo
          // color (background, card y secondary son #fff1f9 en light).
          key={`${mode.label}-${color}-${idx}`}
          className="h-4 w-4 rounded-full border"
          style={{
            backgroundColor: color,
            borderColor: colorMix(mode.foreground, mode.background, 20),
          }}
        />
      ))}
    </div>
  )
}

function colorMix(foreground: string, background: string, amount: number) {
  return `color-mix(in srgb, ${foreground} ${amount}%, ${background})`
}

// ── WCAG Contrast helpers ─────────────────────────────────────────────────────

function hexToLinear(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6})$/i)
  if (!m) return null
  const r = parseInt(m[1].slice(0, 2), 16) / 255
  const g = parseInt(m[1].slice(2, 4), 16) / 255
  const b = parseInt(m[1].slice(4, 6), 16) / 255
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return [toLinear(r), toLinear(g), toLinear(b)]
}

function relativeLuminance(hex: string): number {
  const ch = hexToLinear(hex)
  if (!ch) return 0
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1) + 0.05
  const l2 = relativeLuminance(hex2) + 0.05
  return l1 > l2 ? l1 / l2 : l2 / l1
}

type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

function ContrastBadge({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const ratio = contrastRatio(fg, bg)
  const level = wcagLevel(ratio)
  const colorMap: Record<WcagLevel, string> = {
    AAA: STATUS_COLORS.success,
    AA: STATUS_COLORS.info,
    'AA Large': STATUS_COLORS.warning,
    Fail: STATUS_COLORS.danger,
  }
  const bgMap: Record<WcagLevel, string> = {
    AAA: `color-mix(in srgb, ${STATUS_COLORS.success} 14%, transparent)`,
    AA: `color-mix(in srgb, ${STATUS_COLORS.info} 14%, transparent)`,
    'AA Large': `color-mix(in srgb, ${STATUS_COLORS.warning} 16%, transparent)`,
    Fail: `color-mix(in srgb, ${STATUS_COLORS.danger} 14%, transparent)`,
  }
  return (
    <span
      className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
      style={{
        color: colorMap[level],
        backgroundColor: bgMap[level],
        borderColor: colorMap[level],
      }}
      title={`${label}: ${ratio.toFixed(2)}:1`}
    >
      {level === 'Fail' ? '✕' : '✓'} {level}
      <span className="font-normal opacity-70">{ratio.toFixed(1)}:1</span>
      <span className="ml-0.5 font-normal opacity-60">{label}</span>
    </span>
  )
}
