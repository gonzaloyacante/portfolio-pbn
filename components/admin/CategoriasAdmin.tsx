"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export function CategoriasAdmin() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const docRef = doc(db, "categories", "categories");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCategories(docSnap.data().name);
      } else {
        console.log("No such document!");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "categories", "categories");
      const docSnap = await getDoc(docRef);
      let updatedCategories = categories;
      if (docSnap.exists()) {
        updatedCategories = [...docSnap.data().name, newCategory];
        await updateDoc(docRef, { name: updatedCategories });
      } else {
        await setDoc(docRef, { name: [newCategory] });
      }
      setNewCategory("");
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error añadiendo categoría:", error);
    }
  };

  const handleEdit = (category: string) => {
    setEditCategory(category);
  };

  const handleDelete = async (category: string) => {
    try {
      const docRef = doc(db, "categories", "categories");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updatedCategories = docSnap
          .data()
          .name.filter((cat: string) => cat !== category);
        await updateDoc(docRef, { name: updatedCategories });
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  };

  const handleSave = async () => {
    if (editCategory) {
      try {
        const docRef = doc(db, "categories", "categories");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const updatedCategories = docSnap
            .data()
            .name.map((cat: string) =>
              cat === editCategory ? newCategory : cat
            );
          await updateDoc(docRef, { name: updatedCategories });
          setCategories(updatedCategories);
          setEditCategory(null);
          setNewCategory("");
        }
      } catch (error) {
        console.error("Error actualizando categoría:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              placeholder="Nombre de la Categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="submit">Añadir</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{category}</span>
                <Menu menuButton={<MenuButton>Acciones</MenuButton>}>
                  <MenuItem onClick={() => handleEdit(category)}>
                    Editar
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(category)}>
                    Eliminar
                  </MenuItem>
                </Menu>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {editCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Nombre de la Categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleSave}>Guardar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
