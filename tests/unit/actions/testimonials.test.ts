import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Testimonial } from '@prisma/client'

// Mocks
vi.mock('@/lib/db', () => ({
  prisma: {
    testimonial: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn(() => Promise.resolve({ id: 'admin-1', role: 'ADMIN' })),
  guardSettingsAction: vi.fn(() => Promise.resolve({ id: 'admin-1', role: 'ADMIN' })),
}))

vi.mock('@/lib/email-service', () => ({
  emailService: {
    notifyNewTestimonial: vi.fn(() => Promise.resolve({ success: true })),
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: () => unknown) => fn),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    testimonials: 'testimonials',
    testimonial: (id: string) => `testimonial-${id}`,
    aboutSettings: 'about-settings',
    homeSettings: 'home-settings',
  },
  CACHE_DURATIONS: { MEDIUM: 300, LONG: 1800 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { testimonials: '/admin/testimonials' },
    public: { about: '/sobre-mi' },
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

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn(() => Promise.resolve()),
  checkSettingsRateLimit: vi.fn(() => Promise.resolve()),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((key: string) => {
        if (key === 'x-forwarded-for') return '127.0.0.1'
        return null
      }),
    })
  ),
}))

const makeTestimonial = (overrides: Partial<Testimonial> = {}): Testimonial => ({
  id: 'testimonial-1',
  name: 'María García',
  text: 'Excelente trabajo, quedé encantada',
  excerpt: null,
  email: null,
  phone: null,
  position: 'Novia',
  company: null,
  website: null,
  avatarUrl: null,
  rating: 5,
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  source: 'DIRECT',
  sourceId: null,
  sourceUrl: null,
  mediaProvider: null,
  mediaType: 'TEXT',
  mediaUrl: null,
  mediaEmbed: null,
  projectId: null,
  serviceId: null,
  tags: [],
  ipAddress: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  approvedAt: new Date('2024-01-01'),
  approvedBy: null,
  deletedAt: null,
  ...overrides,
})

describe('Testimonial Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ──────────────────────────────────────────
  // createTestimonial (Admin)
  // ──────────────────────────────────────────
  describe('createTestimonial', () => {
    it('should create a testimonial with valid data', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.create).mockResolvedValue(makeTestimonial())

      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'María García')
      formData.append('text', 'Excelente trabajo, quedé encantada con el resultado final')
      formData.append('rating', '5')
      formData.append('isActive', 'true')

      const result = await createTestimonial(formData)
      expect(result).toHaveProperty('success')
    })

    it('should reject testimonial with missing name', async () => {
      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('text', 'Muy buena profesional')
      formData.append('rating', '5')

      const result = await createTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should reject testimonial with missing text', async () => {
      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Ana Martínez')
      formData.append('rating', '4')

      const result = await createTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should reject testimonial with rating 0', async () => {
      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('text', 'Algún texto de testimonio aquí')
      formData.append('rating', '0')

      const result = await createTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should reject rating above 5', async () => {
      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('text', 'Algún texto de testimonio aquí')
      formData.append('rating', '6')

      const result = await createTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should accept optional position field', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.create).mockResolvedValue(
        makeTestimonial({ position: 'Directora de arte' })
      )

      const { createTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('text', 'Muy buen trabajo profesional y dedicado')
      formData.append('rating', '5')
      formData.append('position', 'Directora de arte')

      const result = await createTestimonial(formData)
      expect(result).toHaveProperty('success')
    })
  })

  // ──────────────────────────────────────────
  // submitPublicTestimonial (Public)
  // ──────────────────────────────────────────
  describe('submitPublicTestimonial', () => {
    it('should submit a public testimonial', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.create).mockResolvedValue(makeTestimonial({ isActive: false }))

      const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Cliente Feliz')
      formData.append('text', 'Estoy muy contenta con el resultado del maquillaje nupcial')
      formData.append('rating', '5')

      const result = await submitPublicTestimonial(formData)
      expect(result).toHaveProperty('success')
    })

    it('should reject public testimonial with short text', async () => {
      const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Ana')
      formData.append('text', 'Ok')
      formData.append('rating', '4')

      const result = await submitPublicTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should reject public testimonial with invalid email', async () => {
      const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('text', 'Excelente servicio profesional de maquillaje')
      formData.append('rating', '5')
      formData.append('email', 'not-an-email')

      const result = await submitPublicTestimonial(formData)
      expect(result.success).toBe(false)
    })

    it('should accept public testimonial with valid email', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.create).mockResolvedValue(makeTestimonial())

      const { submitPublicTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('text', 'Profesional increíble, muy recomendable para cualquier evento')
      formData.append('rating', '5')
      formData.append('email', 'test@example.com')

      const result = await submitPublicTestimonial(formData)
      expect(result).toHaveProperty('success')
    })
  })

  // ──────────────────────────────────────────
  // updateTestimonial
  // ──────────────────────────────────────────
  describe('updateTestimonial', () => {
    it('should update testimonial with valid data', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.update).mockResolvedValue(
        makeTestimonial({ name: 'Nombre Actualizado' })
      )

      const { updateTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Nombre Actualizado')
      formData.append('text', 'Texto actualizado del testimonio profesional')
      formData.append('rating', '4')

      const result = await updateTestimonial('testimonial-1', formData)
      expect(result).toHaveProperty('success')
    })

    it('should reject update with invalid rating', async () => {
      const { updateTestimonial } = await import('@/actions/cms/testimonials')
      const formData = new FormData()
      formData.append('name', 'Test')
      formData.append('text', 'Texto de prueba del testimonio actualizado')
      formData.append('rating', '-1')

      const result = await updateTestimonial('testimonial-1', formData)
      expect(result.success).toBe(false)
    })
  })

  // ──────────────────────────────────────────
  // deleteTestimonial
  // ──────────────────────────────────────────
  describe('deleteTestimonial', () => {
    it('should delete a testimonial successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.delete).mockResolvedValue(makeTestimonial())

      const { deleteTestimonial } = await import('@/actions/cms/testimonials')
      const result = await deleteTestimonial('testimonial-1')
      expect(result).toEqual({ success: true })
    })

    it('should call prisma.testimonial.delete with correct id', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.delete).mockResolvedValue(makeTestimonial())

      const { deleteTestimonial } = await import('@/actions/cms/testimonials')
      await deleteTestimonial('testimonial-xyz')

      expect(prisma.testimonial.delete).toHaveBeenCalledWith({
        where: { id: 'testimonial-xyz' },
      })
    })

    it('should handle delete errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.delete).mockRejectedValue(new Error('DB Error'))

      const { deleteTestimonial } = await import('@/actions/cms/testimonials')
      const result = await deleteTestimonial('testimonial-1')
      expect(result.success).toBe(false)
    })
  })

  // ──────────────────────────────────────────
  // toggleTestimonial
  // ──────────────────────────────────────────
  describe('toggleTestimonial', () => {
    it('should toggle testimonial visibility', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.findUnique).mockResolvedValue(
        makeTestimonial({ isActive: true })
      )
      vi.mocked(prisma.testimonial.update).mockResolvedValue(makeTestimonial({ isActive: false }))

      const { toggleTestimonial } = await import('@/actions/cms/testimonials')
      const result = await toggleTestimonial('testimonial-1')
      expect(result).toHaveProperty('success')
    })

    it('should return error when testimonial not found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.findUnique).mockResolvedValue(null)

      const { toggleTestimonial } = await import('@/actions/cms/testimonials')
      const result = await toggleTestimonial('nonexistent-id')
      expect(result.success).toBe(false)
    })
  })

  // ──────────────────────────────────────────
  // getActiveTestimonials (cached)
  // ──────────────────────────────────────────
  describe('getActiveTestimonials', () => {
    it('should return active testimonials', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.testimonial.findMany).mockResolvedValue([
        makeTestimonial({ id: '1', name: 'Cliente 1' }),
        makeTestimonial({ id: '2', name: 'Cliente 2' }),
      ])

      const { getActiveTestimonials } = await import('@/actions/cms/testimonials')
      const testimonials = await getActiveTestimonials(6)
      expect(Array.isArray(testimonials)).toBe(true)
    })
  })
})
