import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { paginationSchema } from '@/lib/server/validation';
import { handleApiError } from '@/lib/server/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '10';
    const offsetParam = searchParams.get('offset') || '0';
    
    const { limit, offset } = paginationSchema.parse({
      limit: limitParam,
      offset: offsetParam,
    });
    
    const categorySlug = searchParams.get('category');
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam === 'true' ? true : undefined;

    const where: any = { status: 'PUBLISHED' };
    
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      total,
      limit,
      offset,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
