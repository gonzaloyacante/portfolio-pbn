import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function getAuthUser(request: NextRequest): AuthUser {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError('Token no proporcionado', 401);
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError('JWT_SECRET no configurado', 500);
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthUser;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError('Token expirado', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError('Token inválido', 401);
    }
    throw new ApiError('Autenticación fallida', 401);
  }
}

export function requireAdmin(request: NextRequest): AuthUser {
  const user = getAuthUser(request);

  if (user.role !== 'ADMIN') {
    throw new ApiError('Acceso denegado - Se requiere rol de administrador', 403);
  }

  return user;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof jwt.TokenExpiredError) {
    return NextResponse.json(
      { error: 'Token expirado' },
      { status: 401 }
    );
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  );
}
