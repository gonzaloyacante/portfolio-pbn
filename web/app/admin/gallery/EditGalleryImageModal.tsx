"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GalleryImage } from "../../../models/GalleryImage";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, X } from "lucide-react";
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Loader } from "../../../components/Loader";

interface EditGalleryImageModalProps {
  editGalleryImage: GalleryImage;
  setEditGalleryImage: (galleryImage: GalleryImage | null) => void;
  handleSave: (e: React.FormEvent) => void;
  imageId: string;
  setGalleryImages: (galleryImages: GalleryImage[]) => void;
  onClose: () => void;
}

export default function EditGalleryImageModal({
  editGalleryImage,
  setEditGalleryImage,
  handleSave,
  imageId,
  setGalleryImages,
  onClose,
}: EditGalleryImageModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleImageUpload = (result: any) => {
  //   if (result.event === "success") {
  //     const imageUrl = result.info.secure_url;
  //     if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
  //       setEditGalleryImage((prevImage: any) => ({
  //         ...prevImage!,
  //         url: imageUrl,
  //       }));
  //     } else {
  //       console.error("Invalid image URL:", imageUrl);
  //     }
  //   }
  // };

  const handleSubmitWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSave(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al actualizar la imagen");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {success && (
        <SuccessModal
          message="Imagen actualizada con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && (
        <ErrorModal
          message={"Error al actualizar la imagen: \n" + error}
          onClose={() => setError(null)}
        />
      )}
      <Modal title="Editar Imagen" onClose={onClose} footer="Guardar">
        <form onSubmit={handleSubmitWithFeedback} className="space-y-4">
          <Input
            placeholder="Nombre de la Imagen"
            value={editGalleryImage.name}
            onChange={(e) =>
              setEditGalleryImage({ ...editGalleryImage, name: e.target.value })
            }
            className="bg-background"
          />
          <Input
            placeholder="Orden"
            type="number"
            value={editGalleryImage.order}
            onChange={(e) =>
              setEditGalleryImage({
                ...editGalleryImage,
                order: Number(e.target.value),
              })
            }
            className="bg-background"
          />
          {/* <div className="flex items-center space-x-2">
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={handleImageUpload}>
              {({ open }) => {
                function handleOnClick(e: any) {
                  e.preventDefault();
                  open();
                }
                return (
                  <Button onClick={handleOnClick} variant="outline">
                    <Plus className="mr-2" /> Subir Imagen
                  </Button>
                );
              }}
            </CldUploadWidget>
          </div> */}
          {editGalleryImage.url && (
            <div className="relative w-20 h-20">
              <img
                src={editGalleryImage.url}
                alt="Selected"
                className="w-full h-full object-cover rounded"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() =>
                  setEditGalleryImage({ ...editGalleryImage, url: "" })
                }>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
