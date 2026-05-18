import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockPrisma = vi.hoisted(() => ({
  siteSettings: { findFirst: vi.fn() },
  category: { findMany: vi.fn() },
  service: { findMany: vi.fn() },
}))

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    public: {
      about: '/sobre-mi',
      contact: '/contacto',
      portfolio: '/portfolio',
      services: '/servicios',
      privacy: '/privacidad',
    },
  },
}))

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.siteSettings.findFirst.mockResolvedValue({ updatedAt: new Date('2026-01-01') })
    mockPrisma.category.findMany.mockResolvedValue([])
    mockPrisma.service.findMany.mockResolvedValue([])
  })

  it('only includes public categories and services', async () => {
    const sitemap = (await import('@/app/sitemap')).default

    await sitemap()

    expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null, isActive: true },
      })
    )
    expect(mockPrisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null, isActive: true },
      })
    )
  })
})
