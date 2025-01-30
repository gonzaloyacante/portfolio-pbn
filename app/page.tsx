"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { db } from "../lib/firebaseClient";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Project from "@/models/Project";
import Category from "@/models/Category";
import Loader from "@/components/Loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/NoData";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Portfolio");

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
            category: data.category,
            description: data.description,
          };
        });
        console.log("Fetched projects from Firebase:", projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.flatMap(
          (doc) => (doc.data() as Category).name
        );
        setCategories(["Todas", ...categoriesData]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTitle = async () => {
      try {
        const docRef = doc(db, "settings", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const titleData = docSnap.data().title;
          setTitle(titleData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };

    fetchProjects();
    fetchCategories();
    fetchTitle();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredProjects =
    selectedCategory === "Todas"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <motion.div
      className="space-y-6 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.h1
        className="text-2xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        {title}
      </motion.h1>
      <div className="flex overflow-x-auto space-x-4 pb-3 custom-scrollbar">
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
                      className="w-full h-64 object-cover"
                      priority
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "";
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-64 bg-gray-200 rounded-md">
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
                        <Button
                          asChild
                          variant="outline"
                          className="text-white">
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
          <NoData message="No hay proyectos disponibles." />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
