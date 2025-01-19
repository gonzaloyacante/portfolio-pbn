"use client";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import Category from "../../../models/Category";
import { motion } from "framer-motion";

interface CategoryListProps {
  categories: Category[];
  handleEdit: (category: Category) => void;
  handleDelete: (categoryId: string) => void;
}

export default function CategoryList({
  categories,
  handleEdit,
  handleDelete,
}: CategoryListProps) {
  return (
    <div className="space-y-4 px-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex justify-between items-center ${
            index !== categories.length - 1 ? "border-b pb-4" : ""
          }`}>
          <span>{category.name}</span>
          <Menu menuButton={<MenuButton>⋮</MenuButton>}>
            <MenuItem onClick={() => handleEdit(category)}>Editar</MenuItem>
            <MenuItem onClick={() => handleDelete(category.id!)}>
              Eliminar
            </MenuItem>
          </Menu>
        </motion.div>
      ))}
    </div>
  );
}
