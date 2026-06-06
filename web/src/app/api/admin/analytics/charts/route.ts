/**
 * GET /api/admin/analytics/charts
 *
 * Custom visitor analytics are disabled to avoid Neon compute burn.
 * Kept as a compatibility endpoint for the Flutter admin app.
 */

import { NextResponse } from 'next/server'
import { withAdminJwt } from '@/lib/jwt-admin'

export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  return NextResponse.json({
    success: true,
    data: {
      dailyPageViews: [],
      monthlyBookings: [],
      analyticsDisabled: true,
    },
  })
}
