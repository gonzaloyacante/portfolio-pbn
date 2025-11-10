import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleApiError } from '@/lib/server/auth';
import prisma from '@/lib/server/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    return handleApiError(error);
  }
}
