import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * API para verificar credenciales con mensajes específicos
 * POST /api/auth/verify
 */
export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo', code: 'USER_NOT_FOUND' },
        { status: 401 }
      )
    }

    // Si existe, retornamos éxito. La contraseña se verificará en el signIn de NextAuth.
    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    logger.error('Error verifying credentials:', { error: error })
    return NextResponse.json({ error: 'Error del servidor', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
