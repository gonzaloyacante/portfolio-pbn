import { describe, it, expect } from 'vitest'
import {
  contactFormSchema,
  testimonialFormSchema,
  themeEditorSchema,
  aboutSettingsSchema,
  testimonialSettingsSchema,
  contactSettingsSchema,
  projectSettingsSchema,
  categorySettingsSchema,
  projectFormSchema,
  categorySchema,
  loginSchema,
} from '@/lib/validations'

// ============================================
// contactFormSchema — edge cases
// ============================================

describe('contactFormSchema — extended', () => {
  const validContact = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello world, this is a test message.',
    responsePreference: 'EMAIL' as const,
    privacy: true,
  }

  it('passes with all required fields', () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true)
  })

  it('passes with optional phone present', () => {
    const result = contactFormSchema.safeParse({ ...validContact, phone: '+34 600 123 456' })
    expect(result.success).toBe(true)
  })

  it('fails when all required fields are missing', () => {
    const result = contactFormSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('fails when name is too short (1 char)', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('passes when name is exactly 2 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'Ab' })
    expect(result.success).toBe(true)
  })

  it('fails when name exceeds 100 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('passes when name is exactly 100 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'A'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('fails with invalid email format', () => {
    const result = contactFormSchema.safeParse({ ...validContact, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('fails when message is too short (9 chars)', () => {
    const result = contactFormSchema.safeParse({ ...validContact, message: '123456789' })
    expect(result.success).toBe(false)
  })

  it('passes when message is exactly 10 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, message: '1234567890' })
    expect(result.success).toBe(true)
  })

  it('fails when message exceeds 2000 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, message: 'x'.repeat(2001) })
    expect(result.success).toBe(false)
  })

  it('passes when message is exactly 2000 chars', () => {
    const result = contactFormSchema.safeParse({ ...validContact, message: 'x'.repeat(2000) })
    expect(result.success).toBe(true)
  })

  it('fails with invalid responsePreference enum', () => {
    const result = contactFormSchema.safeParse({ ...validContact, responsePreference: 'FAX' })
    expect(result.success).toBe(false)
  })

  it('accepts PHONE as responsePreference', () => {
    const result = contactFormSchema.safeParse({ ...validContact, responsePreference: 'PHONE' })
    expect(result.success).toBe(true)
  })

  it('accepts WHATSAPP as responsePreference', () => {
    const result = contactFormSchema.safeParse({ ...validContact, responsePreference: 'WHATSAPP' })
    expect(result.success).toBe(true)
  })

  it('fails when privacy is false', () => {
    const result = contactFormSchema.safeParse({ ...validContact, privacy: false })
    expect(result.success).toBe(false)
  })

  it('fails when privacy is not boolean', () => {
    const result = contactFormSchema.safeParse({ ...validContact, privacy: 'true' })
    expect(result.success).toBe(false)
  })

  it('handles XSS-like string in name', () => {
    const result = contactFormSchema.safeParse({
      ...validContact,
      name: '<script>alert("xss")</script>',
    })
    // Zod does not sanitize — it just validates shape
    expect(result.success).toBe(true)
  })

  it('handles unicode characters in name', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'Ñoño Ünïcödé' })
    expect(result.success).toBe(true)
  })

  it('handles email with subdomains', () => {
    const result = contactFormSchema.safeParse({ ...validContact, email: 'user@sub.domain.co.uk' })
    expect(result.success).toBe(true)
  })

  it('fails when email is empty string', () => {
    const result = contactFormSchema.safeParse({ ...validContact, email: '' })
    expect(result.success).toBe(false)
  })

  it('fails when name is empty string', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: '' })
    expect(result.success).toBe(false)
  })

  it('passes with phone as undefined', () => {
    const result = contactFormSchema.safeParse({ ...validContact, phone: undefined })
    expect(result.success).toBe(true)
  })
})

// ============================================
// testimonialFormSchema — edge cases
// ============================================

describe('testimonialFormSchema — extended', () => {
  const valid = { name: 'Maria', text: 'Great experience with the service.' }

  it('passes with minimal required fields', () => {
    expect(testimonialFormSchema.safeParse(valid).success).toBe(true)
  })

  it('defaults rating to 5', () => {
    const result = testimonialFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.rating).toBe(5)
  })

  it('fails when rating is 0', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, rating: 0 })
    expect(result.success).toBe(false)
  })

  it('fails when rating is 6', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, rating: 6 })
    expect(result.success).toBe(false)
  })

  it('passes when rating is 1', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, rating: 1 })
    expect(result.success).toBe(true)
  })

  it('passes when rating is 5 explicitly', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, rating: 5 })
    expect(result.success).toBe(true)
  })

  it('fails when text is too short', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, text: 'short' })
    expect(result.success).toBe(false)
  })

  it('fails when name is too short (1 char)', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('passes with optional position', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, position: 'CEO' })
    expect(result.success).toBe(true)
  })

  it('fails when rating is a string', () => {
    const result = testimonialFormSchema.safeParse({ ...valid, rating: 'five' })
    expect(result.success).toBe(false)
  })
})

// ============================================
// themeEditorSchema — edge cases
// ============================================

describe('themeEditorSchema — extended', () => {
  const validTheme = {
    primaryColor: '#6c0a0a',
    secondaryColor: '#fce7f3',
    accentColor: '#fff1f9',
    backgroundColor: '#fff8fc',
    textColor: '#1a050a',
    cardBgColor: '#ffffff',
    darkPrimaryColor: '#fb7185',
    darkSecondaryColor: '#881337',
    darkAccentColor: '#2a1015',
    darkBackgroundColor: '#0f0505',
    darkTextColor: '#fafafa',
    darkCardBgColor: '#1c0a0f',
    headingFont: 'Poppins',
    headingFontSize: 32,
    scriptFont: 'Great Vibes',
    scriptFontSize: 48,
    bodyFont: 'Open Sans',
    bodyFontSize: 16,
    brandFontSize: 40,
    portfolioFontSize: 36,
    signatureFontSize: 24,
    borderRadius: 40,
  }

  it('passes with all valid fields', () => {
    expect(themeEditorSchema.safeParse(validTheme).success).toBe(true)
  })

  it('fails with invalid hex color (no hash)', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: 'ff0000' })
    expect(result.success).toBe(false)
  })

  it('fails with invalid hex color (7 chars)', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: '#ff0000f' })
    expect(result.success).toBe(false)
  })

  it('passes with 3-char hex shorthand', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: '#f00' })
    expect(result.success).toBe(true)
  })

  it('fails when headingFontSize is below 10', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, headingFontSize: 9 })
    expect(result.success).toBe(false)
  })

  it('fails when headingFontSize exceeds 200', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, headingFontSize: 201 })
    expect(result.success).toBe(false)
  })

  it('passes when borderRadius is 0', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, borderRadius: 0 })
    expect(result.success).toBe(true)
  })

  it('fails when borderRadius exceeds 100', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, borderRadius: 101 })
    expect(result.success).toBe(false)
  })

  it('fails when headingFont is empty', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, headingFont: '' })
    expect(result.success).toBe(false)
  })

  it('allows nullable optional font URLs', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, headingFontUrl: null })
    expect(result.success).toBe(true)
  })

  it('fails with non-string color value', () => {
    const result = themeEditorSchema.safeParse({ ...validTheme, primaryColor: 123 })
    expect(result.success).toBe(false)
  })
})

// ============================================
// projectFormSchema — edge cases
// ============================================

describe('projectFormSchema — extended', () => {
  const valid = { title: 'My Project', categoryId: 'cat-1', date: '2025-01-01' }

  it('passes with minimal required fields', () => {
    expect(projectFormSchema.safeParse(valid).success).toBe(true)
  })

  it('fails when title is less than 3 chars', () => {
    const result = projectFormSchema.safeParse({ ...valid, title: 'Ab' })
    expect(result.success).toBe(false)
  })

  it('fails when title exceeds 200 chars', () => {
    const result = projectFormSchema.safeParse({ ...valid, title: 'X'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('fails when categoryId is empty', () => {
    const result = projectFormSchema.safeParse({ ...valid, categoryId: '' })
    expect(result.success).toBe(false)
  })

  it('passes with description as null', () => {
    const result = projectFormSchema.safeParse({ ...valid, description: null })
    expect(result.success).toBe(true)
  })

  it('passes with all optional fields present', () => {
    const result = projectFormSchema.safeParse({
      ...valid,
      description: 'Some description',
      thumbnailUrl: 'https://img.test/thumb.jpg',
      excerpt: 'Short excerpt',
      videoUrl: 'https://youtube.com/watch?v=abc',
      duration: '2h',
      client: 'Client X',
      location: 'Madrid',
      tags: 'tag1,tag2',
      metaTitle: 'SEO Title',
      metaDescription: 'SEO Description',
      metaKeywords: 'kw1,kw2',
      canonicalUrl: 'https://example.com/project',
      layout: 'grid',
      isFeatured: true,
      isPinned: false,
    })
    expect(result.success).toBe(true)
  })

  it('accepts isFeatured as string', () => {
    const result = projectFormSchema.safeParse({ ...valid, isFeatured: 'true' })
    expect(result.success).toBe(true)
  })

  it('accepts isPinned as boolean', () => {
    const result = projectFormSchema.safeParse({ ...valid, isPinned: true })
    expect(result.success).toBe(true)
  })

  it('handles XSS in title', () => {
    const result = projectFormSchema.safeParse({
      ...valid,
      title: '<img src=x onerror=alert(1)>',
    })
    expect(result.success).toBe(true) // Zod doesn't sanitize
  })

  it('handles very long description in optional field', () => {
    const result = projectFormSchema.safeParse({ ...valid, description: 'D'.repeat(10000) })
    expect(result.success).toBe(true) // no max on description
  })
})

// ============================================
// categorySchema — edge cases
// ============================================

describe('categorySchema — extended', () => {
  const valid = { name: 'Retratos', slug: 'retratos' }

  it('passes with valid name and slug', () => {
    expect(categorySchema.safeParse(valid).success).toBe(true)
  })

  it('fails with empty name', () => {
    const result = categorySchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
  })

  it('fails with empty slug', () => {
    const result = categorySchema.safeParse({ ...valid, slug: '' })
    expect(result.success).toBe(false)
  })

  it('fails with uppercase in slug', () => {
    const result = categorySchema.safeParse({ ...valid, slug: 'Retratos' })
    expect(result.success).toBe(false)
  })

  it('fails with spaces in slug', () => {
    const result = categorySchema.safeParse({ ...valid, slug: 'my category' })
    expect(result.success).toBe(false)
  })

  it('fails with special chars in slug', () => {
    const result = categorySchema.safeParse({ ...valid, slug: 'retrato_s' })
    expect(result.success).toBe(false)
  })

  it('passes with numbers in slug', () => {
    const result = categorySchema.safeParse({ ...valid, slug: 'cat-123' })
    expect(result.success).toBe(true)
  })

  it('passes with optional description', () => {
    const result = categorySchema.safeParse({ ...valid, description: 'A description' })
    expect(result.success).toBe(true)
  })

  it('passes with coverImageUrl as null', () => {
    const result = categorySchema.safeParse({ ...valid, coverImageUrl: null })
    expect(result.success).toBe(true)
  })
})

// ============================================
// loginSchema — edge cases
// ============================================

describe('loginSchema — extended', () => {
  it('passes with valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({ email: 'notvalid', password: 'x' })
    expect(result.success).toBe(false)
  })

  it('fails with empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(result.success).toBe(false)
  })

  it('fails with null email', () => {
    const result = loginSchema.safeParse({ email: null, password: 'x' })
    expect(result.success).toBe(false)
  })

  it('fails with number as email', () => {
    const result = loginSchema.safeParse({ email: 12345, password: 'x' })
    expect(result.success).toBe(false)
  })

  it('fails when both fields are missing', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('accepts unicode in password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '密码🔑' })
    expect(result.success).toBe(true)
  })
})

// ============================================
// aboutSettingsSchema — edge cases
// ============================================

describe('aboutSettingsSchema — extended', () => {
  it('passes with empty object (all optional)', () => {
    expect(aboutSettingsSchema.safeParse({}).success).toBe(true)
  })

  it('passes with all fields', () => {
    const result = aboutSettingsSchema.safeParse({
      illustrationUrl: 'https://img.test/ill.png',
      illustrationAlt: 'Alt text',
      bioTitle: 'About Me',
      bioIntro: 'I am a professional',
      bioDescription: 'Description here',
      profileImageUrl: 'https://img.test/profile.jpg',
      profileImageAlt: 'Profile',
      profileImageShape: 'circle',
      skills: ['Makeup', 'FX'],
      yearsExperience: 10,
      certifications: ['Cert A'],
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid profileImageShape', () => {
    const result = aboutSettingsSchema.safeParse({ profileImageShape: 'diamond' })
    expect(result.success).toBe(false)
  })

  it('accepts all profileImageShape values', () => {
    for (const shape of ['ellipse', 'circle', 'rounded', 'none']) {
      expect(aboutSettingsSchema.safeParse({ profileImageShape: shape }).success).toBe(true)
    }
  })

  it('accepts empty skills array', () => {
    expect(aboutSettingsSchema.safeParse({ skills: [] }).success).toBe(true)
  })

  it('fails when yearsExperience is a string', () => {
    const result = aboutSettingsSchema.safeParse({ yearsExperience: 'ten' })
    expect(result.success).toBe(false)
  })
})

// ============================================
// testimonialSettingsSchema — edge cases
// ============================================

describe('testimonialSettingsSchema — extended', () => {
  it('passes with valid data', () => {
    const result = testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 5 })
    expect(result.success).toBe(true)
  })

  it('fails when maxDisplay is 0', () => {
    const result = testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 0 })
    expect(result.success).toBe(false)
  })

  it('fails when maxDisplay exceeds 20', () => {
    const result = testimonialSettingsSchema.safeParse({ showOnAbout: false, maxDisplay: 21 })
    expect(result.success).toBe(false)
  })

  it('fails when showOnAbout is missing', () => {
    const result = testimonialSettingsSchema.safeParse({ maxDisplay: 5 })
    expect(result.success).toBe(false)
  })
})

// ============================================
// contactSettingsSchema — edge cases
// ============================================

describe('contactSettingsSchema — extended', () => {
  const valid = { email: 'admin@test.com', showSocialLinks: true }

  it('passes with minimal required fields', () => {
    expect(contactSettingsSchema.safeParse(valid).success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = contactSettingsSchema.safeParse({ ...valid, email: 'bad' })
    expect(result.success).toBe(false)
  })

  it('fails when showSocialLinks is missing', () => {
    const result = contactSettingsSchema.safeParse({ email: 'a@b.com' })
    expect(result.success).toBe(false)
  })

  it('passes with all optional labels', () => {
    const result = contactSettingsSchema.safeParse({
      ...valid,
      pageTitle: 'Contact',
      ownerName: 'Paola',
      phone: '+34 612 345 678',
      formTitle: 'Send message',
      nameLabel: 'Your Name',
      emailLabel: 'Your Email',
    })
    expect(result.success).toBe(true)
  })
})

// ============================================
// projectSettingsSchema & categorySettingsSchema
// ============================================

describe('projectSettingsSchema — extended', () => {
  it('passes with valid values', () => {
    const result = projectSettingsSchema.safeParse({
      showCardTitles: true,
      showCardCategory: false,
      gridColumns: 3,
    })
    expect(result.success).toBe(true)
  })

  it('fails when gridColumns is 0', () => {
    const result = projectSettingsSchema.safeParse({
      showCardTitles: true,
      showCardCategory: true,
      gridColumns: 0,
    })
    expect(result.success).toBe(false)
  })

  it('fails when gridColumns > 4', () => {
    const result = projectSettingsSchema.safeParse({
      showCardTitles: true,
      showCardCategory: true,
      gridColumns: 5,
    })
    expect(result.success).toBe(false)
  })
})

describe('categorySettingsSchema — extended', () => {
  it('passes with defaults', () => {
    const result = categorySettingsSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.showDescription).toBe(true)
      expect(result.data.showProjectCount).toBe(true)
      expect(result.data.gridColumns).toBe(4)
    }
  })

  it('fails when gridColumns > 5', () => {
    const result = categorySettingsSchema.safeParse({ gridColumns: 6 })
    expect(result.success).toBe(false)
  })

  it('passes with gridColumns 1', () => {
    const result = categorySettingsSchema.safeParse({ gridColumns: 1 })
    expect(result.success).toBe(true)
  })
})
