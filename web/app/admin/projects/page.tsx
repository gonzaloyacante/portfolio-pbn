"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Project from "../../../models/Project";
import Category from "../../../models/Category";
import { Plus } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddProjectModal from "./AddProjectModal";
import ProjectList from "./ProjectList";
import EditProjectModal from "./EditProjectModal";
import AdminLayout from "@/components/AdminLayout";
import { Loader } from "@/components/Loader";
import { projectService } from "@/lib/services/projects";
import { useProjects } from "@/hooks/use-projects";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/components/ui/use-toast";

function AdminProyectos() {
  const { projects, isLoading: loadingProjects, mutate } = useProjects();
  const { categories, isLoading: loadingCategories } = useCategories();
  const { toast } = useToast();
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const loading = loadingProjects || loadingCategories;

  useEffect(() => {
    // Sincroniza proyectos locales para filtros/ediciones
    setLocalProjects(projects);
    setFilteredProjects(projects);
  }, [projects]);

  const handleDelete = async (projectId: string) => {
    try {
      await projectService.remove(projectId);
      await mutate();
      setFilteredProjects((prev) => (selectedCategory === "Todos" ? projects : projects.filter(p => p.category === selectedCategory)));
      setSuccessMessage("Proyecto eliminado correctamente");
      toast({ title: "Eliminado", description: "Se eliminó el proyecto correctamente." });
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      setErrorMessage("Error eliminando proyecto: " + (error as Error).message);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      try {
        // Resolver categoryId a partir del nombre seleccionado
        const category = categories.find((c: Category) => c.name === editProject.category);
        await projectService.update(editProject.id!, {
          title: editProject.title,
          description: editProject.description,
          categoryId: category ? Number(category.id) : undefined,
          images: (editProject.image || []).map((url: string, idx: number) => ({ url, order: idx })),
        });
        setEditProject(null);
        await mutate();
        setFilteredProjects((prev) => (selectedCategory === "Todos" ? projects : projects.filter(p => p.category === selectedCategory)));
        setSuccessMessage("Proyecto actualizado correctamente");
        toast({ title: "Actualizado", description: "Se guardaron los cambios del proyecto." });
      } catch (error) {
        console.error("Error actualizando proyecto:", error);
        setErrorMessage(
          "Error actualizando proyecto: " + (error as Error).message
        );
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      }
    }
  };
  const handleFilter = (category: string) => {
    setSelectedCategory(category); // Actualizar la categoría seleccionada

    if (category === "Todos") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.category === category
      );
      setFilteredProjects(filtered);
    }
  };
  return (
    <AdminLayout
      title="Proyectos Existentes"
      filter={true}
      categories={categories}
      handleFilter={handleFilter}
      selectedCategory={selectedCategory}
      right={
        <Badge variant="secondary">{filteredProjects.length} proyectos</Badge>
      }>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <ProjectList
          projects={filteredProjects}
          handleEdit={setEditProject}
          handleDelete={handleDelete}
        />
      )}

      <Button
        variant="default"
        size="icon"
        className="fixed bottom-5 right-5 h-12 w-12"
        onClick={() => setIsAddProjectModalOpen(true)}>
        <Plus className="scale-150" />
        <span className="sr-only">Añadir Proyecto</span>
      </Button>
      {isAddProjectModalOpen && (
        <AddProjectModal
          setProjects={setLocalProjects}
          onClose={() => setIsAddProjectModalOpen(false)}
        />
      )}
      {editProject && (
        <EditProjectModal
          editProject={editProject}
          setEditProject={setEditProject}
          handleSave={handleSave}
          projectId={editProject.id!}
          setProjects={setLocalProjects}
          onClose={() => setEditProject(null)}
        />
      )}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </AdminLayout>
  );
}

export default AdminProyectos;
