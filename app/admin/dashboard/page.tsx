"use client";

import withAuth from "@/components/withAuth";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MessagesSquare,
  Tag,
  Presentation,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "../../../lib/firebaseClient";
import { useEffect, useState } from "react";
import WarningModal from "@/components/WarningModal";

function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    }
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userUID");
      localStorage.removeItem("userEmail");
    }
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
  ];

  return (
    <div className="space-y-6 relative flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">
        Panel de Administración
      </h1>
      <p className="text-center">{userEmail}</p>
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
        className="h-12 w-48 flex items-center justify-center font-bold fixed bottom-8 left-1/2 transform -translate-x-1/2"
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
  );
}

export default withAuth(AdminDashboard);
