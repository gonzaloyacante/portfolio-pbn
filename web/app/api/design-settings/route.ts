import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { updateDesignSettingsSchema } from '@/lib/server/validation';

// GET design settings
// Para admins: devuelve draft si existe
// Para públicodevuelve solo datos publicados
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.designSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.designSettings.create({
        data: {
          id: 'singleton',
          primaryColor: '#8B0000',
          secondaryColor: '#FFB6C1',
          backgroundColor: '#FFF5F5',
          textColor: '#2D2D2D',
          accentColor: '#D4A5A5',
          headingFont: 'Parisienne',
          bodyFont: 'Inter',
          headingSize: '4rem',
          bodySize: '1rem',
          lineHeight: '1.6',
          containerMaxWidth: '1200px',
          sectionPadding: '4rem 2rem',
          elementSpacing: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          hoverTransform: 'translateY(-4px)',
          transitionSpeed: '0.3s',
        },
      });
    }

    // Verificar si el request es de un admin
    let isAdmin = false;
    try {
      requireAdmin(request);
      isAdmin = true;
    } catch {
      // No es admin, devolver solo datos publicados
    }

    // Si es admin y hay draft, devolver merged data (draft + published)
    if (isAdmin && settings.draftData) {
      const draft = settings.draftData as Record<string, any>;
      return NextResponse.json({
        ...settings,
        // Merge: draft fields override published fields
        ...draft,
        _hasDraft: true,
        _draftData: settings.draftData
      });
    }

    // Público: solo datos publicados (sin draftData)
    const { draftData, ...publicSettings } = settings;
    return NextResponse.json(publicSettings);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update design settings (admin) - GUARDA COMO DRAFT
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = updateDesignSettingsSchema.parse(body);

    // Guardar cambios como draft (no publicados)
    const settings = await prisma.designSettings.upsert({
      where: { id: 'singleton' },
      update: {
        // Guardar en draftData en lugar de actualizar directamente
        draftData: data as any
      },
      create: { 
        id: 'singleton', 
        ...data,
        draftData: null // El primer save es directo, no hay draft
      },
    });

    return NextResponse.json({
      message: 'Cambios guardados como borrador. Usa /publish para publicar.',
      settings
    });
  } catch (error) {
    return handleApiError(error);
  }
}
