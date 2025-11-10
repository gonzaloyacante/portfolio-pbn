import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { createSocialLinkSchema, updateSocialLinkSchema, uuidSchema } from '@/lib/server/validation';

// GET all social links (public)
export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: socialLinks });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create social link (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createSocialLinkSchema.parse(body);

    const socialLink = await prisma.socialLink.create({
      data,
    });

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update social link (admin)
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
    const data = updateSocialLinkSchema.parse(body);

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data,
    });

    return NextResponse.json(socialLink);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE social link (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.socialLink.delete({ where: { id } });

    return NextResponse.json({ message: 'Red social eliminada exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
