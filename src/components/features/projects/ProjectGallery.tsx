'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project, ProjectImage } from '@prisma/client'
import { recordAnalyticEvent } from '@/actions/analytics'
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from 'lucide-react'
import { OptimizedImage } from '@/components/ui/media/OptimizedImage'

type ProjectWithImages = Project & { images: ProjectImage[] }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function ProjectGallery({ projects }: { projects: ProjectWithImages[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithImages | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)

  const handleProjectClick = (project: ProjectWithImages, el: HTMLDivElement) => {
    triggerRef.current = el
    setSelectedProject(project)
    setCurrentImageIndex(0)
    setIsZoomed(false)
    setScale(1)
    recordAnalyticEvent('PROJECT_DETAIL_OPEN', project.id, 'Project')
  }

  // Refs for focus management (declared before callbacks that use them)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeLightbox = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
    setIsZoomed(false)
    setScale(1)
    // Restore focus to the element that triggered the lightbox
    triggerRef.current?.focus()
  }

  const goToPrevious = useCallback(() => {
    if (!selectedProject) return
    setIsZoomed(false)
    setScale(1)
    setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1))
  }, [selectedProject])

  const goToNext = useCallback(() => {
    if (!selectedProject) return
    setIsZoomed(false)
    setScale(1)
    setCurrentImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1))
  }, [selectedProject])

  // Focus close button when lightbox opens
  useEffect(() => {
    if (selectedProject) {
      // Small timeout to let AnimatePresence mount the element
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [selectedProject])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return
      if (e.key === 'Escape') {
        setSelectedProject(null)
        setCurrentImageIndex(0)
        setIsZoomed(false)
        setScale(1)
        triggerRef.current?.focus()
      }
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject, goToPrevious, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="group cursor-pointer"
            onClick={(e) => handleProjectClick(project, e.currentTarget as HTMLDivElement)}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-accent/20 relative mb-3 aspect-square overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg">
              {project.images[0] ? (
                <OptimizedImage
                  src={project.images[0].url}
                  alt={project.title}
                  fill
                  variant="thumbnail"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="text-primary/50 font-script flex h-full w-full items-center justify-center text-2xl">
                  Sin Foto
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <Maximize2 className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
            <h3 className="text-primary group-hover:text-accent text-center text-lg font-medium transition-colors">
              {project.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Galería: ${selectedProject.title}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              aria-label="Cerrar galería"
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Project Title */}
            <div className="absolute top-4 left-4 z-10 max-w-md">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-white/70">
                {currentImageIndex + 1} / {selectedProject.images.length}
              </p>
            </div>

            {/* Navigation Arrows */}
            {selectedProject.images.length > 1 && (
              <>
                <button
                  aria-label="Imagen anterior"
                  className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  aria-label="Imagen siguiente"
                  className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Main Image Container */}
            <motion.div
              key={currentImageIndex}
              className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(!isZoomed)
                setScale(isZoomed ? 1 : 2)
              }}
              style={{
                maxHeight: isZoomed ? '100vh' : '90vh',
                maxWidth: isZoomed ? '100vw' : '90vw',
              }}
              drag={isZoomed}
              dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
              dragElastic={0.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedProject.images[currentImageIndex] && (
                <motion.div
                  className="relative flex items-center justify-center"
                  animate={{ scale: scale }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={selectedProject.images[currentImageIndex].url}
                    alt={`${selectedProject.title} - Imagen ${currentImageIndex + 1}`}
                    variant={isZoomed ? 'original' : 'full'}
                    width={isZoomed ? 1920 : 1200}
                    height={isZoomed ? 1280 : 800}
                    className={`max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl transition-all ${isZoomed ? 'max-h-screen rounded-none' : ''}`}
                    priority
                  />

                  {/* Zoom Hint Indicator */}
                  {!isZoomed && (
                    <div className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-black/50 p-2 text-white opacity-60">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail Strip */}
            {selectedProject.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-10 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-black/50 p-2 backdrop-blur-sm">
                {selectedProject.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md transition-all ${
                      index === currentImageIndex
                        ? 'ring-2 ring-white'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <OptimizedImage
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      variant="thumbnail"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
