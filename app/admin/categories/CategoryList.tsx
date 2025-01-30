"use client";

import { useState } from "react";
import Category from "../../../models/Category";
import { motion } from "framer-motion";
import NoData from "@/components/NoData";
import EditMenu from "@/components/EditMenu";
import WarningModal from "@/components/WarningModal";

interface CategoryListProps {
  categories: Category[];
  handleEdit: (category: Category) => void;
  handleDelete: (categoryId: string) => void;
}

export default function CategoryList({
  categories,
  handleEdit,
  handleDelete,
}: CategoryListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const openModal = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  const confirmDelete = () => {
    if (selectedCategoryId) {
      handleDelete(selectedCategoryId);
      closeModal();
    }
  };

  return (
    <div className="space-y-4 px-4">
      {categories.length === 0 ? (
        <NoData message="No hay categorías disponibles" />
      ) : (
        categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex justify-between items-center ${
              index !== categories.length - 1 ? "border-b pb-4" : ""
            }`}>
            <span>{category.name}</span>
            <EditMenu
              onEdit={() => handleEdit(category)}
              onDelete={() => openModal(category.id!)}
            />
          </motion.div>
        ))
      )}
      {isModalOpen && (
        <WarningModal
          message="¿Estás seguro de que deseas eliminar esta categoría?"
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
