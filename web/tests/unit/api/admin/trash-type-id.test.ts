import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    project: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
    category: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
    service: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
    testimonial: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
    contact: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
    booking: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(url: string, opts: { method?: string; body?: unknown } = {}) {
  return new Request(url, {
    method: opts.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  })
}

const BASE_URL = 'http://localhost/api/admin/trash'

const mockDeletedItem = {
  id: 'item-1',
  title: 'Deleted Item',
  deletedAt: new Date(),
}

// ── Tests: PATCH (restore) ────────────────────────────────────────────────────

describe('PATCH /api/admin/trash/[type]/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as any)

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await PATCH(makeRequest(`${BASE_URL}/project/item-1`, { method: 'PATCH' }), {
      params,
    })
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid type', async () => {
    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'invalid', id: 'item-1' })
    const res = await PATCH(makeRequest(`${BASE_URL}/invalid/item-1`, { method: 'PATCH' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('inválido')
  })

  it('restores item (sets deletedAt to null)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockDeletedItem as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({
      ...mockDeletedItem,
      deletedAt: null,
    } as any)

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await PATCH(makeRequest(`${BASE_URL}/project/item-1`, { method: 'PATCH' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1' },
        data: { deletedAt: null },
      })
    )
  })

  it('returns 404 for non-existent item', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'non-existent' })
    const res = await PATCH(makeRequest(`${BASE_URL}/project/non-existent`, { method: 'PATCH' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toContain('no encontrado')
  })

  it('only operates on already-deleted items', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockDeletedItem as any)
    vi.mocked(prisma.project.update).mockResolvedValueOnce({} as any)

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    await PATCH(makeRequest(`${BASE_URL}/project/item-1`, { method: 'PATCH' }), { params })

    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1', deletedAt: { not: null } },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await PATCH(makeRequest(`${BASE_URL}/project/item-1`, { method: 'PATCH' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('supports category type', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.category.findFirst).mockResolvedValueOnce(mockDeletedItem as any)
    vi.mocked(prisma.category.update).mockResolvedValueOnce({
      ...mockDeletedItem,
      deletedAt: null,
    } as any)

    const { PATCH } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'category', id: 'item-1' })
    const res = await PATCH(makeRequest(`${BASE_URL}/category/item-1`, { method: 'PATCH' }), {
      params,
    })

    expect(res.status).toBe(200)
    expect(prisma.category.findFirst).toHaveBeenCalled()
  })
})

// ── Tests: DELETE (permanent) ─────────────────────────────────────────────────

describe('DELETE /api/admin/trash/[type]/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    const { withAdminJwt } = await import('@/lib/jwt-admin')
    vi.mocked(withAdminJwt).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    } as any)

    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/project/item-1`, { method: 'DELETE' }), {
      params,
    })
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid type', async () => {
    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'invalid', id: 'item-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/invalid/item-1`, { method: 'DELETE' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('inválido')
  })

  it('permanently removes item', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(mockDeletedItem as any)
    vi.mocked(prisma.project.delete).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/project/item-1`, { method: 'DELETE' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(prisma.project.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'item-1' } })
    )
  })

  it('returns 404 for non-existent item', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null)

    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'non-existent' })
    const res = await DELETE(
      makeRequest(`${BASE_URL}/project/non-existent`, { method: 'DELETE' }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toContain('no encontrado')
  })

  it('only deletes already-deleted items', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.service.findFirst).mockResolvedValueOnce(mockDeletedItem as any)
    vi.mocked(prisma.service.delete).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'service', id: 'item-1' })
    await DELETE(makeRequest(`${BASE_URL}/service/item-1`, { method: 'DELETE' }), { params })

    expect(prisma.service.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1', deletedAt: { not: null } },
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.project.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/trash/[type]/[id]/route')
    const params = Promise.resolve({ type: 'project', id: 'item-1' })
    const res = await DELETE(makeRequest(`${BASE_URL}/project/item-1`, { method: 'DELETE' }), {
      params,
    })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })
})
