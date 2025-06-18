"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { db } from "../lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import Project from "@/models/Project";
import Category from "@/models/Category";
import { Loader } from "../components/Loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/NoData";
import CustomImageGallery from "@/components/ImageGallery";

export default function Home() {
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
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Project;
          return {
            id: doc.id,
            title: data.title,
            image: data.image,
            category: data.category.trim(),
            description: data.description,
          };
        });
        setProjects(projectsData);
        console.log(
          "Proyectos:",
          projectsData.map((project) => ({
            title: project.title,
            category: project.category,
          }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.flatMap((doc) =>
          (doc.data() as Category).name.trim()
        );
        setCategories(categoriesData);
        console.log("Categorías:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTitleAndGallery = async () => {
      try {
        const docRef = doc(db, "settings", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const titleData = docSnap.data().title;
          setTitle(titleData);
        } else {
          console.log("No such document!");
        }

        const gallerySnapshot = await getDocs(
          query(collection(db, "homeGallery"), orderBy("order"))
        );
        const galleryImages = gallerySnapshot.docs.map((doc) => ({
          original: doc.data().url,
          thumbnail: doc.data().url,
          order: doc.data().order,
          name: doc.data().name || "Imagen sin título",
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
    if (homeGalleryImages.length > 0) {
      const imagePromises = homeGalleryImages.map(
        (image) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = image.original;
            img.onload = () => resolve();
          })
      );

      Promise.all(imagePromises).then(() => setImagesLoaded(true));
    }
  }, [homeGalleryImages]);

  // const handleCategorySelect = (category: string) => {
  //   setSelectedCategory(category);
  //   const projectsSection = document.getElementById("projects-section");
  //   if (projectsSection) {
  //     projectsSection.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  if (loading) {
    return <Loader />;
  }

  const filteredProjects = selectedCategory
    ? projects.filter(
        (project) => project.category.trim() === selectedCategory.trim()
      )
    : [];

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="flex overflow-x-auto space-x-4 pb-3 custom-scrollbar lg:justify-center">
        {categories.map((category, index) => (
          <Button
            key={index}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className={
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-transparent text-primary dark:text-white border-primary "
            }>
            {category}
          </Button>
        ))}
      </div>
      {!selectedCategory && (
        <div
          className="relative w-full max-w-xl mx-auto"
          style={{ height: "calc(100vh - 12rem)", maxHeight: "360px" }}>
          {!imagesLoaded && <Loader />}
          {imagesLoaded && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}>
              {" "}
              <CustomImageGallery
                images={homeGalleryImages}
                showThumbnails={false}
                thumbnailPosition="bottom"
                showPlayButton={true}
                showFullscreenButton={false}
                autoPlay={true}
                showBullets={true}
                isHome={true}
              />
            </motion.div>
          )}
        </div>
      )}
      <div id="projects-section">
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}>
                  <div className="relative max-w-sm mx-auto overflow-hidden rounded-lg shadow-xl">
                    {project.image.length > 0 ? (
                      <Image
                        src={project.image[0]}
                        alt={project.title}
                        width={300}
                        height={300}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-64 object-cover"
                        priority
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "";
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-64 bg-card rounded-md">
                        <AlertCircle className="w-16 h-16 text-red-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-8">
                      <div className="flex flex-col justify-end h-full">
                        <div className="flex justify-between items-end space-x-4">
                          <div>
                            <span className="text-white text-sm">
                              {project.category}
                            </span>
                            <h3 className="text-white font-bold">
                              {project.title}
                            </h3>
                          </div>
                          <Button variant="outline" className="text-white">
                            <Link href={`/project/${project.id}`}>
                              Ver detalles
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-6 bg-card bg-opacity-80 rounded-lg shadow-md mt-8">
              <NoData
                message={
                  selectedCategory
                    ? "No hay proyectos disponibles."
                    : "Seleccione una categoría para ver más proyectos."
                }
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Script para ocultar los controles de zoom en la página de inicio
if (typeof window !== "undefined") {
  const checkIsHomePage = () => {
    const homeGalleries = document.querySelectorAll(
      '.home-gallery, [data-ishome="true"]'
    );

    homeGalleries.forEach((gallery) => {
      const zoomControls = gallery.querySelectorAll(".zoom-controls");
      zoomControls.forEach((control) => {
        (control as HTMLElement).style.display = "none";
      });

      // Desactivar eventos de rueda y gestos en la galería del home
      gallery.addEventListener(
        "wheel",
        (e) => {
          if (gallery.classList.contains("home-gallery")) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        { passive: false }
      );

      gallery.addEventListener(
        "touchmove",
        (e) => {
          if (gallery.classList.contains("home-gallery")) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        { passive: false }
      );
    });
  };

  // Ejecutar después de que la página se cargue y cuando cambie el DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkIsHomePage);
  } else {
    checkIsHomePage();
  }

  // Ejecutar periódicamente para asegurar que los controles se oculten
  setInterval(checkIsHomePage, 1000);
}
