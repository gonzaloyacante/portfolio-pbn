'use client'

import type { ThemeEditorData } from '@/lib/validations'

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
      {[mode.background, mode.card, mode.secondary, mode.accent, mode.primary].map((color) => (
        <span
          key={`${mode.label}-${color}`}
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
