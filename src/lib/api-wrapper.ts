/**
 * API Route Handler Wrapper
 * Automatically wraps all API routes for logging requests/responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRequestId, logger } from './logger'

type RouteHandler = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse

/**
 * Wraps a route handler to add automatic logging
 */
export function withApiLogger(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const startTime = performance.now()
    const requestId = getRequestId(req.headers)
    const method = req.method
    const url = req.url

    try {
      let requestBody
      try {
        const clonedReq = req.clone()
        requestBody = await clonedReq.json()
      } catch {
        // No body or not JSON
      }

      logger.info('API Request', { requestId, method, url, body: requestBody })

      const response = await handler(req, context)

      const duration = performance.now() - startTime
      let responseBody

      try {
        const clonedResponse = response.clone()
        responseBody = await clonedResponse.json()
      } catch {
        // Not JSON
      }

      logger.info('API Response', {
        requestId,
        method,
        url,
        status: response.status,
        duration: `${duration.toFixed(0)}ms`,
        body: responseBody,
      })

      return response
    } catch (error) {
      const duration = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)

      logger.error('API Error', { requestId, method, url, error: errorMessage, duration })

      throw error
    }
  }
}

/**
 * Helper to create JSON responses
 */
export function createJsonResponse(data: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Helper for error responses
 */
export function createErrorResponse(message: string, status = 500, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: code || `ERROR_${status}`,
    },
    { status }
  )
}
