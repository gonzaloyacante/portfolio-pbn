import { describe, it, expect } from 'vitest'
import {
  BRAND,
  STATUS_COLORS,
  TYPOGRAPHY_DEFAULTS,
  THEME_DEFAULT_BORDER_RADIUS,
  DEFAULT_CSS_VARIABLES,
  RESET_THEME_DEFAULTS,
  NEUTRAL,
  EMAIL_BRAND_COLORS,
  EMAIL_NEUTRAL_COLORS,
} from '@/lib/design-tokens'
import { buildThemeInlineStylesheet } from '@/lib/theme-ssr-css'

describe('design-tokens', () => {
  describe('BRAND', () => {
    it('has correct light mode primary color', () => {
      expect(BRAND.primary).toBe('#6c0a0a')
    })

    it('has correct dark mode primary color', () => {
      expect(BRAND.darkPrimary).toBe('#ffaadd')
    })

    it('matches the approved public brand palette', () => {
      expect(BRAND.secondary).toBe('#ffaadd')
      expect(BRAND.background).toBe('#fff1f9')
      expect(BRAND.foreground).toBe('#000000')
      expect(BRAND.darkSecondary).toBe('#6c0a0a')
      expect(BRAND.darkBackground).toBe('#000000')
      expect(BRAND.darkForeground).toBe('#fff1f9')
    })

    it('has fallback light and dark objects', () => {
      expect(BRAND.fallbackLight).toBeDefined()
      expect(BRAND.fallbackDark).toBeDefined()
      expect(BRAND.fallbackLight.primary).toBeDefined()
      expect(BRAND.fallbackDark.primary).toBeDefined()
    })
  })

  describe('STATUS_COLORS', () => {
    it('has success, warning, danger, info colors', () => {
      expect(STATUS_COLORS.success).toBeDefined()
      expect(STATUS_COLORS.warning).toBeDefined()
      expect(STATUS_COLORS.danger).toBeDefined()
      expect(STATUS_COLORS.info).toBeDefined()
    })

    it('colors are valid hex strings', () => {
      const hexRegex = /^#[0-9a-fA-F]{6}$/
      Object.values(STATUS_COLORS).forEach((color) => {
        expect(color).toMatch(hexRegex)
      })
    })
  })

  describe('TYPOGRAPHY_DEFAULTS', () => {
    it('has required font properties', () => {
      expect(TYPOGRAPHY_DEFAULTS.headingFont).toBe('Poppins')
      expect(TYPOGRAPHY_DEFAULTS.bodyFont).toBe('Open Sans')
      expect(TYPOGRAPHY_DEFAULTS.scriptFont).toBe('Great Vibes')
    })

    it('has numeric font sizes', () => {
      expect(typeof TYPOGRAPHY_DEFAULTS.headingFontSize).toBe('number')
      expect(typeof TYPOGRAPHY_DEFAULTS.bodyFontSize).toBe('number')
      expect(typeof TYPOGRAPHY_DEFAULTS.scriptFontSize).toBe('number')
    })
  })

  describe('DEFAULT_CSS_VARIABLES', () => {
    it('has --primary variable', () => {
      expect(DEFAULT_CSS_VARIABLES['--primary']).toBeDefined()
    })

    it('has font variables', () => {
      expect(DEFAULT_CSS_VARIABLES['--font-heading']).toBeDefined()
      expect(DEFAULT_CSS_VARIABLES['--font-body']).toBeDefined()
    })

    it('has brand font variables so clean seeds do not inherit random fonts', () => {
      expect(DEFAULT_CSS_VARIABLES['--font-brand']).toContain('Saira Extra Condensed')
      expect(DEFAULT_CSS_VARIABLES['--font-portfolio']).toContain('Saira Extra Condensed')
      expect(DEFAULT_CSS_VARIABLES['--font-signature']).toContain('Dawning of a New Day')
    })

    it('has --radius variable aligned with THEME_DEFAULT_BORDER_RADIUS', () => {
      expect(DEFAULT_CSS_VARIABLES['--radius']).toBe(`${THEME_DEFAULT_BORDER_RADIUS}px`)
    })
  })

  describe('RESET_THEME_DEFAULTS', () => {
    it('has light and dark color properties', () => {
      expect(RESET_THEME_DEFAULTS.primaryColor).toBe(BRAND.primary)
      expect(RESET_THEME_DEFAULTS.darkPrimaryColor).toBe(BRAND.darkPrimary)
    })

    it('has typography properties', () => {
      expect(RESET_THEME_DEFAULTS.headingFont).toBe(TYPOGRAPHY_DEFAULTS.headingFont)
      expect(RESET_THEME_DEFAULTS.bodyFont).toBe(TYPOGRAPHY_DEFAULTS.bodyFont)
    })

    it('resets brand typography too', () => {
      expect(RESET_THEME_DEFAULTS.brandFont).toBe(TYPOGRAPHY_DEFAULTS.brandFont)
      expect(RESET_THEME_DEFAULTS.portfolioFont).toBe(TYPOGRAPHY_DEFAULTS.portfolioFont)
      expect(RESET_THEME_DEFAULTS.signatureFont).toBe(TYPOGRAPHY_DEFAULTS.signatureFont)
    })

    it('uses THEME_DEFAULT_BORDER_RADIUS for layout reset', () => {
      expect(RESET_THEME_DEFAULTS.borderRadius).toBe(THEME_DEFAULT_BORDER_RADIUS)
      expect(THEME_DEFAULT_BORDER_RADIUS).toBe(40)
    })
  })

  describe('buildThemeInlineStylesheet', () => {
    it('uses secondary as text over primary surfaces', () => {
      const css = buildThemeInlineStylesheet(DEFAULT_CSS_VARIABLES)
      expect(css).toContain('--primary-foreground:var(--secondary)')
      expect(css).not.toContain('--primary-foreground:#ffffff')
    })
  })

  describe('NEUTRAL', () => {
    it('has gray scale from 50 to 900', () => {
      expect(NEUTRAL.gray50).toBeDefined()
      expect(NEUTRAL.gray100).toBeDefined()
      expect(NEUTRAL.gray900).toBeDefined()
    })

    it('has black and white', () => {
      expect(NEUTRAL.white).toBe('#ffffff')
      expect(NEUTRAL.black).toBe('#000000')
    })
  })

  describe('EMAIL_BRAND_COLORS', () => {
    it('uses BRAND primary', () => {
      expect(EMAIL_BRAND_COLORS.primary).toBe(BRAND.primary)
    })
  })

  describe('EMAIL_NEUTRAL_COLORS', () => {
    it('has expected neutral color keys', () => {
      expect(EMAIL_NEUTRAL_COLORS.bodyBg).toBeDefined()
      expect(EMAIL_NEUTRAL_COLORS.containerBg).toBeDefined()
      expect(EMAIL_NEUTRAL_COLORS.border).toBeDefined()
      expect(EMAIL_NEUTRAL_COLORS.buttonText).toBeDefined()
    })
  })
})
