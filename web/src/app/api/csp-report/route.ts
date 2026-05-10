import * as Sentry from '@sentry/nextjs'

import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const payload: unknown = await req.json()
    if (process.env.NODE_ENV === 'production') {
      const extra: Record<string, unknown> =
        typeof payload === 'object' && payload !== null && !Array.isArray(payload)
          ? { report: payload }
          : { report: JSON.stringify(payload).slice(0, 4000) }
      Sentry.captureMessage('[CSP violation report]', {
        level: 'warning',
        tags: { endpoint: 'csp-report' },
        extra,
      })
    } else {
      logger.error('csp.report.received', { payload })
    }
  } catch {
    // Ignore malformed reports — browsers may POST empty or non-JSON bodies.
  }
  return new Response(null, { status: 204 })
}
