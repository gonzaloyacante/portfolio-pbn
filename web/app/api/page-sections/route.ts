import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { createPageSectionSchema, updatePageSectionSchema, uuidSchema } from '@/lib/server/validation';

// GET page sections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get('pageName');
    
    const where = pageName ? { pageName } : {};
    
    const sections = await prisma.pageSection.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: sections, total: sections.length });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create page section (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createPageSectionSchema.parse(body);

    const section = await prisma.pageSection.create({
      data,
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update page section (admin)
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
    const data = updatePageSectionSchema.parse(body);

    const section = await prisma.pageSection.update({
      where: { id },
      data,
    });

    return NextResponse.json(section);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE page section (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.pageSection.delete({ where: { id } });

    return NextResponse.json({ message: 'Sección eliminada exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
