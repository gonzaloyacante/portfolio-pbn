/**
 * Normaliza términos de búsqueda para evitar scans costosos con entradas triviales.
 * - trim
 * - límite de longitud
 * - ignora strings demasiado cortos
 */
export function normalizeSearchTerm(
  raw: string | null,
  options?: { minLength?: number; maxLength?: number }
): string | undefined {
  if (!raw) return undefined

  const minLength = options?.minLength ?? 2
  const maxLength = options?.maxLength ?? 80
  const value = raw.trim().slice(0, maxLength)

  if (value.length < minLength) return undefined
  return value
}
