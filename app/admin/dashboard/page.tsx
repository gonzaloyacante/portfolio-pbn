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

function AdminDashboard() {
  const router = useRouter();
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userUID");
    localStorage.removeItem("userEmail");
    router.push("/admin/auth/login");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Panel de Administración
      </h1>
      <p className="text-center">{userEmail}</p>
      <div className="grid grid-cols-2 gap-6 items-center justify-center px-4 justify-items-center">
        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/projects")}>
          <Briefcase size={64} className="scale-150" />
          <span>Proyectos</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/contacts")}>
          <MessagesSquare size={64} className="scale-150" />
          <span>Contactos</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/categories")}>
          <Tag size={64} className="scale-150" />
          <span>Categorías</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/about-me")}>
          <Presentation size={64} className="scale-150" />
          <span>Sobre Mí</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/settings")}>
          <Settings size={64} className="scale-150" />
          <span>Configuración</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => router.push("/admin/account")}>
          <UserCog size={64} className="scale-150" />
          <span>Cuenta</span>
        </Button>
      </div>
      <div className="fixed bottom-4 w-full flex justify-center">
        <Button
          variant="outline"
          className="h-12 w-48 flex items-center justify-center font-bold"
          onClick={handleLogout}>
          <LogOut size={24} className="mr-2" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard);
