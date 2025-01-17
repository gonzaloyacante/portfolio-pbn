import { CategoriasAdmin } from "@/components/admin/CategoriasAdmin";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AdminCategorias() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestionar Categorías</h1>
        <Link href="/" className="text-blue-500">
          <Home className="h-6 w-6" />
        </Link>
      </header>
      <CategoriasAdmin />
    </div>
  );
}
