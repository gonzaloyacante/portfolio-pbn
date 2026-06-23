'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { Button, ImageUpload, Input } from '@/components/ui'
import { showToast } from '@/lib/toast'
import type { SiteSettingsData } from '@/actions/settings/site'
import { updateSiteSettings } from '@/actions/settings/site'
import { SiteMaintenanceSection } from './SiteMaintenanceSection'
import { SiteIdentitySection } from './SiteIdentitySection'
import { SiteNavbarSection } from './SiteNavbarSection'
import { SiteSeoSection } from './SiteSeoSection'

interface SiteEditorProps {
  settings: SiteSettingsData | null
}

export function SiteEditor({ settings }: SiteEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [siteName, setSiteName] = useState(
    settings?.siteName ?? 'Paola Bolívar Nievas - Make-up Artist'
  )
  const [siteTagline, setSiteTagline] = useState(settings?.siteTagline ?? '')
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl ?? '')
  const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl ?? '')
  const [defaultMetaTitle, setDefaultMetaTitle] = useState(settings?.defaultMetaTitle ?? '')
  const [defaultMetaDescription, setDefaultMetaDescription] = useState(
    settings?.defaultMetaDescription ?? ''
  )
  const [defaultOgImage, setDefaultOgImage] = useState(settings?.defaultOgImage ?? '')
  const [defaultEmail, setDefaultEmail] = useState(settings?.defaultEmail ?? '')
  const [defaultPhone, setDefaultPhone] = useState(settings?.defaultPhone ?? '')
  const [defaultWhatsapp, setDefaultWhatsapp] = useState(settings?.defaultWhatsapp ?? '')
  const [defaultAddress, setDefaultAddress] = useState(settings?.defaultAddress ?? '')
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode ?? false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings?.maintenanceMessage ?? '')
  const [navbarShowBrand, setNavbarShowBrand] = useState(settings?.navbarShowBrand ?? true)
  const [navbarBrandText, setNavbarBrandText] = useState(settings?.navbarBrandText ?? '')
  const [navbarBrandFont, setNavbarBrandFont] = useState(settings?.navbarBrandFont ?? '')
  const [navbarBrandFontUrl, setNavbarBrandFontUrl] = useState(settings?.navbarBrandFontUrl ?? '')
  const [navbarBrandFontSize, setNavbarBrandFontSize] = useState(
    settings?.navbarBrandFontSize ?? 30
  )
  const [navbarBrandColor, setNavbarBrandColor] = useState(settings?.navbarBrandColor ?? '')
  const [navbarBrandColorDark, setNavbarBrandColorDark] = useState(
    settings?.navbarBrandColorDark ?? ''
  )
  const [showAboutPage, setShowAboutPage] = useState(settings?.showAboutPage ?? true)
  const [showGalleryPage, setShowGalleryPage] = useState(settings?.showGalleryPage ?? true)
  const [showServicesPage, setShowServicesPage] = useState(settings?.showServicesPage ?? false)
  const [showContactPage, setShowContactPage] = useState(settings?.showContactPage ?? true)
  const [allowIndexing, setAllowIndexing] = useState(settings?.allowIndexing ?? true)

  const pageSetters = {
    showAboutPage: setShowAboutPage,
    showGalleryPage: setShowGalleryPage,
    showServicesPage: setShowServicesPage,
    showContactPage: setShowContactPage,
  }

  async function handleSave() {
    setSaving(true)
    try {
      const result = await updateSiteSettings({
        siteName: siteName.trim() || undefined,
        siteTagline: siteTagline.trim() || null,
        logoUrl: logoUrl.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
        defaultMetaTitle: defaultMetaTitle.trim() || null,
        defaultMetaDescription: defaultMetaDescription.trim() || null,
        defaultOgImage: defaultOgImage.trim() || null,
        defaultEmail: defaultEmail.trim() || null,
        defaultPhone: defaultPhone.trim() || null,
        defaultWhatsapp: defaultWhatsapp.trim() || null,
        defaultAddress: defaultAddress.trim() || null,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage.trim() || null,
        navbarShowBrand,
        navbarBrandText: navbarBrandText.trim() || null,
        navbarBrandFont: navbarBrandFont.trim() || null,
        navbarBrandFontUrl: navbarBrandFontUrl.trim() || null,
        navbarBrandFontSize: navbarBrandFontSize || null,
        navbarBrandColor: navbarBrandColor.trim() || null,
        navbarBrandColorDark: navbarBrandColorDark.trim() || null,
        showAboutPage,
        showGalleryPage,
        showServicesPage,
        showContactPage,
        allowIndexing,
      })
      if (!result.success) {
        showToast.error(result.error ?? 'Error al guardar')
        return
      }
      showToast.success('Configuración del sitio guardada')
      router.refresh()
    } catch {
      showToast.error('Error inesperado al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <SiteMaintenanceSection
        maintenanceMode={maintenanceMode}
        onMaintenanceModeChange={setMaintenanceMode}
        maintenanceMessage={maintenanceMessage}
        onMaintenanceMessageChange={setMaintenanceMessage}
      />

      <SiteIdentitySection
        siteName={siteName}
        onSiteNameChange={setSiteName}
        siteTagline={siteTagline}
        onSiteTaglineChange={setSiteTagline}
      />

      <section className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-semibold">
            Branding y datos de contacto por defecto
          </h2>
          <p className="text-muted-foreground text-sm">
            Logo, favicon y los datos que se usan como valores predeterminados cuando las páginas no
            los definen explícitamente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Logo</p>
            <ImageUpload
              name="site-logoUrl"
              value={logoUrl ? [logoUrl] : []}
              onChange={(urls: string[]) => setLogoUrl(urls[0] ?? '')}
            />
          </div>
          <Input
            label="Favicon (URL)"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/…/favicon.ico"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Email por defecto"
            type="email"
            value={defaultEmail}
            onChange={(e) => setDefaultEmail(e.target.value)}
            placeholder="contacto@ejemplo.com"
          />
          <Input
            label="Teléfono por defecto"
            value={defaultPhone}
            onChange={(e) => setDefaultPhone(e.target.value)}
            placeholder="+34 600 000 000"
          />
          <Input
            label="WhatsApp por defecto (link)"
            value={defaultWhatsapp}
            onChange={(e) => setDefaultWhatsapp(e.target.value)}
            placeholder="https://wa.me/34600000000"
          />
          <Input
            label="Dirección por defecto"
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
            placeholder="Granada, España"
          />
        </div>
      </section>

      <SiteSeoSection
        defaultMetaTitle={defaultMetaTitle}
        onDefaultMetaTitleChange={setDefaultMetaTitle}
        defaultMetaDescription={defaultMetaDescription}
        onDefaultMetaDescriptionChange={setDefaultMetaDescription}
        defaultOgImage={defaultOgImage}
        onDefaultOgImageChange={setDefaultOgImage}
        allowIndexing={allowIndexing}
        onAllowIndexingChange={setAllowIndexing}
      />

      <SiteNavbarSection
        navbarShowBrand={navbarShowBrand}
        onNavbarShowBrandChange={setNavbarShowBrand}
        navbarBrandText={navbarBrandText}
        onNavbarBrandTextChange={setNavbarBrandText}
        navbarBrandFont={navbarBrandFont}
        onNavbarBrandFontChange={setNavbarBrandFont}
        navbarBrandFontUrl={navbarBrandFontUrl}
        onNavbarBrandFontUrlChange={setNavbarBrandFontUrl}
        navbarBrandFontSize={navbarBrandFontSize}
        onNavbarBrandFontSizeChange={setNavbarBrandFontSize}
        navbarBrandColor={navbarBrandColor}
        onNavbarBrandColorChange={setNavbarBrandColor}
        navbarBrandColorDark={navbarBrandColorDark}
        onNavbarBrandColorDarkChange={setNavbarBrandColorDark}
        pages={{ showAboutPage, showGalleryPage, showServicesPage, showContactPage }}
        onPageChange={(key, value) => pageSetters[key](value)}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="size-4" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
