"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Project from "@/models/Project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "../../../components/Loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/NoData";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

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
    preloadImage(project?.image[index], () => {
      setIsOpen(true);
    });
  };

  const preloadImage = (src: string | undefined, callback: () => void) => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    img.onload = callback;
  };

  if (loading) {
    return <Loader />;
  }

  if (!project) {
    return (
      <div
        className="flex flex-col justify-center items-center space-y-4"
        style={{ height: "calc(100vh - 12rem)" }}>
        <NoData message="Proyecto no encontrado" />
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    );
  }

  const images = project.image;

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="flex flex-row justify-between mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>

        <Badge variant="default">{project.category}</Badge>
      </div>
      <h3 className="text-lg md:text-2xl font-bold">{project.title}</h3>
      <div className="my-4 border-b pb-2">
        <p className="text-sm md:text-base">{project.description}</p>
      </div>
      <div className="mx-auto max-w-2xl flex flex-col justify-center items-center">
        {images.length > 0 ? (
          <>
            <div className="relative w-full h-[50vh] overflow-hidden rounded-md cursor-pointer">
              {imageLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Loader />
                </div>
              )}
              <Image
                src={images[0]}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                priority
                onClick={() => handleImageClick(0)}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto mt-4">
              {images.slice(1).map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Imagen del proyecto ${project.title}`}
                  width={60}
                  height={60}
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
      </div>
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
