import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

/**
 * API para verificar credenciales con mensajes específicos
 * POST /api/auth/verify
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP para prevenir enumeración de usuarios
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    await checkApiRateLimit(ip)

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true }, // Solo necesitamos saber si existe
    })

    if (!user) {
      // Respuesta genérica para evitar enumeración de usuarios (OWASP A07)
      return NextResponse.json(
        { error: 'Credenciales inválidas', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // Si existe, retornamos éxito. La contraseña se verificará en el signIn de NextAuth.
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes('solicitudes')) {
      return NextResponse.json({ error: error.message }, { status: 429 })
    }
    logger.error('Error verifying credentials:', { error: error })
    return NextResponse.json({ error: 'Error del servidor', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
