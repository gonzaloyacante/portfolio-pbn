import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/server/jwt';
import { handleApiError, ApiError } from '@/lib/server/auth';
import prisma from '@/lib/server/prisma';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      throw new ApiError('Refresh token no proporcionado', 401);
    }

    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new ApiError('Usuario no encontrado', 401);
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ token: accessToken });
  } catch (error) {
    return handleApiError(error);
  }
}
