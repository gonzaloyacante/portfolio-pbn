"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Project from "@/models/Project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "../../../components/Loader";
import { AlertCircle } from "lucide-react";
import NoData from "@/components/NoData";
import CustomImageGallery from "@/components/ImageGallery";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const docRef = doc(db, "projects", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const projectData = docSnap.data() as Project;
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

  const handleImageLoad = () => {
    setImageLoading(false);
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
          <div className="relative w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex justify-center items-center">
                <Loader />
              </div>
            )}
            <CustomImageGallery
              images={project.image.map((img, index) => ({
                original: img,
                thumbnail: img,
                name: `image-${index}`,
                onLoad: handleImageLoad,
              }))}
              showThumbnails={true}
              thumbnailPosition="right"
              showPlayButton={false}
              showFullscreenButton={true}
              autoPlay={false}
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 justify-center items-center w-full h-48 bg-card rounded-md">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p>Error al cargar la imagen</p>
          </div>
        )}
      </div>
    </div>
  );
}
