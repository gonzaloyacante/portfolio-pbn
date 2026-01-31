import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

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
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo', code: 'USER_NOT_FOUND' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'La contraseña es incorrecta', code: 'INVALID_PASSWORD' },
        { status: 401 }
      )
    }

    // Credenciales válidas
    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return NextResponse.json({ error: 'Error del servidor', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
