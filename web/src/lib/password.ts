type StrengthLevel = { score: number; label: string; color: string }

const _STRENGTH_LEVELS: StrengthLevel[] = [
  { score: 0, label: 'Vacía', color: 'bg-muted' },
  { score: 1, label: 'Muy débil', color: 'bg-destructive' },
  { score: 2, label: 'Débil', color: 'bg-destructive/70' },
  { score: 3, label: 'Regular', color: 'bg-warning' },
  { score: 4, label: 'Buena', color: 'bg-info' },
]

function _computePasswordScore(password: string): number {
  let score = 0
  if (password.length > 6) score++
  if (password.length > 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

/**
 * Calculates the strength of a password
 * Returns a score from 0 to 4 and a label
 */
export function calculatePasswordStrength(password: string): StrengthLevel {
  if (!password) return _STRENGTH_LEVELS[0]
  return _STRENGTH_LEVELS[_computePasswordScore(password)]
}
