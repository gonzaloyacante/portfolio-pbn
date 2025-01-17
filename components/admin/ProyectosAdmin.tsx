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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/firebaseClient"; // Importa db desde firebaseClient.js
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Project from "../../models/Project"; // Importa el modelo Project
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export function ProyectosAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    id: "",
    title: "",
    description: "",
    category: "",
    image: [],
    process: [],
  });
  const [editProject, setEditProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectsList);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectsCollection = collection(db, "projects");
      await addDoc(projectsCollection, newProject);
      setNewProject({
        id: "",
        title: "",
        description: "",
        category: "",
        image: [],
        process: [],
      });
      // Refresh the list of projects
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectsList);
    } catch (error) {
      console.error("Error añadiendo proyecto:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditProject(project);
  };

  const handleDelete = async (projectId: string) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await deleteDoc(projectRef);
      // Refresh the list of projects
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectsList);
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
    }
  };

  const handleSave = async () => {
    if (editProject) {
      try {
        const projectRef = doc(db, "projects", editProject.id!);
        await updateDoc(projectRef, { ...editProject });
        setEditProject(null);
        // Refresh the list of projects
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Project)
        );
        setProjects(projectsList);
      } catch (error) {
        console.error("Error actualizando proyecto:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título del Proyecto"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <Select
              onValueChange={(value) =>
                setNewProject({ ...newProject, category: value })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
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
            />
            <Textarea
              placeholder="Proceso (separado por comas)"
              value={newProject.process.join(", ")}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  process: e.target.value.split(",").map((step) => step.trim()),
                })
              }
            />
            <Button type="submit">Añadir Proyecto</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center">
                <span>
                  {project.title} - {project.category}
                </span>
                <Menu menuButton={<MenuButton>⋮</MenuButton>}>
                  <MenuItem onClick={() => handleEdit(project)}>
                    Editar
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(project.id!)}>
                    Eliminar
                  </MenuItem>
                </Menu>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {editProject && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Título del Proyecto"
              value={editProject.title}
              onChange={(e) =>
                setEditProject({ ...editProject, title: e.target.value })
              }
            />
            <Select
              onValueChange={(value) =>
                setEditProject({ ...editProject, category: value })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
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
            />
            <Button onClick={handleSave}>Guardar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
