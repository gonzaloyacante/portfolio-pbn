'use client'

import { useState, ChangeEvent } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  name: string
  multiple?: boolean
  label?: string
}

export default function ImageUpload({
  name,
  multiple = false,
  label = 'Subir Imágenes',
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviews: string[] = []
    Array.from(files).forEach((file) => {
      const objectUrl = URL.createObjectURL(file)
      newPreviews.push(objectUrl)
    })

    setPreviews(newPreviews)
  }

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex w-full items-center justify-center">
        <label
          htmlFor={`file-upload-${name}`}
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="mb-4 h-8 w-8 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
          </div>
          <input
            id={`file-upload-${name}`}
            name={name}
            type="file"
            className="hidden"
            multiple={multiple}
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
            >
              <Image src={src} alt={`Preview ${index}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
