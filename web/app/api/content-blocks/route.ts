import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { createContentBlockSchema, updateContentBlockSchema, uuidSchema } from '@/lib/server/validation';

// GET all content blocks (public)
export async function GET() {
  try {
    const blocks = await prisma.contentBlock.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: blocks, total: blocks.length });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create content block (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createContentBlockSchema.parse(body);

    const block = await prisma.contentBlock.create({
      data,
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update content block (admin)
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
    const data = updateContentBlockSchema.parse(body);

    const block = await prisma.contentBlock.update({
      where: { id },
      data,
    });

    return NextResponse.json(block);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE content block (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.contentBlock.delete({ where: { id } });

    return NextResponse.json({ message: 'Bloque eliminado exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
