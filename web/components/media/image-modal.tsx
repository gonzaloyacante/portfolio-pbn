"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { ImageWithFallback } from "./image-with-fallback"

interface ImageModalProps {
  isOpen: boolean
  images: string[]
  initialIndex?: number
  title?: string
  onClose: () => void
}

export function ImageModal({ isOpen, images, initialIndex = 0, title, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, currentIndex])

  if (!isOpen) return null

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header with title and close button */}
        <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 flex items-center justify-between z-20">
          {title && <h2 className="text-white text-lg md:text-2xl font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Image container */}
        <div className="w-full max-w-4xl max-h-[80vh] relative">
          <ImageWithFallback
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="w-full h-full"
            objectFit="contain"
          />
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-lg transition-colors z-20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-lg transition-colors z-20"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
