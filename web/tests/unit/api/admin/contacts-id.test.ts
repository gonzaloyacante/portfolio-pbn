import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

const BASE_URL = 'http://localhost/api/admin/contacts/contact-1'

const mockContactDetail = {
  id: 'contact-1',
  name: 'María García',
  email: 'maria@example.com',
  phone: '+34 600 123 456',
  message: 'Quiero reservar una sesión.',
  subject: 'Consulta',
  responsePreference: null,
  leadScore: 0,
  leadSource: null,
  status: 'NEW',
  priority: 'MEDIUM',
  assignedTo: null,
  isRead: false,
  readAt: null,
  readBy: null,
  isReplied: false,
  repliedAt: null,
  repliedBy: null,
  replyText: null,
  adminNote: null,
  tags: [],
  ipAddress: null,
  referrer: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests: GET ────────────────────────────────────────────────────────────────

describe('GET /api/admin/contacts/[id]', () => {
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

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    expect(res.status).toBe(401)
  })

  it('returns 404 for non-existent contact', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Contacto no encontrado')
  })

  it('auto-marks contact as read on first view', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
      ...mockContactDetail,
      isRead: false,
    } as any)
    vi.mocked(prisma.contact.update).mockResolvedValueOnce({} as any)

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'contact-1' },
        data: expect.objectContaining({ isRead: true, readAt: expect.any(Date) }),
      })
    )
    expect(json.data.isRead).toBe(true)
  })

  it('returns contact detail with isRead: true in response', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
      ...mockContactDetail,
      isRead: true,
    } as any)

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.isRead).toBe(true)
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockRejectedValueOnce(new Error('DB error'))

    const { GET } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await GET(makeRequest(BASE_URL), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

// ── Tests: PATCH ──────────────────────────────────────────────────────────────

describe('PATCH /api/admin/contacts/[id]', () => {
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

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'IN_PROGRESS' } }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('returns 404 when contact does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null)

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'IN_PROGRESS' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Contacto no encontrado')
  })

  it('updates contact successfully', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(mockContactDetail as any)
    vi.mocked(prisma.contact.update).mockResolvedValueOnce({
      ...mockContactDetail,
      status: 'IN_PROGRESS',
    } as any)

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'IN_PROGRESS' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('marks as replied when replyText provided and not previously replied', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
      ...mockContactDetail,
      isReplied: false,
    } as any)
    vi.mocked(prisma.contact.update).mockResolvedValueOnce({
      ...mockContactDetail,
      isReplied: true,
      replyText: 'Gracias por tu consulta.',
    } as any)

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { replyText: 'Gracias por tu consulta.' } }),
      { params }
    )

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          replyText: 'Gracias por tu consulta.',
          isReplied: true,
          repliedAt: expect.any(Date),
        }),
      })
    )
  })

  it('does not re-mark as replied when already replied', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
      ...mockContactDetail,
      isReplied: true,
      repliedAt: new Date(),
    } as any)
    vi.mocked(prisma.contact.update).mockResolvedValueOnce({
      ...mockContactDetail,
      isReplied: true,
    } as any)

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    await PATCH(makeRequest(BASE_URL, { method: 'PATCH', body: { replyText: 'Updated reply' } }), {
      params,
    })

    // Should NOT include isReplied: true / repliedAt in update since already replied
    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          isReplied: true,
          repliedAt: expect.any(Date),
        }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(mockContactDetail as any)
    vi.mocked(prisma.contact.update).mockRejectedValueOnce(new Error('DB error'))

    const { PATCH } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await PATCH(
      makeRequest(BASE_URL, { method: 'PATCH', body: { status: 'CLOSED' } }),
      { params }
    )
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})

// ── Tests: DELETE ─────────────────────────────────────────────────────────────

describe('DELETE /api/admin/contacts/[id]', () => {
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

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    expect(res.status).toBe(401)
  })

  it('returns 404 when contact does not exist', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null)

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'non-existent' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toBe('Contacto no encontrado')
  })

  it('soft deletes contact (sets deletedAt)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(mockContactDetail as any)
    vi.mocked(prisma.contact.update).mockResolvedValueOnce({} as any)

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Contacto eliminado')
    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'contact-1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    )
  })

  it('returns 500 on DB error', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(mockContactDetail as any)
    vi.mocked(prisma.contact.update).mockRejectedValueOnce(new Error('DB error'))

    const { DELETE } = await import('@/app/api/admin/contacts/[id]/route')
    const params = Promise.resolve({ id: 'contact-1' })
    const res = await DELETE(makeRequest(BASE_URL, { method: 'DELETE' }), { params })
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toEqual({ success: false, error: 'Error interno' })
  })
})
