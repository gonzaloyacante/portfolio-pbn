import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin, handleApiError } from '@/lib/server/auth';
import { paginationSchema, createProjectSchema, updateProjectSchema, uuidSchema } from '@/lib/server/validation';

// GET all projects (admin)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '10';
    const offsetParam = searchParams.get('offset') || '0';
    
    const { limit, offset } = paginationSchema.parse({
      limit: limitParam,
      offset: offsetParam,
    });

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.project.count(),
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

// POST create project (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data,
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update project (admin)
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
    const data = updateProjectSchema.parse(body);

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE project (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
