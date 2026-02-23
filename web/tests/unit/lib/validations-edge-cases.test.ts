import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  contactFormSchema,
  testimonialFormSchema,
  projectFormSchema,
  categorySchema,
  homeSettingsSchema,
  contactSettingsSchema,
  themeEditorSchema,
} from '@/lib/validations'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Base valid objects ────────────────────────────────────────────────────────

const validTheme = {
  primaryColor: '#6C0A0A',
  secondaryColor: '#FCE7F3',
  accentColor: '#FFF1F9',
  backgroundColor: '#FFF8FC',
  textColor: '#1A050A',
  cardBgColor: '#FFFFFF',
  darkPrimaryColor: '#FB7185',
  darkSecondaryColor: '#881337',
  darkAccentColor: '#2A1015',
  darkBackgroundColor: '#0F0505',
  darkTextColor: '#FAFAFA',
  darkCardBgColor: '#1C0A0F',
  headingFont: 'Poppins',
  headingFontSize: 32,
  scriptFont: 'Great Vibes',
  scriptFontSize: 40,
  bodyFont: 'Open Sans',
  bodyFontSize: 16,
  brandFontSize: 48,
  portfolioFontSize: 36,
  signatureFontSize: 24,
  borderRadius: 40,
}

// ============================================
// contactFormSchema — deep edge cases
// ============================================

describe('contactFormSchema — edge cases', () => {
  it('rejects name of exactly 1 character', () => {
    const result = contactFormSchema.safeParse({
      name: 'A',
      email: 'a@b.com',
      message: 'Hello world 123',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts name of exactly 2 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'AB',
      email: 'a@b.com',
      message: 'Hello world 123',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects message of exactly 9 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      message: '123456789',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts message of exactly 10 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      message: '1234567890',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects name exceeding 100 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'A'.repeat(101),
      email: 'a@b.com',
      message: 'Hello world 123',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects message exceeding 2000 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'a@b.com',
      message: 'x'.repeat(2001),
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects WHATSAPP preference typo', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'a@b.com',
      message: 'Hello world test',
      responsePreference: 'whatsapp',
      privacy: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts PHONE preference', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'a@b.com',
      message: 'Hello world test',
      responsePreference: 'PHONE',
      privacy: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts WHATSAPP preference', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'a@b.com',
      message: 'Hello world test',
      responsePreference: 'WHATSAPP',
      privacy: true,
    })
    expect(result.success).toBe(true)
  })

  it('phone is optional and accepts undefined', () => {
    const result = contactFormSchema.safeParse({
      name: 'Ana',
      email: 'a@b.com',
      message: 'Hello world test',
      responsePreference: 'EMAIL',
      privacy: true,
    })
    expect(result.success).toBe(true)
  })
})

// ============================================
// testimonialFormSchema — edge cases
// ============================================

describe('testimonialFormSchema — edge cases', () => {
  it('rejects rating of 0', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Juan',
      text: 'Excelente trabajo!!',
      rating: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects rating of 6', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Juan',
      text: 'Excelente trabajo!!',
      rating: 6,
    })
    expect(result.success).toBe(false)
  })

  it('accepts rating of 1', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Juan',
      text: 'Could be better.',
      rating: 1,
    })
    expect(result.success).toBe(true)
  })

  it('accepts rating of 5', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Juan',
      text: 'Absolutely perfect.',
      rating: 5,
    })
    expect(result.success).toBe(true)
  })

  it('defaults rating to 5 when not provided', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Juan',
      text: 'Great work done.',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rating).toBe(5)
    }
  })

  it('position is optional', () => {
    const result = testimonialFormSchema.safeParse({
      name: 'Ana',
      text: 'Really loved it!',
    })
    expect(result.success).toBe(true)
  })
})

// ============================================
// projectFormSchema — edge cases
// ============================================

describe('projectFormSchema — edge cases', () => {
  it('rejects title shorter than 3 chars', () => {
    const result = projectFormSchema.safeParse({
      title: 'AB',
      categoryId: 'cat-1',
      date: '2025-01-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects title exceeding 200 chars', () => {
    const result = projectFormSchema.safeParse({
      title: 'A'.repeat(201),
      categoryId: 'cat-1',
      date: '2025-01-01',
    })
    expect(result.success).toBe(false)
  })

  it('accepts title of exactly 3 chars', () => {
    const result = projectFormSchema.safeParse({
      title: 'ABC',
      categoryId: 'cat-1',
      date: '2025-01-01',
    })
    expect(result.success).toBe(true)
  })

  it('isFeatured accepts boolean true', () => {
    const result = projectFormSchema.safeParse({
      title: 'My Project',
      categoryId: 'cat-1',
      date: '2025-01-01',
      isFeatured: true,
    })
    expect(result.success).toBe(true)
  })

  it('isFeatured accepts string "true"', () => {
    const result = projectFormSchema.safeParse({
      title: 'My Project',
      categoryId: 'cat-1',
      date: '2025-01-01',
      isFeatured: 'true',
    })
    expect(result.success).toBe(true)
  })

  it('isPinned accepts boolean false', () => {
    const result = projectFormSchema.safeParse({
      title: 'My Project',
      categoryId: 'cat-1',
      date: '2025-01-01',
      isPinned: false,
    })
    expect(result.success).toBe(true)
  })

  it('description can be null', () => {
    const result = projectFormSchema.safeParse({
      title: 'My Project',
      categoryId: 'cat-1',
      date: '2025-01-01',
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('excerpt can be null', () => {
    const result = projectFormSchema.safeParse({
      title: 'My Project',
      categoryId: 'cat-1',
      date: '2025-01-01',
      excerpt: null,
    })
    expect(result.success).toBe(true)
  })
})

// ============================================
// categorySchema — edge cases
// ============================================

describe('categorySchema — slug validation', () => {
  it('rejects uppercase in slug', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'My-Slug' })
    expect(result.success).toBe(false)
  })

  it('rejects spaces in slug', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'my slug' })
    expect(result.success).toBe(false)
  })

  it('rejects special characters in slug', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'my_slug!' })
    expect(result.success).toBe(false)
  })

  it('accepts slug with numbers', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'category-123' })
    expect(result.success).toBe(true)
  })

  it('accepts slug with only numbers', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: '123' })
    expect(result.success).toBe(true)
  })

  it('sortOrder is optional', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'test' })
    expect(result.success).toBe(true)
  })

  it('coverImageUrl can be null', () => {
    const result = categorySchema.safeParse({ name: 'Test', slug: 'test', coverImageUrl: null })
    expect(result.success).toBe(true)
  })
})

// ============================================
// homeSettingsSchema — deep edge cases
// ============================================

describe('homeSettingsSchema — deep validation', () => {
  it('rejects featuredCount of 0', () => {
    const result = homeSettingsSchema.safeParse({ showFeaturedProjects: true, featuredCount: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects featuredCount over 20', () => {
    const result = homeSettingsSchema.safeParse({ showFeaturedProjects: true, featuredCount: 21 })
    expect(result.success).toBe(false)
  })

  it('accepts featuredCount of 1', () => {
    const result = homeSettingsSchema.safeParse({ showFeaturedProjects: false, featuredCount: 1 })
    expect(result.success).toBe(true)
  })

  it('accepts heroTitle colors as 6-char hex', () => {
    const result = homeSettingsSchema.safeParse({
      showFeaturedProjects: false,
      featuredCount: 3,
      heroTitle1Color: '#FF00AA',
    })
    expect(result.success).toBe(true)
  })

  it('rejects heroTitle colors with invalid format', () => {
    const result = homeSettingsSchema.safeParse({
      showFeaturedProjects: false,
      featuredCount: 3,
      heroTitle1Color: 'red',
    })
    expect(result.success).toBe(false)
  })

  it('illustrationOpacity max is 100', () => {
    const result = homeSettingsSchema.safeParse({
      showFeaturedProjects: false,
      featuredCount: 3,
      illustrationOpacity: 101,
    })
    expect(result.success).toBe(false)
  })

  it('illustrationOpacity min is 0', () => {
    const result = homeSettingsSchema.safeParse({
      showFeaturedProjects: false,
      featuredCount: 3,
      illustrationOpacity: 0,
    })
    expect(result.success).toBe(true)
  })
})

// ============================================
// contactSettingsSchema — email required
// ============================================

describe('contactSettingsSchema — email validation', () => {
  it('rejects invalid email', () => {
    const result = contactSettingsSchema.safeParse({
      email: 'not-an-email',
      showSocialLinks: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid email', () => {
    const result = contactSettingsSchema.safeParse({
      email: 'paola@test.com',
      showSocialLinks: false,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = contactSettingsSchema.safeParse({
      email: '',
      showSocialLinks: true,
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// themeEditorSchema — color hexcodes
// ============================================

describe('themeEditorSchema — hex color validation', () => {
  it('accepts 3-char hex for primary', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: '#F0A' })
    expect(result.success).toBe(true)
  })

  it('rejects 4-char hex', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: '#F0AB' })
    expect(result.success).toBe(false)
  })

  it('rejects hex without hash', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: 'FF0000' })
    expect(result.success).toBe(false)
  })

  it('borderRadius min is 0', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, borderRadius: 0 }).success).toBe(true)
  })

  it('borderRadius max is 100', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, borderRadius: 100 }).success).toBe(true)
  })

  it('rejects borderRadius of 101', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, borderRadius: 101 }).success).toBe(false)
  })

  it('rejects borderRadius of -1', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, borderRadius: -1 }).success).toBe(false)
  })
})
