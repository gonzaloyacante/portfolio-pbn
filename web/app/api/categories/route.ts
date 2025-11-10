import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin, ApiError } from '@/lib/server/auth';
import { createCategorySchema, updateCategorySchema, uuidSchema } from '@/lib/server/validation';

// GET all categories (public)
export async function GET() {
  try {
    const categories = await prisma.projectCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            projects: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create category (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createCategorySchema.parse(body);

    const category = await prisma.projectCategory.create({
      data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update category (admin)
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);
    const body = await request.json();
    const data = updateCategorySchema.parse(body);

    const category = await prisma.projectCategory.update({
      where: { id },
      data,
    });

    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE category (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    // Check if category has projects
    const projectCount = await prisma.project.count({
      where: { categoryId: id },
    });

    if (projectCount > 0) {
      throw new ApiError(
        'No se puede eliminar una categoría que tiene proyectos asociados',
        400
      );
    }

    await prisma.projectCategory.delete({ where: { id } });

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
