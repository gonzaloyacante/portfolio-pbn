"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/button"
import Card from "@/components/card"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"

interface ContentBlock {
  id: string
  slug: string
  name: string
  type: string
  content: any
  order: number
  visible: boolean
}

export default function ContentBlocksPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getContentBlocks()
      setBlocks(data.sort((a: ContentBlock, b: ContentBlock) => a.order - b.order))
    } catch (error) {
      console.error("Error loading blocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBlock({
      id: "",
      slug: "",
      name: "",
      type: "TEXT",
      content: {},
      order: blocks.length,
      visible: true,
    })
    setShowModal(true)
  }

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock({ ...block })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!editingBlock) return

    try {
      if (editingBlock.id) {
        await apiClient.updateContentBlock(editingBlock.id, editingBlock)
      } else {
        await apiClient.createContentBlock(editingBlock)
      }
      await loadBlocks()
      setShowModal(false)
      setEditingBlock(null)
      alert("✅ Bloque guardado!")
    } catch (error) {
      alert("❌ Error al guardar bloque")
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este bloque de contenido?")) return

    try {
      await apiClient.deleteContentBlock(id)
      await loadBlocks()
      alert("✅ Bloque eliminado")
    } catch (error) {
      alert("❌ Error al eliminar")
      console.error(error)
    }
  }

  const toggleVisibility = async (block: ContentBlock) => {
    try {
      await apiClient.updateContentBlock(block.id, { visible: !block.visible })
      await loadBlocks()
    } catch (error) {
      console.error(error)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TEXT: "bg-blue-500",
      IMAGE: "bg-green-500",
      CTA: "bg-purple-500",
      STATS: "bg-orange-500",
      TESTIMONIAL: "bg-pink-500",
      CUSTOM_HTML: "bg-gray-500",
    }
    return colors[type] || "bg-gray-400"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Cargando bloques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Blocks</h1>
          <p className="text-muted mt-2">
            Gestiona bloques de contenido reutilizables para tu portfolio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={18} className="mr-2" />
          Nuevo Bloque
        </Button>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <Card key={block.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(block.type)}`}>
                      {block.type}
                    </span>
                    {!block.visible && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{block.name}</h3>
                  <p className="text-sm text-muted">/{block.slug}</p>
                </div>
                <button
                  onClick={() => toggleVisibility(block)}
                  className="p-1 hover:bg-accent rounded"
                >
                  {block.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="text-sm text-muted-foreground bg-accent/10 rounded p-2 max-h-24 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(block.content, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(block)}
                  className="flex-1"
                >
                  <Edit size={14} className="mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(block.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted mb-4">No hay bloques de contenido</p>
          <Button onClick={handleCreate}>
            <Plus size={18} className="mr-2" />
            Crear Primer Bloque
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && editingBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingBlock.id ? "Editar Bloque" : "Nuevo Bloque"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={editingBlock.name}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Hero Background Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug (único)</label>
                <input
                  type="text"
                  value={editingBlock.slug}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="hero-bg-image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={editingBlock.type}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="TEXT">Texto</option>
                  <option value="IMAGE">Imagen</option>
                  <option value="CTA">Call to Action</option>
                  <option value="STATS">Estadísticas</option>
                  <option value="TESTIMONIAL">Testimonio</option>
                  <option value="CUSTOM_HTML">HTML Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenido (JSON)</label>
                <textarea
                  value={JSON.stringify(editingBlock.content, null, 2)}
                  onChange={(e) => {
                    try {
                      setEditingBlock({
                        ...editingBlock,
                        content: JSON.parse(e.target.value),
                      })
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-background font-mono text-sm"
                  rows={10}
                  placeholder='{"text": "...", "url": "..."}'
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Orden</label>
                <input
                  type="number"
                  value={editingBlock.order}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, order: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingBlock.visible}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, visible: e.target.checked })
                  }
                  className="rounded"
                />
                <label className="text-sm font-medium">Visible</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} className="flex-1">
                💾 Guardar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false)
                  setEditingBlock(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
