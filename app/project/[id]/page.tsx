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
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

import Project from "@/models/Project";
import Loader from "@/components/ui/loader";
import NoData from "@/components/ui/NoData";
import Error from "@/components/ui/Error";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, "projects", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Project;
          setProject(data);
          setSelectedImage(data.image[0]);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Error fetching project data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Error message={error} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <NoData />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-center">Detalles del proyecto</h1>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>
            <Badge>{project.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Dialog>
              <DialogTrigger> */}
            <Image
              width="800"
              height="600"
              src={selectedImage || project.image[0]}
              alt={project.title}
              className="w-full h-auto rounded-lg cursor-pointer"
              priority
            />
            {/* </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <Image
                  width="1200"
                  height="900"
                  src={selectedImage || project.image[0]}
                  alt={project.title}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog> */}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {project.image.map((image, index) => (
              // <Dialog key={index}>
              //   <DialogTrigger>
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Image
                  width="200"
                  height="150"
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-auto rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
              </motion.div>
              //   </DialogTrigger>
              //   <DialogContent className="max-w-4xl">
              //     <Image
              //       width="1200"
              //       height="900"
              //       src={selectedImage || project.image[0]}
              //       alt={`${project.title} - Image ${index + 1}`}
              //       className="w-full h-auto"
              //     />
              //   </DialogContent>
              // </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
