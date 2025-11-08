import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/page-sections?pageName=home - Obtener secciones de una página
export const getPageSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageName } = req['query'];
    
    const where = pageName ? { pageName: String(pageName) } : {};
    
    const sections = await prisma.pageSection.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    res.json({ data: sections, total: sections.length });
  } catch (error) {
    console.error('Error fetching page sections:', error);
    res.status(500).json({ error: 'Error al obtener secciones' });
  }
};

// GET /api/page-sections/:id - Obtener una sección específica
export const getPageSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const section = await prisma.pageSection.findUnique({
      where: { id }
    });

    if (!section) {
      res.status(404).json({ error: 'Sección no encontrada' });
      return;
    }

    res.json(section);
  } catch (error) {
    console.error('Error fetching page section:', error);
    res.status(500).json({ error: 'Error al obtener sección' });
  }
};

// POST /api/page-sections - Crear nueva sección (admin only)
export const createPageSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const section = await prisma.pageSection.create({
      data
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating page section:', error);
    res.status(500).json({ error: 'Error al crear sección' });
  }
};

// PUT /api/page-sections/:id - Actualizar sección (admin only)
export const updatePageSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const section = await prisma.pageSection.update({
      where: { id },
      data
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating page section:', error);
    res.status(500).json({ error: 'Error al actualizar sección' });
  }
};

// DELETE /api/page-sections/:id - Eliminar sección (admin only)
export const deletePageSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.pageSection.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page section:', error);
    res.status(500).json({ error: 'Error al eliminar sección' });
  }
};

// PUT /api/page-sections/reorder - Reordenar secciones (admin only)
export const reorderPageSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sections } = req.body as { sections: Array<{ id: string; order: number }> };

    await prisma.$transaction(
      sections.map(({ id, order }) =>
        prisma.pageSection.update({
          where: { id },
          data: { order }
        })
      )
    );

    res.json({ message: 'Secciones reordenadas exitosamente' });
  } catch (error) {
    console.error('Error reordering page sections:', error);
    res.status(500).json({ error: 'Error al reordenar secciones' });
  }
};
