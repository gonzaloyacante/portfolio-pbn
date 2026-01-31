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
  if (!password) return { score: 0, label: 'Vacía', color: 'bg-gray-200' }

  if (password.length > 6) score += 1
  if (password.length > 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score > 4) score = 4

  switch (score) {
    case 0:
      return { score, label: 'Muy débil', color: 'bg-red-500' }
    case 1:
      return { score, label: 'Débil', color: 'bg-red-400' }
    case 2:
      return { score, label: 'Regular', color: 'bg-yellow-500' }
    case 3:
      return { score, label: 'Buena', color: 'bg-blue-500' }
    case 4:
      return { score, label: 'Excelente', color: 'bg-green-500' }
    default:
      return { score: 0, label: 'Vacía', color: 'bg-gray-200' }
  }
}
