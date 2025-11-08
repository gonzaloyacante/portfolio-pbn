import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/design-settings - Obtener configuración de diseño
export const getDesignSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.designSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      // Crear settings por defecto si no existen
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
          transitionSpeed: '0.3s'
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching design settings:', error);
    res.status(500).json({ error: 'Error al obtener configuración de diseño' });
  }
};

// PUT /api/design-settings - Actualizar configuración de diseño (admin only)
export const updateDesignSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const settings = await prisma.designSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    });

    res.json(settings);
  } catch (error) {
    console.error('Error updating design settings:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de diseño' });
  }
};
