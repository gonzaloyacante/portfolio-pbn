import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkSettingsRateLimit: vi.fn().mockResolvedValue(undefined),
}))

// ── Tests: requireAdmin ───────────────────────────────────────────────────────

describe('requireAdmin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return user when session has admin role', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { requireAdmin } = await import('@/lib/security-server')
    const user = await requireAdmin()
    expect(user).toEqual(expect.objectContaining({ id: 'admin-1', role: 'ADMIN' }))
  })

  it('should throw when no session exists', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const { requireAdmin } = await import('@/lib/security-server')
    await expect(requireAdmin()).rejects.toThrow('Unauthorized')
  })

  it('should throw when session has no user', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({ user: undefined, expires: '' } as never)

    const { requireAdmin } = await import('@/lib/security-server')
    await expect(requireAdmin()).rejects.toThrow('Unauthorized')
  })

  it('should throw when user role is not ADMIN', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', role: 'USER', name: 'User', email: 'u@test.com' },
      expires: '',
    })

    const { requireAdmin } = await import('@/lib/security-server')
    await expect(requireAdmin()).rejects.toThrow('Unauthorized')
  })

  it('should throw when user role is undefined', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', name: 'User', email: 'u@test.com' },
      expires: '',
    } as never)

    const { requireAdmin } = await import('@/lib/security-server')
    await expect(requireAdmin()).rejects.toThrow('Unauthorized')
  })

  it('should log warning on unauthorized attempt', async () => {
    const { auth } = await import('@/lib/auth')
    const { logger } = await import('@/lib/logger')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', role: 'USER', name: 'User', email: 'u@test.com' },
      expires: '',
    })

    const { requireAdmin } = await import('@/lib/security-server')
    try {
      await requireAdmin()
    } catch {
      // expected
    }
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Unauthorized'),
      expect.objectContaining({ userId: 'user-1' })
    )
  })

  it('should log warning with userId from session', async () => {
    const { auth } = await import('@/lib/auth')
    const { logger } = await import('@/lib/logger')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'specific-user', role: 'USER', name: 'User', email: 'u@test.com' },
      expires: '',
    })

    const { requireAdmin } = await import('@/lib/security-server')
    try {
      await requireAdmin()
    } catch {
      // expected
    }
    expect(logger.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ userId: 'specific-user' })
    )
  })

  it('should handle null user gracefully', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: null,
      expires: '',
    } as never)

    const { requireAdmin } = await import('@/lib/security-server')
    await expect(requireAdmin()).rejects.toThrow('Unauthorized')
  })

  it('should return the full user object on success', async () => {
    const { auth } = await import('@/lib/auth')
    const adminUser = { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'admin@test.com' }
    vi.mocked(auth).mockResolvedValue({ user: adminUser, expires: '' })

    const { requireAdmin } = await import('@/lib/security-server')
    const result = await requireAdmin()
    expect(result.email).toBe('admin@test.com')
    expect(result.name).toBe('Admin')
  })

  it('should call auth() exactly once', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { requireAdmin } = await import('@/lib/security-server')
    await requireAdmin()
    expect(auth).toHaveBeenCalledTimes(1)
  })
})

// ── Tests: guardSettingsAction ────────────────────────────────────────────────

describe('guardSettingsAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should call requireAdmin and rate limit check', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    await guardSettingsAction()
    expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
  })

  it('should return user on success', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    const user = await guardSettingsAction()
    expect(user.id).toBe('admin-1')
  })

  it('should throw when not admin', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', role: 'USER', name: 'User', email: 'u@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    await expect(guardSettingsAction()).rejects.toThrow('Unauthorized')
  })

  it('should propagate rate limit errors', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })
    vi.mocked(checkSettingsRateLimit).mockRejectedValueOnce(new Error('Rate limited'))

    const { guardSettingsAction } = await import('@/lib/security-server')
    await expect(guardSettingsAction()).rejects.toThrow('Rate limited')
  })

  it('should not call rate limit if admin check fails', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue(null)

    const { guardSettingsAction } = await import('@/lib/security-server')
    try {
      await guardSettingsAction()
    } catch {
      // expected
    }
    expect(checkSettingsRateLimit).not.toHaveBeenCalled()
  })

  it('should throw when session is null', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const { guardSettingsAction } = await import('@/lib/security-server')
    await expect(guardSettingsAction()).rejects.toThrow()
  })

  it('should handle user id check for rate limiting', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-2', role: 'ADMIN', name: 'Admin2', email: 'a2@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    await guardSettingsAction()
    expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-2')
  })

  it('should work with empty user id for rate limiting edge case', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue({
      user: { id: '', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    await guardSettingsAction()
    // Empty string is falsy, so rate limit should not be called
    expect(checkSettingsRateLimit).not.toHaveBeenCalled()
  })

  it('should call auth exactly once', async () => {
    const { auth } = await import('@/lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin', email: 'a@test.com' },
      expires: '',
    })

    const { guardSettingsAction } = await import('@/lib/security-server')
    await guardSettingsAction()
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should pass rate limit with valid admin id', async () => {
    const { auth } = await import('@/lib/auth')
    const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin-x', role: 'ADMIN', name: 'AdminX', email: 'x@test.com' },
      expires: '',
    })
    vi.mocked(checkSettingsRateLimit).mockResolvedValueOnce(undefined)

    const { guardSettingsAction } = await import('@/lib/security-server')
    const user = await guardSettingsAction()
    expect(user.role).toBe('ADMIN')
  })
})
