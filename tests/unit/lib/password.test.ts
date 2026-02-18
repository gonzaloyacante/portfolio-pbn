import { describe, it, expect } from 'vitest'
import { calculatePasswordStrength } from '@/lib/password'

describe('calculatePasswordStrength', () => {
  it('returns score 0 and label "Vacía" for empty string', () => {
    const result = calculatePasswordStrength('')
    expect(result.score).toBe(0)
    expect(result.label).toBe('Vacía')
    expect(result.color).toBe('bg-muted')
  })

  it('returns "Muy débil" for a short password with no complexity', () => {
    const result = calculatePasswordStrength('abc')
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.label).toBe('Muy débil')
    expect(result.color).toBe('bg-destructive')
  })

  it('returns "Débil" for a medium length lowercase-only password', () => {
    // length > 6 (+1) + length > 10 (+1) = score 2
    const result = calculatePasswordStrength('abcdefghijk')
    expect(result.score).toBe(2)
    expect(result.label).toBe('Débil')
    expect(result.color).toBe('bg-destructive/70')
  })

  it('returns "Regular" for password with length + uppercase', () => {
    // length > 6 (+1) + length > 10 (+1) + uppercase (+1) = score 3
    const result = calculatePasswordStrength('abcdefghijkA')
    expect(result.score).toBe(3)
    expect(result.label).toBe('Regular')
    expect(result.color).toBe('bg-warning')
  })

  it('returns "Buena" for password with length + uppercase + number', () => {
    // length > 6 (+1) + length > 10 (+1) + uppercase (+1) + number (+1) = score 4
    const result = calculatePasswordStrength('abcdefghijkA1')
    expect(result.score).toBe(4)
    expect(result.label).toBe('Buena')
    expect(result.color).toBe('bg-info')
  })

  it('caps score at 4 even with all criteria met', () => {
    // All criteria: length>6 (+1), length>10 (+1), uppercase (+1), number (+1), special (+1) = 5, capped at 4
    const result = calculatePasswordStrength('abcdefghijkA1!')
    expect(result.score).toBe(4)
    expect(result.label).toBe('Buena')
  })

  it('detects uppercase letters', () => {
    // Both 7 chars (+1) - only differ in uppercase vs number
    // Scores will be equal (both 2), so we verify uppercase boosts a password
    // that would otherwise score lower
    const justLower = calculatePasswordStrength('abcdefg') // 7 chars, score 1
    const withUpper = calculatePasswordStrength('abcdefG') // 7 chars + uppercase, score 2
    expect(withUpper.score).toBeGreaterThan(justLower.score)
  })

  it('detects numeric characters', () => {
    const withNumber = calculatePasswordStrength('abcdef1')
    const withoutNumber = calculatePasswordStrength('abcdefg')
    expect(withNumber.score).toBeGreaterThan(withoutNumber.score)
  })

  it('detects special characters', () => {
    const withSpecial = calculatePasswordStrength('abcdef!')
    const withoutSpecial = calculatePasswordStrength('abcdefg')
    expect(withSpecial.score).toBeGreaterThan(withoutSpecial.score)
  })

  it('awards point for length > 6', () => {
    const short = calculatePasswordStrength('abc')
    const medium = calculatePasswordStrength('abcdefg') // 7 chars
    expect(medium.score).toBeGreaterThan(short.score)
  })

  it('awards point for length > 10', () => {
    const medium = calculatePasswordStrength('abcdefg') // 7 chars, score 1
    const long = calculatePasswordStrength('abcdefghijk') // 11 chars, score 2
    expect(long.score).toBeGreaterThan(medium.score)
  })
})
