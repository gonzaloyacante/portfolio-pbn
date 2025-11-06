"use client";

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  FormEvent,
} from "react";
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
import { fetchJson } from "@/lib/api";

interface EditProjectModalProps {
  projectId: string;
  setProjects: (projects: Project[]) => void;
  onClose: () => void;
  editProject: Project;
  setEditProject: Dispatch<SetStateAction<Project | null>>;
  handleSave: (e: FormEvent<Element>) => Promise<void>;
}

export default function EditProjectModal({
  projectId,
  setProjects,
  onClose,
  editProject,
  setEditProject,
  handleSave,
}: EditProjectModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const p = await fetchJson<{
        id: number;
        title: string;
        description: string;
        category: { id: number; name: string; slug: string };
        images: { id: number; url: string; order: number }[];
      }>(`/api/projects/${projectId}`);
      const mapped: Project = {
        id: String(p.id),
        title: p.title,
        description: p.description,
        category: p.category?.name ?? "",
        image: (p.images || []).sort((a,b)=>a.order-b.order).map(i=>i.url),
      };
      setEditProject(mapped);
      setSelectedImages(mapped.image);
    };

    const fetchCategories = async () => {
      const apiCategories = await fetchJson<Array<{ id: number; name: string; slug: string }>>(
        "/api/categories"
      );
      const categoriesList: Category[] = apiCategories.map((c) => ({ id: String(c.id), name: c.name }));
      setCategories(categoriesList);
    };

    fetchProject();
    fetchCategories();
  }, [projectId, setEditProject]);

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        setSelectedImages((prevImages) => [...prevImages, imageUrl]);
        setEditProject((prevProject) => {
          if (!prevProject) return prevProject;
          return { ...prevProject, image: [...prevProject.image, imageUrl] };
        });
      } else {
        console.error("Invalid image URL:", imageUrl);
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== url)
    );
    setEditProject((prevProject) => {
      if (!prevProject) return prevProject;
      return {
        ...prevProject,
        image: prevProject.image.filter((image) => image !== url),
      };
    });
  };

  const handleSaveWithFeedback = async (e: FormEvent<Element>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedProject = {
        ...editProject,
        title: editProject.title.trim(),
        description: editProject.description.trim(),
      };
      setEditProject(trimmedProject);
      await handleSave(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al guardar el proyecto");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!editProject) {
    return <Loader />;
  }

  return (
    <>
      {loading && <Loader />}
      {success && (
        <SuccessModal
          message="Proyecto editado con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Modal title="Editar Proyecto" onClose={onClose} footer="Guardar Cambios">
        <form onSubmit={handleSaveWithFeedback} className="space-y-4">
          <Input
            placeholder="Título del Proyecto"
            value={editProject.title}
            onChange={(e) =>
              setEditProject({ ...editProject, title: e.target.value.trim() })
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
