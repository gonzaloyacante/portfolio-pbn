import { describe, it, expect, vi, beforeEach } from 'vitest'

// ──────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────
const mockDeleteCategory = vi.fn(() => Promise.resolve())

vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
      update: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn(() => Promise.resolve({ id: 'admin-1', role: 'ADMIN' })),
}))

vi.mock('@/actions/cms/content', () => ({
  deleteCategory: mockDeleteCategory,
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { categories: '/admin/categorias' },
    public: { projects: '/proyectos' },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

// ──────────────────────────────────────────
// Tests
// ──────────────────────────────────────────
describe('Category Actions', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── deleteCategoryAction ───────────────
  describe('deleteCategoryAction', () => {
    it('should call deleteCategory with correct id', async () => {
      const { deleteCategoryAction } = await import('@/actions/cms/category')
      await deleteCategoryAction('cat-1')
      expect(mockDeleteCategory).toHaveBeenCalledWith('cat-1')
    })

    it('should call requireAdmin before deleting', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { deleteCategoryAction } = await import('@/actions/cms/category')

      await deleteCategoryAction('cat-2')
      expect(requireAdmin).toHaveBeenCalled()
    })

    it('should revalidate admin categories path', async () => {
      const { revalidatePath } = await import('next/cache')
      const { deleteCategoryAction } = await import('@/actions/cms/category')

      await deleteCategoryAction('cat-3')
      expect(revalidatePath).toHaveBeenCalledWith('/admin/categorias')
    })

    it('should revalidate public projects path', async () => {
      const { revalidatePath } = await import('next/cache')
      const { deleteCategoryAction } = await import('@/actions/cms/category')

      await deleteCategoryAction('cat-3')
      expect(revalidatePath).toHaveBeenCalledWith('/proyectos')
    })

    it('should propagate errors from deleteCategory', async () => {
      mockDeleteCategory.mockRejectedValueOnce(new Error('Category has projects'))
      const { deleteCategoryAction } = await import('@/actions/cms/category')

      await expect(deleteCategoryAction('cat-bad')).rejects.toThrow('Category has projects')
    })
  })

  // ── reorderCategories ──────────────────
  describe('reorderCategories', () => {
    it('should reorder categories by array index', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.category.update).mockResolvedValue(
        {} as Parameters<typeof prisma.category.update>[0]['data'] as never
      )

      const { reorderCategories } = await import('@/actions/cms/category')
      await reorderCategories(['cat-b', 'cat-a', 'cat-c'])

      expect(prisma.category.update).toHaveBeenCalledTimes(3)
    })

    it('should set sortOrder=0 for first element', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.category.update).mockResolvedValue({} as never)

      const { reorderCategories } = await import('@/actions/cms/category')
      await reorderCategories(['first-cat', 'second-cat'])

      expect(prisma.category.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'first-cat' },
          data: { sortOrder: 0 },
        })
      )
    })

    it('should set sortOrder=1 for second element', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.category.update).mockResolvedValue({} as never)

      const { reorderCategories } = await import('@/actions/cms/category')
      await reorderCategories(['first-cat', 'second-cat'])

      expect(prisma.category.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'second-cat' },
          data: { sortOrder: 1 },
        })
      )
    })

    it('should revalidate categories path after reorder', async () => {
      const { prisma } = await import('@/lib/db')
      const { revalidatePath } = await import('next/cache')
      vi.mocked(prisma.category.update).mockResolvedValue({} as never)

      const { reorderCategories } = await import('@/actions/cms/category')
      await reorderCategories(['cat-1'])

      expect(revalidatePath).toHaveBeenCalledWith('/admin/categorias')
    })

    it('should handle empty array without errors', async () => {
      const { reorderCategories } = await import('@/actions/cms/category')
      await expect(reorderCategories([])).resolves.not.toThrow()
    })

    it('should update each category in parallel (Promise.all)', async () => {
      const { prisma } = await import('@/lib/db')
      const updateFn = vi.fn(() => Promise.resolve({} as never))
      prisma.category.update = updateFn

      const { reorderCategories } = await import('@/actions/cms/category')
      await reorderCategories(['a', 'b', 'c', 'd'])

      expect(updateFn).toHaveBeenCalledTimes(4)
    })
  })

  // ── getCategoryImages ──────────────────
  describe('getCategoryImages', () => {
    it('should return images for a valid category', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([
        {
          title: 'Boda García',
          images: [
            { id: 'img-1', url: 'https://example.com/img1.jpg', publicId: 'pub-1' },
            { id: 'img-2', url: 'https://example.com/img2.jpg', publicId: 'pub-2' },
          ],
        },
      ] as never)

      const { getCategoryImages } = await import('@/actions/cms/category')
      const result = await getCategoryImages('cat-1')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })

    it('should flatten images from multiple projects', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([
        {
          title: 'Proyecto A',
          images: [{ id: 'img-1', url: 'url1', publicId: 'pub-1' }],
        },
        {
          title: 'Proyecto B',
          images: [
            { id: 'img-2', url: 'url2', publicId: 'pub-2' },
            { id: 'img-3', url: 'url3', publicId: 'pub-3' },
          ],
        },
      ] as never)

      const { getCategoryImages } = await import('@/actions/cms/category')
      const result = await getCategoryImages('cat-multi')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(3)
    })

    it('should include projectTitle in each image', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([
        {
          title: 'Boda López',
          images: [{ id: 'img-1', url: 'url1', publicId: 'pub-1' }],
        },
      ] as never)

      const { getCategoryImages } = await import('@/actions/cms/category')
      const result = await getCategoryImages('cat-1')

      expect(result.data?.[0]).toHaveProperty('projectTitle', 'Boda López')
    })

    it('should return empty data for category with no projects', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockResolvedValue([])

      const { getCategoryImages } = await import('@/actions/cms/category')
      const result = await getCategoryImages('cat-empty')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(0)
    })

    it('should return success:false on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB Down'))

      const { getCategoryImages } = await import('@/actions/cms/category')
      const result = await getCategoryImages('cat-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })

    it('should only fetch non-deleted projects', async () => {
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
  })
})
