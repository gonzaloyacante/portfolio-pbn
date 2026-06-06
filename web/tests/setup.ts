import '@testing-library/jest-dom'
import { vi } from 'vitest'

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test'
process.env.NEXTAUTH_SECRET ??= 'test-nextauth-secret-at-least-32-chars'
process.env.RESEND_API_KEY ??= 're_test_api_key'
process.env.RESEND_FROM_EMAIL ??= 'test@example.com'
process.env.NEXT_PUBLIC_BASE_URL ??= 'http://localhost:3000'
process.env.CLOUDINARY_CLOUD_NAME ??= 'test-cloud'
process.env.CLOUDINARY_API_KEY ??= 'test-api-key'
process.env.CLOUDINARY_API_SECRET ??= 'test-api-secret'

/** jsdom no define IntersectionObserver; OptimizedImage lazy necesita observe → montar imágenes en tests. */
globalThis.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  constructor(
    readonly callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}
  disconnect() {}
  observe(element: Element) {
    this.callback(
      [{ isIntersecting: true, target: element }] as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver
    )
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver

// Mock de Next.js hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  redirect: vi.fn(),
}))

// Mock de next/headers — necesario para Server Actions testeadas en jsdom
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(
    new Map([
      ['x-forwarded-for', '127.0.0.1'],
      ['user-agent', 'vitest/1.0 (test)'],
      ['x-vercel-ip-country', 'AR'],
      ['x-vercel-ip-city', 'Buenos Aires'],
    ])
  ),
  cookies: vi.fn().mockResolvedValue(new Map()),
}))

// Mock de next/cache — evita llamadas a revalidatePath/revalidateTag en tests
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: () => unknown) => fn),
}))

// Mock de resend — email-service.ts instancia Resend al nivel de módulo
// Se usa clase (no arrow fn) porque Resend se instancia con `new`
vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    }
  },
}))

// Mock global de security-server — los tests específicos de auth pueden sobrescribir esto
// Simula una sesión de admin válida para que los Server Actions protegidos no fallen
vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi
    .fn()
    .mockResolvedValue({ id: 'test-admin-id', role: 'ADMIN', email: 'admin@test.com' }),
  guardSettingsAction: vi
    .fn()
    .mockResolvedValue({ id: 'test-admin-id', role: 'ADMIN', email: 'admin@test.com' }),
}))
