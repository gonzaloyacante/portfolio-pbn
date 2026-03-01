import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
// Inferir de forma segura el tipo `where` desde la firma de prisma.deleteMany
type AppReleaseDeleteManyArgs = Parameters<typeof prisma.appRelease.deleteMany>[0]
type WhereType = AppReleaseDeleteManyArgs extends { where?: infer W } ? W : never
import { logger } from '@/lib/logger'

function validateDeployToken(req: Request): boolean {
  const secret = process.env.DEPLOY_SECRET_TOKEN
  if (!secret || secret.trim().length === 0) {
    logger.warn('DEPLOY_SECRET_TOKEN no configurado — rechazando DELETE de release')
    return false
  }
  const token = req.headers.get('X-Deploy-Token') ?? ''
  if (token.length !== secret.length) return false

  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ secret.charCodeAt(i)
  }
  return mismatch === 0
}

export async function POST(req: Request) {
  if (!validateDeployToken(req)) {
    logger.warn('POST /api/admin/app/latest-release/delete: token inválido o ausente')
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ success: false, error: 'Body JSON inválido' }, { status: 400 })
  }

  const { id, version, downloadUrl } = body as {
    id?: string
    version?: string
    downloadUrl?: string
  }

  if (!id && !version && !downloadUrl) {
    return NextResponse.json(
      { success: false, error: 'Se requiere id, version o downloadUrl' },
      { status: 400 }
    )
  }

  // Construir cláusulas OR de forma explícita y luego castear a la forma
  // esperada por Prisma sin usar `any`.
  const orClauses: Array<Record<string, string>> = []
  if (id) orClauses.push({ id })
  if (version) orClauses.push({ version })
  if (downloadUrl) orClauses.push({ downloadUrl })

  const where = orClauses.length ? ({ OR: orClauses } as unknown as WhereType) : undefined

  try {
    const result = await prisma.appRelease.deleteMany({ where })
    logger.info('AppRelease(s) eliminadas via API delete', { where, deleted: result.count })
    return NextResponse.json({ success: true, deleted: result.count }, { status: 200 })
  } catch (err) {
    logger.error('Error al eliminar AppRelease(s)', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}
