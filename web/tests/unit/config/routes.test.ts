import { describe, it, expect } from 'vitest'
import { ROUTES } from '@/config/routes'

describe('ROUTES config', () => {
  // --- Home ---
  it('ROUTES.home equals "/"', () => {
    expect(ROUTES.home).toBe('/')
  })

  // --- Admin routes ---
  it('all admin routes start with "/admin"', () => {
    for (const [, value] of Object.entries(ROUTES.admin)) {
      expect(value).toMatch(/^\/admin/)
    }
  })

  it('admin has dashboard route', () => {
    expect(ROUTES.admin.dashboard).toBeDefined()
    expect(typeof ROUTES.admin.dashboard).toBe('string')
  })

  it('admin has projects route', () => {
    expect(ROUTES.admin.projects).toBeDefined()
  })

  it('admin has categories route', () => {
    expect(ROUTES.admin.categories).toBeDefined()
  })

  it('admin has services route', () => {
    expect(ROUTES.admin.services).toBeDefined()
  })

  // --- Public routes ---
  it('all public string routes start with "/"', () => {
    for (const [, value] of Object.entries(ROUTES.public)) {
      if (typeof value === 'string') {
        expect(value).toMatch(/^\//)
      }
    }
  })

  it('public has about route', () => {
    expect(ROUTES.public.about).toBeDefined()
  })

  it('public has contact route', () => {
    expect(ROUTES.public.contact).toBeDefined()
  })

  it('public has projects route', () => {
    expect(ROUTES.public.projects).toBeDefined()
  })

  it('serviceDetail generates correct URL', () => {
    expect(ROUTES.public.serviceDetail('nail-art')).toBe('/servicios/nail-art')
  })

  it('serviceDetail handles slugs with special chars', () => {
    expect(ROUTES.public.serviceDetail('gel-uñas')).toBe('/servicios/gel-uñas')
  })

  // --- Auth routes ---
  it('auth routes include login', () => {
    expect(ROUTES.auth.login).toBeDefined()
    expect(ROUTES.auth.login).toContain('login')
  })

  it('auth routes include forgot-password', () => {
    expect(ROUTES.auth.forgotPassword).toBeDefined()
    expect(ROUTES.auth.forgotPassword).toContain('forgot-password')
  })

  // --- No duplicate route values ---
  it('no duplicate route values among admin routes', () => {
    const values = Object.values(ROUTES.admin)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })

  it('all route values are strings', () => {
    // Check admin
    for (const value of Object.values(ROUTES.admin)) {
      expect(typeof value).toBe('string')
    }
    // Check auth
    for (const value of Object.values(ROUTES.auth)) {
      expect(typeof value).toBe('string')
    }
    // Check public string routes
    for (const [key, value] of Object.entries(ROUTES.public)) {
      if (key !== 'serviceDetail') {
        expect(typeof value).toBe('string')
      }
    }
  })

  it('serviceDetail is a function', () => {
    expect(typeof ROUTES.public.serviceDetail).toBe('function')
  })
})
