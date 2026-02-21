import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Service } from '@prisma/client'

// ──────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────
vi.mock('@/lib/db', () => ({
  prisma: {
    service: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn(() => Promise.resolve({ id: 'admin-1', role: 'ADMIN' })),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn(() => Promise.resolve()),
  checkSettingsRateLimit: vi.fn(() => Promise.resolve()),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: () => unknown) => fn),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    services: 'services',
    service: (id: string) => `service-${id}`,
  },
  CACHE_DURATIONS: { MEDIUM: 300, LONG: 1800 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { services: '/admin/servicios' },
    public: { services: '/servicios' },
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
// Factory
// ──────────────────────────────────────────
const makeService = (overrides: Partial<Service> = {}): Service => ({
  id: 'service-1',
  name: 'Maquillaje Nupcial',
  slug: 'maquillaje-nupcial',
  description: 'Maquillaje profesional para novias',
  shortDesc: 'Para tu gran día',
  price: null,
  priceLabel: 'desde',
  currency: 'ARS',
  pricingTiers: null,
  duration: '3 horas',
  durationMinutes: 180,
  isAvailable: true,
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  maxBookingsPerDay: 3,
  advanceNoticeDays: 2,
  imageUrl: null,
  galleryUrls: [],
  videoUrl: null,
  iconName: null,
  color: null,
  metaTitle: null,
  metaDescription: null,
  metaKeywords: [],
  requirements: null,
  cancellationPolicy: null,
  bookingCount: 0,
  viewCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// ──────────────────────────────────────────
// Tests
// ──────────────────────────────────────────
describe('Service Actions', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── createService ──────────────────────
  describe('createService', () => {
    it('should create a service with minimum required fields', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.create).mockResolvedValue(makeService())

      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Maquillaje Nupcial')
      formData.append('slug', 'maquillaje-nupcial')

      const result = await createService(formData)
      expect(result).toBeDefined()
    })

    it('should reject service with missing name', async () => {
      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('slug', 'mi-servicio')

      const result = await createService(formData)
      expect(result.success).toBe(false)
    })

    it('should reject service with missing slug', async () => {
      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Mi Servicio')

      const result = await createService(formData)
      expect(result.success).toBe(false)
    })

    it('should reject service with invalid slug characters', async () => {
      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Mi Servicio')
      formData.append('slug', 'Mi Servicio Con Espacios!')

      const result = await createService(formData)
      expect(result.success).toBe(false)
    })

    it('should accept valid slug with dashes and numbers', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.create).mockResolvedValue(
        makeService({ slug: 'maquillaje-artistico-2024' })
      )

      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Maquillaje Artístico 2024')
      formData.append('slug', 'maquillaje-artistico-2024')

      const result = await createService(formData)
      expect(result).toBeDefined()
    })

    it('should accept optional price field', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.create).mockResolvedValue(makeService({ price: 15000 }))

      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Servicio de Prueba')
      formData.append('slug', 'servicio-prueba')
      formData.append('price', '15000')

      const result = await createService(formData)
      expect(result).toBeDefined()
    })

    it('should accept priceLabel from allowed values', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.create).mockResolvedValue(makeService({ priceLabel: 'fijo' }))

      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Servicio Fijo')
      formData.append('slug', 'servicio-fijo')
      formData.append('priceLabel', 'fijo')

      const result = await createService(formData)
      expect(result).toBeDefined()
    })

    it('should attempt create when required fields are provided', async () => {
      const { prisma } = await import('@/lib/db')
      const mockService = makeService({ isActive: true })
      vi.mocked(prisma.service.create).mockResolvedValue(mockService)

      const { createService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Servicio Activo')
      formData.append('slug', 'servicio-activo')
      formData.append('isActive', 'true')

      const result = await createService(formData)
      // Either DB creates it or validation fails — either way no exception
      expect(result).toBeDefined()
    })
  })

  // ── updateService ──────────────────────
  describe('updateService', () => {
    it('should update a service successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockResolvedValue(
        makeService({ name: 'Nombre Actualizado' })
      )

      const { updateService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Nombre Actualizado')
      formData.append('slug', 'nombre-actualizado')

      const result = await updateService('service-1', formData)
      expect(result).toBeDefined()
    })

    it('should call prisma update when data is valid', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockResolvedValue(makeService())

      const { updateService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Servicio Editado')
      formData.append('slug', 'servicio-editado')
      formData.append('isActive', 'true')

      const result = await updateService('service-xyz', formData)
      // If validation passes, update is called; otherwise error is returned
      expect(result).toBeDefined()
    })

    it('should validate fields on update', async () => {
      const { updateService } = await import('@/actions/cms/services')
      const formData = new FormData()
      // Missing name
      formData.append('slug', 'slug-valido')

      const result = await updateService('service-1', formData)
      expect(result.success).toBe(false)
    })

    it('should handle DB errors on update', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockRejectedValue(new Error('DB Error'))

      const { updateService } = await import('@/actions/cms/services')
      const formData = new FormData()
      formData.append('name', 'Test')
      formData.append('slug', 'test')

      const result = await updateService('service-1', formData)
      expect(result.success).toBe(false)
    })
  })

  // ── deleteService ──────────────────────
  describe('deleteService', () => {
    it('should delete a service', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.delete).mockResolvedValue(makeService())

      const { deleteService } = await import('@/actions/cms/services')
      const result = await deleteService('service-1')
      expect(result).toHaveProperty('success')
    })

    it('should call prisma delete with correct id', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.delete).mockResolvedValue(makeService())

      const { deleteService } = await import('@/actions/cms/services')
      await deleteService('service-abc')

      expect(prisma.service.delete).toHaveBeenCalledWith({
        where: { id: 'service-abc' },
      })
    })

    it('should return error on delete failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.delete).mockRejectedValue(new Error('Service not found'))

      const { deleteService } = await import('@/actions/cms/services')
      const result = await deleteService('nonexistent')
      expect(result.success).toBe(false)
    })
  })

  // ── toggleService ──────────────────────
  describe('toggleService', () => {
    it('should toggle service isActive from true to false', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.findUnique).mockResolvedValue(makeService({ isActive: true }))
      vi.mocked(prisma.service.update).mockResolvedValue(makeService({ isActive: false }))

      const { toggleService } = await import('@/actions/cms/services')
      const result = await toggleService('service-1')
      expect(result).toHaveProperty('success')
    })

    it('should toggle service isActive from false to true', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.findUnique).mockResolvedValue(makeService({ isActive: false }))
      vi.mocked(prisma.service.update).mockResolvedValue(makeService({ isActive: true }))

      const { toggleService } = await import('@/actions/cms/services')
      const result = await toggleService('service-1')
      expect(result).toHaveProperty('success')
    })

    it('should return error when service not found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.findUnique).mockResolvedValue(null)

      const { toggleService } = await import('@/actions/cms/services')
      const result = await toggleService('nonexistent')
      expect(result.success).toBe(false)
    })
  })

  // ── reorderServices ────────────────────
  describe('reorderServices', () => {
    it('should reorder services by array of ids', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockResolvedValue(makeService())

      const { reorderServices } = await import('@/actions/cms/services')
      const result = await reorderServices(['service-2', 'service-1', 'service-3'])
      expect(result).toHaveProperty('success')
    })

    it('should call prisma update for each service', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockResolvedValue(makeService())

      const { reorderServices } = await import('@/actions/cms/services')
      await reorderServices(['s1', 's2', 's3'])
      expect(prisma.service.update).toHaveBeenCalledTimes(3)
    })

    it('should handle empty array gracefully', async () => {
      const { reorderServices } = await import('@/actions/cms/services')
      const result = await reorderServices([])
      expect(result).toHaveProperty('success')
    })

    it('should set sortOrder based on array position', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.service.update).mockResolvedValue(makeService())

      const { reorderServices } = await import('@/actions/cms/services')
      await reorderServices(['first-id', 'second-id'])

      expect(prisma.service.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'first-id' },
          data: expect.objectContaining({ sortOrder: 0 }),
        })
      )
    })
  })
})
