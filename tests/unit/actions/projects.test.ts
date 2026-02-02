import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createProject,
  updateProject,
  deleteProject,
  restoreProject,
} from '@/actions/projects.actions'
import { db } from '@/lib/db'
import type { Project, Category } from '@prisma/client'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  db: {
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

// Mock NextAuth
vi.mock('next-auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { role: 'ADMIN' } })),
}))

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Projects Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const mockCategory: Category = {
        id: 'cat-1',
        name: 'Audiovisual',
        slug: 'audiovisual',
        description: null,
        sortOrder: 0,
      }
      const mockProject: Project = {
        id: 'proj-1',
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        categoryId: 'cat-1',
        date: new Date(),
        isFeatured: false,
        isActive: true,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.category.findUnique).mockResolvedValue(mockCategory)
      vi.mocked(db.project.create).mockResolvedValue(mockProject)

      const formData = new FormData()
      formData.append('title', 'Test Project')
      formData.append('slug', 'test-project')
      formData.append('description', 'Test description')
      formData.append('thumbnailUrl', 'https://example.com/thumb.jpg')
      formData.append('categoryId', 'cat-1')
      formData.append('date', new Date().toISOString())

      const result = await createProject(formData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProject)
      expect(db.project.create).toHaveBeenCalledOnce()
    })

    it('should fail if category does not exist', async () => {
      vi.mocked(db.category.findUnique).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('title', 'Test Project')
      formData.append('categoryId', 'invalid-cat')

      const result = await createProject(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Categoría no encontrada')
    })

    it('should validate required fields', async () => {
      const formData = new FormData()
      // Missing required fields

      const result = await createProject(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('updateProject', () => {
    it('should update a project successfully', async () => {
      const mockProject: Project = {
        id: 'proj-1',
        title: 'Updated Project',
        slug: 'updated-project',
        description: 'Desc',
        thumbnailUrl: 'url',
        categoryId: 'cat-1',
        date: new Date(),
        isFeatured: false,
        isActive: true,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.project.update).mockResolvedValue(mockProject)

      const formData = new FormData()
      formData.append('title', 'Updated Project')

      const result = await updateProject('proj-1', formData)

      expect(result.success).toBe(true)
      expect(db.project.update).toHaveBeenCalledOnce()
    })
  })

  describe('deleteProject', () => {
    it('should soft delete a project', async () => {
      const mockProject: Project = {
        id: 'proj-1',
        isDeleted: true,
        deletedAt: new Date(),
        title: 'Project',
        slug: 'project',
        description: 'Desc',
        thumbnailUrl: 'url',
        categoryId: 'cat-1',
        date: new Date(),
        isFeatured: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.project.update).mockResolvedValue(mockProject)

      const result = await deleteProject('proj-1')

      expect(result.success).toBe(true)
      expect(db.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
        }),
      })
    })
  })

  describe('restoreProject', () => {
    it('should restore a deleted project', async () => {
      const mockProject: Project = {
        id: 'proj-1',
        isDeleted: false,
        deletedAt: null,
        title: 'Project',
        slug: 'project',
        description: 'Desc',
        thumbnailUrl: 'url',
        categoryId: 'cat-1',
        date: new Date(),
        isFeatured: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.project.update).mockResolvedValue(mockProject)

      const result = await restoreProject('proj-1')

      expect(result.success).toBe(true)
      expect(db.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      })
    })
  })
})
