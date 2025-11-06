"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { GalleryImage } from "../../../models/GalleryImage";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/WarningModal";
import { GripVertical } from "lucide-react";
import EditMenu from "@/components/EditMenu";
import Image from "next/image";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import React from "react";

interface GalleryImageListProps {
  galleryImages: GalleryImage[];
  handleEdit: (galleryImage: GalleryImage) => void;
  handleDelete: (imageId: string) => void;
  handleOrderChange: (newOrder: GalleryImage[]) => void;
  disabledDrag?: boolean;
  onKeyboardMove?: (id: string, delta: number) => void;
}

export default function GalleryImageList({
  galleryImages,
  handleEdit,
  handleDelete,
  handleOrderChange,
  disabledDrag = false,
  onKeyboardMove,
}: GalleryImageListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openModal = (imageId: string) => {
    setSelectedImageId(imageId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageId(null);
  };

  const confirmDelete = async () => {
    if (selectedImageId) {
      try {
        await handleDelete(selectedImageId);
        setSuccessMessage("Imagen eliminada correctamente");
      } catch (error) {
        setErrorMessage("Error eliminando imagen: " + (error as Error).message);
      } finally {
        closeModal();
      }
    }
  };

  // El reordenamiento lo manejamos item a item usando closest-edge
  const onDropReorder = (
    sourceId: string,
    targetId: string,
    edge: Edge | null,
  ) => {
    if (disabledDrag) return;
    if (sourceId === targetId) return;
    const startIndex = galleryImages.findIndex((i) => i.id === sourceId);
    const targetIndex = galleryImages.findIndex((i) => i.id === targetId);
    if (startIndex < 0 || targetIndex < 0) return;
    const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
    const newOrder = reorder({
      list: galleryImages,
      startIndex,
      finishIndex: destinationIndex,
    });
    handleOrderChange(newOrder);
  };

  const activeImage = galleryImages.find((img) => img.id === activeId);

  return (
    <div className=" pb-8 text-center">
      <h3>Puedes arrastrar y soltar para cambiar el orden</h3>
      {galleryImages.length === 0 ? (
        <NoData message="No hay imágenes disponibles" />
      ) : (
        <div
          role="list"
          aria-label="Lista de imágenes de galería"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setActiveId(null);
            }
          }}
        >
          {galleryImages.map((image: GalleryImage, index: number) => (
            <ListItem
              key={image.id}
              image={image}
              index={index}
              handleEdit={handleEdit}
              openModal={openModal}
              onDropReorder={onDropReorder}
              setActiveId={setActiveId}
              count={galleryImages.length}
              disabled={disabledDrag}
              onKeyboardMove={onKeyboardMove}
              isActive={activeId === image.id}
            />
          ))}
        </div>
      )}
      {isModalOpen && (
        <WarningModal
          onClose={closeModal}
          onConfirm={confirmDelete}
          message="¿Estás seguro de que deseas eliminar esta imagen?"
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
    </div>
  );
}

interface ListItemProps {
  image: GalleryImage;
  index: number;
  count: number;
  handleEdit: (galleryImage: GalleryImage) => void;
  openModal: (imageId: string) => void;
  onDropReorder: (sourceId: string, targetId: string, edge: Edge | null) => void;
  setActiveId: (id: string | null) => void;
  disabled?: boolean;
  onKeyboardMove?: (id: string, delta: number) => void;
  isActive?: boolean;
}

const ListItem = React.memo(function ListItem({
  image,
  index,
  count,
  handleEdit,
  openModal,
  onDropReorder,
  setActiveId,
  disabled = false,
  onKeyboardMove,
  isActive = false,
}: ListItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current!;
    const handle = handleRef.current ?? el;
    if (disabled) return;
    return combine(
      draggable({
        element: handle,
        getInitialData: () => ({ id: image.id }),
        onDragStart: () => setActiveId(image.id),
        onDrop: () => setActiveId(null),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) =>
          attachClosestEdge({
            element,
            input,
            allowedEdges: ["top", "bottom"],
            data: { id: image.id },
          }),
        onDragEnter: () => {},
        onDragLeave: () => {},
        onDrop: ({ self, source }) => {
          const sourceId = (source.data as any).id as string;
          const targetId = (self.data as any).id as string;
          const edge = extractClosestEdge(self.data) as Edge | null;
          onDropReorder(sourceId, targetId, edge);
        },
      }),
    );
  }, [image.id, onDropReorder, setActiveId, disabled]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex justify-between items-center p-4 ${
        index !== count - 1 ? "border-b" : ""
      } ${disabled ? "opacity-60" : ""}`}>
      role="listitem"
      aria-grabbed={disabled ? undefined : isActive}
      <div className="flex text-start items-center space-x-4">
        <div className="flex items-center justify-center w-4 text-primary-foreground rounded-md">
          <span className="text-xl font-bold">{index + 1}</span>
        </div>
        <Image
          src={image.url}
          alt={image.name}
          width={50}
          height={50}
          className="h-16 w-16 object-cover rounded-md"
          priority
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "";
          }}
        />
        <span className="text-sm">{image.name}</span>
      </div>
      <div className="flex items-center">
        <Button
          ref={handleRef as any}
          variant="ghost"
          size="icon"
          className={disabled ? "cursor-not-allowed opacity-60 focus:outline-none" : "cursor-grab focus:ring-2 focus:ring-primary focus:ring-offset-2"}
          aria-label="Reordenar"
          disabled={disabled}
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              const step = e.shiftKey ? 5 : 1;
              onKeyboardMove?.(image.id!, -step);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const step = e.shiftKey ? 5 : 1;
              onKeyboardMove?.(image.id!, step);
            }
          }}
        >
          <GripVertical className="w-5 h-5" />
        </Button>
        <EditMenu onEdit={() => handleEdit(image)} onDelete={() => openModal(image.id!)} />
      </div>
    </motion.div>
  );
});
