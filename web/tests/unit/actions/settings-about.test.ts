import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    aboutSettings: {
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
      about: '/admin/sobre-mi',
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
  aboutSettingsSchema: { partial: () => ({ parse: vi.fn((d: unknown) => d) }) },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockAboutSettings = {
  id: 'about-1',
  illustrationUrl: 'https://res.cloudinary.com/test/about-illustration.png',
  illustrationAlt: 'Ilustración sobre mí',
  bioTitle: 'Hola, soy Paola.',
  bioIntro: 'Soy fotógrafa y artista visual.',
  bioDescription: 'Con más de 10 años de experiencia...',
  profileImageUrl: 'https://res.cloudinary.com/test/profile.jpg',
  profileImageAlt: 'Paola Bolívar Nievas',
  profileImageShape: 'circle',
  skills: ['Fotografía', 'Edición', 'Dirección de arte'],
  yearsExperience: 10,
  certifications: ['Adobe Certified'],
  isActive: true,
}

describe('Settings: About Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getAboutSettings ──────────────────────────────

  describe('getAboutSettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)

      const { getAboutSettings } = await import('@/actions/settings/about')
      const result = await getAboutSettings()

      expect(result).toEqual(mockAboutSettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(null as never)

      const { getAboutSettings } = await import('@/actions/settings/about')
      const result = await getAboutSettings()

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { getAboutSettings } = await import('@/actions/settings/about')
      const result = await getAboutSettings()

      expect(result).toBeNull()
    })

    it('calls prisma.aboutSettings.findFirst with isActive filter', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)

      const { getAboutSettings } = await import('@/actions/settings/about')
      await getAboutSettings()

      expect(prisma.aboutSettings.findFirst).toHaveBeenCalledWith({
        where: { isActive: true },
      })
    })

    it('returns about-specific fields like skills and certifications', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)

      const { getAboutSettings } = await import('@/actions/settings/about')
      const result = await getAboutSettings()

      expect(result!.skills).toEqual(['Fotografía', 'Edición', 'Dirección de arte'])
      expect(result!.certifications).toEqual(['Adobe Certified'])
      expect(result!.yearsExperience).toBe(10)
      expect(result!.bioTitle).toBe('Hola, soy Paola.')
    })
  })

  // ─── updateAboutSettings ───────────────────────────

  describe('updateAboutSettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      const result = await updateAboutSettings({ bioTitle: 'Nuevo título' })

      expect(result.success).toBe(true)
      expect(result.settings).toBeDefined()
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.aboutSettings.create).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      const result = await updateAboutSettings({ bioTitle: 'Nuevo' })

      expect(result.success).toBe(true)
      expect(prisma.aboutSettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      await updateAboutSettings({ bioTitle: 'Test' })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      await updateAboutSettings({ bioTitle: 'Test' })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('validates data via validateAndSanitize', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      await updateAboutSettings({ bioTitle: 'Test' })

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(mockAboutSettings as never)
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue(mockAboutSettings as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      await updateAboutSettings({ bioTitle: 'Test' })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on validation failure', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      vi.mocked(validateAndSanitize).mockReturnValueOnce({
        success: false,
        error: 'Datos inválidos',
      } as never)

      const { updateAboutSettings } = await import('@/actions/settings/about')
      const result = await updateAboutSettings({ bioTitle: '' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.aboutSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateAboutSettings } = await import('@/actions/settings/about')
      const result = await updateAboutSettings({ bioTitle: 'Test' })

      expect(result.success).toBe(false)
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateAboutSettings } = await import('@/actions/settings/about')
      const result = await updateAboutSettings({ bioTitle: 'Test' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
