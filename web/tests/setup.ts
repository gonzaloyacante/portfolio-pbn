import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de Next.js hooks si es necesario
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  redirect: vi.fn(),
}))
