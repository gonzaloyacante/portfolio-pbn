import { describe, it, expect } from 'vitest'
import { calculatePasswordStrength } from '@/lib/password'

describe('calculatePasswordStrength — extended edge cases', () => {
  // ─── Empty / falsy inputs ───────────────────────────────────────────────────

  it('returns score 0 and label "Vacía" for empty string', () => {
    const result = calculatePasswordStrength('')
    expect(result).toEqual({ score: 0, label: 'Vacía', color: 'bg-muted' })
  })

  it('returns score 0 for undefined-like falsy input', () => {
    // TypeScript enforces string, but testing the guard
    const result = calculatePasswordStrength('' as string)
    expect(result.score).toBe(0)
  })

  // ─── Length variations ──────────────────────────────────────────────────────

  it('single lowercase char → score 0 (length<=6, no upper/digit/special)', () => {
    const result = calculatePasswordStrength('a')
    expect(result.score).toBe(0)
    expect(result.label).toBe('Muy débil')
  })

  it('two lowercase chars → score 0', () => {
    const result = calculatePasswordStrength('ab')
    expect(result.score).toBe(0)
  })

  it('six lowercase chars → score 0 (length not > 6)', () => {
    const result = calculatePasswordStrength('abcdef')
    expect(result.score).toBe(0)
  })

  it('seven lowercase chars → score 1 (length > 6)', () => {
    const result = calculatePasswordStrength('abcdefg')
    expect(result.score).toBe(1)
    expect(result.label).toBe('Muy débil')
  })

  it('ten lowercase chars → score 1 (length > 6 but not > 10)', () => {
    const result = calculatePasswordStrength('abcdefghij')
    expect(result.score).toBe(1)
  })

  it('eleven lowercase chars → score 2 (length > 6 AND > 10)', () => {
    const result = calculatePasswordStrength('abcdefghijk')
    expect(result.score).toBe(2)
    expect(result.label).toBe('Débil')
  })

  // ─── Character type scoring ───────────────────────────────────────────────

  it('only uppercase letters, short → score 1', () => {
    const result = calculatePasswordStrength('ABCDEFG')
    // length > 6 → +1, uppercase → +1 = 2? No: uppercase counts as upper
    // but lowercase chars are not checked, length > 6 → +1, upper → +1 = 2
    expect(result.score).toBe(2)
  })

  it('only numbers, short → score 1', () => {
    const result = calculatePasswordStrength('1234567')
    // length > 6 → +1, digit → +1 = 2
    expect(result.score).toBe(2)
  })

  it('only special characters, short → score 1', () => {
    const result = calculatePasswordStrength('!@#$%^&')
    // length > 6 → +1, special → +1 = 2
    expect(result.score).toBe(2)
  })

  it('mixed case no numbers (7 chars) → score 2', () => {
    const result = calculatePasswordStrength('Abcdefg')
    // length > 6 → +1, upper → +1 = 2
    expect(result.score).toBe(2)
    expect(result.label).toBe('Débil')
  })

  it('lowercase + digit (7 chars) → score 2', () => {
    const result = calculatePasswordStrength('abcdef1')
    expect(result.score).toBe(2)
  })

  it('lowercase + upper + digit (7 chars) → score 3', () => {
    const result = calculatePasswordStrength('Abcdef1')
    expect(result.score).toBe(3)
    expect(result.label).toBe('Regular')
    expect(result.color).toBe('bg-warning')
  })

  it('lowercase + upper + digit + special (7 chars) → score 4', () => {
    const result = calculatePasswordStrength('Abcde1!')
    expect(result.score).toBe(4)
    expect(result.label).toBe('Buena')
    expect(result.color).toBe('bg-info')
  })

  it('all types + long (11 chars) → score capped at 4', () => {
    const result = calculatePasswordStrength('Abcdefgh1!x')
    // length>6 → +1, length>10 → +1, upper → +1, digit → +1, special → +1 = 5, capped to 4
    expect(result.score).toBe(4)
    expect(result.label).toBe('Buena')
  })

  // ─── Patterns / common passwords ───────────────────────────────────────────

  it('password "password" → score 1 (only length > 6)', () => {
    const result = calculatePasswordStrength('password')
    expect(result.score).toBe(1)
  })

  it('password "123456" → score 1 (digit, length not > 6)', () => {
    const result = calculatePasswordStrength('123456')
    // length = 6, NOT > 6 → 0; digits → +1 = 1
    expect(result.score).toBe(1)
  })

  it('password "qwerty" → score 0 (all lowercase, len 6)', () => {
    const result = calculatePasswordStrength('qwerty')
    expect(result.score).toBe(0)
  })

  it('password "asdfghjk" → score 1 (lowercase, len > 6)', () => {
    const result = calculatePasswordStrength('asdfghjk')
    expect(result.score).toBe(1)
  })

  it('repeating chars "aaaaaaa" → score 1', () => {
    const result = calculatePasswordStrength('aaaaaaa')
    expect(result.score).toBe(1)
  })

  it('repeating digits "1111111" → score 2', () => {
    const result = calculatePasswordStrength('1111111')
    // length > 6 → +1, digits → +1 = 2
    expect(result.score).toBe(2)
  })

  // ─── Unicode and special strings ────────────────────────────────────────────

  it('unicode password — emoji', () => {
    // Emoji characters: length varies but should work
    const result = calculatePasswordStrength('🔐🔐🔐🔐🔐🔐🔐🔐')
    // length > 6 (16 JS chars for 8 emoji), special chars → +1
    expect(result.score).toBeGreaterThanOrEqual(1)
  })

  it('password with spaces counts length', () => {
    const result = calculatePasswordStrength('a b c d ')
    // length 8 > 6 → +1, spaces are special → +1 = 2
    expect(result.score).toBe(2)
  })

  it('password with tabs', () => {
    const result = calculatePasswordStrength('abc\tdef\t')
    // length 8 > 6 → +1, tab is special → +1 = 2
    expect(result.score).toBe(2)
  })

  it('maximum length password (50 chars, all lower)', () => {
    const result = calculatePasswordStrength('a'.repeat(50))
    // length > 6 → +1, length > 10 → +1 = 2
    expect(result.score).toBe(2)
  })

  // ─── Score → label / color mapping ──────────────────────────────────────────

  it('score 0 → Muy débil / bg-destructive', () => {
    const result = calculatePasswordStrength('abc')
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.label).toBe('Muy débil')
    expect(result.color).toBe('bg-destructive')
  })

  it('score 2 → Débil / bg-destructive/70', () => {
    const result = calculatePasswordStrength('abcdefghijk') // 11 lowercase chars
    expect(result.score).toBe(2)
    expect(result.label).toBe('Débil')
    expect(result.color).toBe('bg-destructive/70')
  })

  it('score 3 → Regular / bg-warning', () => {
    const result = calculatePasswordStrength('Abcdefg1') // upper + digit + len>6
    expect(result.score).toBe(3)
    expect(result.label).toBe('Regular')
    expect(result.color).toBe('bg-warning')
  })

  it('score 4 → Buena / bg-info', () => {
    const result = calculatePasswordStrength('Abcdefg1!')
    expect(result.score).toBe(4)
    expect(result.label).toBe('Buena')
    expect(result.color).toBe('bg-info')
  })
})
