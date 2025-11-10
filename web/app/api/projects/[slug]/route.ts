import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, ApiError } from '@/lib/server/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new ApiError('Proyecto no encontrado', 404);
    }

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}
