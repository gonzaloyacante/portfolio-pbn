import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe un registro con ese valor único',
        field: prismaError.meta?.target?.[0] || 'unknown',
      });
    }

    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: 'Registro no encontrado',
      });
    }
  }

  // Log unexpected errors
  console.error('❌ Error no manejado:', err);

  // Don't leak error details in production
  const message =
    process.env['NODE_ENV'] === 'production' ? 'Error interno del servidor' : err.message;

  return res.status(500).json({
    error: message,
    ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};
