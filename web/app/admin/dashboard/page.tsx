"use client";

import { useRouter } from "next/navigation";
import {
  Briefcase,
  MessagesSquare,
  Tag,
  Presentation,
  Settings,
  LogOut,
  UserCog,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WarningModal from "@/components/WarningModal";
import { logout } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import { useSession } from "@/lib/session";

function AdminDashboard() {
  const router = useRouter();
  const { user } = useSession();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/auth/login");
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const buttons = [
    { label: "Proyectos", icon: Briefcase, path: "/admin/projects" },
    { label: "Contactos", icon: MessagesSquare, path: "/admin/contacts" },
    { label: "Categorías", icon: Tag, path: "/admin/categories" },
    { label: "Sobre Mí", icon: Presentation, path: "/admin/about-me" },
    { label: "Configuración", icon: Settings, path: "/admin/settings" },
    { label: "Cuenta", icon: UserCog, path: "/admin/account" },
    { label: "Imágenes", icon: ImageIcon, path: "/admin/gallery" },
  ];

  return (
    <AdminLayout title="Panel de Administración">
    <div className="space-y-6 relative flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">
        Panel de Administración
      </h1>
      <p className="text-center">{user?.email}</p>
      <div className="w-full max-w-2xl grid grid-cols-2 gap-6 items-center justify-center px-4 justify-items-center">
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-24 w-full flex flex-col items-center justify-center font-bold p-4 space-y-1"
            onClick={() => router.push(button.path)}>
            <button.icon size={64} className="scale-150" />
            <span>{button.label}</span>
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        className="h-12 w-48 flex items-center justify-center font-bold"
        onClick={openLogoutModal}>
        <span>Cerrar Sesión</span>
        <LogOut size={24} />
      </Button>
      {isLogoutModalOpen && (
        <WarningModal
          message="¿Estás seguro de que deseas cerrar sesión?"
          onClose={closeLogoutModal}
          onConfirm={handleLogout}
        />
      )}
    </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
