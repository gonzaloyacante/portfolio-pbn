import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, SlidersHorizontal } from "lucide-react";

interface EditMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ onEdit, onDelete }) => {
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
      <Button variant="ghost" size="icon" onClick={toggleDropdown}>
        <SlidersHorizontal />
      </Button>
      <AnimatePresence>
        {isDropdownActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute end-0 z-10 mt-2 w-34 divide-y rounded-lg border-2 bg-background shadow-lg"
            role="menu">
            <div>
              <a
                href="#"
                className="flex justify-between items-center gap-2 rounded-lg px-4 py-2 text-foreground hover:bg-card dark:hover:bg-primary/20"
                role="menuitem"
                onClick={() => {
                  onEdit();
                  closeDropdown();
                }}>
                Editar
                <Edit3 className="h-4 w-4" />
              </a>
            </div>
            <div>
              <a
                href="#"
                className="flex justify-between items-center gap-2 rounded-lg px-4 py-2 text-primary hover:bg-card dark:hover:bg-primary/20"
                role="menuitem"
                onClick={() => {
                  onDelete();
                  closeDropdown();
                }}>
                Eliminar
                <Trash2 className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditMenu;
