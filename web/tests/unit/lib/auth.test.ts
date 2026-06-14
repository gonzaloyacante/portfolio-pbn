import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hashSync: vi.fn().mockReturnValue('$2b$12$mockedDummyHash') },
}))

vi.mock('@/lib/auth-rate-limit', () => ({
  checkAuthRateLimit: vi.fn().mockResolvedValue({ allowed: true, remainingAttempts: 5 }),
  recordFailedLoginAttempt: vi.fn().mockResolvedValue(undefined),
  clearLoginAttempts: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map()),
}))

vi.mock('@/lib/email-service', () => ({
  emailService: { sendLoginAlert: vi.fn().mockResolvedValue(undefined) },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  name: 'Admin',
  role: 'ADMIN',
  password: '$2b$12$hashedrealpassword',
  failedLoginCount: 0,
  lockedUntil: null as Date | null,
  isActive: true,
  deletedAt: null as Date | null,
}

type Credentials = { email: string; password: string } | undefined

async function getAuthorize() {
  const { authOptions } = await import('@/lib/auth')
  const provider = authOptions.providers[0] as unknown as {
    options: { authorize: (credentials: Credentials) => Promise<unknown> }
  }
  return provider.options.authorize
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('authOptions credentials provider authorize()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when email or password missing', async () => {
    const authorize = await getAuthorize()
    expect(await authorize(undefined)).toBeNull()
    expect(await authorize({ email: 'a@b.com', password: '' })).toBeNull()
  })

  it('throws when rate limit exceeded', async () => {
    const { checkAuthRateLimit } = await import('@/lib/auth-rate-limit')
    vi.mocked(checkAuthRateLimit).mockResolvedValueOnce({ allowed: false, lockoutMinutes: 10 })

    const authorize = await getAuthorize()
    await expect(authorize({ email: 'a@b.com', password: 'x' })).rejects.toThrow(
      /Demasiados intentos/
    )
  })

  it('non-existent user: dummy bcrypt compare + records attempt + returns null (A12)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    const bcrypt = (await import('bcryptjs')).default
    const { recordFailedLoginAttempt } = await import('@/lib/auth-rate-limit')

    const authorize = await getAuthorize()
    const result = await authorize({ email: 'nouser@test.com', password: 'whatever' })

    expect(result).toBeNull()
    expect(bcrypt.compare).toHaveBeenCalledWith('whatever', '$2b$12$mockedDummyHash')
    expect(recordFailedLoginAttempt).toHaveBeenCalledWith('nouser@test.com', expect.any(String))
  })

  it('inactive user: dummy bcrypt compare, returns null without recording attempt', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ ...mockUser, isActive: false } as never)
    const bcrypt = (await import('bcryptjs')).default
    const { recordFailedLoginAttempt } = await import('@/lib/auth-rate-limit')

    const authorize = await getAuthorize()
    const result = await authorize({ email: mockUser.email, password: 'whatever' })

    expect(result).toBeNull()
    expect(bcrypt.compare).toHaveBeenCalledWith('whatever', '$2b$12$mockedDummyHash')
    expect(recordFailedLoginAttempt).not.toHaveBeenCalled()
  })

  it('locked account: dummy bcrypt compare, throws without checking real password (A12)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
    } as never)
    const bcrypt = (await import('bcryptjs')).default

    const authorize = await getAuthorize()
    await expect(authorize({ email: mockUser.email, password: 'whatever' })).rejects.toThrow(
      /bloqueada/
    )
    expect(bcrypt.compare).toHaveBeenCalledWith('whatever', '$2b$12$mockedDummyHash')
  })

  it('wrong password: records attempt + increments failedLoginCount, no lock under 5 (A7)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      failedLoginCount: 2,
    } as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)

    const authorize = await getAuthorize()
    const result = await authorize({ email: mockUser.email, password: 'wrong' })

    expect(result).toBeNull()
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { failedLoginCount: 3, lockedUntil: null },
    })
  })

  it('wrong password on 5th attempt: locks account for 15 minutes (A7)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      failedLoginCount: 4,
    } as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)

    const authorize = await getAuthorize()
    await authorize({ email: mockUser.email, password: 'wrong' })

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { failedLoginCount: 5, lockedUntil: expect.any(Date) },
    })
  })

  it('correct password: clears attempts, resets lockout, returns user (A7)', async () => {
    const { prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      failedLoginCount: 3,
    } as never)
    const bcrypt = (await import('bcryptjs')).default
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)
    const { clearLoginAttempts } = await import('@/lib/auth-rate-limit')

    const authorize = await getAuthorize()
    const result = await authorize({ email: mockUser.email, password: 'correct' })

    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    })
    expect(clearLoginAttempts).toHaveBeenCalledWith(mockUser.email, expect.any(String))
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { failedLoginCount: 0, lockedUntil: null },
    })
  })
})
