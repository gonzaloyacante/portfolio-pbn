import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { createPageSectionSchema, updatePageSectionSchema, uuidSchema } from '@/lib/server/validation';

// GET page sections
// Admins ven drafts, público solo ve publicadas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get('pageName');
    
    // Verificar si es admin
    let isAdmin = false;
    try {
      requireAdmin(request);
      isAdmin = true;
    } catch {
      // No es admin
    }
    
    // Filtros base
    const where: any = pageName ? { pageName } : {};
    
    // Público solo ve secciones publicadas
    if (!isAdmin) {
      where.isPublished = true;
    }
    
    const sections = await prisma.pageSection.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    // Si es admin, mergear draft fields con published fields
    const processed = isAdmin ? sections.map((section: any) => ({
      ...section,
      title: section.draftTitle ?? section.title,
      subtitle: section.draftSubtitle ?? section.subtitle,
      config: section.draftConfig ?? section.config,
      visible: section.draftVisible ?? section.visible,
      _hasDraft: !!(section.draftTitle || section.draftSubtitle || section.draftConfig || section.draftVisible !== null)
    })) : sections;

    return NextResponse.json({ data: processed, total: processed.length });
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

// PUT update page section (admin) - GUARDA COMO DRAFT
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

    // Guardar cambios como draft
    const section = await prisma.pageSection.update({
      where: { id },
      data: {
        // Guardar en campos draft en lugar de actualizar directamente
        draftTitle: data.title,
        draftSubtitle: data.subtitle,
        draftConfig: data.config as any,
        draftVisible: data.visible,
        isPublished: false // Marcar como no publicado
      },
    });

    return NextResponse.json({
      message: 'Cambios guardados como borrador. Usa /publish para publicar.',
      section
    });
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
