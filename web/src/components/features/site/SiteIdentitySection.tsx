import { Input } from '@/components/ui'

interface SiteIdentitySectionProps {
  siteName: string
  onSiteNameChange: (v: string) => void
  siteTagline: string
  onSiteTaglineChange: (v: string) => void
}

export function SiteIdentitySection({
  siteName,
  onSiteNameChange,
  siteTagline,
  onSiteTaglineChange,
}: SiteIdentitySectionProps) {
  return (
    <section className="border-border bg-card space-y-5 rounded-2xl border p-6">
      <h2 className="font-heading text-lg font-semibold">Identidad del sitio</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nombre del sitio</label>
          <Input
            value={siteName}
            onChange={(e) => onSiteNameChange(e.target.value)}
            placeholder="Paola Bolívar Nievas - Make-up Artist"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Eslogan</label>
          <Input
            value={siteTagline}
            onChange={(e) => onSiteTaglineChange(e.target.value)}
            placeholder="Make-up Artist & Fotografía"
          />
        </div>
      </div>
    </section>
  )
}
