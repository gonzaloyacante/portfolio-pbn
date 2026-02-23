import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('env', () => {
  const VALID_ENV = {
    DATABASE_URL: 'postgresql://user:pass@host:5432/db',
    NEXTAUTH_SECRET: 'a-secret-that-is-at-least-32-characters-long',
    CLOUDINARY_CLOUD_NAME: 'my-cloud',
    CLOUDINARY_API_KEY: 'api-key-123',
    CLOUDINARY_API_SECRET: 'api-secret-456',
    RESEND_API_KEY: 're_test_key_123',
    RESEND_FROM_EMAIL: 'test@example.com',
    NODE_ENV: 'test',
    ADMIN_JWT_SECRET: 'a-jwt-secret-that-is-at-least-32-characters-long',
  }

  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    // Reset module cache so env.ts re-runs validation
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('validates and exports env object when all required vars are set', async () => {
    Object.assign(process.env, VALID_ENV)
    const { env } = await import('@/lib/env')
    expect(env).toBeDefined()
    expect(env.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL)
  })

  it('includes NEXTAUTH_SECRET', async () => {
    Object.assign(process.env, VALID_ENV)
    const { env } = await import('@/lib/env')
    expect(env.NEXTAUTH_SECRET).toBe(VALID_ENV.NEXTAUTH_SECRET)
  })

  it('includes ADMIN_JWT_SECRET', async () => {
    Object.assign(process.env, VALID_ENV)
    const { env } = await import('@/lib/env')
    expect(env.ADMIN_JWT_SECRET).toBe(VALID_ENV.ADMIN_JWT_SECRET)
  })

  it('throws when DATABASE_URL is missing', async () => {
    const envWithout = { ...VALID_ENV }
    delete (envWithout as Record<string, string | undefined>).DATABASE_URL
    process.env = { ...originalEnv, ...envWithout }
    // Remove DATABASE_URL from process.env
    delete process.env.DATABASE_URL

    await expect(import('@/lib/env')).rejects.toThrow()
  })

  it('throws when NEXTAUTH_SECRET is too short', async () => {
    process.env = { ...originalEnv, ...VALID_ENV, NEXTAUTH_SECRET: 'short' }
    await expect(import('@/lib/env')).rejects.toThrow()
  })

  it('throws when RESEND_API_KEY does not start with re_', async () => {
    process.env = { ...originalEnv, ...VALID_ENV, RESEND_API_KEY: 'invalid_key' }
    await expect(import('@/lib/env')).rejects.toThrow()
  })

  it('throws when RESEND_FROM_EMAIL is not a valid email', async () => {
    process.env = { ...originalEnv, ...VALID_ENV, RESEND_FROM_EMAIL: 'not-an-email' }
    await expect(import('@/lib/env')).rejects.toThrow()
  })

  it('defaults NODE_ENV to development', async () => {
    const envCopy = { ...VALID_ENV }
    delete (envCopy as Record<string, string | undefined>).NODE_ENV
    process.env = { ...originalEnv, ...envCopy }
    delete process.env.NODE_ENV

    const { env } = await import('@/lib/env')
    expect(env.NODE_ENV).toBe('development')
  })
})
