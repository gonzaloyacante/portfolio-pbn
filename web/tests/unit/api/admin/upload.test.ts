import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/jwt-admin', () => ({
  withAdminJwt: vi.fn().mockResolvedValue({
    ok: true,
    payload: { userId: 'admin-1', role: 'ADMIN', type: 'access' },
  }),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/cloudinary', () => ({
  uploadImage: vi.fn().mockResolvedValue({
    url: 'https://res.cloudinary.com/test/image/upload/v1/test.jpg',
    publicId: 'test-public-id',
  }),
  deleteImage: vi.fn().mockResolvedValue({ result: 'ok' }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFormDataRequest(fields: Record<string, string | File>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }
  // Build a plain Request and override formData() to avoid body-parsing hangs in Vitest
  const req = new Request('http://localhost/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: 'Bearer test-token' },
  })
  ;(req as any).formData = async () => formData
  return req
}

function makeDeleteRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/admin/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: JSON.stringify(body),
  })
}

function createImageFile(name = 'test.jpg', type = 'image/jpeg', sizeBytes = 1024) {
  const file = new File(['test-content'], name, { type })
  Object.defineProperty(file, 'size', { value: sizeBytes })
  return file
}

// ── POST /api/admin/upload ────────────────────────────────────────────────────

describe('POST /api/admin/upload', () => {
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

    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(makeFormDataRequest({ file: createImageFile() }) as any)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing file', async () => {
    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(makeFormDataRequest({}) as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('archivo')
  })

  it('returns 400 for non-image file', async () => {
    const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' })

    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(makeFormDataRequest({ file }) as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('imagen')
  })

  it('returns 400 for file > 10MB', async () => {
    const largeFile = createImageFile('large.jpg', 'image/jpeg', 11 * 1024 * 1024)

    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(makeFormDataRequest({ file: largeFile }) as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('10 MB')
  })

  it('uploads image successfully', async () => {
    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(
      makeFormDataRequest({ file: createImageFile(), folder: 'portfolio' }) as any
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.url).toBe('https://res.cloudinary.com/test/image/upload/v1/test.jpg')
    expect(json.publicId).toBe('test-public-id')
  })

  it('uses custom folder from body', async () => {
    const { uploadImage } = await import('@/lib/cloudinary')

    const { POST } = await import('@/app/api/admin/upload/route')
    await POST(makeFormDataRequest({ file: createImageFile(), folder: 'custom-folder' }) as any)

    expect(uploadImage).toHaveBeenCalledWith(expect.any(File), 'custom-folder')
  })

  it('uses default folder "portfolio" when none provided', async () => {
    const { uploadImage } = await import('@/lib/cloudinary')

    const { POST } = await import('@/app/api/admin/upload/route')
    await POST(makeFormDataRequest({ file: createImageFile() }) as any)

    expect(uploadImage).toHaveBeenCalledWith(expect.any(File), 'portfolio')
  })

  it('returns 500 on cloudinary upload error', async () => {
    const { uploadImage } = await import('@/lib/cloudinary')
    vi.mocked(uploadImage).mockRejectedValueOnce(new Error('Cloudinary upload failed'))

    const { POST } = await import('@/app/api/admin/upload/route')
    const res = await POST(makeFormDataRequest({ file: createImageFile() }) as any)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

// ── DELETE /api/admin/upload ──────────────────────────────────────────────────

describe('DELETE /api/admin/upload', () => {
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

    const { DELETE } = await import('@/app/api/admin/upload/route')
    const res = await DELETE(makeDeleteRequest({ publicId: 'test-id' }) as any)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing publicId', async () => {
    const { DELETE } = await import('@/app/api/admin/upload/route')
    const res = await DELETE(makeDeleteRequest({}) as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('publicId')
  })

  it('deletes image successfully', async () => {
    const { deleteImage } = await import('@/lib/cloudinary')

    const { DELETE } = await import('@/app/api/admin/upload/route')
    const res = await DELETE(makeDeleteRequest({ publicId: 'test-public-id' }) as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)

    expect(deleteImage).toHaveBeenCalledWith('test-public-id')
  })

  it('returns 500 on cloudinary delete error', async () => {
    const { deleteImage } = await import('@/lib/cloudinary')
    vi.mocked(deleteImage).mockRejectedValueOnce(new Error('Cloudinary delete failed'))

    const { DELETE } = await import('@/app/api/admin/upload/route')
    const res = await DELETE(makeDeleteRequest({ publicId: 'fail-id' }) as any)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
