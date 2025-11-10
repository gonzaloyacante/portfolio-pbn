import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { createSkillSchema, updateSkillSchema, uuidSchema } from '@/lib/server/validation';

// GET all skills (public)
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: skills });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create skill (admin)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = createSkillSchema.parse(body);

    const skill = await prisma.skill.create({
      data,
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update skill (admin)
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
    const data = updateSkillSchema.parse(body);

    const skill = await prisma.skill.update({
      where: { id },
      data,
    });

    return NextResponse.json(skill);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE skill (admin)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    uuidSchema.parse(id);

    await prisma.skill.delete({ where: { id } });

    return NextResponse.json({ message: 'Habilidad eliminada exitosamente' });
  } catch (error) {
    return handleApiError(error);
  }
}
