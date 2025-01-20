"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "../lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import Project from "@/models/Project";
import Category from "@/models/Category";
import Loader from "@/components/ui/loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/ui/NoData"; // Importar el componente NoData

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [loading, setLoading] = useState(true);

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

    fetchProjects();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const filteredProjects =
    selectedCategory === "Todas"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.h1
        className="text-2xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        Portfolio de Caracterización
      </motion.h1>
      <div className="flex overflow-x-auto space-x-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}>
            {category}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {filteredProjects.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                <Card className="max-w-sm mx-auto">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.image.length > 0 ? (
                      <Image
                        src={project.image[0]}
                        alt={project.title}
                        width={300}
                        height={300}
                        className="w-full h-40 object-cover rounded-md"
                        priority
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "";
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-32 bg-gray-200 rounded-md">
                        <AlertCircle className="w-16 h-16 text-red-500" />
                      </div>
                    )}
                    <p className="border-t pt-4 text-sm md:text-base">
                      {project.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge>{project.category}</Badge>
                    <Button asChild>
                      <Link href={`/project/${project.id}`}>Ver detalles</Link>
                    </Button>
                  </CardFooter>
                </Card>
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
