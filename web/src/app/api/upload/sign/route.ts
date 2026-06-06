import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '@/lib/auth'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'
import { logger } from '@/lib/logger'
import { getCloudinaryUploadRootFolder, normalizeCloudinaryUploadFolder } from '@/lib/cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

async function isRequestAuthenticated(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (session) return true

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return !!token
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const rateLimit = await checkApiRateLimit(ip)
    if (rateLimit) {
      return NextResponse.json({ success: false, error: rateLimit.error }, { status: 429 })
    }

    if (!(await isRequestAuthenticated(req))) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary no está configurado' },
        { status: 500 }
      )
    }

    const body = (await req.json().catch(() => ({}))) as { folder?: string }
    const folder = normalizeCloudinaryUploadFolder(body.folder)
    const rootFolder = getCloudinaryUploadRootFolder()
    const fullFolder = `${rootFolder}/${folder}`
    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = { timestamp, folder: fullFolder }
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)

    return NextResponse.json({
      success: true,
      apiKey,
      cloudName,
      timestamp,
      signature,
      folder: fullFolder,
    })
  } catch (error) {
    logger.error('Error generating Cloudinary upload signature', { error })
    return NextResponse.json(
      { success: false, error: 'Error generando firma de upload' },
      { status: 500 }
    )
  }
}
