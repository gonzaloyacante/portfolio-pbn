import { useState, useEffect, useRef } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Category from "../../../models/Category";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface FilterDropdownProps {
  categories: Category[];
  handleFilter: (category: string) => void;
  selectedCategory?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  categories,
  handleFilter,
  selectedCategory = "Todos",
}) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const closeDropdown = () => {
    setIsDropdownActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {selectedCategory !== "Todos" && (
          <Badge variant="outline" className="bg-primary/10">
            {selectedCategory}
          </Badge>
        )}
        <Button variant="ghost" size="icon" onClick={toggleDropdown}>
          <Filter className="h-20 w-20 scale-150" />
          <span className="sr-only">Filtrar proyectos</span>
        </Button>
      </div>
      <AnimatePresence>
        {isDropdownActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute end-0 z-10 mt-2 w-56 divide-y rounded-lg border-2 bg-background shadow-lg"
            role="menu">
            <div className="p-2">
              <strong className="block p-2 text-xs font-medium uppercase">
                Categorías
              </strong>
              {categories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block rounded-lg px-4 py-2 text-sm hover:bg-card dark:hover:bg-primary/20 ${
                    selectedCategory === category.name
                      ? "bg-primary/20 font-medium"
                      : ""
                  }`}
                  role="menuitem"
                  onClick={() => {
                    handleFilter(category.name);
                    closeDropdown();
                  }}>
                  {category.name}
                </a>
              ))}
            </div>
            <div className="p-2">
              <a
                href="#"
                className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 hover:bg-card dark:hover:bg-primary/20 ${
                  selectedCategory === "Todos"
                    ? "bg-primary/20 font-medium"
                    : ""
                }`}
                role="menuitem"
                onClick={() => {
                  handleFilter("Todos");
                  closeDropdown();
                }}>
                Todas
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
