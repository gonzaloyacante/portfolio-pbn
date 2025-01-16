"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Project from "@/models/Project";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([""]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const projectsData = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(projectsData);
    };

    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = categoriesSnapshot.docs.map(
        (doc) => doc.data().nombre
      )[0] as string[];
      setCategories(categoriesData || []);
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const handleAddProject = async (
    title: string,
    description: string,
    category: string,
    images: string[],
    steps: string[]
  ) => {
    await addDoc(collection(db, "projects"), {
      titulo: title,
      description: description,
      category: category,
      image: images,
      process: steps,
    });

    toast({
      title: "Proyecto agregado",
      description: "El proyecto ha sido agregado exitosamente.",
    });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter((project) => project.id !== id));
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado exitosamente.",
    });
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = steps.map((step, i) => (i === index ? value : step));
    setSteps(newSteps);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Gestionar Proyectos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Proyectos</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" /> Agregar Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h3 className="text-xl font-bold">Agregar Proyecto</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const title = formData.get("titulo") as string;
                  const description = formData.get("description") as string;
                  const category = formData.get("category") as string;
                  const images = (formData.get("image") as string).split(",");
                  handleAddProject(title, description, category, images, steps);
                }}>
                <Input name="titulo" placeholder="Título" required />
                <Input name="description" placeholder="Descripción" required />
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No hay categorías disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Input
                  name="image"
                  placeholder="URLs de las imágenes (separadas por comas)"
                  required
                />
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Proceso</h4>
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={step}
                        onChange={(e) =>
                          handleStepChange(index, e.target.value)
                        }
                        placeholder={`Paso ${index + 1}`}
                        required
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveStep(index)}>
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button onClick={handleAddStep}>Agregar Paso</Button>
                </div>
                <Button type="submit">Agregar Proyecto</Button>
              </form>
            </DialogContent>
          </Dialog>
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center">
                <span>{project.title}</span>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProject(project.id!)}>
                  <Trash className="mr-2" /> Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
