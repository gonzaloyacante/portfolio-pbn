"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import Project from "../../../models/Project";
import Category from "../../../models/Category";

interface EditProjectModalProps {
  editProject: Project;
  setEditProject: (project: Project | null) => void;
  handleSave: (e: React.FormEvent) => void;
}

export default function EditProjectModal({
  editProject,
  setEditProject,
  handleSave,
}: EditProjectModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Proyecto
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditProject(null)}>
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
          <form onSubmit={handleSave} className="p-4 md:p-5 space-y-4">
            <Input
              placeholder="Título del Proyecto"
              value={editProject.title}
              onChange={(e) =>
                setEditProject({ ...editProject, title: e.target.value })
              }
              className="bg-background"
            />
            <Select
              value={editProject.category}
              onValueChange={(value) =>
                setEditProject({ ...editProject, category: value })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Descripción del Proyecto"
              value={editProject.description}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  description: e.target.value,
                })
              }
              className="bg-background"
            />
            <Textarea
              placeholder="URLs de Imágenes (separadas por comas)"
              value={editProject.image.join(", ")}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  image: e.target.value.split(",").map((url) => url.trim()),
                })
              }
              className="bg-background"
            />
            <Textarea
              placeholder="Proceso (separado por comas)"
              value={editProject.process.join(", ")}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  process: e.target.value.split(",").map((step) => step.trim()),
                })
              }
              className="bg-background"
            />
            <Button type="submit">Guardar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
