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
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import Project from "../../../models/Project";
import Category from "../../../models/Category";

interface AddProjectModalProps {
  setProjects: (projects: Project[]) => void;
  onClose: () => void;
}

export default function AddProjectModal({
  setProjects,
  onClose,
}: AddProjectModalProps) {
  const [newProject, setNewProject] = useState<Project>({
    id: "",
    title: "",
    description: "",
    category: "",
    image: [],
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectsCollection = collection(db, "projects");
      const docRef = await addDoc(projectsCollection, newProject);
      const newProjectWithId = { ...newProject, id: docRef.id };

      await updateDoc(docRef, newProjectWithId);

      setNewProject({
        id: "",
        title: "",
        description: "",
        category: "",
        image: [],
        process: [],
      });

      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectsList);
      onClose();
    } catch (error) {
      console.error("Error añadiendo proyecto:", error);
    }
  };

  return (
    <div
      id="add-project-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Añadir Proyecto
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
              placeholder="Título del Proyecto"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="bg-background"
            />
            <Select
              onValueChange={(value) =>
                setNewProject({ ...newProject, category: value })
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
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              className="bg-background"
            />
            <Textarea
              placeholder="URLs de Imágenes (separadas por comas)"
              value={newProject.image.join(", ")}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  image: e.target.value.split(",").map((url) => url.trim()),
                })
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
