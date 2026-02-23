import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/cloudinary', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}))

vi.mock('@/lib/validations', () => ({
  projectFormSchema: { safeParse: vi.fn().mockReturnValue({ success: true, data: {} }) },
  categorySchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: { name: 'Test', slug: 'test', description: 'desc', coverImageUrl: '' },
    }),
  },
}))

// ── Tests: category.ts ────────────────────────────────────────────────────────

describe('deleteCategoryAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should call requireAdmin before deletion', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    const projectCount = vi.mocked(prisma.project.count)
    projectCount.mockResolvedValue(0)
    vi.mocked(prisma.category.delete).mockResolvedValue({} as never)

    const { deleteCategoryAction } = await import('@/actions/cms/category')
    await deleteCategoryAction('cat-1')
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should revalidate paths after deletion', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValue(0)
    vi.mocked(prisma.category.delete).mockResolvedValue({} as never)

    const { deleteCategoryAction } = await import('@/actions/cms/category')
    await deleteCategoryAction('cat-1')
    expect(revalidatePath).toHaveBeenCalled()
  })

  it('should throw if requireAdmin fails', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Unauthorized'))

    const { deleteCategoryAction } = await import('@/actions/cms/category')
    await expect(deleteCategoryAction('cat-1')).rejects.toThrow('Unauthorized')
  })
})

describe('reorderCategories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update sort order for each category', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValue({} as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-a', 'cat-b', 'cat-c'])

    expect(prisma.category.update).toHaveBeenCalledTimes(3)
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat-a' },
      data: { sortOrder: 0 },
    })
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat-b' },
      data: { sortOrder: 1 },
    })
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat-c' },
      data: { sortOrder: 2 },
    })
  })

  it('should handle empty array', async () => {
    const { prisma } = await import('@/lib/db')
    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories([])
    expect(prisma.category.update).not.toHaveBeenCalled()
  })

  it('should handle single category', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValue({} as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-only'])

    expect(prisma.category.update).toHaveBeenCalledTimes(1)
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat-only' },
      data: { sortOrder: 0 },
    })
  })

  it('should call requireAdmin', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValue({} as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-1'])
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should revalidate admin and public paths', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValue({} as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-1'])
    expect(revalidatePath).toHaveBeenCalledTimes(2)
  })
})

describe('getCategoryImages', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return flattened images with project context', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      {
        title: 'Project A',
        images: [
          { id: 'img-1', url: 'https://img.test/1.jpg', publicId: 'pub-1' },
          { id: 'img-2', url: 'https://img.test/2.jpg', publicId: 'pub-2' },
        ],
      },
      {
        title: 'Project B',
        images: [{ id: 'img-3', url: 'https://img.test/3.jpg', publicId: 'pub-3' }],
      },
    ] as never)

    const { getCategoryImages } = await import('@/actions/cms/category')
    const result = await getCategoryImages('cat-1')

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(3)
    expect(result.data![0]).toEqual({
      id: 'img-1',
      url: 'https://img.test/1.jpg',
      publicId: 'pub-1',
      projectTitle: 'Project A',
    })
  })

  it('should return empty array when no projects', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getCategoryImages } = await import('@/actions/cms/category')
    const result = await getCategoryImages('cat-1')

    expect(result.success).toBe(true)
    expect(result.data).toEqual([])
  })

  it('should handle projects with no images', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      { title: 'Empty Project', images: [] },
    ] as never)

    const { getCategoryImages } = await import('@/actions/cms/category')
    const result = await getCategoryImages('cat-1')

    expect(result.success).toBe(true)
    expect(result.data).toEqual([])
  })

  it('should return error on database failure', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB error'))

    const { getCategoryImages } = await import('@/actions/cms/category')
    const result = await getCategoryImages('cat-1')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database error')
  })

  it('should filter only non-deleted projects', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getCategoryImages } = await import('@/actions/cms/category')
    await getCategoryImages('cat-1')

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { categoryId: 'cat-1', isDeleted: false },
      })
    )
  })

  it('should call requireAdmin', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getCategoryImages } = await import('@/actions/cms/category')
    await getCategoryImages('cat-1')
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should order images by order field ascending', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getCategoryImages } = await import('@/actions/cms/category')
    await getCategoryImages('cat-1')

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          images: expect.objectContaining({
            orderBy: { order: 'asc' },
          }),
        }),
      })
    )
  })

  it('should select only id, url, publicId for images', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findMany).mockResolvedValue([])

    const { getCategoryImages } = await import('@/actions/cms/category')
    await getCategoryImages('cat-1')

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          images: expect.objectContaining({
            select: { id: true, url: true, publicId: true },
          }),
        }),
      })
    )
  })
})
