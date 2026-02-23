import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    homeSettings: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
  guardSettingsAction: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('@/lib/security-client', () => ({
  validateAndSanitize: vi.fn((schema: unknown, data: unknown) => ({ success: true, data })),
  validateFontUrl: vi.fn(() => true),
  validateColor: vi.fn(() => true),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
  checkSettingsRateLimit: vi.fn().mockResolvedValue(undefined),
  getClientIp: vi.fn().mockResolvedValue('127.0.0.1'),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: Function) => fn),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    homeSettings: 'home-settings',
    aboutSettings: 'about-settings',
    contactSettings: 'contact-settings',
    siteSettings: 'site-settings',
    projectSettings: 'project-settings',
    categorySettings: 'category-settings',
    testimonialSettings: 'testimonial-settings',
    projects: 'projects',
    testimonials: 'testimonials',
    categories: 'categories',
    social: 'social',
    services: 'services',
  },
  CACHE_DURATIONS: { SHORT: 60, MEDIUM: 300, LONG: 1800, VERY_LONG: 3600 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    admin: {
      home: '/admin/inicio',
      settings: '/admin/configuracion',
      projects: '/admin/proyectos',
    },
    public: {
      home: '/',
      about: '/sobre-mi',
      contact: '/contacto',
      projects: '/proyectos',
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/validations', () => ({
  homeSettingsSchema: { partial: () => ({ parse: vi.fn((d: unknown) => d) }) },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockHomeSettings = {
  id: 'home-1',
  heroTitle1Text: 'Bienvenida',
  heroTitle1Font: 'Great Vibes',
  heroTitle1FontUrl: 'https://fonts.googleapis.com/css2?family=Great+Vibes',
  heroTitle1FontSize: 72,
  heroTitle1Color: '#6C0A0A',
  heroTitle1ColorDark: '#FB7185',
  heroTitle1ZIndex: 10,
  heroTitle1OffsetX: 0,
  heroTitle1OffsetY: 0,
  heroTitle2Text: 'Portfolio',
  heroTitle2Font: 'Poppins',
  heroTitle2FontUrl: null,
  heroTitle2FontSize: 96,
  heroTitle2Color: '#1A050A',
  heroTitle2ColorDark: '#FAFAFA',
  heroTitle2ZIndex: 10,
  heroTitle2OffsetX: 0,
  heroTitle2OffsetY: 0,
  ownerNameText: 'Paola Bolívar',
  ownerNameFont: 'Open Sans',
  ownerNameFontUrl: null,
  ownerNameFontSize: 28,
  ownerNameColor: '#1A050A',
  ownerNameColorDark: '#FAFAFA',
  ownerNameZIndex: 5,
  ownerNameOffsetX: 0,
  ownerNameOffsetY: 0,
  heroMainImageUrl: 'https://res.cloudinary.com/test/image.jpg',
  heroMainImageAlt: 'Hero image',
  heroMainImageCaption: null,
  heroImageStyle: 'default',
  heroMainImageZIndex: 1,
  heroMainImageOffsetX: 0,
  heroMainImageOffsetY: 0,
  illustrationUrl: null,
  illustrationAlt: null,
  illustrationZIndex: 0,
  illustrationOpacity: 100,
  illustrationSize: 60,
  illustrationOffsetX: 0,
  illustrationOffsetY: 0,
  illustrationRotation: 0,
  ctaText: 'Ver proyectos',
  ctaLink: '/proyectos',
  ctaFont: null,
  ctaFontUrl: null,
  ctaFontSize: 18,
  ctaVariant: 'default',
  ctaSize: 'lg',
  ctaOffsetX: 0,
  ctaOffsetY: 0,
  heroTitle1MobileOffsetX: 0,
  heroTitle1MobileOffsetY: 0,
  heroTitle1MobileFontSize: 56,
  heroTitle2MobileOffsetX: 0,
  heroTitle2MobileOffsetY: 0,
  heroTitle2MobileFontSize: 72,
  ownerNameMobileOffsetX: 0,
  ownerNameMobileOffsetY: 0,
  ownerNameMobileFontSize: 28,
  heroMainImageMobileOffsetX: 0,
  heroMainImageMobileOffsetY: 0,
  illustrationMobileOffsetX: 0,
  illustrationMobileOffsetY: 0,
  illustrationMobileSize: 60,
  illustrationMobileRotation: 0,
  ctaMobileOffsetX: 0,
  ctaMobileOffsetY: 0,
  ctaMobileFontSize: 16,
  showFeaturedProjects: true,
  featuredTitle: 'Destacados',
  featuredTitleFont: null,
  featuredTitleFontUrl: null,
  featuredTitleFontSize: null,
  featuredTitleColor: null,
  featuredTitleColorDark: null,
  featuredCount: 3,
  isActive: true,
}

describe('Settings: Home Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getHomeSettings ───────────────────────────────

  describe('getHomeSettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)

      const { getHomeSettings } = await import('@/actions/settings/home')
      const result = await getHomeSettings()

      expect(result).toEqual(mockHomeSettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(null as never)

      const { getHomeSettings } = await import('@/actions/settings/home')
      const result = await getHomeSettings()

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockRejectedValue(new Error('DB connection failed'))

      const { getHomeSettings } = await import('@/actions/settings/home')
      const result = await getHomeSettings()

      expect(result).toBeNull()
    })

    it('calls prisma.homeSettings.findFirst with isActive filter', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)

      const { getHomeSettings } = await import('@/actions/settings/home')
      await getHomeSettings()

      expect(prisma.homeSettings.findFirst).toHaveBeenCalledWith({
        where: { isActive: true },
      })
    })

    it('returns data with many fields (100+ fields)', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)

      const { getHomeSettings } = await import('@/actions/settings/home')
      const result = await getHomeSettings()

      expect(result).toBeDefined()
      expect(Object.keys(result!).length).toBeGreaterThan(30)
      expect(result!.heroTitle1Text).toBe('Bienvenida')
      expect(result!.showFeaturedProjects).toBe(true)
      expect(result!.featuredCount).toBe(3)
    })
  })

  // ─── updateHomeSettings ────────────────────────────

  describe('updateHomeSettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const result = await updateHomeSettings({ heroTitle1Text: 'Nuevo título' })

      expect(result.success).toBe(true)
      expect(result.settings).toBeDefined()
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.homeSettings.create).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const result = await updateHomeSettings({ heroTitle1Text: 'Nuevo' })

      expect(result.success).toBe(true)
      expect(prisma.homeSettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      await updateHomeSettings({ heroTitle1Text: 'Test' })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      await updateHomeSettings({ heroTitle1Text: 'Test' })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('validates data via validateAndSanitize', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const data = { heroTitle1Text: 'Hola' }
      await updateHomeSettings(data)

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      await updateHomeSettings({ heroTitle1Text: 'Test' })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on validation failure', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      vi.mocked(validateAndSanitize).mockReturnValueOnce({
        success: false,
        error: 'Datos inválidos',
      } as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const result = await updateHomeSettings({ heroTitle1Text: '' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const result = await updateHomeSettings({ heroTitle1Text: 'Test' })

      expect(result.success).toBe(false)
    })

    it('validates font URLs', async () => {
      const { validateFontUrl } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      await updateHomeSettings({
        heroTitle1FontUrl: 'https://fonts.googleapis.com/css2?family=Poppins',
      })

      expect(validateFontUrl).toHaveBeenCalled()
    })

    it('validates colors', async () => {
      const { validateColor } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.homeSettings.findFirst).mockResolvedValue(mockHomeSettings as never)
      vi.mocked(prisma.homeSettings.update).mockResolvedValue(mockHomeSettings as never)

      const { updateHomeSettings } = await import('@/actions/settings/home')
      await updateHomeSettings({ heroTitle1Color: '#FF0000' })

      expect(validateColor).toHaveBeenCalled()
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateHomeSettings } = await import('@/actions/settings/home')
      const result = await updateHomeSettings({ heroTitle1Text: 'Test' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
