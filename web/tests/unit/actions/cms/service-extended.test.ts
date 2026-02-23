import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    service: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn(
    (fn: (...args: unknown[]) => unknown) =>
      (...args: unknown[]) =>
        fn(...args)
  ),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: { services: 'services' },
  CACHE_DURATIONS: { MEDIUM: 300 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { services: '/admin/services' },
    public: { services: '/services' },
    home: '/',
  },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value)
  }
  return fd
}

const validServiceFields = {
  name: 'Photography Session',
  slug: 'photography-session',
  description: 'Professional photography',
  shortDesc: 'Pro photos',
  price: '150',
  priceLabel: 'desde',
  currency: 'EUR',
  pricingTiers: '',
  duration: '2 horas',
  durationMinutes: '',
  isAvailable: 'true',
  maxBookingsPerDay: '3',
  advanceNoticeDays: '2',
  imageUrl: '',
  galleryUrls: '',
  videoUrl: '',
  iconName: '',
  color: '',
  isActive: 'true',
  isFeatured: 'false',
  sortOrder: '0',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  requirements: '',
  cancellationPolicy: '',
}

// ── Tests: createService ──────────────────────────────────────────────────────

describe('createService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should require admin authentication', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.service.create).mockResolvedValue({} as never)

    const { createService } = await import('@/actions/cms/services')
    await createService(makeFormData(validServiceFields))
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should check rate limit', async () => {
    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.service.create).mockResolvedValue({} as never)

    const { createService } = await import('@/actions/cms/services')
    await createService(makeFormData(validServiceFields))
    expect(checkApiRateLimit).toHaveBeenCalled()
  })

  it('should return error for invalid data', async () => {
    const { createService } = await import('@/actions/cms/services')
    const result = await createService(makeFormData({ name: '' }))
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should return error for duplicate slug', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ id: 'existing' } as never)

    const { createService } = await import('@/actions/cms/services')
    const result = await createService(makeFormData(validServiceFields))
    expect(result.success).toBe(false)
    expect(result.error).toContain('slug')
  })

  it('should create service successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.service.create).mockResolvedValue({} as never)

    const { createService } = await import('@/actions/cms/services')
    const result = await createService(makeFormData(validServiceFields))
    expect(result.success).toBe(true)
  })

  it('should handle database error on create', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.service.create).mockRejectedValue(new Error('DB error'))

    const { createService } = await import('@/actions/cms/services')
    const result = await createService(makeFormData(validServiceFields))
    expect(result.success).toBe(false)
  })

  it('should revalidate paths and tags after creation', async () => {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.service.create).mockResolvedValue({} as never)

    const { createService } = await import('@/actions/cms/services')
    await createService(makeFormData(validServiceFields))
    expect(revalidatePath).toHaveBeenCalled()
    expect(revalidateTag).toHaveBeenCalled()
  })

  it('should return error for invalid slug format', async () => {
    const { createService } = await import('@/actions/cms/services')
    const result = await createService(
      makeFormData({ ...validServiceFields, slug: 'INVALID SLUG!@#' })
    )
    expect(result.success).toBe(false)
  })
})

// ── Tests: updateService ──────────────────────────────────────────────────────

describe('updateService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should require admin authentication', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.service.update).mockResolvedValue({} as never)

    const { updateService } = await import('@/actions/cms/services')
    await updateService('svc-1', makeFormData(validServiceFields))
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should return error if slug conflicts with another service', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValue({ id: 'other' } as never)

    const { updateService } = await import('@/actions/cms/services')
    const result = await updateService('svc-1', makeFormData(validServiceFields))
    expect(result.success).toBe(false)
    expect(result.error).toContain('slug')
  })

  it('should update service successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.service.update).mockResolvedValue({} as never)

    const { updateService } = await import('@/actions/cms/services')
    const result = await updateService('svc-1', makeFormData(validServiceFields))
    expect(result.success).toBe(true)
  })

  it('should handle database error on update', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.service.update).mockRejectedValue(new Error('DB error'))

    const { updateService } = await import('@/actions/cms/services')
    const result = await updateService('svc-1', makeFormData(validServiceFields))
    expect(result.success).toBe(false)
  })
})

// ── Tests: deleteService ──────────────────────────────────────────────────────

describe('deleteService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete service successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.delete).mockResolvedValue({} as never)

    const { deleteService } = await import('@/actions/cms/services')
    const result = await deleteService('svc-1')
    expect(result.success).toBe(true)
    expect(prisma.service.delete).toHaveBeenCalledWith({ where: { id: 'svc-1' } })
  })

  it('should handle database error on delete', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.delete).mockRejectedValue(new Error('DB error'))

    const { deleteService } = await import('@/actions/cms/services')
    const result = await deleteService('svc-1')
    expect(result.success).toBe(false)
  })

  it('should revalidate paths after deletion', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.delete).mockResolvedValue({} as never)

    const { deleteService } = await import('@/actions/cms/services')
    await deleteService('svc-1')
    expect(revalidatePath).toHaveBeenCalled()
  })
})

// ── Tests: toggleService ──────────────────────────────────────────────────────

describe('toggleService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should toggle active state from true to false', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ id: 'svc-1', isActive: true } as never)
    vi.mocked(prisma.service.update).mockResolvedValue({} as never)

    const { toggleService } = await import('@/actions/cms/services')
    const result = await toggleService('svc-1')
    expect(result.success).toBe(true)
    expect(result.isActive).toBe(false)
  })

  it('should toggle active state from false to true', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue({
      id: 'svc-1',
      isActive: false,
    } as never)
    vi.mocked(prisma.service.update).mockResolvedValue({} as never)

    const { toggleService } = await import('@/actions/cms/services')
    const result = await toggleService('svc-1')
    expect(result.success).toBe(true)
    expect(result.isActive).toBe(true)
  })

  it('should return error when service not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null)

    const { toggleService } = await import('@/actions/cms/services')
    const result = await toggleService('nonexistent')
    expect(result.success).toBe(false)
    expect(result.error).toContain('no encontrado')
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ id: 'svc-1', isActive: true } as never)
    vi.mocked(prisma.service.update).mockRejectedValue(new Error('DB'))

    const { toggleService } = await import('@/actions/cms/services')
    const result = await toggleService('svc-1')
    expect(result.success).toBe(false)
  })
})

// ── Tests: reorderServices ────────────────────────────────────────────────────

describe('reorderServices', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should call $transaction with correct updates', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValue([])

    const { reorderServices } = await import('@/actions/cms/services')
    const result = await reorderServices(['svc-a', 'svc-b'])
    expect(result.success).toBe(true)
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it('should handle database error during reorder', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error('Transaction fail'))

    const { reorderServices } = await import('@/actions/cms/services')
    const result = await reorderServices(['svc-a', 'svc-b'])
    expect(result.success).toBe(false)
  })

  it('should revalidate paths on success', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.$transaction).mockResolvedValue([])

    const { reorderServices } = await import('@/actions/cms/services')
    await reorderServices(['svc-a'])
    expect(revalidatePath).toHaveBeenCalled()
  })
})
