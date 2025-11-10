"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Project from "../../../models/Project";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/WarningModal";
import { Trash2, Edit3, AlertCircle } from "lucide-react";
import EditMenu from "@/components/EditMenu";
import Image from "next/image";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const openModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProjectId(null);
  };

  const confirmDelete = () => {
    if (selectedProjectId) {
      handleDelete(selectedProjectId);
      closeModal();
    }
  };

  return (
    <div className="space-y-4 px-4 pb-20">
      {projects.length === 0 ? (
        <NoData message="No hay proyectos disponibles" />
      ) : (
        projects.map((project: Project, index: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex justify-between items-center ${
              index !== projects.length - 1 ? "border-b pb-4" : ""
            }`}>
            <div className="flex items-center space-x-4">
              {project.image.length > 0 ? (
                <Image
                  src={project.image[0]}
                  alt={project.title}
                  width={20}
                  height={20}
                  sizes="(max-width: 20px) 100vw"
                  className="h-20 w-20 object-cover rounded-md"
                  priority
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "";
                  }}
                />
              ) : (
                <div className="flex justify-center items-center w-20 h-20 bg-card rounded-md">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
              )}
              <span>
                {project.title} - {project.category}
              </span>
            </div>
            <EditMenu
              onEdit={() => handleEdit(project)}
              onDelete={() => openModal(project.id!)}
            />
          </motion.div>
        ))
      )}
      {isModalOpen && (
        <WarningModal
          message="¿Estás seguro de que deseas eliminar este proyecto?"
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
