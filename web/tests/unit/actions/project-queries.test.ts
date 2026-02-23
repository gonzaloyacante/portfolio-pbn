import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
    },
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: Function) => fn),
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    admin: { projects: '/admin/proyectos' },
    public: { projects: '/proyectos', home: '/' },
  },
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    projects: 'projects',
    featuredProjects: 'featured-projects',
    projectBySlug: (slug: string) => `project-slug-${slug}`,
    projectsByCategory: (id: string) => `projects-category-${id}`,
  },
  CACHE_DURATIONS: { SHORT: 60, MEDIUM: 300, LONG: 1800, VERY_LONG: 3600 },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ─── Helpers ────────────────────────────────────────

const mockProject = {
  id: 'proj-1',
  title: 'Test Project',
  slug: 'test-project',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  date: new Date('2025-01-01'),
  category: { id: 'cat-1', name: 'Bodas', slug: 'bodas' },
  images: [],
}

const _mockPaginatedResult = {
  projects: [mockProject],
  pagination: {
    page: 1,
    limit: 12,
    total: 1,
    totalPages: 1,
    hasMore: false,
  },
}

describe('Project Queries (cms/projects)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getPaginatedProjects ─────────────────────────

  describe('getPaginatedProjects', () => {
    it('returns paginated data', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as never)
      vi.mocked(prisma.project.count).mockResolvedValue(1 as never)

      const { getPaginatedProjects } = await import('@/actions/cms/projects')
      const result = await getPaginatedProjects(1, 12)

      expect(result.projects).toHaveLength(1)
      expect(result.pagination).toBeDefined()
      expect(result.pagination.total).toBe(1)
    })

    it('defaults to page 1 limit 12', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.project.count).mockResolvedValue(0 as never)

      const { getPaginatedProjects } = await import('@/actions/cms/projects')
      const result = await getPaginatedProjects()

      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(12)
    })

    it('calculates totalPages correctly', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as never)
      vi.mocked(prisma.project.count).mockResolvedValue(25 as never)

      const { getPaginatedProjects } = await import('@/actions/cms/projects')
      const result = await getPaginatedProjects(1, 12)

      expect(result.pagination.totalPages).toBe(3)
      expect(result.pagination.hasMore).toBe(true)
    })

    it('handles empty DB', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.project.count).mockResolvedValue(0 as never)

      const { getPaginatedProjects } = await import('@/actions/cms/projects')
      const result = await getPaginatedProjects()

      expect(result.projects).toEqual([])
      expect(result.pagination.total).toBe(0)
      expect(result.pagination.hasMore).toBe(false)
    })

    it('handles DB errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB error'))

      const { getPaginatedProjects } = await import('@/actions/cms/projects')
      const result = await getPaginatedProjects()

      expect(result.projects).toEqual([])
      expect(result.pagination.total).toBe(0)
    })
  })

  // ─── getFeaturedProjects ──────────────────────────

  describe('getFeaturedProjects', () => {
    it('returns featured projects', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as never)

      const { getFeaturedProjects } = await import('@/actions/cms/projects')
      const result = await getFeaturedProjects()

      expect(result).toHaveLength(1)
    })

    it('defaults to count 6', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)

      const { getFeaturedProjects } = await import('@/actions/cms/projects')
      await getFeaturedProjects()

      expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 6 }))
    })

    it('returns empty array on error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB error'))

      const { getFeaturedProjects } = await import('@/actions/cms/projects')
      const result = await getFeaturedProjects()

      expect(result).toEqual([])
    })
  })

  // ─── getProjectsByCategory ────────────────────────

  describe('getProjectsByCategory', () => {
    it('filters by category slug', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as never)
      vi.mocked(prisma.project.count).mockResolvedValue(1 as never)

      const { getProjectsByCategory } = await import('@/actions/cms/projects')
      const result = await getProjectsByCategory('bodas')

      expect(result.projects).toHaveLength(1)
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { slug: 'bodas' },
          }),
        })
      )
    })

    it('returns empty on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB error'))

      const { getProjectsByCategory } = await import('@/actions/cms/projects')
      const result = await getProjectsByCategory('bodas')

      expect(result.projects).toEqual([])
      expect(result.pagination.total).toBe(0)
    })
  })

  // ─── getProjectBySlug ─────────────────────────────

  describe('getProjectBySlug', () => {
    it('returns single project', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as never)

      const { getProjectBySlug } = await import('@/actions/cms/projects')
      const result = await getProjectBySlug('test-project')

      expect(result).toBeDefined()
      expect(result?.slug).toBe('test-project')
    })

    it('returns null for non-existent slug', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null as never)

      const { getProjectBySlug } = await import('@/actions/cms/projects')
      const result = await getProjectBySlug('no-existe')

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockRejectedValue(new Error('DB error'))

      const { getProjectBySlug } = await import('@/actions/cms/projects')
      const result = await getProjectBySlug('test-project')

      expect(result).toBeNull()
    })
  })

  // ─── getRelatedProjects ───────────────────────────

  describe('getRelatedProjects', () => {
    it('excludes current project', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)

      const { getRelatedProjects } = await import('@/actions/cms/projects')
      await getRelatedProjects('proj-1', 'cat-1')

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not: 'proj-1' },
            categoryId: 'cat-1',
          }),
        })
      )
    })

    it('limits results to specified count', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)

      const { getRelatedProjects } = await import('@/actions/cms/projects')
      await getRelatedProjects('proj-1', 'cat-1', 5)

      expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }))
    })

    it('defaults to limit 3', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as never)

      const { getRelatedProjects } = await import('@/actions/cms/projects')
      await getRelatedProjects('proj-1', 'cat-1')

      expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 3 }))
    })

    it('returns empty array on error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB error'))

      const { getRelatedProjects } = await import('@/actions/cms/projects')
      const result = await getRelatedProjects('proj-1', 'cat-1')

      expect(result).toEqual([])
    })
  })

  // ─── revalidateProjects ───────────────────────────

  describe('revalidateProjects', () => {
    it('calls revalidatePath and revalidateTag', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')

      const { revalidateProjects } = await import('@/actions/cms/projects')
      await revalidateProjects()

      expect(revalidatePath).toHaveBeenCalledWith('/proyectos')
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(revalidateTag).toHaveBeenCalled()
    })
  })

  // ─── getAdjacentProjects ──────────────────────────

  describe('getAdjacentProjects', () => {
    it('returns prev/next projects', async () => {
      const { prisma } = await import('@/lib/db')
      const prev = { title: 'Newer', slug: 'newer', thumbnailUrl: null }
      const next = { title: 'Older', slug: 'older', thumbnailUrl: null }

      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        date: new Date('2025-06-01'),
      } as never)
      vi.mocked(prisma.project.findFirst)
        .mockResolvedValueOnce(prev as never) // previous (newer)
        .mockResolvedValueOnce(next as never) // next (older)
        .mockResolvedValueOnce(null as never) // first
        .mockResolvedValueOnce(null as never) // last

      const { getAdjacentProjects } = await import('@/actions/cms/projects')
      const result = await getAdjacentProjects('proj-1', 'cat-1')

      expect(result.previous).toEqual(prev)
      expect(result.next).toEqual(next)
    })

    it('wraps around (circular) when at edges', async () => {
      const { prisma } = await import('@/lib/db')
      const first = { title: 'First', slug: 'first', thumbnailUrl: null }
      const last = { title: 'Last', slug: 'last', thumbnailUrl: null }

      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        date: new Date('2025-01-01'),
      } as never)
      vi.mocked(prisma.project.findFirst)
        .mockResolvedValueOnce(null as never) // no previous (we are at start)
        .mockResolvedValueOnce(null as never) // no next (we are at end)
        .mockResolvedValueOnce(first as never) // first (newest)
        .mockResolvedValueOnce(last as never) // last (oldest)

      const { getAdjacentProjects } = await import('@/actions/cms/projects')
      const result = await getAdjacentProjects('proj-1', 'cat-1')

      expect(result.previous).toEqual(last) // wraps to oldest
      expect(result.next).toEqual(first) // wraps to newest
    })

    it('returns null/null when project not found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null as never)

      const { getAdjacentProjects } = await import('@/actions/cms/projects')
      const result = await getAdjacentProjects('non-existent', 'cat-1')

      expect(result).toEqual({ previous: null, next: null })
    })

    it('handles DB errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockRejectedValue(new Error('DB error'))

      const { getAdjacentProjects } = await import('@/actions/cms/projects')
      const result = await getAdjacentProjects('proj-1', 'cat-1')

      expect(result).toEqual({ previous: null, next: null })
    })
  })
})
