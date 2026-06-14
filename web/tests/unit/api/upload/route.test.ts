import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/auth', () => ({ authOptions: {} }))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn(),
}))

vi.mock('@/lib/cloudinary', () => ({
  deleteImage: vi.fn().mockResolvedValue({ result: 'ok' }),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/upload', {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DELETE /api/upload', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(checkApiRateLimit).mockResolvedValue(undefined)

    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue(null)

    const { getToken } = await import('next-auth/jwt')
    vi.mocked(getToken).mockResolvedValue(null)
  })

  it('returns 429 when rate limited', async () => {
    const { checkApiRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(checkApiRateLimit).mockResolvedValue({
      allowed: false,
      error: 'Demasiadas solicitudes. Intenta de nuevo en 60s',
    })

    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error).toBe('Demasiadas solicitudes. Intenta de nuevo en 60s')
  })

  it('returns 401 without session or token', async () => {
    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.error).toContain('No autorizado')
  })

  it('returns 403 when session role is not ADMIN', async () => {
    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'EDITOR' },
    } as never)

    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toContain('administrador')
  })

  it('returns 403 when JWT token role is not ADMIN', async () => {
    const { getToken } = await import('next-auth/jwt')
    vi.mocked(getToken).mockResolvedValue({ id: 'user-1', role: 'VIEWER' } as never)

    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))

    expect(res.status).toBe(403)
  })

  it('returns 400 for missing publicId when admin', async () => {
    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    } as never)

    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({}))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('Datos inválidos')
  })

  it('deletes image when session role is ADMIN', async () => {
    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    } as never)

    const { deleteImage } = await import('@/lib/cloudinary')
    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(deleteImage).toHaveBeenCalledWith('portfolio/foo')
  })

  it('deletes image when JWT token role is ADMIN (no session)', async () => {
    const { getToken } = await import('next-auth/jwt')
    vi.mocked(getToken).mockResolvedValue({ id: 'admin-1', role: 'ADMIN' } as never)

    const { deleteImage } = await import('@/lib/cloudinary')
    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/bar' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(deleteImage).toHaveBeenCalledWith('portfolio/bar')
  })

  it('returns 500 when deleteImage throws', async () => {
    const { getServerSession } = await import('next-auth')
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    } as never)

    const { deleteImage } = await import('@/lib/cloudinary')
    vi.mocked(deleteImage).mockRejectedValue(new Error('cloudinary down'))

    const { DELETE } = await import('@/app/api/upload/route')
    const res = await DELETE(buildRequest({ publicId: 'portfolio/foo' }))
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('Error al eliminar la imagen')
  })
})
