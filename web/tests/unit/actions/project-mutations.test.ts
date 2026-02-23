import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    project: {
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn(),
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
  revalidateTag: vi.fn(),
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    admin: { projects: '/admin/proyectos' },
    public: { projects: '/proyectos', home: '/' },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
}))

describe('Project Mutations (cms/project)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── reorderProjects ─────────────────────────────

  describe('reorderProjects', () => {
    it('reorders projects successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { reorderProjects } = await import('@/actions/cms/project')
      await reorderProjects(['p1', 'p2', 'p3'])

      expect(prisma.project.update).toHaveBeenCalledTimes(3)
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { sortOrder: 0 },
      })
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'p2' },
        data: { sortOrder: 1 },
      })
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'p3' },
        data: { sortOrder: 2 },
      })
    })

    it('requires admin auth', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { reorderProjects } = await import('@/actions/cms/project')
      await reorderProjects(['p1'])

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { reorderProjects } = await import('@/actions/cms/project')
      await reorderProjects(['p1'])

      expect(checkApiRateLimit).toHaveBeenCalled()
    })

    it('handles empty array', async () => {
      const { prisma } = await import('@/lib/db')

      const { reorderProjects } = await import('@/actions/cms/project')
      await reorderProjects([])

      expect(prisma.project.update).not.toHaveBeenCalled()
    })

    it('calls revalidatePath after reorder', async () => {
      const { revalidatePath } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { reorderProjects } = await import('@/actions/cms/project')
      await reorderProjects(['p1'])

      expect(revalidatePath).toHaveBeenCalledWith('/admin/proyectos')
    })

    it('throws on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockRejectedValue(new Error('DB error'))

      const { reorderProjects } = await import('@/actions/cms/project')

      await expect(reorderProjects(['p1'])).rejects.toThrow()
    })
  })

  // ─── setProjectThumbnail ─────────────────────────

  describe('setProjectThumbnail', () => {
    it('sets thumbnail URL', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { setProjectThumbnail } = await import('@/actions/cms/project')
      const result = await setProjectThumbnail('proj-1', 'https://example.com/img.jpg')

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: { thumbnailUrl: 'https://example.com/img.jpg' },
      })
      expect(result.success).toBe(true)
    })

    it('requires admin auth', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { setProjectThumbnail } = await import('@/actions/cms/project')
      await setProjectThumbnail('proj-1', 'https://example.com/img.jpg')

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('returns success', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { setProjectThumbnail } = await import('@/actions/cms/project')
      const result = await setProjectThumbnail('proj-1', 'https://example.com/img.jpg')

      expect(result).toEqual({ success: true })
    })

    it('returns error on failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockRejectedValue(new Error('DB error'))

      const { setProjectThumbnail } = await import('@/actions/cms/project')
      const result = await setProjectThumbnail('proj-1', 'https://example.com/img.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  // ─── deleteProjectAction ─────────────────────────

  describe('deleteProjectAction', () => {
    it('soft deletes project', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { deleteProjectAction } = await import('@/actions/cms/project')
      await deleteProjectAction('proj-1')

      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'proj-1' },
          data: expect.objectContaining({ isDeleted: true }),
        })
      )
    })

    it('requires admin auth', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { deleteProjectAction } = await import('@/actions/cms/project')
      await deleteProjectAction('proj-1')

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('calls revalidatePath after deletion', async () => {
      const { revalidatePath } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { deleteProjectAction } = await import('@/actions/cms/project')
      await deleteProjectAction('proj-1')

      expect(revalidatePath).toHaveBeenCalledWith('/admin/proyectos')
    })

    it('sets deletedAt timestamp', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { deleteProjectAction } = await import('@/actions/cms/project')
      await deleteProjectAction('proj-1')

      const call = vi.mocked(prisma.project.update).mock.calls[0][0]
      expect(call.data).toHaveProperty('deletedAt')
      expect(call.data.deletedAt).toBeInstanceOf(Date)
    })
  })

  // ─── toggleProjectActive ─────────────────────────

  describe('toggleProjectActive', () => {
    it('toggles isActive to opposite value', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ isActive: true } as never)
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { toggleProjectActive } = await import('@/actions/cms/project')
      const result = await toggleProjectActive('proj-1')

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: { isActive: false },
      })
      expect(result.success).toBe(true)
    })

    it('requires admin auth', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ isActive: true } as never)
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { toggleProjectActive } = await import('@/actions/cms/project')
      await toggleProjectActive('proj-1')

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ isActive: false } as never)
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { toggleProjectActive } = await import('@/actions/cms/project')
      await toggleProjectActive('proj-1')

      expect(checkApiRateLimit).toHaveBeenCalled()
    })

    it('calls revalidatePath for admin and public routes', async () => {
      const { revalidatePath } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ isActive: true } as never)
      vi.mocked(prisma.project.update).mockResolvedValue({} as never)

      const { toggleProjectActive } = await import('@/actions/cms/project')
      await toggleProjectActive('proj-1')

      expect(revalidatePath).toHaveBeenCalledWith('/admin/proyectos')
      expect(revalidatePath).toHaveBeenCalledWith('/proyectos')
    })

    it('returns error if project not found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null as never)

      const { toggleProjectActive } = await import('@/actions/cms/project')
      const result = await toggleProjectActive('non-existent')

      expect(result.success).toBe(false)
      expect(result.error).toContain('no encontrado')
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ isActive: true } as never)
      vi.mocked(prisma.project.update).mockRejectedValue(new Error('DB error'))

      const { toggleProjectActive } = await import('@/actions/cms/project')
      const result = await toggleProjectActive('proj-1')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
