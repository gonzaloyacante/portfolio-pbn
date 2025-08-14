"use client";

import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from "../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
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

function AdminProyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Establecer loading en true al inicio de la carga
      try {
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Project)
        );
        setProjects(projectsList);
        setFilteredProjects(projectsList);
      } catch (error) {
        console.error("Error al cargar los proyectos:", error);
        setErrorMessage(
          "Error al cargar los proyectos: " + (error as Error).message
        );
      } finally {
        setLoading(false); // Establecer loading en false cuando termine la carga
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Category)
        );
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const handleDelete = async (projectId: string) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await deleteDoc(projectRef);
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectsList);
      setFilteredProjects(projectsList);
      setSuccessMessage("Proyecto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      setErrorMessage("Error eliminando proyecto: " + (error as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      try {
        const projectRef = doc(db, "projects", editProject.id!);
        await updateDoc(projectRef, { ...editProject });
        setEditProject(null);
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Project)
        );
        setProjects(projectsList);
        setFilteredProjects(projectsList);
        setSuccessMessage("Proyecto actualizado correctamente");
      } catch (error) {
        console.error("Error actualizando proyecto:", error);
        setErrorMessage(
          "Error actualizando proyecto: " + (error as Error).message
        );
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
      selectedCategory={selectedCategory}>
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
          setProjects={setProjects}
          onClose={() => setIsAddProjectModalOpen(false)}
        />
      )}
      {editProject && (
        <EditProjectModal
          editProject={editProject}
          setEditProject={setEditProject}
          handleSave={handleSave}
          projectId={editProject.id!}
          setProjects={setProjects}
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

export default withAuth(AdminProyectos);
