import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    projectImage: {
      findUnique: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/cloudinary', () => ({
  uploadImage: vi.fn().mockResolvedValue({ url: 'https://cdn.test/img.jpg', publicId: 'pub-1' }),
  deleteImage: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/validations', () => ({
  projectFormSchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        title: 'Test Project',
        description: 'A test project',
        categoryId: 'cat-1',
        date: '2026-01-01',
        tags: 'tag1,tag2',
        metaKeywords: 'kw1,kw2',
      },
    }),
  },
  categorySchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A category',
        coverImageUrl: 'https://cdn.test/cover.jpg',
        thumbnailUrl: 'https://cdn.test/thumb.jpg',
      },
    }),
  },
}))

// ── Tests: deleteProject ──────────────────────────────────────────────────────

describe('deleteProject (soft delete)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should soft delete project by setting isDeleted flag', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockResolvedValue({} as never)

    const { deleteProject } = await import('@/actions/cms/content')
    const result = await deleteProject('proj-1')

    expect(result.success).toBe(true)
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'proj-1' },
        data: expect.objectContaining({ isDeleted: true }),
      })
    )
  })

  it('should set deletedAt timestamp', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockResolvedValue({} as never)

    const { deleteProject } = await import('@/actions/cms/content')
    await deleteProject('proj-1')

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    )
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockRejectedValue(new Error('DB error'))

    const { deleteProject } = await import('@/actions/cms/content')
    const result = await deleteProject('proj-1')
    expect(result.success).toBe(false)
  })

  it('should revalidate paths', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockResolvedValue({} as never)

    const { deleteProject } = await import('@/actions/cms/content')
    await deleteProject('proj-1')
    expect(revalidatePath).toHaveBeenCalled()
  })
})

// ── Tests: restoreProject ─────────────────────────────────────────────────────

describe('restoreProject', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should restore project by clearing isDeleted flag', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockResolvedValue({} as never)

    const { restoreProject } = await import('@/actions/cms/content')
    const result = await restoreProject('proj-1')

    expect(result.success).toBe(true)
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'proj-1' },
      data: { isDeleted: false, deletedAt: null },
    })
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.update).mockRejectedValue(new Error('DB error'))

    const { restoreProject } = await import('@/actions/cms/content')
    const result = await restoreProject('proj-1')
    expect(result.success).toBe(false)
  })
})

// ── Tests: permanentlyDeleteProject ───────────────────────────────────────────

describe('permanentlyDeleteProject', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete images from Cloudinary and DB', async () => {
    const { prisma } = await import('@/lib/db')
    const { deleteImage } = await import('@/lib/cloudinary')
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: 'proj-1',
      images: [
        { id: 'img-1', publicId: 'pub-1' },
        { id: 'img-2', publicId: 'pub-2' },
      ],
    } as never)
    vi.mocked(prisma.project.delete).mockResolvedValue({} as never)

    const { permanentlyDeleteProject } = await import('@/actions/cms/content')
    const result = await permanentlyDeleteProject('proj-1')

    expect(result.success).toBe(true)
    expect(deleteImage).toHaveBeenCalledTimes(2)
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'proj-1' } })
  })

  it('should throw when project not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null)

    const { permanentlyDeleteProject } = await import('@/actions/cms/content')
    const result = await permanentlyDeleteProject('nonexistent')
    expect(result.success).toBe(false)
  })
})

// ── Tests: reorderProjectImages ───────────────────────────────────────────────

describe('reorderProjectImages', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should reorder images via transaction', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValue([])

    const { reorderProjectImages } = await import('@/actions/cms/content')
    const result = await reorderProjectImages('proj-1', [
      { id: 'img-1', order: 0 },
      { id: 'img-2', order: 1 },
    ])
    expect(result.success).toBe(true)
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error('Transaction fail'))

    const { reorderProjectImages } = await import('@/actions/cms/content')
    const result = await reorderProjectImages('proj-1', [{ id: 'img-1', order: 0 }])
    expect(result.success).toBe(false)
  })
})

// ── Tests: deleteProjectImage ─────────────────────────────────────────────────

describe('deleteProjectImage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete image from Cloudinary and DB', async () => {
    const { prisma } = await import('@/lib/db')
    const { deleteImage } = await import('@/lib/cloudinary')
    vi.mocked(prisma.projectImage.findUnique).mockResolvedValue({
      id: 'img-1',
      publicId: 'pub-1',
    } as never)
    vi.mocked(prisma.projectImage.delete).mockResolvedValue({} as never)

    const { deleteProjectImage } = await import('@/actions/cms/content')
    const result = await deleteProjectImage('img-1')

    expect(result.success).toBe(true)
    expect(deleteImage).toHaveBeenCalledWith('pub-1')
    expect(prisma.projectImage.delete).toHaveBeenCalledWith({ where: { id: 'img-1' } })
  })

  it('should return error when image not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.projectImage.findUnique).mockResolvedValue(null)

    const { deleteProjectImage } = await import('@/actions/cms/content')
    const result = await deleteProjectImage('nonexistent')
    expect(result.success).toBe(false)
  })
})

// ── Tests: createCategory ─────────────────────────────────────────────────────

describe('createCategory (content.ts)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create category successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.category.create).mockResolvedValue({} as never)

    const { createCategory } = await import('@/actions/cms/content')
    const fd = new FormData()
    fd.set('name', 'Test Category')
    fd.set('slug', 'test-category')
    const result = await createCategory(fd)
    expect(result.success).toBe(true)
  })

  it('should return error for duplicate slug', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 'existing' } as never)

    const { createCategory } = await import('@/actions/cms/content')
    const fd = new FormData()
    fd.set('name', 'Test')
    fd.set('slug', 'existing-slug')
    const result = await createCategory(fd)
    expect(result.success).toBe(false)
    expect(result.error).toContain('slug')
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.category.create).mockRejectedValue(new Error('DB'))

    const { createCategory } = await import('@/actions/cms/content')
    const fd = new FormData()
    fd.set('name', 'Test')
    fd.set('slug', 'test')
    const result = await createCategory(fd)
    expect(result.success).toBe(false)
  })
})

// ── Tests: updateCategory ─────────────────────────────────────────────────────

describe('updateCategory (content.ts)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update category successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockResolvedValue({} as never)

    const { updateCategory } = await import('@/actions/cms/content')
    const fd = new FormData()
    fd.set('name', 'Updated')
    fd.set('slug', 'updated')
    const result = await updateCategory('cat-1', fd)
    expect(result.success).toBe(true)
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.update).mockRejectedValue(new Error('DB'))

    const { updateCategory } = await import('@/actions/cms/content')
    const fd = new FormData()
    fd.set('name', 'Updated')
    fd.set('slug', 'updated')
    const result = await updateCategory('cat-1', fd)
    expect(result.success).toBe(false)
  })
})

// ── Tests: deleteCategory (content.ts) ────────────────────────────────────────

describe('deleteCategory (content.ts)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete category when no projects exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValue(0)
    vi.mocked(prisma.category.delete).mockResolvedValue({} as never)

    const { deleteCategory } = await import('@/actions/cms/content')
    const result = await deleteCategory('cat-1')
    expect(result.success).toBe(true)
  })

  it('should return error when category has projects', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValue(3)

    const { deleteCategory } = await import('@/actions/cms/content')
    const result = await deleteCategory('cat-1')
    expect(result.success).toBe(false)
    expect(result.error).toContain('3')
  })

  it('should handle singular project count in error message', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValue(1)

    const { deleteCategory } = await import('@/actions/cms/content')
    const result = await deleteCategory('cat-1')
    expect(result.success).toBe(false)
    expect(result.error).toContain('1')
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.count).mockResolvedValue(0)
    vi.mocked(prisma.category.delete).mockRejectedValue(new Error('DB'))

    const { deleteCategory } = await import('@/actions/cms/content')
    const result = await deleteCategory('cat-1')
    expect(result.success).toBe(false)
  })
})
