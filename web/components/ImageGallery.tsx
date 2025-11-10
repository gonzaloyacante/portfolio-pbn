import React, { useState, useEffect, useRef } from "react";
import ReactImageGallery from "react-image-gallery";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import clsx from "clsx";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { normalizeCloudinary } from "@/lib/imageUtils";

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
  // Thumb uniforme cuadrado con shimmer + hover/active
  const renderThumbInner = (item: { thumbnail: string; name: string }) => (
    <div className="thumb-img relative">
      <ImageWithSkeleton
        src={normalizeCloudinary(item.thumbnail, 'thumb')}
        alt={item.name}
        fill
        sizes="96px"
        className="object-cover rounded-md"
        containerClassName="w-full h-full"
        priority={false}
      />
    </div>
  )

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
          <TransformComponent
            wrapperClass="w-full flex justify-center items-center"
            contentClass="flex justify-center items-center">
            {" "}
            <div className="image-container flex justify-center items-center w-full">
              <ImageWithSkeleton
                src={normalizeCloudinary(item.original, 'viewer')}
                alt="Imagen de la galería"
                width={1920}
                height={1080}
                sizes="(max-width: 768px) 100vw, 95vw"
                priority={isHome}
                className={`gallery-image max-w-full ${
                  isHome ? "max-h-full" : "max-h-none"
                } object-contain mx-auto`}
                style={isHome ? { maxHeight: "600px" } : { maxHeight: "80vh" }}
                containerClassName="w-full h-full"
              />
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );

  // Fix tipado de JSX: castear a FC para evitar TS2786 en ciertos setups
  const Gallery = ReactImageGallery as unknown as React.FC<any>

  return (
    <div className={galleryClass} data-ishome={isHome ? "true" : "false"}>
      {" "}
      <Gallery
        ref={galleryRef}
        items={sortedImages}
        showThumbnails={showThumbnails}
        thumbnailPosition={isMobile ? "bottom" : thumbnailPosition}
        showPlayButton={showPlayButton}
        showFullscreenButton={false}
        autoPlay={isPlaying}
        renderItem={renderItem}
        renderThumbInner={renderThumbInner}
        renderPlayPauseButton={renderPlayPauseButton}
        showBullets={showBullets}
        showNav={true}
        slideDuration={450}
        slideInterval={3000}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        lazyLoad={true}
      />
      {/* Estilos globales para miniaturas y hover/selección */}
      <style jsx global>{`
        /* Centrar el carrusel dentro del contenedor y usar más ancho */
        .custom-gallery .image-gallery {
          margin-left: auto;
          margin-right: auto;
          max-width: min(1400px, 95vw);
          width: 100%;
        }
        .custom-gallery .image-gallery-content {
          margin-left: auto;
          margin-right: auto;
        }
        .custom-gallery .image-gallery-swipe,
        .custom-gallery .image-gallery-slides,
        .custom-gallery .image-gallery-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .custom-gallery .image-gallery-slide .image-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .custom-gallery .image-gallery-thumbnails-wrapper {
          margin-top: 14px;
        }
        .custom-gallery .image-gallery-thumbnails-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }
        .custom-gallery .image-gallery-thumbnail {
          width: 96px;
          height: 96px;
          padding: 0;
          border: none;
          border-radius: 8px;
          overflow: hidden;
          background: transparent;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .custom-gallery .image-gallery-thumbnail:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        .custom-gallery .image-gallery-thumbnail.active {
          outline: 2px solid var(--color-primary, #ec4899);
          outline-offset: 2px;
        }
        .custom-gallery .image-gallery-thumbnail .thumb-img { position: relative; width: 100%; height: 100%; }
        /* Evitar forzar altura fija que desbalancea el layout y genera scroll innecesario */
        .custom-gallery .image-gallery-slide-wrapper {
          min-height: unset;
          height: auto;
        }
        /* Botón play/pause visible y separado de thumbnails */
        .custom-gallery .image-gallery-play-button {
          bottom: 18px !important;
          right: 12px !important;
          z-index: 5;
        }
        /* Centrar verticalmente las flechas respecto a la imagen */
        .custom-gallery .image-gallery-icon.image-gallery-left-nav,
        .custom-gallery .image-gallery-icon.image-gallery-right-nav {
          top: 50% !important;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};

export default CustomImageGallery;
