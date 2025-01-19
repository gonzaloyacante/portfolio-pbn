"use client";

import { useRouter } from "next/navigation";
import { Briefcase, Users, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Panel de Administración
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-6 items-center justify-center p-4 justify-items-center">
        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4 border-white"
          onClick={() => router.push("/admin/projects")}>
          <Briefcase size={64} />
          <span>Proyectos</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4 border-white"
          onClick={() => router.push("/admin/contacts")}>
          <Users size={64} />
          <span>Contactos</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4 border-white"
          onClick={() => router.push("/admin/categories")}>
          <Tag size={64} />
          <span>Categorías</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4 border-white"
          onClick={() => router.push("/admin/about-me")}>
          <User size={64} />
          <span>Sobre Mí</span>
        </Button>
      </div>
    </div>
  );
}
