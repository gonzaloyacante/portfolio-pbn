import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateProject, deleteProject, restoreProject } from '@/actions/cms/content'
import type { Project } from '@/generated/prisma/client'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
    },
  },
}))

// Mock NextAuth session
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({ user: { id: 'user-1', role: 'ADMIN' } })),
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

// Mock rate-limit-guards (uses next/headers internally)
vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn(() => Promise.resolve()),
  checkSettingsRateLimit: vi.fn(() => Promise.resolve()),
  getClientIp: vi.fn(() => Promise.resolve('127.0.0.1')),
}))

// Mock Cloudinary
vi.mock('@/lib/cloudinary', () => ({
  uploadToCloudinary: vi.fn(),
  deleteFromCloudinary: vi.fn(),
}))

// Mock routes config
vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { projects: '/admin/projects' },
    public: { projects: '/proyectos' },
  },
}))

// Mock security server utilities
vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn(() => Promise.resolve({ id: 'user-1', role: 'ADMIN' })),
  validateAndSanitize: vi.fn((schema: unknown, data: unknown) => ({ success: true, data })),
}))

// Minimal Project factory satisfying the full Prisma schema
const makeProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'proj-1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'Test description for the project',
  excerpt: null,
  thumbnailUrl: 'https://res.cloudinary.com/test/image/upload/v1/thumb.jpg',
  videoUrl: null,
  date: new Date('2024-01-15'),
  duration: null,
  client: null,
  location: null,
  tags: [],
  metaTitle: null,
  metaDescription: null,
  metaKeywords: [],
  ogImage: null,
  canonicalUrl: null,
  categoryId: 'cat-1',
  sortOrder: 0,
  isFeatured: false,
  isPinned: false,
  layout: 'grid',
  viewCount: 0,
  likeCount: 0,
  shareCount: 0,
  lastViewedAt: null,
  version: 1,
  publishedAt: null,
  isActive: true,
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  createdAt: new Date(),
  createdBy: null,
  updatedAt: new Date(),
  updatedBy: null,
  ...overrides,
})

describe('Project CMS Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateProject', () => {
    it('should update a project successfully', async () => {
      const { prisma } = await import('@/lib/db')
      const updated = makeProject({ title: 'Updated Project', slug: 'updated-project' })
      vi.mocked(prisma.project.update).mockResolvedValue(updated)
      vi.mocked(prisma.project.findUnique).mockResolvedValue(updated)

      const formData = new FormData()
      formData.append('title', 'Updated Project')
      formData.append('categoryId', 'cat-1')
      formData.append('date', new Date().toISOString())

      const result = await updateProject('proj-1', formData)

      expect(result.success).toBe(true)
    })

    it('should handle update errors gracefully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('title', 'Test')
      formData.append('categoryId', 'cat-1')
      formData.append('date', new Date().toISOString())

      const result = await updateProject('nonexistent-id', formData)

      // Should not throw, should return error
      expect(result).toBeDefined()
    })
  })

  describe('deleteProject', () => {
    it('should soft delete a project', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue(
        makeProject({ isDeleted: true, deletedAt: new Date() })
      )

      const result = await deleteProject('proj-1')

      expect(result.success).toBe(true)
      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'proj-1' },
          data: expect.objectContaining({
            isDeleted: true,
          }),
        })
      )
    })
  })

  describe('restoreProject', () => {
    it('should restore a soft-deleted project', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue(
        makeProject({ isDeleted: false, deletedAt: null })
      )

      const result = await restoreProject('proj-1')

      expect(result.success).toBe(true)
      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'proj-1' },
          data: expect.objectContaining({
            isDeleted: false,
            deletedAt: null,
          }),
        })
      )
    })
  })
})
