/**
 * GET   /api/admin/contacts  — Listar contactos
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { normalizePagination, normalizeSearchTerm } from '@/lib/search-utils'

const CONTACT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  subject: true,
  status: true,
  priority: true,
  isRead: true,
  isReplied: true,
  readAt: true,
  repliedAt: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = normalizePagination(
      searchParams.get('page'),
      searchParams.get('limit'),
      { defaultLimit: 50, maxLimit: 100 }
    )
    const search = normalizeSearchTerm(searchParams.get('search'))
    const status = searchParams.get('status') ?? undefined
    const priority = searchParams.get('priority') ?? undefined
    const unreadOnly = searchParams.get('unread') === 'true'

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { subject: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(unreadOnly && { isRead: false }),
    }

    const [contacts, total, unreadCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        select: CONTACT_SELECT,
        orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { deletedAt: null, isRead: false } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: contacts,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (err) {
    logger.error('[admin-contacts-get] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
