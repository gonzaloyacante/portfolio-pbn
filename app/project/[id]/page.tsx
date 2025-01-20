"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Project from "@/models/Project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { AlertCircle } from "lucide-react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const docRef = doc(db, "projects", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const projectData = docSnap.data() as Project;
            console.log("Fetched project from Firebase:", projectData);
            setProject(projectData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id]);

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const preloadImages = (images: string[]) => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ height: "calc(100vh - 10rem)" }}>
        <Loader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Proyecto no encontrado</p>
      </div>
    );
  }

  const images = project.image;
  preloadImages(images);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg md:text-2xl">{project.title}</CardTitle>
          <Badge>{project.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="my-4 border-b pb-2">
            <p className="text-sm md:text-base">{project.description}</p>
          </div>
          {images.length > 0 ? (
            <>
              <Image
                src={images[0]}
                alt={project.title}
                width={800}
                height={600}
                className="w-full h-auto object-cover rounded-md cursor-pointer"
                priority
                onClick={() => handleImageClick(0)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
              <div className="flex space-x-2 overflow-x-auto mt-4">
                {images.slice(1).map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Imagen del proyecto ${project.title}`}
                    width={60}
                    height={80}
                    className="object-cover rounded-md cursor-pointer"
                    onClick={() => handleImageClick(index + 1)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center w-full h-48 bg-gray-200 rounded-md">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          )}
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.back()} className="mt-4">
        Volver
      </Button>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
          imageCaption={`Imagen ${photoIndex + 1} de ${images.length}`}
        />
      )}
    </div>
  );
}
