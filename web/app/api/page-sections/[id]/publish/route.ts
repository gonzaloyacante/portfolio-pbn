import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin } from '@/lib/server/auth';

/**
 * Publica los cambios draft de una PageSection a producción
 * POST /api/page-sections/[id]/publish
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación admin
    requireAdmin(request);

    const { id } = params;

    // Obtener sección
    const section = await prisma.pageSection.findUnique({
      where: { id }
    });

    if (!section) {
      return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 });
    }

    // Copiar draft a campos publicados
    const published = await prisma.pageSection.update({
      where: { id },
      data: {
        // Si hay draft, usar esos valores, si no, mantener los actuales
        title: section.draftTitle ?? section.title,
        subtitle: section.draftSubtitle ?? section.subtitle,
        config: section.draftConfig ?? section.config,
        visible: section.draftVisible ?? section.visible,
        
        // Marcar como publicado y limpiar drafts
        isPublished: true,
        publishedAt: new Date(),
        draftTitle: null,
        draftSubtitle: null,
        draftConfig: null,
        draftVisible: null
      }
    });

    return NextResponse.json({
      message: 'Sección publicada exitosamente',
      section: published
    });

  } catch (error) {
    console.error('Error publicando sección:', error);
    return NextResponse.json({ 
      error: 'Error publicando sección', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
