"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, Trash2, MoreVertical } from "lucide-react";

interface EditMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function EditMenu({ onEdit, onDelete }: EditMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-3 rounded-full hover:bg-muted transition-colors">
          <MoreVertical className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onEdit} className="py-3 cursor-pointer">
          <Edit3 className="mr-3 h-5 w-5" />
          <span className="text-base">Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="py-3 cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="mr-3 h-5 w-5" />
          <span className="text-base">Eliminar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
