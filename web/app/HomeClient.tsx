"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Project from "@/models/Project";
import Category from "@/models/Category";
import { Loader } from "../components/Loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/NoData";
import dynamic from 'next/dynamic';
import { projectService } from "@/lib/services/projects";
import { categoryService } from "@/lib/services/categories";
import { settingsService } from "@/lib/services/settings";
import { galleryService } from "@/lib/services/gallery";
import { normalizeCloudinary } from "@/lib/imageUtils";

// Importación dinámica para mejorar rendimiento
const DynamicImageGallery = dynamic(
  () => import("@/components/ImageGallery"),
  {
    loading: () => <div className="w-full h-64 bg-background-light dark:bg-background-dark animate-pulse rounded-md"></div>,
    ssr: false, // Componente usa window, mejor no renderizarlo en servidor
  }
);

function ProjectCard({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      key={project.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative max-w-sm mx-auto overflow-hidden rounded-xl shadow-xl">
        {/* Contenedor con ratio fijo y fondo neutro */}
        <div className="relative w-full aspect-[4/3] bg-muted/20 dark:bg-muted/10">
          {/* Skeleton shimmer mientras carga */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
          )}
          {project.image.length > 0 ? (
            <Image
              src={normalizeCloudinary(project.image[0], 'card')}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoadingComplete={() => setLoaded(true)}
              onError={(e) => {
                (e.currentTarget as any).style.display = 'none';
                setLoaded(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        {/* Overlay con info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
          <div className="flex justify-between items-end gap-4">
            <div>
              <span className="text-white/80 text-xs">{project.category}</span>
              <h3 className="text-white font-semibold leading-snug">{project.title}</h3>
            </div>
            <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href={`/project/${project.id}`}>Ver detalles</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Portfolio");
  const [homeGalleryImages, setHomeGalleryImages] = useState<
    {
      original: string;
      thumbnail: string;
      order: number;
      name: string;
    }[]
  >([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectService.list();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesList = await categoryService.list();
        const categoriesData = categoriesList
          .map((c) => c.name.trim())
          .filter((name) => name.toLowerCase() !== "general");
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTitleAndGallery = async () => {
      try {
        const s = await settingsService.get();
        if (s) setTitle(s.title);

        const gallery = await galleryService.list();
        const galleryImages = gallery
          .sort((a,b) => a.order - b.order)
          .map((g) => ({
            original: g.url,
            thumbnail: g.url,
            order: g.order,
            name: g.name || "Imagen sin título",
          }));
        setHomeGalleryImages(galleryImages);
      } catch (error) {
        console.error("Error fetching title or gallery images:", error);
      }
    };

    fetchProjects();
    fetchCategories();
    fetchTitleAndGallery();
  }, []);

  useEffect(() => {
    if (homeGalleryImages.length === 0) {
      // No hay imágenes: marcar como "cargado" para evitar spinner infinito
      setImagesLoaded(true);
      return;
    }
    const imagePromises = homeGalleryImages.map(
      (image) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = image.original;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    );

    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, [homeGalleryImages]);

  if (loading) {
    return <Loader />;
  }

  const filteredProjects = selectedCategory
    ? projects.filter(
        (project) => project.category.trim() === selectedCategory.trim()
      )
    : projects;

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      {/* Contenedor de categorías */}
      <div className="flex-none py-1 bg-background/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex flex-wrap justify-center gap-3 pb-3 px-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`h-10 ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary dark:text-white border-primary"
              }`}>
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow flex flex-col mt-2">
        {!selectedCategory ? (
          <>
            {/* Mensaje informativo */}
            <div className="py-3 px-4 bg-card bg-opacity-80 rounded-lg shadow-md mb-6 w-full max-w-xl mx-auto">
              <p className="text-base font-medium text-center">
                Seleccione una categoría para ver más proyectos.
              </p>
            </div>

            {/* Galería de imágenes de inicio */}
            <div className="w-full max-w-5xl mx-auto mb-8">
              {!imagesLoaded ? (
                <div className="min-h-[280px] md:min-h-[420px] flex justify-center items-center">
                  <Loader />
                </div>
              ) : homeGalleryImages.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-center text-muted-foreground">
                  No hay imágenes configuradas para la galería de inicio.
                </div>
              ) : (
                <div className="w-full flex justify-center items-center overflow-hidden">
                  <DynamicImageGallery
                    images={homeGalleryImages}
                    showThumbnails={false}
                    thumbnailPosition="bottom"
                    showPlayButton={true}
                    showFullscreenButton={false}
                    autoPlay={true}
                    showBullets={true}
                    isHome={true}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div id="projects-section" className="w-full px-4">
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-6 bg-card bg-opacity-80 rounded-lg shadow-md mt-8 relative z-20">
                  <NoData message="No hay proyectos disponibles." />
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
