"use client";

import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from "../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { GalleryImage } from "../../../models/GalleryImage";
import { Plus } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddGalleryImageModal from "./AddGalleryImageModal";
import GalleryImageList from "./GalleryImageList";
import EditGalleryImageModal from "./EditGalleryImageModal";
import "@szhsin/react-menu/dist/index.css";
import AdminLayout from "@/components/AdminLayout";

function AdminGallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [editGalleryImage, setEditGalleryImage] = useState<GalleryImage | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddGalleryImageModalOpen, setIsAddGalleryImageModalOpen] =
    useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      const galleryImagesCollection = collection(db, "homeGallery");
      const galleryImagesSnapshot = await getDocs(galleryImagesCollection);
      const galleryImagesList = galleryImagesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as GalleryImage)
      );
      setGalleryImages(galleryImagesList);
    };

    fetchGalleryImages();
  }, []);

  const handleDelete = async (imageId: string) => {
    try {
      const imageRef = doc(db, "homeGallery", imageId);
      await deleteDoc(imageRef);
      const galleryImagesCollection = collection(db, "homeGallery");
      const galleryImagesSnapshot = await getDocs(galleryImagesCollection);
      const galleryImagesList = galleryImagesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as GalleryImage)
      );
      setGalleryImages(galleryImagesList);
      setSuccessMessage("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      setErrorMessage("Error eliminando imagen: " + (error as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editGalleryImage) {
      try {
        const imageRef = doc(db, "homeGallery", editGalleryImage.id!);
        await updateDoc(imageRef, { ...editGalleryImage });
        setEditGalleryImage(null);
        const galleryImagesCollection = collection(db, "homeGallery");
        const galleryImagesSnapshot = await getDocs(galleryImagesCollection);
        const galleryImagesList = galleryImagesSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as GalleryImage)
        );
        setGalleryImages(galleryImagesList);
        setSuccessMessage("Imagen actualizada correctamente");
      } catch (error) {
        console.error("Error actualizando imagen:", error);
        setErrorMessage(
          "Error actualizando imagen: " + (error as Error).message
        );
      }
    }
  };

  const handleOrderChange = (newOrder: GalleryImage[]) => {
    setGalleryImages(newOrder);
    setIsOrderChanged(true);
  };

  const saveOrderChanges = async () => {
    try {
      for (let index = 0; index < galleryImages.length; index++) {
        const image = galleryImages[index];
        const imageRef = doc(db, "homeGallery", image.id!);
        await updateDoc(imageRef, { order: index });
      }
      setSuccessMessage("Orden de imágenes actualizado correctamente");
      setIsOrderChanged(false);
    } catch (error) {
      console.error("Error actualizando el orden de las imágenes:", error);
      setErrorMessage(
        "Error actualizando el orden de las imágenes: " +
          (error as Error).message
      );
    }
  };

  return (
    <AdminLayout title="Imágenes de la Galería" filter={false}>
      <GalleryImageList
        galleryImages={galleryImages}
        handleEdit={setEditGalleryImage}
        handleDelete={handleDelete}
        handleOrderChange={handleOrderChange}
      />
      {isOrderChanged && (
        <Button variant="default" className="mt-4" onClick={saveOrderChanges}>
          Guardar cambios
        </Button>
      )}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-5 right-5 h-12 w-12"
        onClick={() => setIsAddGalleryImageModalOpen(true)}>
        <Plus className="scale-150" />
        <span className="sr-only">Añadir Imagen</span>
      </Button>
      {isAddGalleryImageModalOpen && (
        <AddGalleryImageModal
          setGalleryImages={setGalleryImages}
          onClose={() => setIsAddGalleryImageModalOpen(false)}
        />
      )}
      {editGalleryImage && (
        <EditGalleryImageModal
          editGalleryImage={editGalleryImage}
          setEditGalleryImage={setEditGalleryImage}
          handleSave={handleSave}
          imageId={editGalleryImage.id!}
          setGalleryImages={setGalleryImages}
          onClose={() => setEditGalleryImage(null)}
        />
      )}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </AdminLayout>
  );
}

export default withAuth(AdminGallery);
