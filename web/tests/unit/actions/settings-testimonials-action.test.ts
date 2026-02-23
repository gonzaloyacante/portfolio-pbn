import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    testimonialSettings: {
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
      testimonials: '/admin/testimonios',
      settings: '/admin/configuracion',
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
  testimonialSettingsSchema: { parse: vi.fn((d: unknown) => d) },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockTestimonialSettings = {
  id: 'testimonial-settings-1',
  showOnAbout: true,
  title: 'Lo que dicen de mí',
  maxDisplay: 3,
}

describe('Settings: Testimonials Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getTestimonialSettings ────────────────────────

  describe('getTestimonialSettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { getTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await getTestimonialSettings()

      expect(result).toEqual(mockTestimonialSettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(null as never)

      const { getTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await getTestimonialSettings()

      expect(result).toBeNull()
    })

    it('calls prisma.testimonialSettings.findFirst', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { getTestimonialSettings } = await import('@/actions/settings/testimonials')
      await getTestimonialSettings()

      expect(prisma.testimonialSettings.findFirst).toHaveBeenCalled()
    })

    it('returns testimonial-specific fields', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { getTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await getTestimonialSettings()

      expect(result!.showOnAbout).toBe(true)
      expect(result!.title).toBe('Lo que dicen de mí')
      expect(result!.maxDisplay).toBe(3)
    })
  })

  // ─── updateTestimonialSettings ─────────────────────

  describe('updateTestimonialSettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )
      vi.mocked(prisma.testimonialSettings.update).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await updateTestimonialSettings({
        showOnAbout: false,
        title: 'Testimonios',
        maxDisplay: 5,
      })

      expect(result.success).toBe(true)
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.testimonialSettings.create).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await updateTestimonialSettings({
        showOnAbout: true,
        title: 'Testimonios',
        maxDisplay: 3,
      })

      expect(result.success).toBe(true)
      expect(prisma.testimonialSettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )
      vi.mocked(prisma.testimonialSettings.update).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      await updateTestimonialSettings({ showOnAbout: true, title: 'Test', maxDisplay: 3 })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )
      vi.mocked(prisma.testimonialSettings.update).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      await updateTestimonialSettings({ showOnAbout: true, title: 'Test', maxDisplay: 3 })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('validates data via validateAndSanitize', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )
      vi.mocked(prisma.testimonialSettings.update).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      await updateTestimonialSettings({ showOnAbout: true, title: 'Test', maxDisplay: 3 })

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockResolvedValue(
        mockTestimonialSettings as never
      )
      vi.mocked(prisma.testimonialSettings.update).mockResolvedValue(
        mockTestimonialSettings as never
      )

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      await updateTestimonialSettings({ showOnAbout: true, title: 'Test', maxDisplay: 3 })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on validation failure', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      vi.mocked(validateAndSanitize).mockReturnValueOnce({
        success: false,
        error: 'Datos inválidos',
      } as never)

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await updateTestimonialSettings({
        showOnAbout: true,
        title: '',
        maxDisplay: 0,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonialSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await updateTestimonialSettings({
        showOnAbout: true,
        title: 'Test',
        maxDisplay: 3,
      })

      expect(result.success).toBe(false)
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateTestimonialSettings } = await import('@/actions/settings/testimonials')
      const result = await updateTestimonialSettings({
        showOnAbout: true,
        title: 'Test',
        maxDisplay: 3,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
