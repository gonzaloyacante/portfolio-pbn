/**
 * DESIGN TOKENS — Única Fuente de Verdad para colores del sistema.
 *
 * Usado por: theme.ts (defaults/fallbacks/reset), email-templates.ts,
 * y cualquier lugar donde se necesite un color del brand programáticamente.
 *
 * ⚠️ REGLA: únicamente este archivo puede definir colores HEX del brand.
 * Los componentes deben usar variables CSS (var(--primary)) o clases Tailwind.
 */

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const BRAND = {
  // Light mode
  primary: '#6c0a0a', // Wine (brand principal)
  secondary: '#fce7f3', // Light pink
  accent: '#fff1f9', // Soft pink accent
  background: '#fff8fc', // Off-white pink
  foreground: '#1a050a', // Near-black wine
  card: '#ffffff', // Pure white

  // Dark mode
  darkPrimary: '#fb7185', // Rose-400 (más visible en dark)
  darkSecondary: '#881337', // Deep rose
  darkAccent: '#2a1015', // Very dark wine
  darkBackground: '#0f0505', // Near-black
  darkForeground: '#fafafa', // Near-white
  darkCard: '#1c0a0f', // Dark card

  /** Punto intermedio rampa clusters mapa analytics (MapLibre, basemap oscuro CARTO). */
  mapClusterMid: '#fda4af',

  // Fallbacks genéricos (usados cuando no hay tema guardado en DB)
  fallbackLight: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#cccccc',
    background: '#ffffff',
    foreground: '#000000',
    card: '#ffffff',
  },
  fallbackDark: {
    primary: '#ffffff',
    secondary: '#000000',
    accent: '#333333',
    background: '#000000',
    foreground: '#ffffff',
    card: '#000000',
  },
} as const

// ─── Semantic / Status Colors ─────────────────────────────────────────────────
export const STATUS_COLORS = {
  success: '#059669', // Emerald-600
  warning: '#d97706', // Amber-600
  danger: '#dc2626', // Red-600
  info: '#2563eb', // Blue-600
} as const

// ─── Layout (tema CMS) ───────────────────────────────────────────────────────
/** Radio por defecto — igual que Prisma `ThemeSettings.borderRadius` @default y seed `theme.ts`. */
export const THEME_DEFAULT_BORDER_RADIUS = 40 as const

// ─── Typography Defaults ──────────────────────────────────────────────────────
export const TYPOGRAPHY_DEFAULTS = {
  headingFont: 'Poppins',
  headingFontSize: 32,
  scriptFont: 'Great Vibes',
  scriptFontSize: 24,
  bodyFont: 'Open Sans',
  bodyFontSize: 16,
  brandFont: 'Saira Extra Condensed',
  brandFontSize: 112,
  portfolioFont: 'Saira Extra Condensed',
  portfolioFontSize: 96,
  signatureFont: 'Dawning of a New Day',
  signatureFontSize: 36,
} as const

// ─── Default Theme (defaults para `getThemeValues` sin DB) ───────────────────
export const DEFAULT_CSS_VARIABLES: Record<string, string> = {
  '--primary': BRAND.primary,
  '--secondary': BRAND.secondary,
  '--accent': BRAND.accent,
  '--background': BRAND.background,
  '--foreground': BRAND.foreground,
  '--card-bg': BRAND.card,

  '--dark-primary': BRAND.darkPrimary,
  '--dark-secondary': BRAND.darkSecondary,
  '--dark-accent': BRAND.darkAccent,
  '--dark-background': BRAND.darkBackground,
  '--dark-foreground': BRAND.darkForeground,
  '--dark-card-bg': BRAND.darkCard,

  '--font-heading': `"${TYPOGRAPHY_DEFAULTS.headingFont}", sans-serif`,
  '--font-heading-size': `${TYPOGRAPHY_DEFAULTS.headingFontSize}px`,
  '--font-script': `"${TYPOGRAPHY_DEFAULTS.scriptFont}", cursive`,
  '--font-script-size': `${TYPOGRAPHY_DEFAULTS.scriptFontSize}px`,
  '--font-body': `"${TYPOGRAPHY_DEFAULTS.bodyFont}", sans-serif`,
  '--font-body-size': `${TYPOGRAPHY_DEFAULTS.bodyFontSize}px`,
  '--font-brand': `"${TYPOGRAPHY_DEFAULTS.brandFont}", sans-serif`,
  '--font-brand-size': `${TYPOGRAPHY_DEFAULTS.brandFontSize}px`,
  '--font-portfolio': `"${TYPOGRAPHY_DEFAULTS.portfolioFont}", sans-serif`,
  '--font-portfolio-size': `${TYPOGRAPHY_DEFAULTS.portfolioFontSize}px`,
  '--font-signature': `"${TYPOGRAPHY_DEFAULTS.signatureFont}", cursive`,
  '--font-signature-size': `${TYPOGRAPHY_DEFAULTS.signatureFontSize}px`,

  '--radius': `${THEME_DEFAULT_BORDER_RADIUS}px`,
}

// ─── Reset Theme Defaults (para resetThemeToDefaults) ────────────────────────
export const RESET_THEME_DEFAULTS = {
  // Light
  primaryColor: BRAND.primary,
  secondaryColor: BRAND.secondary,
  accentColor: BRAND.accent,
  backgroundColor: BRAND.background,
  textColor: BRAND.foreground,
  cardBgColor: BRAND.card,
  // Dark
  darkPrimaryColor: BRAND.darkPrimary,
  darkSecondaryColor: BRAND.darkSecondary,
  darkAccentColor: BRAND.darkAccent,
  darkBackgroundColor: BRAND.darkBackground,
  darkTextColor: BRAND.darkForeground,
  darkCardBgColor: BRAND.darkCard,
  // Typography
  headingFont: TYPOGRAPHY_DEFAULTS.headingFont,
  headingFontSize: TYPOGRAPHY_DEFAULTS.headingFontSize,
  scriptFont: TYPOGRAPHY_DEFAULTS.scriptFont,
  scriptFontSize: TYPOGRAPHY_DEFAULTS.scriptFontSize,
  bodyFont: TYPOGRAPHY_DEFAULTS.bodyFont,
  bodyFontSize: TYPOGRAPHY_DEFAULTS.bodyFontSize,
  brandFont: TYPOGRAPHY_DEFAULTS.brandFont,
  brandFontSize: TYPOGRAPHY_DEFAULTS.brandFontSize,
  portfolioFont: TYPOGRAPHY_DEFAULTS.portfolioFont,
  portfolioFontSize: TYPOGRAPHY_DEFAULTS.portfolioFontSize,
  signatureFont: TYPOGRAPHY_DEFAULTS.signatureFont,
  signatureFontSize: TYPOGRAPHY_DEFAULTS.signatureFontSize,
  borderRadius: THEME_DEFAULT_BORDER_RADIUS,
} as const

// ─── Neutral Gray Scale ───────────────────────────────────────────────────────
// Referencia Tailwind gray — usados en emails y UI neutros.
export const NEUTRAL = {
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
} as const

// ─── Email Colors (inline styles para email clients) ─────────────────────────
// Los emails requieren inline styles — los colores deben venir aquí, no hardcodeados.
export const EMAIL_BRAND_COLORS = {
  primary: BRAND.primary,
  secondary: NEUTRAL.black, // negro para email (contraste máximo)
  success: STATUS_COLORS.success,
  warning: STATUS_COLORS.warning,
  danger: STATUS_COLORS.danger,
} as const

// ─── Email Neutral Colors (para EMAIL_STYLES backgrounds, borders, text) ─────
export const EMAIL_NEUTRAL_COLORS = {
  bodyBg: NEUTRAL.gray50, // #f9fafb
  containerBg: NEUTRAL.white, // #ffffff
  border: NEUTRAL.gray200, // #e5e7eb
  headingText: NEUTRAL.gray900, // #111827
  subheadText: NEUTRAL.gray500, // #6b7280
  bodyText: NEUTRAL.gray700, // #374151
  boxBg: NEUTRAL.gray100, // #f3f4f6
  footerText: NEUTRAL.gray400, // #9ca3af
  linkText: NEUTRAL.gray600, // #4b5563
  buttonText: NEUTRAL.white, // #ffffff
  warningBg: '#fef2f2', // Red-50
  warningText: '#991b1b', // Red-800
  warningBorder: '#fee2e2', // Red-100
} as const
