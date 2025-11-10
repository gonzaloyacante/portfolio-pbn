"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Category from "../../../models/Category";
import { Plus } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddCategoryModal from "./AddCategoryModal";
import CategoryList from "./CategoryList";
import EditCategoryModal from "./EditCategoryModal";
import AdminLayout from "@/components/AdminLayout";
import { categoryService } from "@/lib/services/categories";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/components/ui/use-toast";

export default function AdminCategorias() {
  const { categories, isLoading, mutate } = useCategories();
  const { toast } = useToast();
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleDelete = async (categoryId: string) => {
    try {
      await categoryService.remove(categoryId);
      await mutate();
      setSuccessMessage("Categoría eliminada correctamente");
      toast({ title: "Eliminada", description: "Se eliminó la categoría correctamente." });
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      setErrorMessage(
        "Error eliminando categoría: " + (error as Error).message
      );
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleSave = async (category: Category) => {
    try {
      await categoryService.update(category.id!, category.name);
      setEditCategory(null);
      await mutate();
      setSuccessMessage("Categoría actualizada correctamente");
      toast({ title: "Actualizada", description: "Se guardaron los cambios de la categoría." });
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      setErrorMessage(
        "Error actualizando categoría: " + (error as Error).message
      );
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout 
      title="Categorías Existentes"
      right={<Badge variant="secondary">{localCategories.length} categorías</Badge>}
    >
      <CategoryList
        categories={localCategories}
        handleEdit={setEditCategory}
        handleDelete={handleDelete}
      />
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4"
        onClick={() => setIsAddCategoryModalOpen(true)}>
        <Plus className="h-6 w-6" />
        <span className="sr-only">Añadir Categoría</span>
      </Button>
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          setCategories={setLocalCategories}
          onClose={() => setIsAddCategoryModalOpen(false)}
        />
      )}
      {editCategory && (
        <EditCategoryModal
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          handleSave={handleSave}
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
