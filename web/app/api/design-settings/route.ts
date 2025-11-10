import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { handleApiError, requireAdmin } from '@/lib/server/auth';
import { updateDesignSettingsSchema } from '@/lib/server/validation';

// GET design settings (public)
export async function GET() {
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

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update design settings (admin)
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const data = updateDesignSettingsSchema.parse(body);

    const settings = await prisma.designSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
