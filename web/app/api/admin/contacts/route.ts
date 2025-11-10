import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin, handleApiError } from '@/lib/server/auth';
import { paginationSchema, updateContactSchema, uuidSchema } from '@/lib/server/validation';

// GET all contacts (admin)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '10';
    const offsetParam = searchParams.get('offset') || '0';
    const status = searchParams.get('status');
    
    const { limit, offset } = paginationSchema.parse({
      limit: limitParam,
      offset: offsetParam,
    });

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      data: contacts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update contact (admin)
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
    const data = updateContactSchema.parse(body);

    const updateData: any = { ...data };
    
    if (data.status === 'RESPONDED' && !updateData.respondedAt) {
      updateData.respondedAt = new Date();
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(contact);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE contact (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.contact.delete({ where: { id } });

    return NextResponse.json({ message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
