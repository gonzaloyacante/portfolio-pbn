import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access', email: 'admin@test.com' },
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

const BASE_URL = 'http://localhost/api/admin/contacts'

const mockContact = {
  id: 'contact-1',
  name: 'María López',
  email: 'maria@test.com',
  subject: 'Consulta boda',
  message: 'Me gustaría reservar para una boda.',
  phone: '+34 600 000 111',
  isRead: false,
  readAt: null,
  status: 'PENDING',
  priority: 'NORMAL',
  assignedTo: null,
  tags: [],
  isReplied: false,
  repliedAt: null,
  repliedBy: null,
  replyText: null,
  adminNote: null,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2025-06-01'),
  updatedAt: new Date('2025-06-01'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// GET /api/admin/contacts — extended
// ============================================

describe('GET /api/admin/contacts — extended', () => {
  it('GET returns contacts list with unreadCount', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockContact])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(1) // total
      .mockResolvedValueOnce(1) // unread

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.data).toHaveLength(1)
    expect(json.data.unreadCount).toBe(1)
  })

  it('GET with search filter matches name', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(`${BASE_URL}?search=María`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: expect.objectContaining({ contains: 'María' }) }),
          ]),
        }),
      })
    )
  })

  it('GET with status filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(`${BASE_URL}?status=RESOLVED`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'RESOLVED' }),
      })
    )
  })

  it('GET with unread filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(`${BASE_URL}?unread=true`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isRead: false }),
      })
    )
  })

  it('GET with priority filter', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(`${BASE_URL}?priority=HIGH`))
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ priority: 'HIGH' }),
      })
    )
  })

  it('GET returns pagination metadata', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(30)
      .mockResolvedValueOnce(5)

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(`${BASE_URL}?page=2&limit=10`))
    const json = await res.json()

    expect(json.data.pagination.total).toBe(30)
    expect(json.data.pagination.totalPages).toBe(3)
  })

  it('GET orders by isRead asc then createdAt desc', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    ;(prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/contacts/route')
    await GET(makeRequest(BASE_URL))

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.arrayContaining([{ isRead: 'asc' }, { createdAt: 'desc' }]),
      })
    )
  })

  it('GET handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB'))

    const { GET } = await import('@/app/api/admin/contacts/route')
    const res = await GET(makeRequest(BASE_URL))

    expect(res.status).toBe(500)
  })
})

// ============================================
// GET /api/admin/contacts/[id] — auto-read
// ============================================

describe('GET /api/admin/contacts/[id] — auto-read marking', () => {
  it('GET returns contact by id', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isRead: true,
    })

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/contact-1`), {
      params: Promise.resolve({ id: 'contact-1' }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.id).toBe('contact-1')
  })

  it('GET marks unread contact as read', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isRead: false,
    })
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isRead: true,
    })

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    await GET(makeRequest(`${BASE_URL}/contact-1`), {
      params: Promise.resolve({ id: 'contact-1' }),
    })

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'contact-1' },
        data: expect.objectContaining({
          isRead: true,
          readAt: expect.any(Date),
        }),
      })
    )
  })

  it('GET does not update already-read contact', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isRead: true,
    })

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    await GET(makeRequest(`${BASE_URL}/contact-1`), {
      params: Promise.resolve({ id: 'contact-1' }),
    })

    expect(prisma.contact.update).not.toHaveBeenCalled()
  })

  it('GET returns 404 for nonexistent contact', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await GET(makeRequest(`${BASE_URL}/contact-404`), {
      params: Promise.resolve({ id: 'contact-404' }),
    })

    expect(res.status).toBe(404)
  })
})

// ============================================
// PATCH /api/admin/contacts/[id] — reply tracking
// ============================================

describe('PATCH /api/admin/contacts/[id] — reply tracking', () => {
  it('PATCH updates status', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      status: 'IN_PROGRESS',
    })

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, { method: 'PATCH', body: { status: 'IN_PROGRESS' } }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(res.status).toBe(200)
    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'IN_PROGRESS' }),
      })
    )
  })

  it('PATCH updates priority', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      priority: 'HIGH',
    })

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, { method: 'PATCH', body: { priority: 'HIGH' } }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ priority: 'HIGH' }),
      })
    )
  })

  it('PATCH sets reply tracking on first reply', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isReplied: false,
    })
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockContact,
      isReplied: true,
      replyText: 'Thank you!',
    })

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, { method: 'PATCH', body: { replyText: 'Thank you!' } }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          replyText: 'Thank you!',
          isReplied: true,
          repliedAt: expect.any(Date),
        }),
      })
    )
  })

  it('PATCH updates admin note', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockContact })

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, {
        method: 'PATCH',
        body: { adminNote: 'Follow up next week' },
      }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ adminNote: 'Follow up next week' }),
      })
    )
  })

  it('PATCH updates assignedTo', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockContact })

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, { method: 'PATCH', body: { assignedTo: 'user-2' } }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ assignedTo: 'user-2' }),
      })
    )
  })

  it('PATCH returns 404 when contact not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/contact-404`, { method: 'PATCH', body: { status: 'RESOLVED' } }),
      { params: Promise.resolve({ id: 'contact-404' }) }
    )

    expect(res.status).toBe(404)
  })

  it('PATCH handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/contact-1`, { method: 'PATCH', body: { status: 'RESOLVED' } }),
      { params: Promise.resolve({ id: 'contact-1' }) }
    )

    expect(res.status).toBe(500)
  })
})

// ============================================
// DELETE /api/admin/contacts/[id] — soft delete
// ============================================

describe('DELETE /api/admin/contacts/[id] — soft delete', () => {
  it('DELETE soft deletes a contact', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockResolvedValue({})

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/contact-1`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'contact-1' }),
    })

    expect(res.status).toBe(200)
    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    )
  })

  it('DELETE returns 404 when contact not found', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/contact-404`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'contact-404' }),
    })

    expect(res.status).toBe(404)
  })

  it('DELETE handles db error with 500', async () => {
    const { prisma } = await import('@/lib/db')
    ;(prisma.contact.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockContact)
    ;(prisma.contact.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const res = await DELETE(makeRequest(`${BASE_URL}/contact-1`, { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'contact-1' }),
    })

    expect(res.status).toBe(500)
  })
})
