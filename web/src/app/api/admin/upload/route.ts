import { NextRequest, NextResponse } from 'next/server'
import { withAdminJwt } from '@/lib/jwt-admin'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

// ── POST /api/admin/upload ────────────────────────────────────────────────────
// Sube una imagen a Cloudinary con autenticación JWT Flutter.

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string | null) ?? 'portfolio'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'La imagen no debe superar 10 MB' },
        { status: 400 }
      )
    }

    const result = await uploadImage(file, folder)

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al subir la imagen', details: String(error) },
      { status: 500 }
    )
  }
}

// ── DELETE /api/admin/upload ──────────────────────────────────────────────────
// Elimina una imagen de Cloudinary por publicId.

export async function DELETE(req: NextRequest) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { publicId } = (await req.json()) as { publicId?: string }

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó publicId' },
        { status: 400 }
      )
    }

    await deleteImage(publicId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar imagen', details: String(error) },
      { status: 500 }
    )
  }
}
