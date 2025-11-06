import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthTokenPayload {
  sub: number
  email: string
  role: 'ADMIN' | 'EDITOR'
}

// Marca temporal global para revocar sesiones emitidas antes de este instante
let revokedAfterMs = 0
export function setRevocationNow() {
  revokedAfterMs = Date.now()
}
export function getRevocation() {
  return revokedAfterMs
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session as string | undefined
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const decoded = jwt.verify(token, secret)
    if (!decoded || typeof decoded === 'string') return res.status(401).json({ error: 'Invalid token' })
    const payload = decoded as jwt.JwtPayload
    if (!payload.sub || !payload.email || !payload.role) return res.status(401).json({ error: 'Invalid token' })
    // Si hay rotación/revocación y el token es anterior, inválidalo
    if (revokedAfterMs && payload.iat && payload.iat * 1000 < revokedAfterMs) {
      return res.status(401).json({ error: 'Session expired' })
    }
    const userPayload: AuthTokenPayload = {
      sub: typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : (payload.sub as number),
      email: String(payload.email),
      role: payload.role as 'ADMIN' | 'EDITOR',
    }
    ;(req as any).user = userPayload
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function setSessionCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // Primero validar autenticación
  requireAuth(req, res, () => {
    const user = (req as any).user as AuthTokenPayload | undefined
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
    return next()
  })
}
