"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/button"
import Card from "@/components/card"

export default function DesignSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await apiClient.getDesignSettings()
      setSettings(data)
    } catch (error) {
      console.error("Error loading design settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      await apiClient.updateDesignSettings(settings)
      alert("✅ Configuración de diseño guardada!")
    } catch (error) {
      alert("❌ Error al guardar configuración")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Diseño</h1>
          <p className="text-muted mt-2">
            Personaliza completamente el look & feel de tu portfolio
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      {/* Colores */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">🎨 Paleta de Colores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Color Primario</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="h-10 w-20 rounded border"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color Secundario</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="h-10 w-20 rounded border"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fondo</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleChange("backgroundColor", e.target.value)}
                className="h-10 w-20 rounded border"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => handleChange("backgroundColor", e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color de Texto</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="h-10 w-20 rounded border"
              />
              <input
                type="text"
                value={settings.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color de Acento</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="h-10 w-20 rounded border"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tipografía */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">🔤 Tipografía</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fuente Títulos</label>
            <input
              type="text"
              value={settings.headingFont}
              onChange={(e) => handleChange("headingFont", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Parisienne, serif"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fuente Cuerpo</label>
            <input
              type="text"
              value={settings.bodyFont}
              onChange={(e) => handleChange("bodyFont", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Inter, sans-serif"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tamaño Títulos (H1)</label>
            <input
              type="text"
              value={settings.headingSize}
              onChange={(e) => handleChange("headingSize", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="4rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tamaño Texto</label>
            <input
              type="text"
              value={settings.bodySize}
              onChange={(e) => handleChange("bodySize", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="1rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Altura de Línea</label>
            <input
              type="text"
              value={settings.lineHeight}
              onChange={(e) => handleChange("lineHeight", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="1.6"
            />
          </div>
        </div>
      </Card>

      {/* Espaciados */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📐 Espaciados y Layout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ancho Máximo Contenedor</label>
            <input
              type="text"
              value={settings.containerMaxWidth}
              onChange={(e) => handleChange("containerMaxWidth", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="1200px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Padding Secciones</label>
            <input
              type="text"
              value={settings.sectionPadding}
              onChange={(e) => handleChange("sectionPadding", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="4rem 2rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Espaciado Elementos</label>
            <input
              type="text"
              value={settings.elementSpacing}
              onChange={(e) => handleChange("elementSpacing", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="2rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Radio Bordes</label>
            <input
              type="text"
              value={settings.borderRadius}
              onChange={(e) => handleChange("borderRadius", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="0.5rem"
            />
          </div>
        </div>
      </Card>

      {/* Efectos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">✨ Efectos y Animaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sombra de Caja</label>
            <input
              type="text"
              value={settings.boxShadow}
              onChange={(e) => handleChange("boxShadow", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="0 4px 6px rgba(0,0,0,0.1)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transform Hover</label>
            <input
              type="text"
              value={settings.hoverTransform}
              onChange={(e) => handleChange("hoverTransform", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="translateY(-4px)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Velocidad Transiciones</label>
            <input
              type="text"
              value={settings.transitionSpeed}
              onChange={(e) => handleChange("transitionSpeed", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="0.3s"
            />
          </div>
        </div>
      </Card>

      {/* Vista previa */}
      <Card className="p-6 bg-gradient-to-br from-card to-accent/10">
        <h2 className="text-xl font-semibold mb-4">👁️ Vista Previa</h2>
        <div 
          className="p-6 rounded-lg"
          style={{
            backgroundColor: settings.backgroundColor,
            color: settings.textColor,
            borderRadius: settings.borderRadius,
            boxShadow: settings.boxShadow,
          }}
        >
          <h1 
            style={{ 
              fontFamily: settings.headingFont,
              fontSize: '2rem',
              color: settings.primaryColor,
              marginBottom: '1rem'
            }}
          >
            Título de Ejemplo
          </h1>
          <p style={{ fontFamily: settings.bodyFont, lineHeight: settings.lineHeight }}>
            Este es un párrafo de texto de ejemplo para ver cómo se verá tu diseño. 
            Los cambios se aplicarán en toda la web cuando guardes.
          </p>
          <button
            style={{
              backgroundColor: settings.primaryColor,
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: settings.borderRadius,
              marginTop: '1rem',
              transition: `all ${settings.transitionSpeed}`,
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = settings.hoverTransform}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            Botón de Ejemplo
          </button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "💾 Guardar Todos los Cambios"}
        </Button>
      </div>
    </div>
  )
}
