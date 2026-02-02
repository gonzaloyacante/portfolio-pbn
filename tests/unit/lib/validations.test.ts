import { describe, it, expect } from 'vitest'
import { projectSchema, contactSchema, themeEditorSchema } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('projectSchema', () => {
    it('should validate a valid project', () => {
      const validProject = {
        title: 'Test Project',
        slug: 'test-project',
        description: 'A test project description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        categoryId: 'cat-123',
        date: new Date().toISOString(),
        isFeatured: false,
        isActive: true,
      }

      const result = projectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should require title', () => {
      const invalidProject = {
        slug: 'test-project',
        description: 'Test',
        categoryId: 'cat-123',
      }

      const result = projectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
      }
    })

    it('should require description to be at least 10 characters', () => {
      const invalidProject = {
        title: 'Test',
        slug: 'test',
        description: 'Short',
        categoryId: 'cat-123',
      }

      const result = projectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should validate thumbnail URL format', () => {
      const invalidProject = {
        title: 'Test',
        slug: 'test',
        description: 'Valid description here',
        thumbnailUrl: 'not-a-url',
        categoryId: 'cat-123',
      }

      const result = projectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should allow optional isFeatured and isActive', () => {
      const validProject = {
        title: 'Test',
        slug: 'test',
        description: 'Valid description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        categoryId: 'cat-123',
      }

      const result = projectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })
  })

  describe('contactSchema', () => {
    it('should validate a valid contact form', () => {
      const validContact = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I need more information',
        responsePreference: 'EMAIL',
      }

      const result = contactSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should require valid email format', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }

      const result = contactSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should require message to be at least 10 characters', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      }

      const result = contactSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should accept optional phone number', () => {
      const validContact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+34123456789',
        message: 'Hello world, this is a test',
      }

      const result = contactSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should accept valid response preferences', () => {
      const preferences = ['EMAIL', 'PHONE', 'WHATSAPP']

      preferences.forEach((pref) => {
        const contact = {
          name: 'John',
          email: 'john@test.com',
          message: 'Test message here',
          responsePreference: pref,
        }

        const result = contactSchema.safeParse(contact)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('themeEditorSchema', () => {
    it('should validate valid HEX colors', () => {
      const validTheme = {
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        accentColor: '#0000ff',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        cardBgColor: '#f5f5f5',
      }

      const result = themeEditorSchema.safeParse(validTheme)
      expect(result.success).toBe(true)
    })

    it('should reject invalid HEX colors', () => {
      const invalidTheme = {
        primaryColor: 'red', // Not HEX
        secondaryColor: '#00ff00',
      }

      const result = themeEditorSchema.safeParse(invalidTheme)
      expect(result.success).toBe(false)
    })

    it('should validate border radius as positive integer', () => {
      const validTheme = {
        borderRadius: 40,
      }

      const result = themeEditorSchema.safeParse(validTheme)
      expect(result.success).toBe(true)
    })

    it('should reject negative border radius', () => {
      const invalidTheme = {
        borderRadius: -10,
      }

      const result = themeEditorSchema.safeParse(invalidTheme)
      expect(result.success).toBe(false)
    })

    it('should accept font URLs as optional strings', () => {
      const validTheme = {
        headingFont: 'Poppins',
        headingFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins',
        bodyFont: 'Open Sans',
      }

      const result = themeEditorSchema.safeParse(validTheme)
      expect(result.success).toBe(true)
    })
  })
})
