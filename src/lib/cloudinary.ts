import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Subir imagen a Cloudinary
 * @param file - Archivo de imagen
 * @param folder - Carpeta en Cloudinary (default: 'portfolio')
 */
export const uploadImage = async (
  file: File,
  folder: string = 'portfolio'
): Promise<{ url: string; publicId: string }> => {
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
          transformation: [{ quality: 'auto:best' }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result) return reject(new Error('No result from Cloudinary'))
          resolve({
            url: result.secure_url,
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
    console.error('Error deleting image from Cloudinary:', error)
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
    console.error('Error deleting multiple images from Cloudinary:', error)
    throw error
  }
}

export default cloudinary
