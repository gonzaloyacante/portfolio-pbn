"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import Category from "../../../models/Category";
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import Loader from "@/components/loader";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmitWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al añadir la categoría");
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
          message="Categoría añadida con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Modal title="Añadir Categoría" onClose={onClose} footer="Añadir">
        <form onSubmit={handleSubmitWithFeedback} className="space-y-4">
          <label htmlFor="categoryName">Nombre de la nueva Categoría</label>
          <Input
            placeholder="Maquillaje, Peluquería, etc."
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value.trim() })
            }
            className="bg-background"
          />
        </form>
      </Modal>
    </>
  );
}
