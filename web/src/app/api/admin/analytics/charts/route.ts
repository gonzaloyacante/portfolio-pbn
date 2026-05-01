/**
 * GET /api/admin/analytics/charts
 * Datos de tendencias para los gráficos del dashboard.
 * Query params:
 *   - days (1–90, default 7): rango de visitas diarias.
 *   - months (1–24, default 6): rango de reservas mensuales.
 * Devuelve:
 * - Visitas diarias de los últimos N días.
 * - Reservas mensuales de los últimos N meses.
 */

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Helpers ───────────────────────────────────────────────────────────────────

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function monthLabel(date: Date): string {
  return date.toLocaleString('es-ES', { month: 'short', year: '2-digit' })
}

function dayLabel(date: Date): string {
  return date.toLocaleString('es-ES', { weekday: 'short', day: 'numeric' })
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const daysParam = Math.min(Math.max(parseInt(searchParams.get('days') ?? '7', 10) || 7, 1), 90)
    const monthsParam = Math.min(
      Math.max(parseInt(searchParams.get('months') ?? '6', 10) || 6, 1),
      24
    )

    const now = new Date()
    const today = startOfDay(now)

    // ── Visitas diarias (últimos N días) — agregado en DB, no en memoria ─────
    const daysAgo = addDays(today, -(daysParam - 1))

    const dailyRaw = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('day', timestamp) AS day, COUNT(*)::bigint AS count
      FROM "analytic_logs"
      WHERE timestamp >= ${daysAgo}
        AND "eventType" IN (
          'HOME_VIEW',
          'GALLERY_VIEW',
          'GALLERY_DETAIL_VIEW',
          'ABOUT_VIEW',
          'CONTACT_VIEW',
          'PAGE_VIEW',
          'CATEGORY_VIEW',
          'PROJECT_DETAIL_VIEW'
        )
        AND "isBot" = false
      GROUP BY DATE_TRUNC('day', timestamp)
      ORDER BY day ASC
    `

    const dailyMap = new Map<string, number>()
    for (const row of dailyRaw) {
      const key = new Date(row.day).toISOString().split('T')[0]
      dailyMap.set(key, Number(row.count))
    }

    const dailyPageViews = Array.from({ length: daysParam }, (_, i) => {
      const day = addDays(daysAgo, i)
      const key = day.toISOString().split('T')[0]
      return { label: dayLabel(day), count: dailyMap.get(key) ?? 0 }
    })

    // ── Reservas mensuales (últimos N meses) ──────────────────────────────────
    const monthsAgo = new Date(now.getFullYear(), now.getMonth() - (monthsParam - 1), 1)

    const monthlyRaw = await prisma.$queryRaw<{ month: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('month', date) AS month, COUNT(*)::bigint AS count
      FROM "bookings"
      WHERE date >= ${monthsAgo}
        AND "deletedAt" IS NULL
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month ASC
    `
    const monthlyMap = new Map<string, number>()
    for (const row of monthlyRaw) {
      const month = new Date(row.month)
      const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, Number(row.count))
    }

    const monthlyBookings = Array.from({ length: monthsParam }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (monthsParam - 1) + i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return { label: monthLabel(d), count: monthlyMap.get(key) ?? 0 }
    })

    return NextResponse.json({
      success: true,
      data: { dailyPageViews, monthlyBookings },
    })
  } catch (err) {
    logger.error('[analytics-charts] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
