import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('handles null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })

    it('merges conflicting tailwind classes (last wins)', () => {
      const result = cn('p-4', 'p-2')
      expect(result).toBe('p-2')
    })

    it('handles empty arguments', () => {
      expect(cn()).toBe('')
    })

    it('handles single argument', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
    })

    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('handles multiple arguments', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c')
    })

    it('returns empty string for no inputs', () => {
      expect(cn('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('formats a date string', () => {
      const result = formatDate('2024-01-15T10:30:00Z')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('formats a Date object', () => {
      const result = formatDate(new Date(2024, 0, 15, 10, 30))
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
