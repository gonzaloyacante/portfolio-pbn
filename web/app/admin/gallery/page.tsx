"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GalleryImage } from "../../../models/GalleryImage";
import { Plus, Undo2, Redo2 } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddGalleryImageModal from "./AddGalleryImageModal";
import SelectFromProjectsModal from "./SelectFromProjectsModal";
import GalleryImageList from "./GalleryImageList";
import EditGalleryImageModal from "./EditGalleryImageModal";
import AdminLayout from "@/components/AdminLayout";
import { galleryService } from "@/lib/services/gallery";
import { useGallery } from "@/hooks/use-gallery";
import { useToast } from "@/components/ui/use-toast";

function AdminGallery() {
  const { gallery: galleryImagesSWR, isLoading, mutate } = useGallery();
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [editGalleryImage, setEditGalleryImage] = useState<GalleryImage | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddGalleryImageModalOpen, setIsAddGalleryImageModalOpen] =
    useState(false);
  const [isSelectFromProjectsOpen, setIsSelectFromProjectsOpen] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [past, setPast] = useState<GalleryImage[][]>([]);
  const [future, setFuture] = useState<GalleryImage[][]>([]);

  useEffect(() => {
    setGalleryImages(galleryImagesSWR);
    if (!isLoading && !galleryImagesSWR && galleryImagesSWR !== undefined) {
      toast({ title: "Error", description: "No se pudieron cargar las imágenes de la galería.", variant: "destructive" });
    }
  }, [galleryImagesSWR, isLoading, toast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (isOrderChanged && !isSavingOrder) {
          void saveOrderChanges();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOrderChanged, isSavingOrder]);

  const handleKeyboardMove = (id: string, delta: number) => {
    const currentIndex = galleryImages.findIndex(img => img.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = Math.max(0, Math.min(galleryImages.length - 1, currentIndex + delta));
    if (newIndex === currentIndex) return;
    
    const newOrder = [...galleryImages];
    const [moved] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    
    setPast((p) => [...p, galleryImages]);
    setFuture([]);
    setGalleryImages(newOrder);
    setIsOrderChanged(true);
  };

  const handleDelete = async (imageId: string) => {
    try {
      await galleryService.remove(imageId);
      await mutate();
      setSuccessMessage("Imagen eliminada correctamente");
      toast({ title: "Eliminada", description: "Se eliminó la imagen de la galería." });
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      setErrorMessage("Error eliminando imagen: " + (error as Error).message);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editGalleryImage) {
      try {
        await galleryService.update(editGalleryImage.id!, {
          url: editGalleryImage.url,
          name: editGalleryImage.name,
          order: editGalleryImage.order,
        });
        setEditGalleryImage(null);
        await mutate();
        setSuccessMessage("Imagen actualizada correctamente");
        toast({ title: "Imagen actualizada", description: "Se guardaron los cambios." });
      } catch (error) {
        console.error("Error actualizando imagen:", error);
        setErrorMessage(
          "Error actualizando imagen: " + (error as Error).message
        );
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      }
    }
  };

  const handleOrderChange = (newOrder: GalleryImage[]) => {
    setPast((p) => [...p, galleryImages]);
    setFuture([]);
    setGalleryImages(newOrder);
    setIsOrderChanged(true);
  };

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = () => {
    if (!canUndo) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [galleryImages, ...f]);
    setGalleryImages(prev);
    setIsOrderChanged(true);
  };

  const redo = () => {
    if (!canRedo) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, galleryImages]);
    setGalleryImages(next);
    setIsOrderChanged(true);
  };

  const saveOrderChanges = async () => {
    if (isSavingOrder) return;
    setIsSavingOrder(true);
    try {
      const items = galleryImages.map((img, idx) => ({ id: Number(img.id), order: idx }));
      await galleryService.reorderAll(items);
      setSuccessMessage("Orden de imágenes actualizado correctamente");
      toast({ title: "Orden guardado", description: "Se actualizó el orden de la galería." });
      setIsOrderChanged(false);
      await mutate();
    } catch (error) {
      console.error("Error actualizando el orden de las imágenes:", error);
      setErrorMessage(
        "Error actualizando el orden de las imágenes: " +
          (error as Error).message
      );
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <AdminLayout
      title="Imágenes de la Galería"
      filter={false}
      right={
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{galleryImages.length} imágenes</Badge>
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo || isSavingOrder} aria-label="Deshacer">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo || isSavingOrder} aria-label="Rehacer">
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={() => setIsSelectFromProjectsOpen(true)}>
            Agregar desde proyectos
          </Button>
        </div>
      }
    >
      <GalleryImageList
        galleryImages={galleryImages}
        handleEdit={setEditGalleryImage}
        handleDelete={handleDelete}
        handleOrderChange={handleOrderChange}
        disabledDrag={isSavingOrder}
        onKeyboardMove={handleKeyboardMove}
      />
      {isOrderChanged && (
        <Button
          variant="default"
          className="mt-4"
          onClick={saveOrderChanges}
          disabled={isSavingOrder}
        >
          {isSavingOrder ? "Guardando..." : "Guardar cambios"}
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
      {isSelectFromProjectsOpen && (
        <SelectFromProjectsModal
          currentCount={galleryImages.length}
          onAdded={async () => {
            setIsSelectFromProjectsOpen(false);
            await mutate();
            setSuccessMessage("Imágenes agregadas desde proyectos");
            toast({ title: "Imágenes agregadas", description: "Se agregaron imágenes desde proyectos." });
          }}
          onClose={() => setIsSelectFromProjectsOpen(false)}
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
      <div className="mt-4 flex gap-2 justify-center">
        <Button variant="secondary" onClick={() => setIsSelectFromProjectsOpen(true)}>
          Agregar desde proyectos
        </Button>
      </div>
    </AdminLayout>
  );
}

export default AdminGallery;
