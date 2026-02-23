import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  testimonialFormSchema,
  themeEditorSchema,
  homeSettingsSchema,
  aboutSettingsSchema,
  testimonialSettingsSchema,
  contactSettingsSchema,
  projectSettingsSchema,
  categorySettingsSchema,
  categorySchema,
  loginSchema,
} from '@/lib/validations'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── helpers ───────────────────────────────────────────────────────────────────

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
  scriptFontSize: 48,
  bodyFont: 'Open Sans',
  bodyFontSize: 16,
  brandFontSize: 40,
  portfolioFontSize: 36,
  signatureFontSize: 28,
  borderRadius: 40,
}

// ============================================
// loginSchema — exhaustive
// ============================================

describe('loginSchema — exhaustive', () => {
  it('passes with valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'admin@test.com', password: 'secret123' }).success).toBe(
      true
    )
  })

  it('fails when email is missing', () => {
    const r = loginSchema.safeParse({ password: 'abc' })
    expect(r.success).toBe(false)
  })

  it('fails when password is missing', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com' })
    expect(r.success).toBe(false)
  })

  it('fails when email is invalid format', () => {
    expect(loginSchema.safeParse({ email: 'not-email', password: 'x' }).success).toBe(false)
  })

  it('fails when password is empty string', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false)
  })

  it('passes with password of 1 char', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true)
  })

  it('fails with empty object', () => {
    expect(loginSchema.safeParse({}).success).toBe(false)
  })
})

// ============================================
// aboutSettingsSchema
// ============================================

describe('aboutSettingsSchema — exhaustive', () => {
  it('passes with empty object (all optional)', () => {
    expect(aboutSettingsSchema.safeParse({}).success).toBe(true)
  })

  it('passes with all fields filled', () => {
    const r = aboutSettingsSchema.safeParse({
      illustrationUrl: 'https://img.test/pic.png',
      illustrationAlt: 'My illustration',
      bioTitle: 'About Me',
      bioIntro: 'I am an artist',
      bioDescription: 'Long bio description here',
      profileImageUrl: 'https://img.test/profile.jpg',
      profileImageAlt: 'Profile image',
      profileImageShape: 'circle',
      skills: ['painting', 'drawing'],
      yearsExperience: 10,
      certifications: ['Art School'],
    })
    expect(r.success).toBe(true)
  })

  it('accepts profileImageShape = ellipse', () => {
    expect(aboutSettingsSchema.safeParse({ profileImageShape: 'ellipse' }).success).toBe(true)
  })

  it('accepts profileImageShape = rounded', () => {
    expect(aboutSettingsSchema.safeParse({ profileImageShape: 'rounded' }).success).toBe(true)
  })

  it('accepts profileImageShape = none', () => {
    expect(aboutSettingsSchema.safeParse({ profileImageShape: 'none' }).success).toBe(true)
  })

  it('rejects invalid profileImageShape', () => {
    expect(aboutSettingsSchema.safeParse({ profileImageShape: 'square' }).success).toBe(false)
  })

  it('accepts empty skills array', () => {
    expect(aboutSettingsSchema.safeParse({ skills: [] }).success).toBe(true)
  })

  it('rejects skills with non-string items', () => {
    expect(aboutSettingsSchema.safeParse({ skills: [123] }).success).toBe(false)
  })

  it('accepts yearsExperience as 0', () => {
    expect(aboutSettingsSchema.safeParse({ yearsExperience: 0 }).success).toBe(true)
  })
})

// ============================================
// testimonialSettingsSchema
// ============================================

describe('testimonialSettingsSchema — exhaustive', () => {
  it('passes with required fields', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 5 }).success).toBe(
      true
    )
  })

  it('fails when showOnAbout is missing', () => {
    expect(testimonialSettingsSchema.safeParse({ maxDisplay: 5 }).success).toBe(false)
  })

  it('fails when maxDisplay is missing', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: false }).success).toBe(false)
  })

  it('fails when maxDisplay is 0', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 0 }).success).toBe(
      false
    )
  })

  it('fails when maxDisplay exceeds 20', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 21 }).success).toBe(
      false
    )
  })

  it('passes when maxDisplay is 1', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 1 }).success).toBe(
      true
    )
  })

  it('passes when maxDisplay is 20', () => {
    expect(testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 20 }).success).toBe(
      true
    )
  })

  it('accepts optional title', () => {
    expect(
      testimonialSettingsSchema.safeParse({ showOnAbout: true, maxDisplay: 3, title: 'Reviews' })
        .success
    ).toBe(true)
  })
})

// ============================================
// contactSettingsSchema
// ============================================

describe('contactSettingsSchema — exhaustive', () => {
  const validCS = { email: 'info@paola.es', showSocialLinks: true }

  it('passes with required email and showSocialLinks', () => {
    expect(contactSettingsSchema.safeParse(validCS).success).toBe(true)
  })

  it('fails when email is missing', () => {
    expect(contactSettingsSchema.safeParse({ showSocialLinks: true }).success).toBe(false)
  })

  it('fails when showSocialLinks is missing', () => {
    expect(contactSettingsSchema.safeParse({ email: 'a@b.com' }).success).toBe(false)
  })

  it('fails with invalid email', () => {
    expect(contactSettingsSchema.safeParse({ email: 'bad', showSocialLinks: false }).success).toBe(
      false
    )
  })

  it('passes with all optional fields', () => {
    const r = contactSettingsSchema.safeParse({
      ...validCS,
      pageTitle: 'Contacto',
      illustrationUrl: 'https://img.test/ill.png',
      illustrationAlt: 'Alt',
      ownerName: 'Paola',
      phone: '+34 600 000 000',
      whatsapp: '+34 600 000 000',
      location: 'Madrid',
      formTitle: 'Formulario',
      nameLabel: 'Nombre',
      emailLabel: 'Email',
      phoneLabel: 'Teléfono',
      messageLabel: 'Mensaje',
      preferenceLabel: 'Preferencia',
      submitLabel: 'Enviar',
      successTitle: 'Enviado',
      successMessage: 'Te responderemos pronto',
      sendAnotherLabel: 'Enviar otro',
    })
    expect(r.success).toBe(true)
  })

  it('accepts showSocialLinks = false', () => {
    expect(
      contactSettingsSchema.safeParse({ email: 'a@b.com', showSocialLinks: false }).success
    ).toBe(true)
  })
})

// ============================================
// projectSettingsSchema
// ============================================

describe('projectSettingsSchema — exhaustive', () => {
  it('passes with all booleans and gridColumns', () => {
    expect(
      projectSettingsSchema.safeParse({
        showCardTitles: true,
        showCardCategory: true,
        gridColumns: 3,
      }).success
    ).toBe(true)
  })

  it('fails when showCardTitles is missing', () => {
    expect(
      projectSettingsSchema.safeParse({ showCardCategory: true, gridColumns: 2 }).success
    ).toBe(false)
  })

  it('fails when gridColumns is 0', () => {
    expect(
      projectSettingsSchema.safeParse({
        showCardTitles: true,
        showCardCategory: true,
        gridColumns: 0,
      }).success
    ).toBe(false)
  })

  it('fails when gridColumns exceeds 4', () => {
    expect(
      projectSettingsSchema.safeParse({
        showCardTitles: true,
        showCardCategory: true,
        gridColumns: 5,
      }).success
    ).toBe(false)
  })

  it('passes with gridColumns = 1', () => {
    expect(
      projectSettingsSchema.safeParse({
        showCardTitles: false,
        showCardCategory: false,
        gridColumns: 1,
      }).success
    ).toBe(true)
  })

  it('passes with gridColumns = 4', () => {
    expect(
      projectSettingsSchema.safeParse({
        showCardTitles: true,
        showCardCategory: true,
        gridColumns: 4,
      }).success
    ).toBe(true)
  })
})

// ============================================
// categorySettingsSchema
// ============================================

describe('categorySettingsSchema — exhaustive', () => {
  it('passes with defaults via empty parse', () => {
    const r = categorySettingsSchema.safeParse({})
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.showDescription).toBe(true)
      expect(r.data.showProjectCount).toBe(true)
      expect(r.data.gridColumns).toBe(4)
    }
  })

  it('overrides defaults', () => {
    const r = categorySettingsSchema.safeParse({
      showDescription: false,
      showProjectCount: false,
      gridColumns: 2,
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.showDescription).toBe(false)
      expect(r.data.gridColumns).toBe(2)
    }
  })

  it('fails when gridColumns exceeds 5', () => {
    expect(categorySettingsSchema.safeParse({ gridColumns: 6 }).success).toBe(false)
  })

  it('fails when gridColumns is 0', () => {
    expect(categorySettingsSchema.safeParse({ gridColumns: 0 }).success).toBe(false)
  })

  it('passes with gridColumns = 5', () => {
    expect(categorySettingsSchema.safeParse({ gridColumns: 5 }).success).toBe(true)
  })
})

// ============================================
// categorySchema — edge cases
// ============================================

describe('categorySchema — edge cases', () => {
  const valid = { name: 'Wedding', slug: 'wedding' }

  it('passes with valid data', () => {
    expect(categorySchema.safeParse(valid).success).toBe(true)
  })

  it('fails with empty name', () => {
    expect(categorySchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('fails with empty slug', () => {
    expect(categorySchema.safeParse({ ...valid, slug: '' }).success).toBe(false)
  })

  it('rejects slug with spaces', () => {
    expect(categorySchema.safeParse({ ...valid, slug: 'my wedding' }).success).toBe(false)
  })

  it('rejects slug with uppercase', () => {
    expect(categorySchema.safeParse({ ...valid, slug: 'Wedding' }).success).toBe(false)
  })

  it('rejects slug with special chars', () => {
    expect(categorySchema.safeParse({ ...valid, slug: 'wedding!' }).success).toBe(false)
  })

  it('accepts slug with numbers and hyphens', () => {
    expect(categorySchema.safeParse({ ...valid, slug: 'wedding-2025' }).success).toBe(true)
  })

  it('accepts optional coverImageUrl', () => {
    expect(
      categorySchema.safeParse({ ...valid, coverImageUrl: 'https://img.test/cover.jpg' }).success
    ).toBe(true)
  })

  it('accepts nullable coverImageUrl', () => {
    expect(categorySchema.safeParse({ ...valid, coverImageUrl: null }).success).toBe(true)
  })

  it('accepts optional sortOrder', () => {
    expect(categorySchema.safeParse({ ...valid, sortOrder: 5 }).success).toBe(true)
  })
})

// ============================================
// homeSettingsSchema — selected paths
// ============================================

describe('homeSettingsSchema — selected paths', () => {
  const minValid = { showFeaturedProjects: true, featuredCount: 4 }

  it('passes with minimal required fields', () => {
    expect(homeSettingsSchema.safeParse(minValid).success).toBe(true)
  })

  it('fails when showFeaturedProjects is missing', () => {
    expect(homeSettingsSchema.safeParse({ featuredCount: 4 }).success).toBe(false)
  })

  it('fails when featuredCount is missing', () => {
    expect(homeSettingsSchema.safeParse({ showFeaturedProjects: true }).success).toBe(false)
  })

  it('fails when featuredCount is 0', () => {
    expect(
      homeSettingsSchema.safeParse({ showFeaturedProjects: true, featuredCount: 0 }).success
    ).toBe(false)
  })

  it('fails when featuredCount exceeds 20', () => {
    expect(
      homeSettingsSchema.safeParse({ showFeaturedProjects: true, featuredCount: 21 }).success
    ).toBe(false)
  })

  it('accepts heroTitle1Color as valid hex', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, heroTitle1Color: '#FF0000' }).success).toBe(
      true
    )
  })

  it('rejects heroTitle1Color as 3-char hex (requires 6)', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, heroTitle1Color: '#FFF' }).success).toBe(
      false
    )
  })

  it('accepts nullable heroTitle1Color', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, heroTitle1Color: null }).success).toBe(true)
  })

  it('accepts illustrationOpacity = 0', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, illustrationOpacity: 0 }).success).toBe(true)
  })

  it('rejects illustrationOpacity > 100', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, illustrationOpacity: 101 }).success).toBe(
      false
    )
  })

  it('accepts ctaFontSize within 10-32', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, ctaFontSize: 16 }).success).toBe(true)
  })

  it('rejects ctaFontSize > 32', () => {
    expect(homeSettingsSchema.safeParse({ ...minValid, ctaFontSize: 33 }).success).toBe(false)
  })
})

// ============================================
// testimonialFormSchema — more edge cases
// ============================================

describe('testimonialFormSchema — more edge cases', () => {
  const valid = { name: 'Ana García', text: 'Excelente trabajo profesional' }

  it('passes with minimal fields and default rating', () => {
    const r = testimonialFormSchema.safeParse(valid)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.rating).toBe(5)
  })

  it('accepts rating of 3', () => {
    expect(testimonialFormSchema.safeParse({ ...valid, rating: 3 }).success).toBe(true)
  })

  it('rejects negative rating', () => {
    expect(testimonialFormSchema.safeParse({ ...valid, rating: -1 }).success).toBe(false)
  })

  it('accepts avatarUrl as optional', () => {
    expect(
      testimonialFormSchema.safeParse({ ...valid, avatarUrl: 'https://img.test/avatar.jpg' })
        .success
    ).toBe(true)
  })

  it('accepts position as optional string', () => {
    expect(testimonialFormSchema.safeParse({ ...valid, position: 'CEO' }).success).toBe(true)
  })
})

// ============================================
// themeEditorSchema — brand font constraints
// ============================================

describe('themeEditorSchema — brand fonts', () => {
  it('accepts brandFontSize up to 300', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, brandFontSize: 300 }).success).toBe(true)
  })

  it('rejects brandFontSize > 300', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, brandFontSize: 301 }).success).toBe(false)
  })

  it('accepts portfolioFontSize up to 300', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, portfolioFontSize: 300 }).success).toBe(
      true
    )
  })

  it('rejects portfolioFontSize below 10', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, portfolioFontSize: 9 }).success).toBe(false)
  })

  it('accepts signatureFontSize up to 200', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, signatureFontSize: 200 }).success).toBe(
      true
    )
  })

  it('rejects signatureFontSize > 200', () => {
    expect(themeEditorSchema.safeParse({ ...validTheme, signatureFontSize: 201 }).success).toBe(
      false
    )
  })
})
