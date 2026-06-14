import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    appRelease: {
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/push-service', () => ({
  sendPushToAdmins: vi.fn().mockResolvedValue(undefined),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const baseRelease = {
  version: '3.0.0',
  versionCode: 30,
  releaseNotes: 'notas de la release',
  downloadUrl: 'https://example.com/app.apk',
  checksumSha256: 'abc123',
  mandatory: false,
  minVersion: null as string | null,
  fileSizeBytes: 12345,
  publishedAt: new Date('2026-01-01T00:00:00Z'),
}

function makeRequest(params?: Record<string, string>) {
  const url = new URL('http://localhost/api/admin/app/latest-release')
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value)
  }
  return new Request(url)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/app/latest-release', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // downloadUrl siempre alcanzable (HEAD request en urlIsReachable)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns data: null and updateAvailable: false when there is no release', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue(null)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest())
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data).toBeNull()
    expect(data.updateAvailable).toBe(false)
  })

  it('returns updateAvailable: false without version query params', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue(baseRelease as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest())
    const data = await res.json()

    expect(data.updateAvailable).toBe(false)
    expect(data.forceUpdate).toBe(false)
  })

  it('returns updateAvailable: true and forceUpdate: false when mandatory is false', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      mandatory: false,
      minVersion: null,
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest({ version: '2.0.0', versionCode: '20' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(false)
  })

  // ── M17: mandatory sin minVersion debe forzar igualmente ──────────────────────

  it('forces update when mandatory is true and minVersion is not set (M17)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      mandatory: true,
      minVersion: null,
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest({ version: '2.0.0', versionCode: '20' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(true)
  })

  it('does not force update when current version is already at or above minVersion', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      mandatory: true,
      minVersion: '2.5.0',
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    // Update disponible (29 < 30) pero ya está en/por encima de minVersion (2.5.0)
    const res = await GET(makeRequest({ version: '2.9.0', versionCode: '29' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(false)
  })

  it('forces update when current version is below minVersion', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      mandatory: true,
      minVersion: '2.5.0',
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest({ version: '2.0.0', versionCode: '20' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(true)
  })

  // ── M16: compareSemver y prereleases ──────────────────────────────────────────

  it('treats a prerelease version as lower than its release version (M16)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      version: '2.0.0',
      versionCode: 20,
      mandatory: true,
      minVersion: '2.0.0',
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    // "2.0.0-beta.1" debe considerarse MENOR que "2.0.0" (minVersion)
    const res = await GET(makeRequest({ version: '2.0.0-beta.1', versionCode: '19' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(true)
  })

  it('treats equal core versions without a suffix as equal (M16)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue({
      ...baseRelease,
      mandatory: true,
      minVersion: '1.2.0',
    } as never)

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    // "1.2" === "1.2.0" → no está por debajo de minVersion → no fuerza
    const res = await GET(makeRequest({ version: '1.2', versionCode: '5' }))
    const data = await res.json()

    expect(data.updateAvailable).toBe(true)
    expect(data.forceUpdate).toBe(false)
  })

  it('hides the release when downloadUrl is not reachable', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.appRelease.findFirst).mockResolvedValue(baseRelease as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const { GET } = await import('@/app/api/admin/app/latest-release/route')
    const res = await GET(makeRequest())
    const data = await res.json()

    expect(data.data).toBeNull()
    expect(data.updateAvailable).toBe(false)
  })
})
