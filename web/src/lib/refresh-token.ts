import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * Ventana de gracia de `reissueOrRevokeChain` (refresh/route.ts): un token
 * recién revocado por rotación sigue siendo válido para que el "perdedor" de
 * una carrera de refresh reciba un reemplazo en vez de disparar la detección
 * de reuso. `pruneRefreshTokens` no debe borrar revocados más nuevos que esto.
 */
export const GRACE_PERIOD_MS = 60_000

/**
 * Borra refresh tokens del usuario que ya no pueden usarse: expirados, o
 * revocados fuera de la ventana de gracia de rotación (M20 — evita que
 * refresh_tokens crezca sin límite con filas muertas de logins/rotaciones
 * pasadas).
 */
export async function pruneRefreshTokens(userId: string): Promise<void> {
  try {
    const now = new Date()
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [
          { expiresAt: { lt: now } },
          { revokedAt: { lt: new Date(now.getTime() - GRACE_PERIOD_MS) } },
        ],
      },
    })
  } catch (err) {
    // No crítico: si falla, las filas viejas simplemente persisten hasta el próximo intento.
    logger.warn('[refresh-token] No se pudo limpiar tokens viejos', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
