import { logger } from '@/lib/logger'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Server-side only (not exposed to client)
  api_key: process.env.CLOUDINARY_API_KEY, // Server-side only
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ── Transformaciones de URL ───────────────────────────────────────────────────

/**
 * Genera la URL de thumbnail a partir de la URL original de Cloudinary.
 *
 * El thumbnail usa transformaciones on-the-fly de Cloudinary (sin re-subir):
 * - c_fill: recorte inteligente centrado
 * - w_800, h_600: tamaño para listas / cards (cubre pantallas retina 2×)
 * - q_auto: calidad automática (equilibrio velocidad/visual)
 * - f_auto: formato moderno automático (WebP, AVIF según el browser)
 *
 * Si la URL no es de Cloudinary, devuelve la URL original sin modificar.
 */
export function generateThumbnailUrl(originalUrl: string): string {
  if (!originalUrl.includes('res.cloudinary.com')) return originalUrl
  const THUMB_TRANSFORM = 'c_fill,w_800,h_600,q_auto,f_auto'
  return originalUrl.replace('/image/upload/', `/image/upload/${THUMB_TRANSFORM}/`)
}

/**
 * Genera la URL de cover (alta calidad) a partir de la URL original.
 *
 * Aplica sólo q_auto:best y f_auto: preserva la resolución 4K original
 * y convierte al formato más eficiente que soporta el browser.
 *
 * Si la URL no es de Cloudinary, devuelve la URL original sin modificar.
 */
export function generateCoverUrl(originalUrl: string): string {
  if (!originalUrl.includes('res.cloudinary.com')) return originalUrl
  const COVER_TRANSFORM = 'q_auto:best,f_auto'
  return originalUrl.replace('/image/upload/', `/image/upload/${COVER_TRANSFORM}/`)
}

// ── Subida ────────────────────────────────────────────────────────────────────

/**
 * Subir imagen a Cloudinary conservando la calidad original.
 *
 * No se aplican transformaciones al archivo almacenado: Cloudinary guarda
 * la imagen tal como se sube. Las variantes optimizadas se generan
 * dinámicamente vía URL (generateThumbnailUrl / generateCoverUrl).
 *
 * @returns url           – URL original (sin transformaciones)
 * @returns thumbnailUrl  – URL con transformación de thumbnail (on-the-fly)
 * @returns publicId      – Public ID en Cloudinary
 */
export const uploadImage = async (
  file: File,
  folder: string = 'portfolio'
): Promise<{ url: string; thumbnailUrl: string; publicId: string }> => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    // Determine root folder based on environment
    const isProduction = process.env.NODE_ENV === 'production'
    const rootFolder = isProduction ? 'pbn-prod' : 'pbn-dev'

    cloudinary.uploader
      .upload_stream(
        {
          folder: `${rootFolder}/${folder}`,
          resource_type: 'image',
          // Sin transformation: se preserva el archivo original (4K, FullHD, etc.)
          // Las variantes se generan dinámicamente vía URL de Cloudinary.
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result) return reject(new Error('No result from Cloudinary'))
          const url = result.secure_url
          resolve({
            url,
            thumbnailUrl: generateThumbnailUrl(url),
            publicId: result.public_id,
          })
        }
      )
      .end(buffer)
  })
}

/**
 * Eliminar imagen de Cloudinary
 * @param publicId - ID público de la imagen
 */
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    logger.error('Error deleting image from Cloudinary:', { error: error })
    throw error
  }
}

/**
 * Eliminar múltiples imágenes de Cloudinary
 * @param publicIds - Array de IDs públicos
 */
export const deleteMultipleImages = async (publicIds: string[]) => {
  if (publicIds.length === 0) return

  try {
    const result = await cloudinary.api.delete_resources(publicIds)
    return result
  } catch (error) {
    logger.error('Error deleting multiple images from Cloudinary:', { error: error })
    throw error
  }
}

export default cloudinary
