import { RESET_THEME_DEFAULTS } from '@/lib/design-tokens'

/**
 * Valores iniciales del tema — mismos colores/tipografía base que `RESET_THEME_DEFAULTS`
 * / BRAND en design-tokens. `borderRadius` 40px alinea con cards públicas (rounded-[2.5rem]).
 */
export const themeSettings = {
  key: 'singleton' as const,
  ...RESET_THEME_DEFAULTS,
  borderRadius: 40,
  headingFontUrl: null as string | null,
  scriptFontUrl: null as string | null,
  bodyFontUrl: null as string | null,
  brandFont: 'Saira Extra Condensed',
  brandFontUrl: null as string | null,
  brandFontSize: 112,
  portfolioFont: 'Saira Extra Condensed',
  portfolioFontUrl: null as string | null,
  portfolioFontSize: 96,
  signatureFont: 'Dawning of a New Day',
  signatureFontUrl: null as string | null,
  signatureFontSize: 36,
  isActive: true,
}
