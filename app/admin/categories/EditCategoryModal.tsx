"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Category from "../../../models/Category";

interface EditCategoryModalProps {
  editCategory: Category;
  setEditCategory: (category: Category | null) => void;
  handleSave: (e: React.FormEvent) => void;
}

export default function EditCategoryModal({
  editCategory,
  setEditCategory,
  handleSave,
}: EditCategoryModalProps) {
  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Categoría
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditCategory(null)}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Cerrar modal</span>
            </Button>
          </div>
          <form onSubmit={handleSave} className="p-4 md:p-5 space-y-4">
            <Input
              placeholder="Nombre de la Categoría"
              value={editCategory.name}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: e.target.value })
              }
              className="bg-background"
            />
            <Button type="submit">Guardar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
