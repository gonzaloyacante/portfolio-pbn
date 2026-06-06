import { ImageUpload, Input, Switch, TextArea } from '@/components/ui'

interface SiteSeoSectionProps {
  defaultMetaTitle: string
  onDefaultMetaTitleChange: (value: string) => void
  defaultMetaDescription: string
  onDefaultMetaDescriptionChange: (value: string) => void
  defaultOgImage: string
  onDefaultOgImageChange: (value: string) => void
  allowIndexing: boolean
  onAllowIndexingChange: (value: boolean) => void
}

export function SiteSeoSection({
  defaultMetaTitle,
  onDefaultMetaTitleChange,
  defaultMetaDescription,
  onDefaultMetaDescriptionChange,
  defaultOgImage,
  onDefaultOgImageChange,
  allowIndexing,
  onAllowIndexingChange,
}: SiteSeoSectionProps) {
  return (
    <section className="border-border bg-card space-y-5 rounded-2xl border p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Vista al compartir</h2>
        <p className="text-muted-foreground text-sm">
          Estos datos se usan cuando alguien comparte la web en WhatsApp, Instagram, Facebook,
          LinkedIn, X y otras redes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Título que se ve al compartir</label>
            <Input
              value={defaultMetaTitle}
              onChange={(event) => onDefaultMetaTitleChange(event.target.value)}
              placeholder="Paola Bolívar Nievas | Maquilladora profesional"
            />
            <p className="text-muted-foreground text-xs">
              Mejor corto y claro. Ejemplo: nombre + profesión.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descripción que se ve al compartir</label>
            <TextArea
              value={defaultMetaDescription}
              onChange={(event) => onDefaultMetaDescriptionChange(event.target.value)}
              placeholder="Maquilladora profesional especializada en caracterización, FX, bodas y editoriales."
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Una frase natural sobre el trabajo, sin palabras raras ni demasiado larga.
            </p>
          </div>

          <div className="border-border flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Permitir que Google muestre la web</p>
              <p className="text-muted-foreground text-xs">
                Déjalo activo salvo que quieras ocultar la web de buscadores.
              </p>
            </div>
            <Switch
              checked={allowIndexing}
              onCheckedChange={onAllowIndexingChange}
              aria-label="Permitir que Google muestre la web"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <ImageUpload
            name="defaultOgImage"
            label="Imagen para compartir"
            folder="site/seo"
            mode="single"
            currentImage={defaultOgImage || null}
            onChange={(urls) => onDefaultOgImageChange(urls[0] ?? '')}
            maxFiles={1}
            maxSizeMB={10}
          />
          <p className="text-muted-foreground text-xs">
            Ideal: horizontal, clara, con buen contraste. Si una página tiene una foto propia, esa
            puede tener prioridad.
          </p>
        </div>
      </div>
    </section>
  )
}
