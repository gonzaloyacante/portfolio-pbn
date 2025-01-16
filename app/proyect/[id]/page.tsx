"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

import Project from "@/models/Project";

export default function projectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [imageSelected, setImageSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchproject() {
      const docRef = doc(db, "projects", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        setProject(data);
        setImageSelected(data.image[0]);
      } else {
        notFound();
      }
    }

    fetchproject();
  }, [params.id]);

  if (!project) {
    return <p>Cargando...</p>;
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-center">{project.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>
            <Badge>{project.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger>
                <Image
                  width="800"
                  height="600"
                  src={imageSelected || project.image[0]}
                  alt={project.title}
                  className="w-full h-auto rounded-lg cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <Image
                  width="1200"
                  height="900"
                  src={imageSelected || project.image[0]}
                  alt={project.title}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
            <div className="space-y-4">
              <p className="text-gray-700">{project.description}</p>
              <h3 className="text-xl font-semibold">Proceso de Creación</h3>
              <ul className="list-disc pl-5">
                {project.process.map((paso, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}>
                    {paso}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {project.image.map((imagen, index) => (
              <Dialog key={index}>
                <DialogTrigger>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Image
                      width="200"
                      height="150"
                      src={imagen}
                      alt={`${project.title} - Imagen ${index + 1}`}
                      className="w-full h-auto rounded-md cursor-pointer"
                      onClick={() => setImageSelected(imagen)}
                    />
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <Image
                    width="1200"
                    height="900"
                    src={imagen}
                    alt={`${project.title} - Imagen ${index + 1}`}
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
