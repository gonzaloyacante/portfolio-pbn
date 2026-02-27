import { logger } from '@/lib/logger'
import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

async function _resolveUserEmail(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (session?.user?.email) return session.user.email
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return token?.email ?? null
}

export async function POST(req: NextRequest) {
  try {
    const userEmail = await _resolveUserEmail(req)
    if (!userEmail) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } })

    if (!user?.password) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error changing password:', { error: error })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
