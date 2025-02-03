"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import { GalleryImage } from "../../../models/GalleryImage";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, X } from "lucide-react";
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Loader } from "../../../components/Loader";

interface AddGalleryImageModalProps {
  setGalleryImages: (galleryImages: GalleryImage[]) => void;
  onClose: () => void;
}

export default function AddGalleryImageModal({
  setGalleryImages,
  onClose,
}: AddGalleryImageModalProps) {
  const [newGalleryImage, setNewGalleryImage] = useState<GalleryImage>({
    id: "",
    url: "",
    name: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        setNewGalleryImage((prevImage) => ({ ...prevImage, url: imageUrl }));
      } else {
        console.error("Invalid image URL:", imageUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const galleryImageData = {
        ...newGalleryImage,
        name: newGalleryImage.name.trim(),
      };
      const galleryImagesCollection = collection(db, "homeGallery");
      const docRef = await addDoc(galleryImagesCollection, galleryImageData);
      const newGalleryImageWithId = { ...galleryImageData, id: docRef.id };

      await updateDoc(docRef, newGalleryImageWithId);

      setNewGalleryImage({
        id: "",
        url: "",
        name: "",
        order: 0,
      });

      const galleryImagesSnapshot = await getDocs(galleryImagesCollection);
      const galleryImagesList = galleryImagesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as GalleryImage)
      );
      setGalleryImages(galleryImagesList);
      onClose();
    } catch (error) {
      console.error("Error añadiendo imagen:", error);
    }
  };

  const handleSubmitWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryImage.url) {
      setError("Por favor, sube una imagen.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setLoading(true);
    try {
      await handleSubmit(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al añadir la imagen");
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
          message="Imagen añadida con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && (
        <ErrorModal
          message={"Error al añadir la imagen: \n" + error}
          onClose={() => setError(null)}
        />
      )}
      <Modal title="Añadir Imagen" onClose={onClose} footer="Añadir">
        <form onSubmit={handleSubmitWithFeedback} className="space-y-4">
          <Input
            placeholder="Nombre de la Imagen"
            value={newGalleryImage.name}
            onChange={(e) =>
              setNewGalleryImage({ ...newGalleryImage, name: e.target.value })
            }
            className="bg-background"
          />
          <Input
            placeholder="Orden"
            type="number"
            value={newGalleryImage.order}
            onChange={(e) =>
              setNewGalleryImage({
                ...newGalleryImage,
                order: Number(e.target.value),
              })
            }
            className="bg-background"
          />
          <div className="flex items-center space-x-2">
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
          </div>
          {newGalleryImage.url && (
            <div className="relative w-20 h-20">
              <img
                src={newGalleryImage.url}
                alt="Selected"
                className="w-full h-full object-cover rounded"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() =>
                  setNewGalleryImage({ ...newGalleryImage, url: "" })
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
