import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export interface ApiError extends Error {
  status?: number
  code?: string
}

export function errorHandler(
  err: Error | ApiError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  })

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          error: 'Unique constraint violation',
          code: 'DUPLICATE_ENTRY',
          field: err.meta?.target,
        })
        return
      case 'P2025':
        res.status(404).json({
          error: 'Record not found',
          code: 'NOT_FOUND',
        })
        return
      case 'P2003':
        res.status(400).json({
          error: 'Foreign key constraint violation',
          code: 'FOREIGN_KEY_ERROR',
        })
        return
      default:
        res.status(500).json({
          error: 'Database error',
          code: 'DATABASE_ERROR',
        })
        return
    }
  }

  // Custom API errors
  const apiError = err as ApiError
  if (apiError.status) {
    res.status(apiError.status).json({
      error: apiError.message,
      code: apiError.code || 'API_ERROR',
    })
    return
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED',
    })
    return
  }

  // Default server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    code: 'INTERNAL_ERROR',
  })
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  })
}

export function createApiError(message: string, status = 500, code?: string): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.code = code
  return error
}
