"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import ProjectsGrid from "@/components/projects-grid"
import ContactSection from "@/components/contact-section"
import { apiClient } from "@/lib/api-client"

interface PageSection {
  id: string
  sectionType: string
  visible: boolean
  order: number
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPageSections() {
      try {
        const data = await apiClient.getPageSections(currentPage)
        setSections(
          data
            .filter((s: PageSection) => s.visible)
            .sort((a: PageSection, b: PageSection) => a.order - b.order)
        )
      } catch (error) {
        console.error("Error loading sections:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPageSections()
  }, [currentPage])

  const renderSection = (section: PageSection) => {
    switch (section.sectionType) {
      case "HERO":
        return <Hero key={section.id} onNavigate={setCurrentPage} />
      case "ABOUT":
        return <AboutSection key={section.id} onNavigate={setCurrentPage} />
      case "SKILLS":
        return <SkillsSection key={section.id} />
      case "PROJECTS":
        return (
          <ProjectsGrid
            key={section.id}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        )
      case "CONTACT":
        return <ContactSection key={section.id} onNavigate={setCurrentPage} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {sections.map((section) => renderSection(section))}
    </main>
  )
}
