import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    categorySettings: {
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
      categories: '/admin/categorias',
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
  categorySettingsSchema: { parse: vi.fn((d: unknown) => d) },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockCategorySettings = {
  id: 'category-settings-1',
  showDescription: true,
  showProjectCount: true,
  gridColumns: 4,
}

describe('Settings: Categories Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getCategorySettings ───────────────────────────

  describe('getCategorySettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)

      const { getCategorySettings } = await import('@/actions/settings/categories')
      const result = await getCategorySettings()

      expect(result).toEqual(mockCategorySettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(null as never)

      const { getCategorySettings } = await import('@/actions/settings/categories')
      const result = await getCategorySettings()

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { getCategorySettings } = await import('@/actions/settings/categories')
      const result = await getCategorySettings()

      expect(result).toBeNull()
    })

    it('calls prisma.categorySettings.findFirst', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)

      const { getCategorySettings } = await import('@/actions/settings/categories')
      await getCategorySettings()

      expect(prisma.categorySettings.findFirst).toHaveBeenCalled()
    })

    it('returns category-specific fields', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)

      const { getCategorySettings } = await import('@/actions/settings/categories')
      const result = await getCategorySettings()

      expect(result!.showDescription).toBe(true)
      expect(result!.showProjectCount).toBe(true)
      expect(result!.gridColumns).toBe(4)
    })
  })

  // ─── updateCategorySettings ────────────────────────

  describe('updateCategorySettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)
      vi.mocked(prisma.categorySettings.update).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      const result = await updateCategorySettings({
        showDescription: false,
        showProjectCount: true,
        gridColumns: 3,
      })

      expect(result.success).toBe(true)
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.categorySettings.create).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      const result = await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(result.success).toBe(true)
      expect(prisma.categorySettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)
      vi.mocked(prisma.categorySettings.update).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)
      vi.mocked(prisma.categorySettings.update).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('validates data via validateAndSanitize', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)
      vi.mocked(prisma.categorySettings.update).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockResolvedValue(mockCategorySettings as never)
      vi.mocked(prisma.categorySettings.update).mockResolvedValue(mockCategorySettings as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on validation failure', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      vi.mocked(validateAndSanitize).mockReturnValueOnce({
        success: false,
        error: 'Datos inválidos',
      } as never)

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      const result = await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 0,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.categorySettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      const result = await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(result.success).toBe(false)
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateCategorySettings } = await import('@/actions/settings/categories')
      const result = await updateCategorySettings({
        showDescription: true,
        showProjectCount: true,
        gridColumns: 4,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
