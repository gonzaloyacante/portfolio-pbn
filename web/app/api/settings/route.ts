import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin, ApiError } from '@/lib/server/auth';
import { updateSettingsSchema } from '@/lib/server/validation';

// GET settings (public)
export async function GET() {
  try {
    const settings = await prisma.portfolioSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      throw new ApiError('Configuración no encontrada', 404);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update settings (admin)
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = updateSettingsSchema.parse(body);

    const settings = await prisma.portfolioSettings.update({
      where: { id: 'singleton' },
      data,
    });

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
