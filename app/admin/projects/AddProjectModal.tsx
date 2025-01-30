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
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Loader } from "../../../components/Loader";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmitWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al añadir el proyecto");
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
          message="Proyecto añadido con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Modal title="Añadir Proyecto" onClose={onClose} footer="Añadir">
        <form onSubmit={handleSubmitWithFeedback} className="space-y-4">
          <Input
            placeholder="Título del Proyecto"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value.trim() })
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
        </form>
      </Modal>
    </>
  );
}
