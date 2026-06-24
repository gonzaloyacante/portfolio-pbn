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
      findUniqueOrThrow: vi.fn().mockResolvedValue({}),
      findFirstOrThrow: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
      upsert: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      aggregate: vi.fn().mockResolvedValue({}),
      groupBy: vi.fn().mockResolvedValue({}),
    },
    $transaction: vi.fn().mockImplementation(async (ops: Promise<unknown>[]) => Promise.all(ops)),
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

vi.mock('@/actions/cms/content', () => ({
  deleteCategory: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('@/lib/validations', () => ({
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
    vi.mocked(prisma.category.delete).mockResolvedValue({} as never)

    const { deleteCategoryAction } = await import('@/actions/cms/category')
    await deleteCategoryAction('cat-1')
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should revalidate paths after deletion', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
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
    vi.mocked(prisma.category.updateMany).mockResolvedValue({ count: 1 } as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-a', 'cat-b', 'cat-c'])

    expect(prisma.category.updateMany).toHaveBeenCalledTimes(3)
    expect(prisma.category.updateMany).toHaveBeenCalledWith({
      where: { id: 'cat-a', deletedAt: null },
      data: { sortOrder: 0 },
    })
    expect(prisma.category.updateMany).toHaveBeenCalledWith({
      where: { id: 'cat-b', deletedAt: null },
      data: { sortOrder: 1 },
    })
    expect(prisma.category.updateMany).toHaveBeenCalledWith({
      where: { id: 'cat-c', deletedAt: null },
      data: { sortOrder: 2 },
    })
  })

  it('should handle empty array', async () => {
    const { prisma } = await import('@/lib/db')
    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories([])
    expect(prisma.category.updateMany).not.toHaveBeenCalled()
  })

  it('should handle single category', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.updateMany).mockResolvedValue({ count: 1 } as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-only'])

    expect(prisma.category.updateMany).toHaveBeenCalledTimes(1)
    expect(prisma.category.updateMany).toHaveBeenCalledWith({
      where: { id: 'cat-only', deletedAt: null },
      data: { sortOrder: 0 },
    })
  })

  it('should call requireAdmin', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.updateMany).mockResolvedValue({ count: 1 } as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-1'])
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should revalidate admin and public paths', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.updateMany).mockResolvedValue({ count: 1 } as never)

    const { reorderCategories } = await import('@/actions/cms/category')
    await reorderCategories(['cat-1'])
    expect(revalidatePath).toHaveBeenCalledTimes(3)
    expect(revalidatePath).toHaveBeenCalledWith('/admin/categorias')
    expect(revalidatePath).toHaveBeenCalledWith('/portfolio')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })
})
