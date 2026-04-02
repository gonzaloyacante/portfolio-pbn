import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateCategoryGalleryOrder, resetCategoryGalleryOrder } from '@/actions/gallery-ordering'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findUnique: vi.fn(),
    },
    categoryImage: {
      update: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

// Mock admin auth
vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

import { prisma } from '@/lib/db'

const mockPrisma = prisma as {
  category: { findUnique: ReturnType<typeof vi.fn> }
  categoryImage: { update: ReturnType<typeof vi.fn>; findMany: ReturnType<typeof vi.fn> }
  $transaction: ReturnType<typeof vi.fn>
}

const VALID_CUID = 'clxxxxxxxxxxxxxxxxxxxxxxxx'
const VALID_IMAGE_ID = 'clyyyyyyyyyyyyyyyyyyyyyyyyy'

const validInput = {
  categoryId: VALID_CUID,
  imageOrders: [{ imageId: VALID_IMAGE_ID, order: 0 }],
}

describe('updateCategoryGalleryOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.$transaction.mockResolvedValue([])
  })

  it('returns success when category exists and input is valid', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({
      id: VALID_CUID,
      slug: 'retrato',
    })

    const result = await updateCategoryGalleryOrder(validInput)
    expect(result.success).toBe(true)
  })

  it('returns error when category is not found', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null)

    const result = await updateCategoryGalleryOrder(validInput)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Categoría no encontrada')
  })

  it('returns error when imageOrders is empty', async () => {
    const result = await updateCategoryGalleryOrder({
      categoryId: VALID_CUID,
      imageOrders: [],
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Datos inválidos')
  })

  it('returns error when categoryId is not a valid cuid', async () => {
    const result = await updateCategoryGalleryOrder({
      categoryId: 'not-a-cuid',
      imageOrders: [{ imageId: VALID_IMAGE_ID, order: 0 }],
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Datos inválidos')
  })

  it('returns error when order is negative', async () => {
    const result = await updateCategoryGalleryOrder({
      categoryId: VALID_CUID,
      imageOrders: [{ imageId: VALID_IMAGE_ID, order: -1 }],
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Datos inválidos')
  })

  it('executes a transaction to update image orders', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: VALID_CUID, slug: 'test' })

    await updateCategoryGalleryOrder(validInput)

    expect(mockPrisma.$transaction).toHaveBeenCalledOnce()
  })
})

describe('resetCategoryGalleryOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when category has no images', async () => {
    mockPrisma.categoryImage.findMany.mockResolvedValue([])

    const result = await resetCategoryGalleryOrder(VALID_CUID)
    expect(result.success).toBe(false)
    expect(result.error).toBe('No hay imágenes en esta categoría')
  })

  it('resets orders and returns success when images exist', async () => {
    mockPrisma.categoryImage.findMany.mockResolvedValue([{ id: 'img-1' }, { id: 'img-2' }])
    mockPrisma.$transaction.mockResolvedValue([])
    mockPrisma.category.findUnique.mockResolvedValue({ id: VALID_CUID, slug: 'retrato' })

    const result = await resetCategoryGalleryOrder(VALID_CUID)
    expect(result.success).toBe(true)
  })
})
