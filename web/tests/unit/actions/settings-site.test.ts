import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    siteSettings: {
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
  siteSettingsSchema: {
    partial: () => ({ safeParse: vi.fn((d: unknown) => ({ success: true, data: d })) }),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockSiteSettings = {
  id: 'site-1',
  siteName: 'Paola Bolívar Nievas',
  siteTagline: 'Fotografía & Arte Visual',
  logoUrl: 'https://res.cloudinary.com/test/logo.png',
  faviconUrl: 'https://res.cloudinary.com/test/favicon.ico',
  defaultEmail: 'info@paolabolivar.es',
  defaultPhone: '+34 600 000 000',
  defaultWhatsapp: '+34 600 000 000',
  maintenanceMode: false,
  showAboutPage: true,
  showProjectsPage: true,
  showServicesPage: false,
  showContactPage: true,
  allowIndexing: true,
  isActive: true,
}

const mockVisibility = {
  showAboutPage: true,
  showProjectsPage: true,
  showServicesPage: false,
  showContactPage: true,
  maintenanceMode: false,
}

describe('Settings: Site Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getSiteSettings ───────────────────────────────

  describe('getSiteSettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)

      const { getSiteSettings } = await import('@/actions/settings/site')
      const result = await getSiteSettings()

      expect(result).toEqual(mockSiteSettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(null as never)

      const { getSiteSettings } = await import('@/actions/settings/site')
      const result = await getSiteSettings()

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { getSiteSettings } = await import('@/actions/settings/site')
      const result = await getSiteSettings()

      expect(result).toBeNull()
    })

    it('calls prisma with isActive filter and select clause', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)

      const { getSiteSettings } = await import('@/actions/settings/site')
      await getSiteSettings()

      expect(prisma.siteSettings.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          select: expect.objectContaining({
            id: true,
            siteName: true,
            maintenanceMode: true,
          }),
        })
      )
    })

    it('returns site-specific fields', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)

      const { getSiteSettings } = await import('@/actions/settings/site')
      const result = await getSiteSettings()

      expect(result!.siteName).toBe('Paola Bolívar Nievas')
      expect(result!.maintenanceMode).toBe(false)
      expect(result!.allowIndexing).toBe(true)
    })
  })

  // ─── getPageVisibility ─────────────────────────────

  describe('getPageVisibility', () => {
    it('returns page visibility fields when settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockVisibility as never)

      const { getPageVisibility } = await import('@/actions/settings/site')
      const result = await getPageVisibility()

      expect(result.showAboutPage).toBe(true)
      expect(result.showProjectsPage).toBe(true)
      expect(result.showServicesPage).toBe(false)
      expect(result.showContactPage).toBe(true)
      expect(result.maintenanceMode).toBe(false)
    })

    it('returns defaults when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(null as never)

      const { getPageVisibility } = await import('@/actions/settings/site')
      const result = await getPageVisibility()

      expect(result.showAboutPage).toBe(true)
      expect(result.showProjectsPage).toBe(true)
      expect(result.showServicesPage).toBe(false)
      expect(result.showContactPage).toBe(true)
      expect(result.maintenanceMode).toBe(false)
    })

    it('returns defaults on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { getPageVisibility } = await import('@/actions/settings/site')
      const result = await getPageVisibility()

      expect(result.showAboutPage).toBe(true)
      expect(result.maintenanceMode).toBe(false)
    })
  })

  // ─── updateSiteSettings ────────────────────────────

  describe('updateSiteSettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)
      vi.mocked(prisma.siteSettings.update).mockResolvedValue(mockSiteSettings as never)

      const { updateSiteSettings } = await import('@/actions/settings/site')
      const result = await updateSiteSettings({ siteName: 'Nuevo nombre' })

      expect(result.success).toBe(true)
      expect(result.settings).toBeDefined()
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.siteSettings.create).mockResolvedValue(mockSiteSettings as never)

      const { updateSiteSettings } = await import('@/actions/settings/site')
      const result = await updateSiteSettings({ siteName: 'Nuevo' })

      expect(result.success).toBe(true)
      expect(prisma.siteSettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)
      vi.mocked(prisma.siteSettings.update).mockResolvedValue(mockSiteSettings as never)

      const { updateSiteSettings } = await import('@/actions/settings/site')
      await updateSiteSettings({ siteName: 'Test' })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)
      vi.mocked(prisma.siteSettings.update).mockResolvedValue(mockSiteSettings as never)

      const { updateSiteSettings } = await import('@/actions/settings/site')
      await updateSiteSettings({ siteName: 'Test' })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(mockSiteSettings as never)
      vi.mocked(prisma.siteSettings.update).mockResolvedValue(mockSiteSettings as never)

      const { updateSiteSettings } = await import('@/actions/settings/site')
      await updateSiteSettings({ siteName: 'Test' })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.siteSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateSiteSettings } = await import('@/actions/settings/site')
      const result = await updateSiteSettings({ siteName: 'Test' })

      expect(result.success).toBe(false)
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateSiteSettings } = await import('@/actions/settings/site')
      const result = await updateSiteSettings({ siteName: 'Test' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
