import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ImageGalleryProps {
  images: { original: string; thumbnail: string; onLoad?: () => void }[];
}

const CustomImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <ImageGallery
      items={images}
      showThumbnails={true}
      thumbnailPosition="bottom"
      showPlayButton={false}
      showFullscreenButton={true}
      autoPlay={false}
    />
  );
};

export default CustomImageGallery;
