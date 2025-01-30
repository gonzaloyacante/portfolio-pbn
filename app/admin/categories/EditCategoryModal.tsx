"use client";

import { Input } from "@/components/ui/input";
import Category from "../../../models/Category";
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { useState } from "react";
import { Loader } from "../../../components/Loader";

interface EditCategoryModalProps {
  editCategory: Category;
  setEditCategory: (category: Category | null) => void;
  handleSave: (category: Category) => void;
}

export default function EditCategoryModal({
  editCategory,
  setEditCategory,
  handleSave,
}: EditCategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedCategory = {
        ...editCategory,
        name: editCategory.name.trim(),
      };
      setEditCategory(updatedCategory);
      handleSave(updatedCategory);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al guardar la categoría");
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
          message="Categoría editada con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Modal
        title="Editar Categoría"
        onClose={() => setEditCategory(null)}
        footer="Guardar">
        <form onSubmit={handleSaveWithFeedback} className="space-y-4">
          <label htmlFor="categoryName">Nombre de la categoría</label>
          <Input
            placeholder="Nombre de la Categoría"
            value={editCategory.name}
            onChange={(e) =>
              setEditCategory({ ...editCategory, name: e.target.value })
            }
            className="bg-background"
          />
        </form>
      </Modal>
    </>
  );
}
