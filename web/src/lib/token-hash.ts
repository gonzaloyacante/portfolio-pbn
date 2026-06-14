import crypto from 'crypto'

/**
 * SHA-256 hex digest de un token de alta entropía (UUID v4, bytes random)
 * para guardarlo en BD sin el valor crudo (A10). Determinístico: mismo
 * input → mismo hash, permite lookup por igualdad exacta.
 */
export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}
