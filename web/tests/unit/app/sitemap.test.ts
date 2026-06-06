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
      sitemap: '/sitemap.xml',
      robots: '/robots.txt',
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

  it('returns no urls when indexing is disabled', async () => {
    mockPrisma.siteSettings.findFirst.mockResolvedValueOnce({
      updatedAt: new Date('2026-01-01'),
      allowIndexing: false,
    })
    const sitemap = (await import('@/app/sitemap')).default

    await expect(sitemap()).resolves.toEqual([])
  })

  it('respects page visibility settings', async () => {
    mockPrisma.siteSettings.findFirst.mockResolvedValueOnce({
      updatedAt: new Date('2026-01-01'),
      showAboutPage: false,
      showGalleryPage: false,
      showServicesPage: true,
      showContactPage: true,
      allowIndexing: true,
    })
    mockPrisma.category.findMany.mockResolvedValueOnce([
      {
        slug: 'oculta',
        updatedAt: new Date('2026-01-02'),
        images: [],
      },
    ])
    mockPrisma.service.findMany.mockResolvedValueOnce([
      { slug: 'servicio-visible', updatedAt: new Date('2026-01-03') },
    ])

    const sitemap = (await import('@/app/sitemap')).default
    const result = await sitemap()
    const urls = result.map((entry) => entry.url)

    expect(urls).not.toContain('http://localhost:3000/sobre-mi')
    expect(urls).not.toContain('http://localhost:3000/portfolio')
    expect(urls).not.toContain('http://localhost:3000/portfolio/oculta')
    expect(urls).toContain('http://localhost:3000/servicios')
    expect(urls).toContain('http://localhost:3000/servicios/servicio-visible')
  })
})
