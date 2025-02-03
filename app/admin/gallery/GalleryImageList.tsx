"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GalleryImage } from "../../../models/GalleryImage";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/WarningModal";
import { Trash2, Edit3, GripVertical } from "lucide-react";
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
}

export default function GalleryImageList({
  galleryImages,
  handleEdit,
  handleDelete,
  handleOrderChange,
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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over.id) {
      const oldIndex = galleryImages.findIndex((img) => img.id === active.id);
      const newIndex = galleryImages.findIndex((img) => img.id === over.id);

      const newOrder = arrayMove(galleryImages, oldIndex, newIndex);
      handleOrderChange(newOrder);
    }
  };

  const activeImage = galleryImages.find((img) => img.id === activeId);

  return (
    <div className=" pb-8 text-center">
      <h3>Puedes arrastrar y soltar para cambiar el orden</h3>
      {galleryImages.length === 0 ? (
        <NoData message="No hay imágenes disponibles" />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={galleryImages.map((image) => image.id)}
            strategy={verticalListSortingStrategy}>
            {galleryImages.map((image: GalleryImage, index: number) => (
              <SortableItem
                key={image.id}
                image={image}
                index={index}
                handleEdit={handleEdit}
                openModal={openModal}
                galleryImages={galleryImages}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeImage ? (
              <div className="flex items-center space-x-4 bg-primary/20 p-4 rounded-md shadow-lg text-left">
                <span className="text-2xl font-bold">
                  {galleryImages.findIndex((img) => img.id === activeId) + 1}
                </span>
                <Image
                  src={activeImage.url}
                  alt={activeImage.name}
                  width={50}
                  height={50}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <span>{activeImage.name}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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

interface SortableItemProps {
  image: GalleryImage;
  index: number;
  handleEdit: (galleryImage: GalleryImage) => void;
  openModal: (imageId: string) => void;
  galleryImages: GalleryImage[];
}

const SortableItem = React.memo(function SortableItem({
  image,
  index,
  handleEdit,
  openModal,
  galleryImages,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
    boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
    backgroundColor: isDragging ? "bg-primary/20" : "transparent",
    touchAction: "none",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex justify-between items-center p-4 ${
        index !== galleryImages.length - 1 ? "border-b" : ""
      } ${isDragging ? "bg-primary/20 border rounded-md" : ""}`}>
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
          variant="ghost"
          size="icon"
          {...listeners}
          className="cursor-grab"
          {...attributes}>
          <GripVertical className="w-5 h-5" />
        </Button>
        <EditMenu
          onEdit={() => handleEdit(image)}
          onDelete={() => openModal(image.id!)}
        />
      </div>
    </motion.div>
  );
});
