import React, { useState, useEffect, useRef } from "react";
import ImageGallery from "react-image-gallery";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import clsx from "clsx";
import "react-image-gallery/styles/css/image-gallery.css";

interface ImageGalleryProps {
  images: {
    original: string;
    thumbnail: string;
    name: string;
    onLoad?: () => void;
    order?: number;
  }[];
  showThumbnails?: boolean;
  thumbnailPosition?: "top" | "right" | "bottom" | "left";
  showPlayButton?: boolean;
  showFullscreenButton?: boolean;
  autoPlay?: boolean;
  showBullets?: boolean;
  isHome?: boolean;
}

const CustomImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  showThumbnails = true,
  thumbnailPosition = "bottom",
  showPlayButton = true,
  showFullscreenButton = true,
  autoPlay = false,
  showBullets = false,
  isHome = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const galleryRef = useRef<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const galleryClass = clsx("custom-gallery", {
    "home-gallery": isHome,
    "project-gallery": !isHome,
    "mobile-view": isMobile,
  });

  // Ordenar las imágenes por el campo `order`
  const sortedImages = images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Funciones mejoradas para controlar reproducción
  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
    if (galleryRef.current) {
      if (!isPlaying) {
        galleryRef.current.play();
      } else {
        galleryRef.current.pause();
      }
    }
  };

  // Botón de reproducción personalizado
  const renderPlayPauseButton = () => {
    return (
      <button
        className="image-gallery-play-button"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (
          <svg className="image-gallery-svg" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
          </svg>
        ) : (
          <svg className="image-gallery-svg" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        )}
      </button>
    );
  };

  const renderItem = (item: { original: string }) => (
    <TransformWrapper
      initialScale={1}
      minScale={0.8}
      maxScale={3}
      wheel={{ disabled: isHome }}
      panning={{ disabled: isHome }}
      doubleClick={{ disabled: isHome }}
      initialPositionX={0}
      initialPositionY={0}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          {!isHome && (
            <div className="zoom-controls">
              <button onClick={() => zoomIn()} className="zoom-button zoom-in">
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="zoom-button zoom-out">
                -
              </button>
              <button
                onClick={() => resetTransform()}
                className="zoom-button zoom-reset">
                ↻
              </button>
            </div>
          )}{" "}
          <TransformComponent>
            <div
              className={clsx("image-container", {
                "h-[300px] md:h-[600px]": !isHome,
                "h-[200px] md:h-[400px]": isHome,
                "w-full": true,
              })}>
              <img
                src={item.original}
                alt="Imagen de la galería"
                loading="lazy"
                className="gallery-image w-full"
              />
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );

  return (
    <div className={galleryClass} data-ishome={isHome ? "true" : "false"}>
      {" "}
      <ImageGallery
        ref={galleryRef}
        items={sortedImages}
        showThumbnails={showThumbnails}
        thumbnailPosition={isMobile ? "bottom" : thumbnailPosition}
        showPlayButton={showPlayButton}
        showFullscreenButton={false}
        autoPlay={isPlaying}
        renderItem={renderItem}
        renderPlayPauseButton={renderPlayPauseButton}
        showBullets={showBullets}
        showNav={true}
        slideDuration={450}
        slideInterval={3000}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        lazyLoad={true}
      />
    </div>
  );
};

export default CustomImageGallery;
