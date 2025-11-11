"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button, Card, Loading, Select } from "@/components/cms/form-components"
import { AnimationSelector } from "@/components/cms/animation-selector"
import { GripVertical, Eye, EyeOff, Settings, Plus } from "lucide-react"

interface PageSection {
  id: string
  pageName: string
  sectionType: string
  title: string
  subtitle?: string
  order: number
  visible: boolean
  config: any
}

export default function LayoutManagerPage() {
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [selectedPage, setSelectedPage] = useState("home")

  useEffect(() => {
    loadSections()
  }, [selectedPage])

  const loadSections = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getPageSections(selectedPage)
      setSections(data.sort((a: PageSection, b: PageSection) => a.order - b.order))
    } catch (error) {
      console.error("Error loading sections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === index) return

    const newSections = [...sections]
    const draggedSection = newSections[draggedItem]
    if (!draggedSection) return
    
    newSections.splice(draggedItem, 1)
    newSections.splice(index, 0, draggedSection)

    // Update orders
    newSections.forEach((section, idx) => {
      section.order = idx
    })

    setSections(newSections)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = sections.map(s => ({ id: s.id, order: s.order }))
      await apiClient.reorderPageSections(updates)
      
      // Save visibility changes
      await Promise.all(
        sections.map(s => apiClient.updatePageSection(s.id, { visible: s.visible }))
      )
      
      alert("✅ Layout guardado exitosamente!")
    } catch (error) {
      alert("❌ Error al guardar layout")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleConfigChange = (id: string, config: any) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, config } : s
    ))
  }

  if (loading) return <Loading text="Cargando layout..." />

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administrador de Páginas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Arrastra para reordenar secciones, configura animaciones y controla visibilidad
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={handleSave} 
          loading={saving}
        >
          Guardar Cambios
        </Button>
      </div>

      {/* Page selector */}
      <Card padding="md">
        <Select
          label="Página"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          options={[
            { value: "home", label: "Inicio" },
            { value: "about", label: "Sobre Mí" },
            { value: "projects", label: "Proyectos" },
            { value: "contact", label: "Contacto" }
          ]}
        />
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`transition-all ${
              draggedItem === index ? "opacity-50" : ""
            }`}
          >
            <Card className="p-6 cursor-move hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Drag handle */}
                <div className="pt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                  <GripVertical size={24} />
                </div>

                {/* Section info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {section.title}
                        <span className="text-xs px-2 py-1 bg-accent rounded-full">
                          {section.sectionType}
                        </span>
                      </h3>
                      {section.subtitle && (
                        <p className="text-sm text-muted mt-1">{section.subtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(section.id)}
                      >
                        {section.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </Button>
                    </div>
                  </div>

                  {/* Animation Selector for ALL sections */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      💫 Animación de Entrada
                    </h4>
                    <AnimationSelector
                      value={section.config?.animation || "fade-in"}
                      onChange={(animation) =>
                        handleConfigChange(section.id, {
                          ...section.config,
                          animation,
                        })
                      }
                    />
                  </div>

                  {/* Section config */}
                  {section.sectionType === "SKILLS" && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Settings size={16} />
                        Configuración de Skills
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Layout</label>
                          <select
                            value={section.config?.layout || "grid"}
                            onChange={(e) =>
                              handleConfigChange(section.id, {
                                ...section.config,
                                layout: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                          >
                            <option value="grid">Cuadrícula</option>
                            <option value="circular">Circular</option>
                            <option value="list">Lista</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Columnas</label>
                          <input
                            type="number"
                            min="2"
                            max="6"
                            value={section.config?.columns || 3}
                            onChange={(e) =>
                              handleConfigChange(section.id, {
                                ...section.config,
                                columns: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Tamaño Iconos</label>
                          <input
                            type="text"
                            value={section.config?.iconSize || "3rem"}
                            onChange={(e) =>
                              handleConfigChange(section.id, {
                                ...section.config,
                                iconSize: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                            placeholder="3rem"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={section.config?.showProgress || false}
                              onChange={(e) =>
                                handleConfigChange(section.id, {
                                  ...section.config,
                                  showProgress: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            Mostrar Progreso
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.sectionType === "PROJECTS" && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Settings size={16} />
                        Configuración de Proyectos
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Columnas</label>
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={section.config?.columns || 3}
                            onChange={(e) =>
                              handleConfigChange(section.id, {
                                ...section.config,
                                columns: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Proyectos por Página</label>
                          <input
                            type="number"
                            min="3"
                            max="12"
                            value={section.config?.perPage || 6}
                            onChange={(e) =>
                              handleConfigChange(section.id, {
                                ...section.config,
                                perPage: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                    <span>Orden: {section.order}</span>
                    <span>Estado: {section.visible ? "✅ Visible" : "❌ Oculto"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Add new section */}
      <Card className="p-6 border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
        <div className="flex items-center justify-center gap-2 text-muted hover:text-foreground">
          <Plus size={20} />
          <span>Agregar Nueva Sección</span>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "💾 Guardar Todo"}
        </Button>
      </div>
    </div>
  )
}
