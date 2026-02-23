import { describe, it, expect } from 'vitest'
import {
  projectFormSchema,
  contactFormSchema,
  themeEditorSchema,
  categorySchema,
  loginSchema,
} from '@/lib/validations'

// Full valid theme — all required fields must be present
const validTheme = {
  primaryColor: '#6c0a0a',
  secondaryColor: '#ffaadd',
  accentColor: '#fff1f9',
  backgroundColor: '#fff8fc',
  textColor: '#3d0a0a',
  cardBgColor: '#ffaadd',
  darkPrimaryColor: '#fb7185',
  darkSecondaryColor: '#ffaadd',
  darkAccentColor: '#000000',
  darkBackgroundColor: '#0f0505',
  darkTextColor: '#fafafa',
  darkCardBgColor: '#2a0a0a',
  headingFont: 'Poppins',
  headingFontUrl: null,
  headingFontSize: 48,
  scriptFont: 'Great Vibes',
  scriptFontUrl: null,
  scriptFontSize: 80,
  bodyFont: 'Open Sans',
  bodyFontUrl: null,
  bodyFontSize: 16,
  brandFont: null,
  brandFontUrl: null,
  brandFontSize: 120,
  portfolioFont: null,
  portfolioFontUrl: null,
  portfolioFontSize: 60,
  signatureFont: null,
  signatureFontUrl: null,
  signatureFontSize: 48,
  borderRadius: 40,
}

describe('Validation Schemas', () => {
  // ==========================================
  // projectFormSchema
  // ==========================================
  describe('projectFormSchema', () => {
    it('should validate a valid project', () => {
      const validProject = {
        title: 'Test Project',
        description: 'A test project description',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
        thumbnailUrl: 'https://example.com/thumb.jpg',
        isFeatured: false,
      }

      const result = projectFormSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should require title of minimum 3 characters', () => {
      const invalidProject = {
        title: 'AB',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
      }

      const result = projectFormSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
      }
    })

    it('should require categoryId', () => {
      const invalidProject = {
        title: 'Valid Title',
        date: new Date().toISOString(),
        categoryId: '',
      }

      const result = projectFormSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should accept optional fields as undefined', () => {
      const minimalProject = {
        title: 'Valid Title Here',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
      }

      const result = projectFormSchema.safeParse(minimalProject)
      expect(result.success).toBe(true)
    })

    it('should accept isFeatured as boolean or string', () => {
      const withBoolean = {
        title: 'Test Project',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
        isFeatured: true,
      }
      const withString = {
        title: 'Test Project',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
        isFeatured: 'on',
      }

      expect(projectFormSchema.safeParse(withBoolean).success).toBe(true)
      expect(projectFormSchema.safeParse(withString).success).toBe(true)
    })
  })

  // ==========================================
  // contactFormSchema
  // ==========================================
  describe('contactFormSchema', () => {
    it('should validate a valid contact form', () => {
      const validContact = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I need more information about your services',
        responsePreference: 'EMAIL',
        privacy: true,
      }

      const result = contactFormSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should require valid email format', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message here',
        privacy: true,
      }

      const result = contactFormSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should require message to be at least 10 characters', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
        privacy: true,
      }

      const result = contactFormSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should require privacy to be true', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I need more information about your services',
        responsePreference: 'EMAIL',
        privacy: false,
      }

      const result = contactFormSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should accept optional phone number', () => {
      const validContact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+34123456789',
        message: 'Hello, I need more information',
        responsePreference: 'PHONE',
        privacy: true,
      }

      const result = contactFormSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should accept valid response preferences', () => {
      const preferences = ['EMAIL', 'PHONE', 'WHATSAPP'] as const

      preferences.forEach((pref) => {
        const contact = {
          name: 'John',
          email: 'john@test.com',
          message: 'Test message here, needing more detail',
          responsePreference: pref,
          privacy: true,
        }

        const result = contactFormSchema.safeParse(contact)
        expect(result.success).toBe(true)
      })
    })
  })

  // ==========================================
  // themeEditorSchema
  // ==========================================
  describe('themeEditorSchema', () => {
    it('should validate a complete valid theme', () => {
      const result = themeEditorSchema.safeParse(validTheme)
      expect(result.success).toBe(true)
    })

    it('should reject invalid HEX colors', () => {
      const invalidTheme = {
        ...validTheme,
        primaryColor: 'red',
      }

      const result = themeEditorSchema.safeParse(invalidTheme)
      expect(result.success).toBe(false)
    })

    it('should reject negative border radius', () => {
      const invalidTheme = { ...validTheme, borderRadius: -10 }

      const result = themeEditorSchema.safeParse(invalidTheme)
      expect(result.success).toBe(false)
    })

    it('should accept font URLs as optional nullable strings', () => {
      const themeWithUrls = {
        ...validTheme,
        headingFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins',
        bodyFontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans',
      }

      const result = themeEditorSchema.safeParse(themeWithUrls)
      expect(result.success).toBe(true)
    })

    it('should require required font fields (headingFont, scriptFont, bodyFont)', () => {
      const withoutHeadingFont = { ...validTheme, headingFont: '' }
      expect(themeEditorSchema.safeParse(withoutHeadingFont).success).toBe(false)

      const withoutBodyFont = { ...validTheme, bodyFont: '' }
      expect(themeEditorSchema.safeParse(withoutBodyFont).success).toBe(false)
    })
  })

  // ==========================================
  // categorySchema
  // ==========================================
  describe('categorySchema', () => {
    it('should validate a valid category', () => {
      const validCategory = {
        name: 'Audiovisual',
        slug: 'audiovisual',
        description: 'Proyectos audiovisuales',
        sortOrder: 1,
      }

      const result = categorySchema.safeParse(validCategory)
      expect(result.success).toBe(true)
    })

    it('should require name', () => {
      const invalid = { slug: 'audiovisual' }
      const result = categorySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject slugs with uppercase letters or spaces', () => {
      const invalid = { name: 'Test', slug: 'My Category' }
      const result = categorySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept valid slug with hyphens and numbers', () => {
      const valid = { name: 'My Category', slug: 'my-category-2' }
      const result = categorySchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  // ==========================================
  // loginSchema
  // ==========================================
  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const valid = { email: 'admin@example.com', password: 'secretpassword' }
      expect(loginSchema.safeParse(valid).success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalid = { email: 'not-an-email', password: 'password' }
      expect(loginSchema.safeParse(invalid).success).toBe(false)
    })

    it('should require both email and password', () => {
      expect(loginSchema.safeParse({ email: 'a@b.com' }).success).toBe(false)
      expect(loginSchema.safeParse({ password: 'pass' }).success).toBe(false)
    })
  })
})
