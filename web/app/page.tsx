"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import ProjectsGrid from "@/components/projects-grid"
import ContactSection from "@/components/contact-section"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutSection onNavigate={setCurrentPage} />
      case "projects":
        return (
          <ProjectsGrid
            onNavigate={setCurrentPage}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        )
      case "contact":
        return <ContactSection onNavigate={setCurrentPage} />
      default:
        return <Hero onNavigate={setCurrentPage} />
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </main>
  )
}
