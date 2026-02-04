'use client'

import ImageUpload from '@/components/ui/media/ImageUpload'

interface EditorImageUploadProps {
  label: string
  value: string | null
  onChange: (value: string) => void
}

/**
 * Wrapper for ImageUpload to work with single string values in Editor
 */
export function EditorImageUpload({ label, value, onChange }: EditorImageUploadProps) {
  return (
    <div className="space-y-2">
      <ImageUpload
        name="hero-image-upload" // Generic name, id handles uniqueness inside ImageUpload usually
        label={label}
        value={value ? [value] : []}
        onChange={(urls) => {
          if (urls.length > 0) {
            onChange(urls[0])
          } else {
            onChange('') // Clear
          }
        }}
        maxFiles={1}
        maxSizeMB={5}
      />
    </div>
  )
}
