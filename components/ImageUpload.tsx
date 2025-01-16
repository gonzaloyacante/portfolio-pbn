"use client"

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useCallback } from 'react'
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onChange: (value: string) => void
  value: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url)
  }, [onChange])

  return (
    <CldUploadWidget 
      onUpload={handleUpload} 
      uploadPreset="rlqnvhzb"
      options={{
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
          <div className="space-y-4">
            <Button 
              type="button" 
              onClick={() => open()}
            >
              Subir Imagen
            </Button>
            {value && (
              <div className="relative w-full h-64">
                <Image
                  fill
                  style={{ objectFit: 'cover' }}
                  src={value || "/placeholder.svg"}
                  alt="Imagen subida"
                />
              </div>
            )}
          </div>
        )
      }}
    </CldUploadWidget>
  )
}

