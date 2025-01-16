"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex justify-between items-center">
          <div className="flex space-x-6">
            <li>
              <Link
                href="/"
                className={`text-foreground hover:text-primary ${
                  pathname === "/" ? "font-bold" : ""
                }`}>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/about-me"
                className={`text-foreground hover:text-primary ${
                  pathname === "/about-me" ? "font-bold" : ""
                }`}>
                Sobre Mí
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`text-foreground hover:text-primary ${
                  pathname === "/contact" ? "font-bold" : ""
                }`}>
                Contacto
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={`text-foreground hover:text-primary ${
                  pathname === "/admin" ? "font-bold" : ""
                }`}>
                Admin
              </Link>
            </li>
          </div>
          <li>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "light" ? "dark" : "light")
              }>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
