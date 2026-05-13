import { BRAND, DEFAULT_CSS_VARIABLES } from '@/lib/design-tokens'

/** Une BD + defaults (evita huecos si falta clave o falla lectura). */
function mergeThemeValues(themeValues: Record<string, string>): Record<string, string> {
  return { ...DEFAULT_CSS_VARIABLES, ...themeValues }
}

/**
 * Calcula la luminancia relativa de un color HEX (#RRGGBB) según WCAG 2.1.
 * Retorna un valor entre 0 (negro) y 1 (blanco).
 */
function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return 0
  const [r, g, b] = [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Elige el color de texto más legible (blanco u oscuro) para colocar sobre `primaryHex`.
 * Garantiza contraste WCAG AA (≥4.5:1) para texto sobre botones/badges primary.
 */
function pickPrimaryForeground(primaryHex: string): string {
  const L = relativeLuminance(primaryHex)
  // Contraste blanco vs color: (1.05) / (L + 0.05)
  // Contraste oscuro vs color: (L + 0.05) / (0.05)
  const contrastWhite = 1.05 / (L + 0.05)
  const contrastDark = (L + 0.05) / 0.05
  return contrastWhite >= contrastDark ? BRAND.card : BRAND.foreground
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
    ['--primary-foreground', pickPrimaryForeground(t['--primary']!)],
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
    ['--accent-foreground', 'var(--foreground)'],
    ['--secondary-foreground', BRAND.card],
    ['--primary-foreground', pickPrimaryForeground(t['--dark-primary']!)],
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
