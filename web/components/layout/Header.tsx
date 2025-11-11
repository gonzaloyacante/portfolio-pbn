"use client"

import { Moon, Sun, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import NavLink from "@/components/utils/nav-link"
import { NAVIGATION_ITEMS } from "@/lib/constants"

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate("home")}
            className="script-font text-2xl md:text-3xl text-primary hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
            aria-label="Ir a inicio"
          >
            PBN
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-8 flex-wrap justify-center flex-1 mx-8">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                label={item.label}
                isActive={currentPage === item.id}
                onClick={() => handleNavigate(item.id)}
              />
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-card/30 rounded-lg transition-colors duration-200"
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              ) : (
                <Moon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-card/30 rounded-lg transition-colors duration-200"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pt-3 mt-3 border-t border-border animate-slide-down">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                label={item.label}
                isActive={currentPage === item.id}
                onClick={() => handleNavigate(item.id)}
                mobile
              />
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
