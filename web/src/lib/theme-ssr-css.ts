import { DEFAULT_CSS_VARIABLES } from '@/lib/design-tokens'

/** Une BD + defaults (evita huecos si falta clave o falla lectura). */
function mergeThemeValues(themeValues: Record<string, string>): Record<string, string> {
  return { ...DEFAULT_CSS_VARIABLES, ...themeValues }
}

/** Evita cortar `</style>` y neutraliza saltos de línea en valores CSS. */
function escapeCssCustomPropertyValue(value: string): string {
  return value
    .replace(/\r/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/</g, '\\3c ')
    .replace(/>/g, '\\3e ')
    .replace(/\n/g, '\\a ')
}

function declBlock(entries: ReadonlyArray<readonly [string, string]>): string {
  return entries.map(([k, v]) => `${k}:${escapeCssCustomPropertyValue(v)}`).join('')
}

/**
 * Hoja mínima sin @layer: gana a `:root` / `.dark` de `@layer base` en globals.css.
 * Light en `:root`; dark solo cuando `html` tiene clase `.dark` (next-themes).
 */
export function buildThemeInlineStylesheet(themeValues: Record<string, string>): string {
  const t = mergeThemeValues(themeValues)

  const lightSemantic: Array<[string, string]> = [
    ['--primary', t['--primary']!],
    ['--secondary', t['--secondary']!],
    ['--accent', t['--accent']!],
    ['--background', t['--background']!],
    ['--foreground', t['--foreground']!],
    ['--card', t['--card-bg']!],
    ['--card-bg', t['--card-bg']!],
    /* Encadenan al texto/fondo del tema CMS para no quedar huérfanos respecto a globals */
    ['--card-foreground', 'var(--foreground)'],
    ['--popover', 'var(--card-bg)'],
    ['--popover-foreground', 'var(--foreground)'],
    ['--muted', 'color-mix(in srgb, var(--foreground) 6%, var(--background))'],
    ['--muted-foreground', 'color-mix(in srgb, var(--foreground) 52%, var(--background))'],
    ['--border', 'color-mix(in srgb, var(--foreground) 14%, var(--background))'],
    ['--input', 'color-mix(in srgb, var(--foreground) 14%, var(--background))'],
    ['--accent-foreground', 'var(--primary)'],
    ['--secondary-foreground', 'var(--primary)'],
    ['--primary-foreground', 'var(--secondary)'],
  ]

  const darkSemantic: Array<[string, string]> = [
    ['--primary', t['--dark-primary']!],
    ['--secondary', t['--dark-secondary']!],
    ['--accent', t['--dark-accent']!],
    ['--background', t['--dark-background']!],
    ['--foreground', t['--dark-foreground']!],
    ['--card', t['--dark-card-bg']!],
    ['--card-bg', t['--dark-card-bg']!],
    ['--card-foreground', 'var(--foreground)'],
    ['--popover', 'var(--card-bg)'],
    ['--popover-foreground', 'var(--foreground)'],
    ['--muted', 'color-mix(in srgb, var(--foreground) 8%, var(--background))'],
    ['--muted-foreground', 'color-mix(in srgb, var(--foreground) 55%, var(--background))'],
    ['--border', 'color-mix(in srgb, var(--foreground) 18%, var(--background))'],
    ['--input', 'color-mix(in srgb, var(--foreground) 18%, var(--background))'],
    ['--accent-foreground', 'var(--primary)'],
    ['--secondary-foreground', 'var(--primary)'],
    ['--primary-foreground', 'var(--secondary)'],
  ]

  const shared: Array<[string, string]> = [
    ['--font-heading', t['--font-heading']!],
    ['--font-script', t['--font-script']!],
    ['--font-body', t['--font-body']!],
    ['--font-brand', t['--font-brand'] ?? 'inherit'],
    ['--font-portfolio', t['--font-portfolio'] ?? 'inherit'],
    ['--font-signature', t['--font-signature'] ?? 'inherit'],
    ['--font-heading-size', t['--font-heading-size']!],
    ['--font-script-size', t['--font-script-size']!],
    ['--font-body-size', t['--font-body-size']!],
    ['--font-brand-size', t['--font-brand-size'] ?? DEFAULT_CSS_VARIABLES['--font-brand-size']!],
    [
      '--font-portfolio-size',
      t['--font-portfolio-size'] ?? DEFAULT_CSS_VARIABLES['--font-portfolio-size']!,
    ],
    [
      '--font-signature-size',
      t['--font-signature-size'] ?? DEFAULT_CSS_VARIABLES['--font-signature-size']!,
    ],
    ['--radius', t['--radius']!],
    /* Tailwind `rounded-theme` — mismo valor px que CMS (--radius) */
    ['--layout-border-radius', t['--radius']!],
  ]

  return `:root{${declBlock([...lightSemantic, ...shared])}}.dark{${declBlock(darkSemantic)}}`
}

/**
 * Hoja inline para overrides de --public-* leídos de `theme_color_overrides`.
 * Sólo emite las keys con valor non-empty; el resto hereda del public-fixed-theme.css.
 */
export function buildPublicColorInlineStylesheet(
  overrides: Record<string, { light: string; dark: string }>
): string {
  const lightEntries = Object.entries(overrides).filter(([, v]) => v.light)
  const darkEntries = Object.entries(overrides).filter(([, v]) => v.dark)
  if (lightEntries.length === 0 && darkEntries.length === 0) return ''

  const lightDecls = lightEntries
    .map(([k, v]) => `--public-${k}:${escapeCssCustomPropertyValue(v.light)}`)
    .join('')
  const darkDecls = darkEntries
    .map(([k, v]) => `--public-${k}:${escapeCssCustomPropertyValue(v.dark)}`)
    .join('')

  let css = ''
  if (lightDecls) css += `.public-fixed-theme{${lightDecls}}`
  if (darkDecls) css += `.dark .public-fixed-theme{${darkDecls}}`
  return css
}
