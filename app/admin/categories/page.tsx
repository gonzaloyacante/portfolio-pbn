"use client";

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
import Category from "../../../models/Category";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddCategoryModal from "./AddCategoryModal";
import CategoryList from "./CategoryList";
import EditCategoryModal from "./EditCategoryModal";
import "@szhsin/react-menu/dist/index.css";

export default function AdminCategorias() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      console.log("Category IDs:", categoriesList);
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    console.log("Deleting category with ID:", categoryId);
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await deleteDoc(categoryRef);
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(categoriesList);
      setSuccessMessage("Categoría eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      setErrorMessage(
        "Error eliminando categoría: " + (error as Error).message
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCategory) {
      try {
        const categoryRef = doc(db, "categories", editCategory.id!);
        await updateDoc(categoryRef, { ...editCategory });
        setEditCategory(null);
        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Category)
        );
        setCategories(categoriesList);
        setSuccessMessage("Categoría actualizada correctamente");
      } catch (error) {
        console.error("Error actualizando categoría:", error);
        setErrorMessage(
          "Error actualizando categoría: " + (error as Error).message
        );
      }
    }
  };

  return (
    <div className="space-y-6 h-full">
      <header className="flex flex justify-between items-center space-x-4 w-full">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-20 w-20" />
            <span className="sr-only">Volver</span>
          </Button>
          <h2 className="text-xl font-bold">Categorías Existentes</h2>
        </div>
      </header>
      <CategoryList
        categories={categories}
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
          setCategories={setCategories}
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
    </div>
  );
}
