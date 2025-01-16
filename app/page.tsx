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

type Project = {
  id: string;
  title: string;
  image: string[];
  category: string;
};

export default function Home() {
  const [categorySelected, setCategorySelected] = useState("Todas");
  const [proyectos, setProyectos] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Project;
        return {
          id: doc.id,
          title: data.title,
          image: data.image,
          category: data.category,
        };
      });
      setProyectos(projectsData);
    };

    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.flatMap(
        (doc) => doc.data().nombre
      );
      setCategories(categoriesData);
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const proyectosFiltrados =
    categorySelected === "Todas"
      ? proyectos
      : proyectos.filter((proyecto) => proyecto.category === categorySelected);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.h1
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        Portafolio de Caracterización
      </motion.h1>
      <div className="flex justify-center space-x-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            onClick={() => setCategorySelected(category)}
            variant={categorySelected === category ? "default" : "outline"}>
            {category}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          {proyectosFiltrados.map((proyecto) => (
            <motion.div
              key={proyecto.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{proyecto.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={proyecto.image[0] || "/placeholder.svg"}
                    alt={proyecto.title}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Badge>{proyecto.category}</Badge>
                  <Button asChild>
                    <Link href={`/proyect/${proyecto.id}`}>Ver Detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
