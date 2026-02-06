/**
 * Calculates the strength of a password
 * Returns a score from 0 to 4 and a label
 */
export function calculatePasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (!password) return { score: 0, label: 'Vacía', color: 'bg-muted' }

  if (password.length > 6) score += 1
  if (password.length > 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score > 4) score = 4

  // The original switch statement is replaced with the provided if-else if structure.
  // Note: The condition `score === 5` will never be met due to `if (score > 4) score = 4`.
  // The final `return` acts as a default if none of the above conditions are met.
  if (score <= 1) return { score, label: 'Muy débil', color: 'bg-destructive' }
  else if (score === 2) return { score, label: 'Débil', color: 'bg-destructive/70' }
  else if (score === 3) return { score, label: 'Regular', color: 'bg-warning' }
  else if (score === 4) return { score, label: 'Buena', color: 'bg-info' }
  else if (score === 5)
    // This condition will not be met as score is capped at 4
    return { score, label: 'Excelente', color: 'bg-success' }
  else return { score: 0, label: 'Vacía', color: 'bg-muted' }
}
