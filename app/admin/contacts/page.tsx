import { ContactosAdmin } from "@/components/admin/ContactosAdmin";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AdminContactos() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestionar Contactos</h1>
        <Link href="/">
          <a className="text-blue-500">
            <Home className="h-6 w-6" />
          </a>
        </Link>
      </header>
      <ContactosAdmin />
    </div>
  );
}
