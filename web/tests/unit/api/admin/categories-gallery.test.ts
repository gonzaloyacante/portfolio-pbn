import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const categoryFindUnique = vi.fn()
const categoryImageCount = vi.fn().mockResolvedValue(0)
const categoryImageCreateMany = vi.fn().mockResolvedValue({ count: 1 })

vi.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findUnique: categoryFindUnique,
      findUniqueOrThrow: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue({}),
      findFirstOrThrow: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      upsert: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      count: vi.fn().mockResolvedValue({}),
      aggregate: vi.fn().mockResolvedValue({}),
      groupBy: vi.fn().mockResolvedValue({}),
    },
    categoryImage: {
      count: categoryImageCount,
      createMany: categoryImageCreateMany,
      findUnique: vi.fn().mockResolvedValue({}),
      findUniqueOrThrow: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue({}),
      findFirstOrThrow: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      upsert: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      aggregate: vi.fn().mockResolvedValue({}),
      groupBy: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
  }),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/cloudinary', () => ({
  deleteImage: vi.fn(),
  extractPublicIdUrl: vi.fn(),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost/api/admin/categories/cat-1/gallery'

function makeRequest(body: unknown) {
  return new Request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: JSON.stringify(body),
  })
}

const validImage = {
  url: 'https://res.cloudinary.com/demo/image/upload/v1700000000/sample.jpg',
  publicId: 'sample',
  width: 800,
  height: 600,
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/admin/categories/[id]/gallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoryImageCount.mockResolvedValue(0)
    categoryImageCreateMany.mockResolvedValue({ count: 1 })
    categoryFindUnique.mockResolvedValue({ id: 'cat-1', slug: 'retratos', deletedAt: null })
  })

  it('agrega imágenes válidas a la galería', async () => {
    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const res = await POST(makeRequest({ images: [validImage] }), {
      params: Promise.resolve({ id: 'cat-1' }),
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(categoryImageCreateMany).toHaveBeenCalledWith({
      data: [
        {
          url: validImage.url,
          publicId: validImage.publicId,
          width: 800,
          height: 600,
          categoryId: 'cat-1',
          order: 0,
        },
      ],
    })
  })

  it('rechaza body sin imágenes', async () => {
    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const res = await POST(makeRequest({ images: [] }), {
      params: Promise.resolve({ id: 'cat-1' }),
    })
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Debés seleccionar al menos una imagen')
    expect(categoryImageCreateMany).not.toHaveBeenCalled()
  })

  // M25: la URL debe ser una subida real de Cloudinary, no cualquier URL externa
  it('rechaza una imagen cuya URL no es de Cloudinary, indicando cuál', async () => {
    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const res = await POST(
      makeRequest({
        images: [validImage, { ...validImage, url: 'https://evil.example.com/x.jpg' }],
      }),
      { params: Promise.resolve({ id: 'cat-1' }) }
    )
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('La imagen #2 no se subió correctamente')
    expect(categoryImageCreateMany).not.toHaveBeenCalled()
  })

  // M25: rechaza imágenes sin publicId
  it('rechaza una imagen sin publicId, indicando cuál', async () => {
    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const res = await POST(makeRequest({ images: [{ ...validImage, publicId: '' }] }), {
      params: Promise.resolve({ id: 'cat-1' }),
    })
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('La imagen #1 no se subió correctamente')
    expect(categoryImageCreateMany).not.toHaveBeenCalled()
  })

  // M25: límite de tamaño de array
  it('rechaza más de 50 imágenes en una sola solicitud', async () => {
    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const images = Array.from({ length: 51 }, () => ({ ...validImage }))
    const res = await POST(makeRequest({ images }), {
      params: Promise.resolve({ id: 'cat-1' }),
    })
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('No se pueden agregar más de 50 imágenes a la vez')
    expect(categoryImageCreateMany).not.toHaveBeenCalled()
  })

  it('devuelve 404 si la categoría no existe', async () => {
    categoryFindUnique.mockResolvedValue(null)

    const { POST } = await import('@/app/api/admin/categories/[id]/gallery/route')
    const res = await POST(makeRequest({ images: [validImage] }), {
      params: Promise.resolve({ id: 'cat-1' }),
    })
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe('Categoría no encontrada')
  })
})
