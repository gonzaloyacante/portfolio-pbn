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

/**
 * Parsea page/limit de forma consistente en endpoints de listados.
 */
export function normalizePagination(
  pageRaw: string | null,
  limitRaw: string | null,
  options?: { defaultPage?: number; defaultLimit?: number; maxLimit?: number }
): { page: number; limit: number; skip: number } {
  const defaultPage = options?.defaultPage ?? 1
  const defaultLimit = options?.defaultLimit ?? 50
  const maxLimit = options?.maxLimit ?? 100

  const parsedPage = Number.parseInt(pageRaw ?? String(defaultPage), 10)
  const parsedLimit = Number.parseInt(limitRaw ?? String(defaultLimit), 10)

  const page = Math.max(1, Number.isFinite(parsedPage) ? parsedPage : defaultPage)
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number.isFinite(parsedLimit) ? parsedLimit : defaultLimit)
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}
