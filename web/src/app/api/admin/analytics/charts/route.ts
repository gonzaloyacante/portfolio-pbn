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

    // ── Visitas diarias (últimos N días) ──────────────────────────────────────
    const daysAgo = addDays(today, -(daysParam - 1))

    const pageLogs = await prisma.analyticLog.findMany({
      where: {
        timestamp: { gte: daysAgo },
        eventType: { endsWith: '_VIEW' },
        isBot: false,
      },
      select: { timestamp: true },
    })

    // Agrupar por día en JavaScript
    const dailyMap = new Map<string, number>()
    for (const log of pageLogs) {
      const dayKey = startOfDay(log.timestamp).toISOString().split('T')[0]
      dailyMap.set(dayKey, (dailyMap.get(dayKey) ?? 0) + 1)
    }

    const dailyPageViews = Array.from({ length: daysParam }, (_, i) => {
      const day = addDays(daysAgo, i)
      const key = day.toISOString().split('T')[0]
      return { label: dayLabel(day), count: dailyMap.get(key) ?? 0 }
    })

    // ── Reservas mensuales (últimos N meses) ──────────────────────────────────
    const monthsAgo = new Date(now.getFullYear(), now.getMonth() - (monthsParam - 1), 1)

    const bookings = await prisma.booking.findMany({
      where: { date: { gte: monthsAgo }, deletedAt: null },
      select: { date: true },
    })

    const monthlyMap = new Map<string, number>()
    for (const b of bookings) {
      const key = `${b.date.getFullYear()}-${String(b.date.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1)
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
