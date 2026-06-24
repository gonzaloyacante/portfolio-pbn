import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockPrisma = vi.hoisted(() => ({
  siteSettings: { findFirst: vi.fn().mockResolvedValue({ id: '1', key: 'singleton' }) },
}))

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

describe('robots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.siteSettings.findFirst.mockResolvedValue({ allowIndexing: true })
  })

  it('allows public crawling by default while blocking admin and api', async () => {
    const robots = (await import('@/app/robots')).default

    await expect(robots()).resolves.toEqual(
      expect.objectContaining({
        rules: {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/api/'],
        },
      })
    )
  })

  it('blocks all crawling when indexing is disabled', async () => {
    mockPrisma.siteSettings.findFirst.mockResolvedValueOnce({ allowIndexing: false })
    const robots = (await import('@/app/robots')).default

    await expect(robots()).resolves.toEqual(
      expect.objectContaining({
        rules: {
          userAgent: '*',
          disallow: '/',
        },
      })
    )
  })
})
