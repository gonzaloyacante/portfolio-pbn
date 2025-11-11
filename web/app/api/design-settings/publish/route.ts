import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin } from '@/lib/server/auth';

/**
 * Publica los cambios draft de DesignSettings a producción
 * POST /api/design-settings/publish
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación admin (lanza error si no es admin)
    requireAdmin(request);

    // Obtener registro de DesignSettings
    const settings = await prisma.designSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      return NextResponse.json({ error: 'DesignSettings no encontrado' }, { status: 404 });
    }

    // Si no hay draft, no hay nada que publicar
    if (!settings.draftData) {
      return NextResponse.json({ 
        message: 'No hay cambios pendientes para publicar',
        settings 
      });
    }

    // Parsear draft data
    const draft = settings.draftData as Record<string, any>;

    // Actualizar campos publicados con los valores del draft
    const published = await prisma.designSettings.update({
      where: { id: 'singleton' },
      data: {
        // Copiar todos los campos del draft a los campos principales
        primaryColor: draft.primaryColor || settings.primaryColor,
        secondaryColor: draft.secondaryColor || settings.secondaryColor,
        backgroundColor: draft.backgroundColor || settings.backgroundColor,
        textColor: draft.textColor || settings.textColor,
        accentColor: draft.accentColor || settings.accentColor,
        headingFont: draft.headingFont || settings.headingFont,
        bodyFont: draft.bodyFont || settings.bodyFont,
        headingSize: draft.headingSize || settings.headingSize,
        bodySize: draft.bodySize || settings.bodySize,
        lineHeight: draft.lineHeight || settings.lineHeight,
        containerMaxWidth: draft.containerMaxWidth || settings.containerMaxWidth,
        sectionPadding: draft.sectionPadding || settings.sectionPadding,
        elementSpacing: draft.elementSpacing || settings.elementSpacing,
        borderRadius: draft.borderRadius || settings.borderRadius,
        boxShadow: draft.boxShadow || settings.boxShadow,
        hoverTransform: draft.hoverTransform || settings.hoverTransform,
        transitionSpeed: draft.transitionSpeed || settings.transitionSpeed,
        
        // Limpiar draft después de publicar
        draftData: null,
        publishedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Diseño publicado exitosamente',
      settings: published
    });

  } catch (error) {
    console.error('Error publicando diseño:', error);
    return NextResponse.json({ 
      error: 'Error publicando diseño', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
