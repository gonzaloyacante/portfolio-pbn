import React from "react";
import ImageGallery from "react-image-gallery";
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
}

const CustomImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  showThumbnails = true,
  thumbnailPosition = "bottom",
  showPlayButton = false,
  showFullscreenButton = true,
  autoPlay = false,
  showBullets = false,
}) => {
  // Ordenar las imágenes por el campo `order`
  const sortedImages = images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const renderItem = (item: { original: string }) => (
    <div className="w-full h-full">
      <img
        src={item.original}
        alt="Imagen de la galería"
        loading="lazy"
        className="object-cover w-full h-full"
      />
    </div>
  );

  return (
    <ImageGallery
      items={sortedImages}
      showThumbnails={showThumbnails}
      thumbnailPosition={thumbnailPosition}
      showPlayButton={showPlayButton}
      showFullscreenButton={showFullscreenButton}
      autoPlay={autoPlay}
      renderItem={renderItem}
      showBullets={showBullets}
    />
  );
};

export default CustomImageGallery;
