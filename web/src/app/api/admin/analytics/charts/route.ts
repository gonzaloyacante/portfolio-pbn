/**
 * GET /api/admin/analytics/charts
 * Datos de tendencias para los gráficos del dashboard.
 * Devuelve:
 * - Visitas diarias de los últimos 7 días.
 * - Reservas mensuales de los últimos 6 meses.
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
    const now = new Date()
    const today = startOfDay(now)

    // ── Visitas diarias (últimos 7 días) ──────────────────────────────────────
    const sevenDaysAgo = addDays(today, -6)

    const pageLogs = await prisma.analyticLog.findMany({
      where: {
        timestamp: { gte: sevenDaysAgo },
        eventType: 'page_view',
      },
      select: { timestamp: true },
    })

    // Agrupar por día en JavaScript
    const dailyMap = new Map<string, number>()
    for (const log of pageLogs) {
      const dayKey = startOfDay(log.timestamp).toISOString().split('T')[0]
      dailyMap.set(dayKey, (dailyMap.get(dayKey) ?? 0) + 1)
    }

    const dailyPageViews = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(sevenDaysAgo, i)
      const key = day.toISOString().split('T')[0]
      return { label: dayLabel(day), count: dailyMap.get(key) ?? 0 }
    })

    // ── Reservas mensuales (últimos 6 meses) ──────────────────────────────────
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    )

    const bookings = await prisma.booking.findMany({
      where: { date: { gte: sixMonthsAgo }, deletedAt: null },
      select: { date: true },
    })

    const monthlyMap = new Map<string, number>()
    for (const b of bookings) {
      const key = `${b.date.getFullYear()}-${String(b.date.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1)
    }

    const monthlyBookings = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
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
