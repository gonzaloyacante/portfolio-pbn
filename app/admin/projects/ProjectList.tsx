"use client";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import Project from "../../../models/Project";
import { motion } from "framer-motion";

interface ProjectListProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  handleDelete: (projectId: string) => void;
}

export default function ProjectList({
  projects,
  handleEdit,
  handleDelete,
}: ProjectListProps) {
  return (
    <div className="space-y-4 px-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex justify-between items-center ${
            index !== projects.length - 1 ? "border-b pb-4" : ""
          }`}>
          <span>
            {project.title} - {project.category}
          </span>
          <Menu menuButton={<MenuButton>⋮</MenuButton>}>
            <MenuItem onClick={() => handleEdit(project)}>Editar</MenuItem>
            <MenuItem onClick={() => handleDelete(project.id!)}>
              Eliminar
            </MenuItem>
          </Menu>
        </motion.div>
      ))}
    </div>
  );
}
