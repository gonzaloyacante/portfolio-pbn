"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function Categories() {
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = categoriesSnapshot.docs.map(
        (doc) => doc.data().nombre
      )[0] as string[];
      setCategories(["Todas", ...categoriesData]);
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory: string) => {
    await addDoc(collection(db, "categories"), {
      nombre: [...categories, newCategory],
    });
    if (newCategory) {
      setCategories([...categories, newCategory]);
    }
    toast({
      title: "Categoría agregada",
      description: "La categoría ha sido agregada exitosamente.",
    });
  };

  const handleDeleteCategory = async (category: string) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    const categoryDoc = (await getDocs(collection(db, "categories"))).docs[0];
    await updateDoc(categoryDoc.ref, { nombre: updatedCategories });
    setCategories(updatedCategories);
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">
          <Plus className="mr-2" /> Gestionar Categorías
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4 p-4">
          <h2 className="text-2xl font-bold text-gray-700">Categorías</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 text-white">
                <Plus className="mr-2" /> Agregar Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h3 className="text-xl font-bold text-gray-700">
                Agregar Categoría
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newCategory = formData.get("nuevaCategoria") as string;
                  handleAddCategory(newCategory);
                }}>
                <Input
                  name="nuevaCategoria"
                  placeholder="Nueva Categoría"
                  required
                  className="mb-2"
                />
                <Button type="submit" className="bg-green-500 text-white">
                  Agregar Categoría
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span className="text-gray-700">{category}</span>
                {category !== "Todas" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteCategory(category)}
                    className="bg-red-500 text-white">
                    <Trash className="mr-2" /> Eliminar
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
