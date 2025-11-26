import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const uploadImage = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (error, result) => {
      if (error) return reject(error)
      if (!result) return reject(new Error('No result from Cloudinary'))
      resolve({ url: result.secure_url, publicId: result.public_id })
    }).end(buffer)
  })
}

export const deleteImage = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary
