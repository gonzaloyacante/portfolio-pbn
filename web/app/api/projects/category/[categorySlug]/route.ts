import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { paginationSchema } from '@/lib/server/validation';
import { handleApiError, ApiError } from '@/lib/server/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categorySlug: string }> }
) {
  try {
    const { categorySlug } = await params;
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '10';
    const offsetParam = searchParams.get('offset') || '0';
    
    const { limit, offset } = paginationSchema.parse({
      limit: limitParam,
      offset: offsetParam,
    });

    const category = await prisma.projectCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new ApiError('Categoría no encontrada', 404);
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.project.count({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
      }),
    ]);

    return NextResponse.json({
      data: projects,
      total,
      category,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
