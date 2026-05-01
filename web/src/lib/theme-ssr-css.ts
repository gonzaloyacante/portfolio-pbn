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
  ]

  const darkSemantic: Array<[string, string]> = [
    ['--primary', t['--dark-primary']!],
    ['--secondary', t['--dark-secondary']!],
    ['--accent', t['--dark-accent']!],
    ['--background', t['--dark-background']!],
    ['--foreground', t['--dark-foreground']!],
    ['--card', t['--dark-card-bg']!],
    ['--card-bg', t['--dark-card-bg']!],
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
  ]

  return `:root{${declBlock([...lightSemantic, ...shared])}}.dark{${declBlock(darkSemantic)}}`
}
