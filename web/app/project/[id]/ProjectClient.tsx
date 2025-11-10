"use client";

import { useState } from "react";
import Project from "@/models/Project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "../../../components/Loader";
import NoData from "@/components/NoData";
import dynamic from "next/dynamic";

const CustomImageGallery = dynamic(() => import("@/components/ImageGallery"), {
  ssr: false,
});

type Props = { project: Project | null };

export default function ProjectClient({ project }: Props) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => setImageLoading(false);

  if (!project) {
    return (
      <div
        className="flex flex-col justify-center items-center space-y-4"
        style={{ height: "calc(100vh - 12rem)" }}
      >
        <NoData message="Proyecto no encontrado" />
      </div>
    );
  }

  const images = project.image || [];

  return (
    <div className="container mx-auto px-2 sm:px-4 w-full">
      <div className="flex flex-row justify-between mb-4">
        <div />
        <Badge variant="default">{project.category}</Badge>
      </div>
      <h3 className="text-lg md:text-2xl font-bold">{project.title}</h3>
      <div className="my-4 border-b pb-2">
        <p className="text-sm md:text-base">{project.description}</p>
      </div>
      <div className="mx-auto w-full flex flex-col justify-center items-center">
        {images.length > 0 ? (
          <div className="relative w-full project-gallery">
            {imageLoading && (
              <div className="absolute inset-0 flex justify-center items-center">
                <Loader />
              </div>
            )}
            <CustomImageGallery
              images={images.map((img, index) => ({
                original: img,
                thumbnail: img,
                name: `image-${index}`,
                onLoad: handleImageLoad,
              }))}
              showThumbnails={true}
              thumbnailPosition="top"
              showPlayButton={false}
              showFullscreenButton={true}
              autoPlay={false}
              showBullets={false}
              isHome={false}
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 justify-center items-center w-full h-48 bg-card rounded-md">
            <p>Error al cargar la imagen</p>
          </div>
        )}
      </div>
    </div>
  );
}
