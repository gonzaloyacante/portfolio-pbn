import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// cn() — exhaustive
// ============================================

describe('cn() — class merging', () => {
  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })

  it('returns single class', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('merges two classes', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('ignores undefined values', () => {
    expect(cn('text-red-500', undefined)).toBe('text-red-500')
  })

  it('ignores null values', () => {
    expect(cn('text-red-500', null)).toBe('text-red-500')
  })

  it('ignores false values', () => {
    expect(cn('text-red-500', false)).toBe('text-red-500')
  })

  it('ignores empty string', () => {
    expect(cn('text-red-500', '')).toBe('text-red-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toContain('active')
  })

  it('handles false conditional classes', () => {
    const isActive = false
    const result = cn('base', isActive && 'active')
    expect(result).not.toContain('active')
  })

  it('merges conflicting Tailwind text colors (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('merges conflicting Tailwind padding', () => {
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('merges conflicting Tailwind margin', () => {
    const result = cn('mt-2', 'mt-6')
    expect(result).toBe('mt-6')
  })

  it('merges conflicting bg colors', () => {
    const result = cn('bg-red-500', 'bg-green-500')
    expect(result).toBe('bg-green-500')
  })

  it('keeps non-conflicting classes', () => {
    const result = cn('p-4', 'mt-2', 'bg-blue-500')
    expect(result).toContain('p-4')
    expect(result).toContain('mt-2')
    expect(result).toContain('bg-blue-500')
  })

  it('handles arrays of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500'])
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('handles object syntax', () => {
    const result = cn({ 'text-red-500': true, 'bg-blue-500': false })
    expect(result).toContain('text-red-500')
    expect(result).not.toContain('bg-blue-500')
  })

  it('handles mixed args: string, array, object', () => {
    const result = cn('p-4', ['mt-2'], { 'bg-blue-500': true })
    expect(result).toContain('p-4')
    expect(result).toContain('mt-2')
    expect(result).toContain('bg-blue-500')
  })

  it('merges conflicting rounded classes', () => {
    const result = cn('rounded-md', 'rounded-xl')
    expect(result).toBe('rounded-xl')
  })

  it('merges conflicting width classes', () => {
    const result = cn('w-full', 'w-auto')
    expect(result).toBe('w-auto')
  })

  it('handles multiple undefined and null mixed', () => {
    const result = cn(undefined, null, 'visible', undefined, false, 'flex')
    expect(result).toContain('visible')
    expect(result).toContain('flex')
  })

  it('handles Tailwind responsive prefixes', () => {
    const result = cn('p-2', 'md:p-4', 'lg:p-6')
    expect(result).toContain('p-2')
    expect(result).toContain('md:p-4')
    expect(result).toContain('lg:p-6')
  })

  it('handles hover/focus variants', () => {
    const result = cn('text-blue-500', 'hover:text-red-500')
    expect(result).toContain('text-blue-500')
    expect(result).toContain('hover:text-red-500')
  })

  it('returns type string', () => {
    expect(typeof cn('abc')).toBe('string')
  })
})

// ============================================
// formatDate()
// ============================================

describe('formatDate()', () => {
  it('formats Date object', () => {
    const result = formatDate(new Date('2025-01-15T10:30:00'))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formats ISO date string', () => {
    const result = formatDate('2025-01-15T10:30:00Z')
    expect(typeof result).toBe('string')
  })

  it('includes time component', () => {
    const result = formatDate('2025-06-15T14:30:00Z')
    // Intl format with timeStyle: 'short' should include hours/minutes
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('handles date at midnight', () => {
    const result = formatDate('2025-01-01T00:00:00Z')
    expect(typeof result).toBe('string')
  })

  it('handles date at end of day', () => {
    const result = formatDate('2025-12-31T23:59:59Z')
    expect(typeof result).toBe('string')
  })

  it('returns consistent format for same date', () => {
    const date = new Date('2025-03-20T12:00:00Z')
    expect(formatDate(date)).toBe(formatDate(date))
  })

  it('formats in Spanish locale', () => {
    const result = formatDate('2025-01-15T10:30:00Z')
    // es-ES uses month names like "ene", "feb", etc.
    expect(result).toMatch(/ene|feb|mar|abr|may|jun|jul|ago|sept|oct|nov|dic/i)
  })

  it('handles leap year date', () => {
    const result = formatDate('2024-02-29T12:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('different dates produce different output', () => {
    const a = formatDate('2025-01-01T10:00:00Z')
    const b = formatDate('2025-06-15T10:00:00Z')
    expect(a).not.toBe(b)
  })

  it('handles very old date', () => {
    const result = formatDate('1990-05-10T08:00:00Z')
    expect(typeof result).toBe('string')
  })

  it('handles far future date', () => {
    const result = formatDate('2099-12-31T23:59:59Z')
    expect(typeof result).toBe('string')
  })

  it('throws or returns NaN-ish for garbage input', () => {
    // Invalid date strings produce "Invalid Date" when passed to new Date()
    expect(() => formatDate('not-a-date')).toThrow()
  })
})
