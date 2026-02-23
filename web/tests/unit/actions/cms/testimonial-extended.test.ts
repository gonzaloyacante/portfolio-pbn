import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    testimonial: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } }),
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

let testIpCounter = 0

vi.mock('next/headers', () => ({
  headers: vi.fn().mockImplementation(async () => ({
    get: (key: string) => {
      if (key === 'x-forwarded-for') return `10.0.${testIpCounter}.1`
      if (key === 'x-real-ip') return `10.0.${testIpCounter}.1`
      return null
    },
  })),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewTestimonial: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: { testimonials: 'testimonials' },
  CACHE_DURATIONS: { MEDIUM: 300 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    admin: { testimonials: '/admin/testimonials' },
    public: { about: '/about' },
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

const validTestimonialFields = {
  name: 'Maria García',
  text: 'Excelente servicio profesional, muy recomendable.',
  position: 'Designer',
  company: '',
  website: '',
  avatarUrl: '',
  email: '',
  rating: '5',
  isActive: 'true',
  isVerified: 'false',
  isFeatured: 'false',
  status: 'PENDING',
  moderationNote: '',
}

// ── Tests: createTestimonial ──────────────────────────────────────────────────

describe('createTestimonial', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should require admin authentication', async () => {
    const { requireAdmin } = await import('@/lib/security-server')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { createTestimonial } = await import('@/actions/cms/testimonials')
    await createTestimonial(makeFormData(validTestimonialFields))
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('should create testimonial with valid data', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { createTestimonial } = await import('@/actions/cms/testimonials')
    const result = await createTestimonial(makeFormData(validTestimonialFields))
    expect(result.success).toBe(true)
  })

  it('should return error for empty name', async () => {
    const { createTestimonial } = await import('@/actions/cms/testimonials')
    const result = await createTestimonial(makeFormData({ ...validTestimonialFields, name: '' }))
    expect(result.success).toBe(false)
  })

  it('should return error for text too short', async () => {
    const { createTestimonial } = await import('@/actions/cms/testimonials')
    const result = await createTestimonial(
      makeFormData({ ...validTestimonialFields, text: 'short' })
    )
    expect(result.success).toBe(false)
  })

  it('should set isActive to true by default', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { createTestimonial } = await import('@/actions/cms/testimonials')
    await createTestimonial(makeFormData(validTestimonialFields))

    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockRejectedValue(new Error('DB'))

    const { createTestimonial } = await import('@/actions/cms/testimonials')
    const result = await createTestimonial(makeFormData(validTestimonialFields))
    expect(result.success).toBe(false)
  })
})

// ── Tests: submitPublicTestimonial ────────────────────────────────────────────

describe('submitPublicTestimonial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    testIpCounter++
  })

  it('should create testimonial with isActive=false for moderation', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    const result = await submitPublicTestimonial(makeFormData(validTestimonialFields))
    expect(result.success).toBe(true)
    expect(prisma.testimonial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('should return success message', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    const result = await submitPublicTestimonial(makeFormData(validTestimonialFields))
    expect(result.message).toBeDefined()
  })

  it('should send email notification to admin', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)

    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    await submitPublicTestimonial(makeFormData(validTestimonialFields))
    expect(emailService.notifyNewTestimonial).toHaveBeenCalled()
  })

  it('should handle email sending failure gracefully', async () => {
    const { prisma } = await import('@/lib/db')
    const { emailService } = await import('@/lib/email-service')
    vi.mocked(prisma.testimonial.create).mockResolvedValue({} as never)
    vi.mocked(emailService.notifyNewTestimonial).mockRejectedValue(new Error('Email fail'))

    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    const result = await submitPublicTestimonial(makeFormData(validTestimonialFields))
    expect(result.success).toBe(true)
  })

  it('should return error for invalid data', async () => {
    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    const result = await submitPublicTestimonial(makeFormData({ name: '', text: '', rating: '0' }))
    expect(result.success).toBe(false)
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.create).mockRejectedValue(new Error('DB'))

    const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
    const result = await submitPublicTestimonial(makeFormData(validTestimonialFields))
    expect(result.success).toBe(false)
  })
})

// ── Tests: updateTestimonial ──────────────────────────────────────────────────

describe('updateTestimonial', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should update testimonial successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.update).mockResolvedValue({} as never)

    const { updateTestimonial } = await import('@/actions/cms/testimonials')
    const result = await updateTestimonial(
      'tst-1',
      makeFormData({
        ...validTestimonialFields,
        isActive: 'true',
        isVerified: 'true',
        isFeatured: 'false',
      })
    )
    expect(result.success).toBe(true)
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.update).mockRejectedValue(new Error('DB'))

    const { updateTestimonial } = await import('@/actions/cms/testimonials')
    const result = await updateTestimonial('tst-1', makeFormData(validTestimonialFields))
    expect(result.success).toBe(false)
  })

  it('should revalidate paths on success', async () => {
    const { revalidatePath } = await import('next/cache')
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.update).mockResolvedValue({} as never)

    const { updateTestimonial } = await import('@/actions/cms/testimonials')
    await updateTestimonial('tst-1', makeFormData(validTestimonialFields))
    expect(revalidatePath).toHaveBeenCalled()
  })
})

// ── Tests: deleteTestimonial ──────────────────────────────────────────────────

describe('deleteTestimonial', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should delete testimonial successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.delete).mockResolvedValue({} as never)

    const { deleteTestimonial } = await import('@/actions/cms/testimonials')
    const result = await deleteTestimonial('tst-1')
    expect(result.success).toBe(true)
    expect(prisma.testimonial.delete).toHaveBeenCalledWith({ where: { id: 'tst-1' } })
  })

  it('should handle error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.delete).mockRejectedValue(new Error('DB'))

    const { deleteTestimonial } = await import('@/actions/cms/testimonials')
    const result = await deleteTestimonial('tst-1')
    expect(result.success).toBe(false)
  })
})

// ── Tests: toggleTestimonial ──────────────────────────────────────────────────

describe('toggleTestimonial', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should toggle from active to inactive', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findUnique).mockResolvedValue({
      id: 'tst-1',
      isActive: true,
    } as never)
    vi.mocked(prisma.testimonial.update).mockResolvedValue({} as never)

    const { toggleTestimonial } = await import('@/actions/cms/testimonials')
    const result = await toggleTestimonial('tst-1')
    expect(result.success).toBe(true)
    expect(result.isActive).toBe(false)
  })

  it('should toggle from inactive to active', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findUnique).mockResolvedValue({
      id: 'tst-1',
      isActive: false,
    } as never)
    vi.mocked(prisma.testimonial.update).mockResolvedValue({} as never)

    const { toggleTestimonial } = await import('@/actions/cms/testimonials')
    const result = await toggleTestimonial('tst-1')
    expect(result.success).toBe(true)
    expect(result.isActive).toBe(true)
  })

  it('should return error when not found', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findUnique).mockResolvedValue(null)

    const { toggleTestimonial } = await import('@/actions/cms/testimonials')
    const result = await toggleTestimonial('nonexistent')
    expect(result.success).toBe(false)
    expect(result.error).toContain('no encontrado')
  })

  it('should handle database error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.testimonial.findUnique).mockResolvedValue({
      id: 'tst-1',
      isActive: true,
    } as never)
    vi.mocked(prisma.testimonial.update).mockRejectedValue(new Error('DB'))

    const { toggleTestimonial } = await import('@/actions/cms/testimonials')
    const result = await toggleTestimonial('tst-1')
    expect(result.success).toBe(false)
  })
})
