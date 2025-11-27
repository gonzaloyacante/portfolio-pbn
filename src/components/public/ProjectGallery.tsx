'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Project, ProjectImage } from '@prisma/client'
import { recordAnalyticEvent } from '@/actions/analytics.actions'

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

  const handleProjectClick = (project: ProjectWithImages) => {
    setSelectedProject(project)
    recordAnalyticEvent('PROJECT_DETAIL_OPEN', project.id, 'Project')
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="group cursor-pointer"
            onClick={() => handleProjectClick(project)}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-accent/20 relative mb-3 aspect-square overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg">
              {project.images[0] ? (
                <Image
                  src={project.images[0].url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="text-primary/50 font-script flex h-full w-full items-center justify-center text-2xl">
                  Sin Foto
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
            <h3 className="text-primary group-hover:text-accent text-center text-lg font-medium transition-colors">
              {project.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <div>
                <h2 className="text-primary text-2xl font-bold">{selectedProject.title}</h2>
                {selectedProject.description && (
                  <p className="mt-1 text-sm text-gray-600">{selectedProject.description}</p>
                )}
              </div>
              <button
                className="rounded-full p-2 transition-colors hover:bg-gray-200"
                onClick={() => setSelectedProject(null)}
              >
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {selectedProject.images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg shadow-sm">
                    <Image
                      src={img.url}
                      alt={`${selectedProject.title} image`}
                      width={1200}
                      height={800}
                      className="h-auto w-full bg-white object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
