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
import Project from "../../../models/Project";
import Category from "../../../models/Category";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, X } from "lucide-react";
import Modal from "@/components/Modal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Loader } from "../../../components/Loader";
import WarningModal from "@/components/WarningModal";
import { categoryService } from "@/lib/services/categories";
import { projectService } from "@/lib/services/projects";

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
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesList: Category[] = await categoryService.list();
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
      const category = categories.find((c) => c.name === newProject.category);
      await projectService.create({
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        categoryId: category ? Number(category.id) : undefined,
        images: selectedImages.map((url, idx) => ({ url, order: idx })),
      });

      // reset
      setNewProject({ id: "", title: "", description: "", category: "", image: [] });
      setSelectedImages([]);

      // refresh list
      const projectsList = await projectService.list();
      setProjects(projectsList);
      onClose();
    } catch (error) {
      console.error("Error añadiendo proyecto:", error);
    }
  };

  const handleSubmitWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      setIsWarningModalOpen(true);
      return;
    }
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

  const confirmSaveWithoutImages = async () => {
    setIsWarningModalOpen(false);
    setLoading(true);
    try {
      const category = categories.find((c) => c.name === newProject.category);
      await projectService.create({
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        categoryId: category ? Number(category.id) : undefined,
        images: selectedImages.map((url, idx) => ({ url, order: idx })),
      });

      setNewProject({ id: "", title: "", description: "", category: "", image: [] });
      setSelectedImages([]);

      const projectsList = await projectService.list();
      setProjects(projectsList);
      onClose();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error añadiendo proyecto:", error);
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
      {!error && (
        <ErrorModal
          message={"Error al añadir el proyecto: \n" + error}
          onClose={() => setError(null)}
        />
      )}
      {isWarningModalOpen && (
        <WarningModal
          message="El proyecto no tiene fotos. ¿Deseas guardarlo sin fotos?"
          onClose={() => setIsWarningModalOpen(false)}
          onConfirm={confirmSaveWithoutImages}
        />
      )}
      <Modal title="Añadir Proyecto" onClose={onClose} footer="Añadir">
        <form onSubmit={handleSubmitWithFeedback} className="space-y-4">
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
        </form>
      </Modal>
    </>
  );
}
