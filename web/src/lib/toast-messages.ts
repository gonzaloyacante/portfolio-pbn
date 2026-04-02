/**
 * Centralized toast messages for consistency across the admin panel
 */
export const TOAST_MESSAGES = {
  categories: {
    reorder: {
      success: 'Orden actualizado',
      error: 'Error al reordenar categorías',
    },
    delete: {
      success: 'Categoría eliminada',
      error: 'Error al eliminar categoría',
    },
    create: {
      success: 'Categoría creada exitosamente',
      error: 'Error al crear categoría',
    },
    update: {
      success: 'Categoría actualizada',
      error: 'Error al actualizar categoría',
    },
  },
  images: {
    reorder: {
      success: 'Imágenes reordenadas',
      error: 'Error al reordenar imágenes',
    },
    delete: {
      success: 'Imagen eliminada',
      error: 'Error al eliminar imagen',
    },
    thumbnail: {
      success: 'Portada actualizada',
      error: 'Error al cambiar portada',
    },
    upload: {
      success: 'Imagen subida exitosamente',
      error: 'Error al subir imagen',
    },
  },
  testimonials: {
    create: {
      success: 'Testimonio creado',
      error: 'Error al crear testimonio',
    },
    update: {
      success: 'Testimonio actualizado',
      error: 'Error al actualizar testimonio',
    },
    delete: {
      success: 'Testimonio eliminado',
      error: 'Error al eliminar testimonio',
    },
  },
  services: {
    create: {
      success: 'Servicio creado',
      error: 'Error al crear servicio',
    },
    update: {
      success: 'Servicio actualizado',
      error: 'Error al actualizar servicio',
    },
    delete: {
      success: 'Servicio eliminado',
      error: 'Error al eliminar servicio',
    },
  },
  about: {
    update: {
      success: 'Información actualizada',
      error: 'Error al actualizar información',
    },
  },
} as const
