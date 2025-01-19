"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from "../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Project from "../../../models/Project";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AddProjectModal from "./AddProjectModal";
import ProjectList from "./ProjectList";
import EditProjectModal from "./EditProjectModal";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export default function AdminProyectos() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      console.log("Project IDs:", projectsList);
      setProjects(projectsList);
      setFilteredProjects(projectsList);
    };

    const fetchCategories = async () => {
      const docRef = doc(db, "categories", "categories");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCategories(docSnap.data().name);
      } else {
        console.log("No such document!");
      }
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const handleDelete = async (projectId: string) => {
    console.log("Deleting project with ID:", projectId);
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
    <div className="space-y-6 h-full">
      <header className="flex justify-between items-center space-x-4 w-full">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-20 w-20" />
            <span className="sr-only">Volver</span>
          </Button>
          <h2 className="text-xl font-bold">Proyectos Existentes</h2>
        </div>
        <Menu
          menuButton={
            <MenuButton>
              <Filter className="h-6 w-6" />
            </MenuButton>
          }>
          <MenuItem onClick={() => handleFilter("Todos")}>Todos</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} onClick={() => handleFilter(category)}>
              {category}
            </MenuItem>
          ))}
        </Menu>
      </header>
      <ProjectList
        projects={filteredProjects}
        handleEdit={setEditProject}
        handleDelete={handleDelete}
      />
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4"
        onClick={() => setIsAddProjectModalOpen(true)}>
        <Plus className="h-6 w-6" />
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
    </div>
  );
}
