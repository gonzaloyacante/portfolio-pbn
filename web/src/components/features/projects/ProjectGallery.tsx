'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Project, ProjectImage } from '@/generated/prisma/client'
import { recordAnalyticEvent } from '@/actions/analytics'
import { Maximize2 } from 'lucide-react'
import { OptimizedImage, Lightbox } from '@/components/ui'
import type { LightboxImage } from '@/components/ui'

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  const handleProjectClick = (project: ProjectWithImages, el: HTMLDivElement) => {
    triggerRef.current = el
    setSelectedProject(project)
    setSelectedIndex(0)
    recordAnalyticEvent('PROJECT_DETAIL_OPEN', project.id, 'Project')
  }

  const closeLightbox = () => {
    setSelectedProject(null)
    setSelectedIndex(null)
    triggerRef.current?.focus()
  }

  const lightboxImages: LightboxImage[] = selectedProject
    ? selectedProject.images.map((img, i) => ({
        id: img.id,
        url: img.url,
        alt: `${selectedProject.title} - Imagen ${i + 1}`,
        title: i === 0 ? selectedProject.title : undefined,
        width: img.width,
        height: img.height,
      }))
    : []

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

      <Lightbox
        images={lightboxImages}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}
