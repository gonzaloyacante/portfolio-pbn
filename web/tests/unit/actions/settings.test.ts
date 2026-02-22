import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getThemeValues, updateThemeSettings, resetThemeToDefaults } from '@/actions/settings/theme'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    themeSettings: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

// Mock admin auth
vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
  guardSettingsAction: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

// Mock rate-limit guards
vi.mock('@/lib/rate-limit-guards', () => ({
  checkSettingsRateLimit: vi.fn().mockResolvedValue(undefined),
}))

// Mock next/cache (unstable_cache just calls the wrapped fn directly)
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

import { prisma } from '@/lib/db'

const mockPrisma = prisma as {
  themeSettings: {
    findFirst: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    updateMany: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
}

const mockThemeSettings = {
  id: 'theme-1',
  isActive: true,
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
  brandFontSize: null,
  portfolioFont: null,
  portfolioFontUrl: null,
  portfolioFontSize: null,
  signatureFont: null,
  signatureFontUrl: null,
  signatureFontSize: null,
  borderRadius: 8,
}

describe('getThemeValues', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns CSS variables from stored settings', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue(mockThemeSettings)

    const values = await getThemeValues()

    expect(values['--primary']).toBe('#6c0a0a')
    expect(values['--background']).toBe('#fff8fc')
    expect(values['--foreground']).toBe('#1a050a')
  })

  it('wraps font names in quotes with fallback', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue(mockThemeSettings)

    const values = await getThemeValues()

    expect(values['--font-heading']).toBe('"Poppins", sans-serif')
    expect(values['--font-script']).toBe('"Great Vibes", cursive')
    expect(values['--font-body']).toBe('"Open Sans", sans-serif')
  })

  it('returns font size as px string', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue(mockThemeSettings)

    const values = await getThemeValues()

    expect(values['--font-heading-size']).toBe('48px')
    expect(values['--font-body-size']).toBe('16px')
    expect(values['--radius']).toBe('8px')
  })

  it('returns DEFAULT_CSS_VARIABLES when no settings in DB', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue(null)

    const values = await getThemeValues()

    // Should return non-empty defaults
    expect(Object.keys(values).length).toBeGreaterThan(0)
  })

  it('falls back to "inherit" for null optional fonts', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue({
      ...mockThemeSettings,
      brandFont: null,
      signatureFont: null,
    })

    const values = await getThemeValues()

    expect(values['--font-brand']).toBe('inherit')
    expect(values['--font-signature']).toBe('inherit')
  })
})

describe('updateThemeSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // findFirst returns existing settings so we go through the `update` path
    mockPrisma.themeSettings.findFirst.mockResolvedValue(mockThemeSettings)
    mockPrisma.themeSettings.update.mockResolvedValue(mockThemeSettings)
    mockPrisma.themeSettings.create.mockResolvedValue(mockThemeSettings)
  })

  it('returns success with valid color data', async () => {
    const result = await updateThemeSettings({ primaryColor: '#6c0a0a' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid color values', async () => {
    const result = await updateThemeSettings({ primaryColor: 'not-a-color' as string })
    expect(result.success).toBe(false)
    expect(result.error).toContain('Color inválido')
  })

  it('rejects invalid font URL', async () => {
    const result = await updateThemeSettings({
      headingFontUrl: 'javascript:alert(1)',
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('inválida')
  })

  it('accepts valid Google Fonts URL', async () => {
    const result = await updateThemeSettings({
      headingFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins',
    })
    expect(result.success).toBe(true)
  })

  it('creates settings when none exist in DB', async () => {
    mockPrisma.themeSettings.findFirst.mockResolvedValue(null)
    const result = await updateThemeSettings({ primaryColor: '#6c0a0a' })
    expect(result.success).toBe(true)
    expect(mockPrisma.themeSettings.create).toHaveBeenCalledOnce()
  })
})

describe('resetThemeToDefaults', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.themeSettings.deleteMany.mockResolvedValue({ count: 1 })
    mockPrisma.themeSettings.create.mockResolvedValue(mockThemeSettings)
  })

  it('deletes current settings and creates new defaults', async () => {
    const result = await resetThemeToDefaults()
    expect(result.success).toBe(true)
    expect(mockPrisma.themeSettings.deleteMany).toHaveBeenCalledOnce()
    expect(mockPrisma.themeSettings.create).toHaveBeenCalledOnce()
  })

  it('returns success message', async () => {
    const result = await resetThemeToDefaults()
    expect(result).toMatchObject({ success: true })
  })
})
