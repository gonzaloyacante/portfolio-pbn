/**
 * POST /api/admin/upload/sign
 *
 * Genera una firma de Cloudinary para que el cliente suba imágenes
 * DIRECTAMENTE a Cloudinary sin pasar por Vercel.
 * Esto elimina el límite de 4.5 MB del body de Vercel Serverless.
 *
 * Flujo:
 *   1. Flutter POST /api/admin/upload/sign  → recibe firma
 *   2. Flutter POST https://api.cloudinary.com/v1_1/{cloud}/image/upload
 *      usando la firma → sube directo (sin límite de Vercel)
 *   3. Flutter POST /api/admin/categories/[id]/gallery
 *      con { url, publicId, width, height } → persiste en DB
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAdminJwt } from '@/lib/jwt-admin'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function POST(req: NextRequest) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const rl = await checkApiRateLimit()
  if (rl) return NextResponse.json({ success: false, error: rl.error }, { status: 429 })

  try {
    const body = (await req.json().catch(() => ({}))) as { folder?: string }
    const folder = body?.folder ?? 'portfolio'

    const isProduction = process.env.NODE_ENV === 'production'
    const rootFolder = isProduction ? 'pbn-prod' : 'pbn-dev'
    const fullFolder = `${rootFolder}/${folder}`

    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = { timestamp, folder: fullFolder }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      success: true,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      timestamp,
      signature,
      folder: fullFolder,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error generando firma de upload' },
      { status: 500 }
    )
  }
}
