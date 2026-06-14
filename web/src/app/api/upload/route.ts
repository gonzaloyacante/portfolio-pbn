import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { deleteImage } from '@/lib/cloudinary'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadDeleteSchema } from '@/lib/validations'
import { getToken } from 'next-auth/jwt'

/**
 * Devuelve el rol del usuario autenticado (vía session o JWT), o null si no hay sesión.
 */
async function getRequestRole(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (session) return session.user.role

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return token?.role ?? null
}

/**
 * DELETE /api/upload - Eliminar imagen de Cloudinary (solo ADMIN)
 */
export async function DELETE(req: NextRequest) {
  try {
    // 0. 🚦 Rate Limiting (IP based)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const rateLimit = await checkApiRateLimit(ip)
    if (rateLimit) {
      return NextResponse.json({ error: rateLimit.error }, { status: 429 })
    }

    // 1. Verificar autenticación y rol
    const role = await getRequestRole(req)
    if (role === null) {
      logger.error('API Delete - 401 Unauthorized - No session or token found')
      return NextResponse.json({ error: 'No autorizado - Sesión no encontrada' }, { status: 401 })
    }
    if (role !== 'ADMIN') {
      logger.error('API Delete - 403 Forbidden - Requiere rol ADMIN')
      return NextResponse.json(
        { error: 'No autorizado - Requiere rol de administrador' },
        { status: 403 }
      )
    }

    const body = await req.json().catch(() => null)
    const parsed = uploadDeleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { publicId } = parsed.data

    await deleteImage(publicId)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes('solicitudes')) {
      return NextResponse.json({ error: error.message }, { status: 429 })
    }
    logger.error('Error deleting image:', { error: error })
    return NextResponse.json({ error: 'Error al eliminar la imagen' }, { status: 500 })
  }
}
