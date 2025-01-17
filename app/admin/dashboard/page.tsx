import { ProyectosAdmin } from "@/components/admin/ProyectosAdmin";
import { ContactosAdmin } from "@/components/admin/ContactosAdmin";
import { CategoriasAdmin } from "@/components/admin/CategoriasAdmin";
import { SobreMiAdmin } from "@/components/admin/SobreMiAdmin";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Proyectos</h2>
          <ProyectosAdmin />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Contactos</h2>
          <ContactosAdmin />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Categorías</h2>
          <CategoriasAdmin />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Sobre Mí</h2>
          <SobreMiAdmin />
        </div>
      </div>
    </div>
  );
}
