import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Dynamic Prisma mock (settings use dynamic model access) ───────────────────

const mockModel = {
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}

vi.mock('@/lib/db', () => ({
  prisma: new Proxy(
    {},
    {
      get: () => mockModel,
    }
  ),
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

const BASE_URL = 'http://localhost/api/admin/settings'

const VALID_TYPES = [
  'home',
  'about',
  'contact',
  'theme',
  'site',
  'project',
  'testimonial',
  'category',
] as const

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// GET /api/admin/settings/[type] — extended
// ============================================

describe('GET /api/admin/settings/[type] — extended', () => {
  it.each(VALID_TYPES)('GET returns 200 for valid type "%s"', async (type) => {
    mockModel.findFirst.mockResolvedValue({ id: '1', title: 'Hello' })

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/${type}`), { params: Promise.resolve({ type }) })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })

  it('GET returns 400 for invalid type', async () => {
    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/invalid-type`), {
      params: Promise.resolve({ type: 'invalid-type' }),
    })

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('inválido')
  })

  it('GET creates settings when none exist', async () => {
    mockModel.findFirst.mockResolvedValue(null)
    mockModel.create.mockResolvedValue({ id: 'new-1' })

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/home`), {
      params: Promise.resolve({ type: 'home' }),
    })

    expect(res.status).toBe(200)
    expect(mockModel.create).toHaveBeenCalledWith({ data: {} })
  })

  it('GET returns existing settings when found', async () => {
    const existing = { id: '1', heroTitle: 'Welcome', heroSubtitle: 'Hi' }
    mockModel.findFirst.mockResolvedValue(existing)

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/home`), {
      params: Promise.resolve({ type: 'home' }),
    })

    const json = await res.json()
    expect(json.data).toEqual(existing)
    expect(mockModel.create).not.toHaveBeenCalled()
  })

  it('GET handles db error with 500', async () => {
    mockModel.findFirst.mockRejectedValue(new Error('DB failure'))

    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/home`), {
      params: Promise.resolve({ type: 'home' }),
    })

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('GET returns 400 for empty string type', async () => {
    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/`), { params: Promise.resolve({ type: '' }) })

    expect(res.status).toBe(400)
  })

  it('GET returns 400 for numeric type', async () => {
    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/123`), {
      params: Promise.resolve({ type: '123' }),
    })

    expect(res.status).toBe(400)
  })

  it('GET returns 400 for uppercase type', async () => {
    const { GET } = await import('@/app/api/admin/settings/[type]/route')
    const res = await GET(makeRequest(`${BASE_URL}/HOME`), {
      params: Promise.resolve({ type: 'HOME' }),
    })

    expect(res.status).toBe(400)
  })
})

// ============================================
// PATCH /api/admin/settings/[type] — extended
// ============================================

describe('PATCH /api/admin/settings/[type] — extended', () => {
  it.each(VALID_TYPES)('PATCH returns 200 for valid type "%s"', async (type) => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1', updated: true })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/${type}`, { method: 'PATCH', body: { title: 'New title' } }),
      { params: Promise.resolve({ type }) }
    )

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('PATCH returns 400 for invalid type', async () => {
    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/invalid`, { method: 'PATCH', body: { title: 'test' } }),
      { params: Promise.resolve({ type: 'invalid' }) }
    )

    expect(res.status).toBe(400)
  })

  it('PATCH filters out FORBIDDEN_FIELDS id', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/home`, {
        method: 'PATCH',
        body: { id: 'hacked', heroTitle: 'Hello' },
      }),
      { params: Promise.resolve({ type: 'home' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ id: 'hacked' }),
      })
    )
  })

  it('PATCH filters out FORBIDDEN_FIELDS createdAt', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/about`, {
        method: 'PATCH',
        body: { createdAt: '2020-01-01', title: 'x' },
      }),
      { params: Promise.resolve({ type: 'about' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ createdAt: '2020-01-01' }),
      })
    )
  })

  it('PATCH filters out FORBIDDEN_FIELDS updatedAt', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/contact`, {
        method: 'PATCH',
        body: { updatedAt: '2020-01-01', phone: '999' },
      }),
      { params: Promise.resolve({ type: 'contact' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ updatedAt: '2020-01-01' }),
      })
    )
  })

  it('PATCH filters out FORBIDDEN_FIELDS isActive', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/theme`, {
        method: 'PATCH',
        body: { isActive: false, primaryColor: '#ff0000' },
      }),
      { params: Promise.resolve({ type: 'theme' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ isActive: false }),
      })
    )
  })

  it('PATCH creates settings when none exist', async () => {
    mockModel.findFirst.mockResolvedValue(null)
    mockModel.create.mockResolvedValue({ id: 'new-1', heroTitle: 'My Hero' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'My Hero' } }),
      { params: Promise.resolve({ type: 'home' }) }
    )

    expect(res.status).toBe(200)
    expect(mockModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ heroTitle: 'My Hero' }),
      })
    )
  })

  it('PATCH updates existing settings by id', async () => {
    mockModel.findFirst.mockResolvedValue({ id: 'existing-id' })
    mockModel.update.mockResolvedValue({ id: 'existing-id', heroTitle: 'Updated' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'Updated' } }),
      { params: Promise.resolve({ type: 'home' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith({
      where: { id: 'existing-id' },
      data: { heroTitle: 'Updated' },
    })
  })

  it('PATCH with empty body updates nothing', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: {} }), {
      params: Promise.resolve({ type: 'home' }),
    })

    expect(res.status).toBe(200)
    expect(mockModel.update).toHaveBeenCalledWith({ where: { id: '1' }, data: {} })
  })

  it('PATCH with only forbidden fields results in empty data', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, {
        method: 'PATCH',
        body: { id: 'x', createdAt: 'x', updatedAt: 'x', isActive: true },
      }),
      { params: Promise.resolve({ type: 'home' }) }
    )

    expect(res.status).toBe(200)
    expect(mockModel.update).toHaveBeenCalledWith({ where: { id: '1' }, data: {} })
  })

  it('PATCH handles db error with 500', async () => {
    mockModel.findFirst.mockRejectedValue(new Error('DB error'))

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    const res = await PATCH(
      makeRequest(`${BASE_URL}/home`, { method: 'PATCH', body: { heroTitle: 'test' } }),
      { params: Promise.resolve({ type: 'home' }) }
    )

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('PATCH preserves allowed fields while stripping forbidden', async () => {
    mockModel.findFirst.mockResolvedValue({ id: '1' })
    mockModel.update.mockResolvedValue({ id: '1' })

    const { PATCH } = await import('@/app/api/admin/settings/[type]/route')
    await PATCH(
      makeRequest(`${BASE_URL}/about`, {
        method: 'PATCH',
        body: {
          id: 'inject',
          createdAt: 'inject',
          updatedAt: 'inject',
          isActive: false,
          title: 'About Me',
          description: 'Lorem ipsum',
          imageUrl: 'https://example.com/me.jpg',
        },
      }),
      { params: Promise.resolve({ type: 'about' }) }
    )

    expect(mockModel.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        title: 'About Me',
        description: 'Lorem ipsum',
        imageUrl: 'https://example.com/me.jpg',
      },
    })
  })
})
