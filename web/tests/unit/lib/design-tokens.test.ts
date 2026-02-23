import { describe, it, expect } from 'vitest'
import {
  BRAND,
  STATUS_COLORS,
  TYPOGRAPHY_DEFAULTS,
  DEFAULT_CSS_VARIABLES,
  RESET_THEME_DEFAULTS,
  NEUTRAL,
  EMAIL_BRAND_COLORS,
  EMAIL_NEUTRAL_COLORS,
} from '@/lib/design-tokens'

describe('design-tokens', () => {
  describe('BRAND', () => {
    it('has correct light mode primary color', () => {
      expect(BRAND.primary).toBe('#6c0a0a')
    })

    it('has correct dark mode primary color', () => {
      expect(BRAND.darkPrimary).toBe('#fb7185')
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

    it('has --radius variable', () => {
      expect(DEFAULT_CSS_VARIABLES['--radius']).toBeDefined()
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
