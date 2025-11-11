"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button, Card, Loading } from "@/components/cms/form-components"
import { ColorPicker } from "@/components/cms/color-picker"
import { FontSelector } from "@/components/cms/font-selector"
import { AnimationSelector } from "@/components/cms/animation-selector"
import { SpacingSelector, ShadowSelector, BorderRadiusSelector } from "@/components/cms/visual-selectors"
import LivePreview from "@/components/cms/live-preview"
import { Save, Eye, RotateCcw } from "lucide-react"

interface DesignSettings {
  // Colores
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  // Tipografía
  headingFont: string
  bodyFont: string
  headingSize: string
  bodySize: string
  lineHeight: string
  // Layout
  containerMaxWidth: string
  sectionPadding: string
  elementSpacing: string
  borderRadius: string
  // Efectos
  boxShadow: string
  hoverTransform: string
  transitionSpeed: string
}

const DEFAULT_SETTINGS: DesignSettings = {
  primaryColor: "#E11D48",
  secondaryColor: "#EC4899",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  accentColor: "#F9FAFB",
  headingFont: "Playfair Display, serif",
  bodyFont: "Inter, sans-serif",
  headingSize: "3rem",
  bodySize: "1rem",
  lineHeight: "1.6",
  containerMaxWidth: "1200px",
  sectionPadding: "4rem 2rem",
  elementSpacing: "2rem",
  borderRadius: "0.75rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  hoverTransform: "translateY(-4px)",
  transitionSpeed: "0.3s",
}

export default function DesignSettingsPage() {
  const [settings, setSettings] = useState<DesignSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "layout" | "effects" | "animations">("colors")
  const [showPreview, setShowPreview] = useState(false)
  const [defaultAnimation, setDefaultAnimation] = useState("fade-in")

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await apiClient.getDesignSettings()
      setSettings({ ...DEFAULT_SETTINGS, ...data })
    } catch (error) {
      console.error("Error loading design settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await apiClient.updateDesignSettings(settings)
      alert("✅ Cambios guardados como borrador")
    } catch (error) {
      alert("❌ Error al guardar")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!confirm("¿Publicar cambios a la web pública? Los usuarios verán estos cambios inmediatamente.")) {
      return
    }
    
    setSaving(true)
    try {
      const response = await fetch('/api/design-settings/publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) throw new Error('Error publicando')
      
      alert("✅ Diseño publicado exitosamente")
      await loadSettings()
    } catch (error) {
      alert("❌ Error al publicar el diseño")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    if (confirm("¿Seguro que quieres restaurar los valores por defecto?")) {
      setSettings(DEFAULT_SETTINGS)
    }
  }

  const tabs = [
    { id: "colors", label: "🎨 Colores", description: "Paleta de colores del sitio" },
    { id: "typography", label: "🔤 Tipografía", description: "Fuentes y tamaños" },
    { id: "animations", label: "💫 Animaciones", description: "Efectos de entrada" },
    { id: "layout", label: "📐 Diseño", description: "Espaciado y estructura" },
    { id: "effects", label: "✨ Efectos", description: "Sombras y transiciones" },
  ]

  if (loading) return <Loading text="Cargando configuración de diseño..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Diseño Visual</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Personaliza colores, fuentes y estilos de tu portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={RotateCcw}
            onClick={handleReset}
          >
            Restaurar
          </Button>
          <Button
            variant="outline"
            icon={Eye}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Ocultar" : "Vista Previa"}
          </Button>
          <Button
            variant="secondary"
            icon={Save}
            onClick={handleSave}
            loading={saving}
          >
            Guardar Borrador
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            loading={saving}
          >
            🚀 Publicar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            )}
          >
            <div>{tab.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{tab.description}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* COLORES */}
          {activeTab === "colors" && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Paleta de Colores</h2>
              <div className="space-y-6">
                <ColorPicker
                  label="Color Principal"
                  value={settings.primaryColor}
                  onChange={(v) => setSettings({ ...settings, primaryColor: v })}
                />
                <ColorPicker
                  label="Color Secundario"
                  value={settings.secondaryColor}
                  onChange={(v) => setSettings({ ...settings, secondaryColor: v })}
                />
                <ColorPicker
                  label="Color de Fondo"
                  value={settings.backgroundColor}
                  onChange={(v) => setSettings({ ...settings, backgroundColor: v })}
                />
                <ColorPicker
                  label="Color de Texto"
                  value={settings.textColor}
                  onChange={(v) => setSettings({ ...settings, textColor: v })}
                />
                <ColorPicker
                  label="Color de Acento"
                  value={settings.accentColor}
                  onChange={(v) => setSettings({ ...settings, accentColor: v })}
                  showPalettes={false}
                />
              </div>
            </Card>
          )}

          {/* TIPOGRAFÍA */}
          {activeTab === "typography" && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tipografía</h2>
              <div className="space-y-6">
                <FontSelector
                  label="Fuente para Títulos"
                  type="heading"
                  value={settings.headingFont}
                  onChange={(v) => setSettings({ ...settings, headingFont: v })}
                />
                <FontSelector
                  label="Fuente para Textos"
                  type="body"
                  value={settings.bodyFont}
                  onChange={(v) => setSettings({ ...settings, bodyFont: v })}
                />
                <div className="space-y-6 pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      📏 Tamaño de Títulos
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["2rem", "2.5rem", "3rem", "3.5rem", "4rem", "4.5rem", "5rem", "6rem"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSettings({ ...settings, headingSize: size })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.headingSize === size
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div style={{ fontSize: `${parseFloat(size) / 3}rem` }} className="font-bold text-gray-900 dark:text-white">Aa</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{size}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      📝 Tamaño de Texto
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["0.875rem", "1rem", "1.125rem", "1.25rem"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSettings({ ...settings, bodySize: size })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.bodySize === size
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div style={{ fontSize: size }} className="text-gray-900 dark:text-white">Texto</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{size}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      📐 Espacio entre Líneas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["1.2", "1.4", "1.6", "1.8", "2.0"].map((height) => (
                        <button
                          key={height}
                          type="button"
                          onClick={() => setSettings({ ...settings, lineHeight: height })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.lineHeight === height
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div style={{ lineHeight: height }} className="text-xs text-gray-900 dark:text-white">
                            Línea 1<br/>Línea 2
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{height}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ANIMACIONES */}
          {activeTab === "animations" && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Animaciones de Entrada</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Elige las animaciones que se aplicarán a las secciones de tu portfolio. 
                Haz clic en el botón play para ver cómo se verá cada animación.
              </p>
              <AnimationSelector
                value={defaultAnimation}
                onChange={(animation) => {
                  setDefaultAnimation(animation)
                  // Aquí se aplicaría a las secciones por defecto
                }}
              />
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> También puedes configurar animaciones específicas para cada sección 
                  en el administrador de páginas.
                </p>
              </div>
            </Card>
          )}

          {/* LAYOUT */}
          {activeTab === "layout" && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Diseño y Espaciado</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Configura los espacios y tamaños de tu portfolio de forma visual
              </p>
              <div className="space-y-8">
                <SpacingSelector
                  label="Espaciado entre Elementos"
                  type="gap"
                  value={settings.elementSpacing || "2rem"}
                  onChange={(v) => setSettings({ ...settings, elementSpacing: v })}
                />
                
                <SpacingSelector
                  label="Espaciado Interno de Secciones"
                  type="padding"
                  value={((settings.sectionPadding || "4rem 2rem").split(' ')[0]) || "4rem"}
                  onChange={(v) => setSettings({ ...settings, sectionPadding: `${v} 2rem` })}
                />

                <BorderRadiusSelector
                  label="Redondeo de Bordes"
                  value={settings.borderRadius}
                  onChange={(v) => setSettings({ ...settings, borderRadius: v })}
                />
              </div>
            </Card>
          )}

          {/* EFECTOS */}
          {activeTab === "effects" && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Efectos Visuales</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Agrega profundidad y movimiento a tu portfolio
              </p>
              <div className="space-y-8">
                <ShadowSelector
                  label="Sombra de Tarjetas y Elementos"
                  value={settings.boxShadow}
                  onChange={(v) => setSettings({ ...settings, boxShadow: v })}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Vista Previa en Vivo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ve los cambios en tiempo real en tu sitio web
              </p>
              <div className="h-[600px]">
                <LivePreview 
                  url="/" 
                  designSettings={settings}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
