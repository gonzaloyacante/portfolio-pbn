"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import useRoutePreloader from "@/lib/preloadRoutes";
import { useToast } from "@/components/ui/use-toast";
import { fetchJson } from "@/lib/api";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const homeTitle = useAppStore(state => state.title);
  const { toast } = useToast();
  
  // Utilizamos el preloader de rutas para mejorar la velocidad de navegación
  useRoutePreloader();


  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="bg-background border-b h-16">
      <nav className="container mx-auto px-6 flex justify-between items-center h-full">
        {isAdminRoute ? (
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="scale-150" />
                <span className="sr-only">Inicio</span>
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex space-x-6 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="scale-150" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </div>
            <div className="hidden lg:flex space-x-6">
              <Link
                href="/"
                className={`text-foreground hover:text-primary ${
                  pathname === "/" ? "font-bold border-b-2 border-primary" : ""
                }`}>
                Inicio
              </Link>
              <Link
                href="/about-me"
                className={`text-foreground hover:text-primary ${
                  pathname === "/about-me"
                    ? "font-bold border-b-2 border-primary"
                    : ""
                }`}>
                Sobre Mí
              </Link>
              <Link
                href="/contact"
                className={`text-foreground hover:text-primary ${
                  pathname === "/contact"
                    ? "font-bold border-b-2 border-primary"
                    : ""
                }`}>
                Contacto
              </Link>
            </div>
            <span className="text-foreground font-bold lg:hidden">
              {pathname === "/"
                ? homeTitle
                : pathname === "/about-me"
                ? "Sobre Mí"
                : pathname === "/contact"
                ? "Contacto"
                : ""}
            </span>
          </>
        )}
        <div className="flex items-center space-x-4">
          {process.env.NODE_ENV !== "production" && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await fetchJson("/api/dev/import/full", { method: "POST" });
                  toast({ title: "Datos de ejemplo cargados" });
                  // Recargar para que se vean los cambios inmediatamente
                  window.location.reload();
                } catch (e: any) {
                  toast({ title: "Error al cargar demo", description: String(e), variant: "destructive" });
                }
              }}
            >
              Cargar demo
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "light" ? "dark" : "light")
            }>
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-150 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-150" />
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && !isAdminRoute && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center lg:hidden space-y-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8">
              <X className="scale-150" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
            <Link
              href="/"
              className={`text-foreground hover:text-primary text-2xl ${
                pathname === "/" ? "font-bold border-b-2 border-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link
              href="/about-me"
              className={`text-foreground hover:text-primary text-2xl ${
                pathname === "/about-me"
                  ? "font-bold border-b-2 border-primary"
                  : ""
              }`}
              onClick={() => setIsMenuOpen(false)}>
              Sobre Mí
            </Link>
            <Link
              href="/contact"
              className={`text-foreground hover:text-primary text-2xl ${
                pathname === "/contact"
                  ? "font-bold border-b-2 border-primary"
                  : ""
              }`}
              onClick={() => setIsMenuOpen(false)}>
              Contacto
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
