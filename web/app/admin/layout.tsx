"use client";

import { PropsWithChildren } from "react";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  // No proteger las rutas públicas de auth bajo /admin/auth/*
  if (pathname?.startsWith("/admin/auth")) {
    return <>{children}</>;
  }
  const { user, loading } = useSession({ redirectTo: "/admin/auth/login" });

  if (loading) return null; // La propia app general ya tiene Loader en transiciones
  if (!user) return null; // useSession redirige si no hay sesión

  // Guardia de rol: solo ADMIN
  if ((user as any).role && (user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full border rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold mb-2">Acceso denegado</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Tu cuenta no tiene permisos para acceder al panel de administración.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try { await logout(); } finally { window.location.replace("/admin/auth/login"); }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Panel Admin</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await logout();
                  window.location.replace("/admin/auth/login");
                } catch {
                  window.location.replace("/admin/auth/login");
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
