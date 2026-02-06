import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { getToken } from 'next-auth/jwt'

/**
 * POST /api/upload - Subir imagen a Cloudinary
 */
export async function POST(req: NextRequest) {
  try {
    // 0. 🚦 Rate Limiting (IP based)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    await checkApiRateLimit(ip)

    // 1. Intentar obtener sesión completa (Server-side)
    const session = await getServerSession(authOptions)
    let isAuthenticated = !!session

    // 2. Fallback: Verificar Token JWT directamente (si getServerSession falla en Route Handler)
    if (!isAuthenticated) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (token) {
        isAuthenticated = true
        // console.log('API Upload - Auth via JWT Token (getServerSession failed)')
      }
    }

    if (!isAuthenticated) {
      console.error('API Upload - 401 Unauthorized - No session or token found')
      // Debug: Log cookie names only
      // Log Cookies removed for production
      return NextResponse.json({ error: 'No autorizado - Sesión no encontrada' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 })
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 10MB' }, { status: 400 })
    }

    // Subir a Cloudinary
    const result = await uploadImage(file, folder || 'portfolio')

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('solicitudes')) {
      return NextResponse.json({ error: error.message }, { status: 429 })
    }
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Error al subir la imagen', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload - Eliminar imagen de Cloudinary
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verificar autenticación
    let isAuthenticated = false
    const session = await getServerSession(authOptions)
    if (session) isAuthenticated = true

    if (!isAuthenticated) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (token) isAuthenticated = true
    }

    if (!isAuthenticated) {
      console.error('API Delete - 401 Unauthorized - No session found')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { publicId } = await req.json()

    if (!publicId) {
      return NextResponse.json({ error: 'No se proporcionó publicId' }, { status: 400 })
    }

    await deleteImage(publicId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Error al eliminar la imagen' }, { status: 500 })
  }
}
