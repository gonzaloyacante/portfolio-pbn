import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'

const VALID_TYPES = ['project', 'category', 'service', 'testimonial', 'contact', 'booking'] as const
type TrashType = (typeof VALID_TYPES)[number]

function isValidType(t: string): t is TrashType {
  return VALID_TYPES.includes(t as TrashType)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(type: TrashType): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[type]
}

async function restoreItem(type: TrashType, id: string) {
  const model = getModel(type)
  const item = await model.findFirst({ where: { id, deletedAt: { not: null } } })
  if (!item) return null
  return model.update({ where: { id }, data: { deletedAt: null } })
}

async function purgeItem(type: TrashType, id: string) {
  const model = getModel(type)
  const item = await model.findFirst({ where: { id, deletedAt: { not: null } } })
  if (!item) return null
  return model.delete({ where: { id } })
}

// ── PATCH /api/admin/trash/[type]/[id] — Restaurar ───────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type, id } = await params
  if (!isValidType(type)) {
    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 })
  }

  try {
    const item = await restoreItem(type, id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Elemento no encontrado en papelera' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error(`[trash] PATCH ${type}/${id} error:`, error)
    return NextResponse.json({ success: false, error: 'Error al restaurar' }, { status: 500 })
  }
}

// ── DELETE /api/admin/trash/[type]/[id] — Eliminar permanentemente ────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type, id } = await params
  if (!isValidType(type)) {
    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 })
  }

  try {
    const item = await purgeItem(type, id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Elemento no encontrado en papelera' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[trash] DELETE ${type}/${id} error:`, error)
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}
