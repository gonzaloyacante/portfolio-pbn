"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import Category from "../../../models/Category";

interface AddCategoryModalProps {
  setCategories: (categories: Category[]) => void;
  onClose: () => void;
}

export default function AddCategoryModal({
  setCategories,
  onClose,
}: AddCategoryModalProps) {
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoriesCollection = collection(db, "categories");
      const docRef = await addDoc(categoriesCollection, newCategory);
      const newCategoryWithId = { ...newCategory, id: docRef.id };

      await updateDoc(docRef, newCategoryWithId);

      setNewCategory({
        id: "",
        name: "",
      });

      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(categoriesList);
      onClose();
    } catch (error) {
      console.error("Error añadiendo categoría:", error);
    }
  };

  return (
    <div
      id="add-category-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Añadir Categoría
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Cerrar modal</span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
            <Input
              placeholder="Nombre de la Categoría"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="bg-background"
            />
            <Button type="submit">Añadir</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
