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
import { CldUploadWidget } from "next-cloudinary";
import { Plus, X } from "lucide-react";

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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      console.log("Image uploaded to Cloudinary:", imageUrl);
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        setSelectedImages((prevImages) => [...prevImages, imageUrl]);
      } else {
        console.error("Invalid image URL:", imageUrl);
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== url)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        image: selectedImages,
      };
      console.log("Submitting project to Firebase:", projectData);
      const projectsCollection = collection(db, "projects");
      const docRef = await addDoc(projectsCollection, projectData);
      const newProjectWithId = { ...projectData, id: docRef.id };

      await updateDoc(docRef, newProjectWithId);

      setNewProject({
        id: "",
        title: "",
        description: "",
        category: "",
        image: [],
      });
      setSelectedImages([]);

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
        <div className="relative bg-background border rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
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
            <div className="flex items-center space-x-2">
              <CldUploadWidget
                uploadPreset="ml_default"
                onSuccess={handleImageUpload}>
                {({ open }) => {
                  function handleOnClick(e: any) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <Button onClick={handleOnClick} variant="outline">
                      <Plus className="mr-2" /> Agregar Imágenes
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {selectedImages.map((url) => (
                <div key={url} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt="Selected"
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleRemoveImage(url)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="submit">Añadir</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
