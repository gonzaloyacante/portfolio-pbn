import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    socialLink: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('@/lib/security-client', () => ({
  validateAndSanitize: vi.fn((schema: unknown, data: unknown) => ({ success: true, data })),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
  checkSettingsRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: Function) => fn),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    socialLinks: 'social-links',
  },
  CACHE_DURATIONS: { SHORT: 60, MEDIUM: 300, LONG: 1800 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    admin: { settings: '/admin/configuracion' },
    public: { home: '/' },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
}))

// ─── Helpers ────────────────────────────────────────

const mockSocialLink = {
  id: 'sl-1',
  platform: 'instagram',
  url: 'https://instagram.com/test',
  username: '@test',
  icon: 'instagram',
  isActive: true,
  sortOrder: 0,
}

describe('Social Actions (settings/social)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getSocialLinks ───────────────────────────────

  describe('getSocialLinks', () => {
    it('returns active social links', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.findMany).mockResolvedValue([mockSocialLink] as never)

      const { getSocialLinks } = await import('@/actions/settings/social')
      const result = await getSocialLinks()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockSocialLink)
    })

    it('returns empty array for none', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.findMany).mockResolvedValue([] as never)

      const { getSocialLinks } = await import('@/actions/settings/social')
      const result = await getSocialLinks()

      expect(result).toEqual([])
    })

    it('orders by sortOrder', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.findMany).mockResolvedValue([] as never)

      const { getSocialLinks } = await import('@/actions/settings/social')
      await getSocialLinks()

      expect(prisma.socialLink.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { sortOrder: 'asc' },
        })
      )
    })

    it('handles DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.findMany).mockRejectedValue(new Error('DB error'))

      const { getSocialLinks } = await import('@/actions/settings/social')
      const result = await getSocialLinks()

      expect(result).toEqual([])
    })
  })

  // ─── upsertSocialLink ────────────────────────────

  describe('upsertSocialLink', () => {
    it('creates/updates social link', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.upsert).mockResolvedValue(mockSocialLink as never)

      const { upsertSocialLink } = await import('@/actions/settings/social')
      const result = await upsertSocialLink({
        platform: 'instagram',
        url: 'https://instagram.com/test',
        username: '@test',
        icon: 'instagram',
        isActive: true,
        sortOrder: 0,
      })

      expect(result.success).toBe(true)
      expect(prisma.socialLink.upsert).toHaveBeenCalled()
    })

    it('requires admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.upsert).mockResolvedValue(mockSocialLink as never)

      const { upsertSocialLink } = await import('@/actions/settings/social')
      await upsertSocialLink({
        platform: 'instagram',
        url: 'https://instagram.com/test',
        username: null,
        icon: null,
        isActive: true,
        sortOrder: 0,
      })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('validates data', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.upsert).mockResolvedValue(mockSocialLink as never)

      const { upsertSocialLink } = await import('@/actions/settings/social')
      await upsertSocialLink({
        platform: 'instagram',
        url: 'https://instagram.com/test',
        username: null,
        icon: null,
        isActive: true,
        sortOrder: 0,
      })

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.upsert).mockResolvedValue(mockSocialLink as never)

      const { upsertSocialLink } = await import('@/actions/settings/social')
      await upsertSocialLink({
        platform: 'instagram',
        url: 'https://instagram.com/test',
        username: null,
        icon: null,
        isActive: true,
        sortOrder: 0,
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

      const { upsertSocialLink } = await import('@/actions/settings/social')
      const result = await upsertSocialLink({
        platform: '',
        url: '',
        username: null,
        icon: null,
        isActive: true,
        sortOrder: 0,
      })

      expect(result.success).toBe(false)
    })

    it('returns access denied when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { upsertSocialLink } = await import('@/actions/settings/social')
      const result = await upsertSocialLink({
        platform: 'instagram',
        url: 'https://instagram.com/test',
        username: null,
        icon: null,
        isActive: true,
        sortOrder: 0,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })

  // ─── deleteSocialLink ─────────────────────────────

  describe('deleteSocialLink', () => {
    it('deletes social link', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.delete).mockResolvedValue(mockSocialLink as never)

      const { deleteSocialLink } = await import('@/actions/settings/social')
      const result = await deleteSocialLink('sl-1')

      expect(result.success).toBe(true)
      expect(prisma.socialLink.delete).toHaveBeenCalledWith({ where: { id: 'sl-1' } })
    })

    it('requires admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.delete).mockResolvedValue(mockSocialLink as never)

      const { deleteSocialLink } = await import('@/actions/settings/social')
      await deleteSocialLink('sl-1')

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.socialLink.delete).mockRejectedValue(new Error('DB error'))

      const { deleteSocialLink } = await import('@/actions/settings/social')
      const result = await deleteSocialLink('non-existent')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns access denied when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { deleteSocialLink } = await import('@/actions/settings/social')
      const result = await deleteSocialLink('sl-1')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
