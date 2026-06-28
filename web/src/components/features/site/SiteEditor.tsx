'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { Button, ImageUpload, Input } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
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
  const [isDirty, setIsDirty] = useState(false)
  const savedBaselineRef = useRef<SiteSettingsData | null>(settings)

  useUnsavedChanges(isDirty)

  const [siteName, setSiteNameRaw] = useState(
    settings?.siteName ?? 'Paola Bolívar Nievas - Make-up Artist'
  )
  const [siteTagline, setSiteTaglineRaw] = useState(settings?.siteTagline ?? '')
  const [logoUrl, setLogoUrlRaw] = useState(settings?.logoUrl ?? '')
  const [faviconUrl, setFaviconUrlRaw] = useState(settings?.faviconUrl ?? '')
  const [defaultMetaTitle, setDefaultMetaTitleRaw] = useState(settings?.defaultMetaTitle ?? '')
  const [defaultMetaDescription, setDefaultMetaDescriptionRaw] = useState(
    settings?.defaultMetaDescription ?? ''
  )
  const [defaultOgImage, setDefaultOgImageRaw] = useState(settings?.defaultOgImage ?? '')
  const [defaultEmail, setDefaultEmailRaw] = useState(settings?.defaultEmail ?? '')
  const [defaultPhone, setDefaultPhoneRaw] = useState(settings?.defaultPhone ?? '')
  const [defaultWhatsapp, setDefaultWhatsappRaw] = useState(settings?.defaultWhatsapp ?? '')
  const [defaultAddress, setDefaultAddressRaw] = useState(settings?.defaultAddress ?? '')
  const [maintenanceMode, setMaintenanceModeRaw] = useState(settings?.maintenanceMode ?? false)
  const [maintenanceMessage, setMaintenanceMessageRaw] = useState(
    settings?.maintenanceMessage ?? ''
  )
  const [navbarShowBrand, setNavbarShowBrandRaw] = useState(settings?.navbarShowBrand ?? true)
  const [navbarBrandText, setNavbarBrandTextRaw] = useState(settings?.navbarBrandText ?? '')
  const [navbarBrandFont, setNavbarBrandFontRaw] = useState(settings?.navbarBrandFont ?? '')
  const [navbarBrandFontUrl, setNavbarBrandFontUrlRaw] = useState(
    settings?.navbarBrandFontUrl ?? ''
  )
  const [navbarBrandFontSize, setNavbarBrandFontSizeRaw] = useState(
    settings?.navbarBrandFontSize ?? 30
  )
  const [navbarBrandColor, setNavbarBrandColorRaw] = useState(settings?.navbarBrandColor ?? '')
  const [navbarBrandColorDark, setNavbarBrandColorDarkRaw] = useState(
    settings?.navbarBrandColorDark ?? ''
  )
  const [showAboutPage, setShowAboutPageRaw] = useState(settings?.showAboutPage ?? true)
  const [showGalleryPage, setShowGalleryPageRaw] = useState(settings?.showGalleryPage ?? true)
  const [showServicesPage, setShowServicesPageRaw] = useState(settings?.showServicesPage ?? false)
  const [showContactPage, setShowContactPageRaw] = useState(settings?.showContactPage ?? true)
  const [allowIndexing, setAllowIndexingRaw] = useState(settings?.allowIndexing ?? true)

  function markDirty<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setIsDirty(true)
    }
  }

  const setSiteName = markDirty(setSiteNameRaw)
  const setSiteTagline = markDirty(setSiteTaglineRaw)
  const setLogoUrl = markDirty(setLogoUrlRaw)
  const setFaviconUrl = markDirty(setFaviconUrlRaw)
  const setDefaultMetaTitle = markDirty(setDefaultMetaTitleRaw)
  const setDefaultMetaDescription = markDirty(setDefaultMetaDescriptionRaw)
  const setDefaultOgImage = markDirty(setDefaultOgImageRaw)
  const setDefaultEmail = markDirty(setDefaultEmailRaw)
  const setDefaultPhone = markDirty(setDefaultPhoneRaw)
  const setDefaultWhatsapp = markDirty(setDefaultWhatsappRaw)
  const setDefaultAddress = markDirty(setDefaultAddressRaw)
  const setMaintenanceMode = markDirty(setMaintenanceModeRaw)
  const setMaintenanceMessage = markDirty(setMaintenanceMessageRaw)
  const setNavbarShowBrand = markDirty(setNavbarShowBrandRaw)
  const setNavbarBrandText = markDirty(setNavbarBrandTextRaw)
  const setNavbarBrandFont = markDirty(setNavbarBrandFontRaw)
  const setNavbarBrandFontUrl = markDirty(setNavbarBrandFontUrlRaw)
  const setNavbarBrandFontSize = markDirty(setNavbarBrandFontSizeRaw)
  const setNavbarBrandColor = markDirty(setNavbarBrandColorRaw)
  const setNavbarBrandColorDark = markDirty(setNavbarBrandColorDarkRaw)
  const setShowAboutPage = markDirty(setShowAboutPageRaw)
  const setShowGalleryPage = markDirty(setShowGalleryPageRaw)
  const setShowServicesPage = markDirty(setShowServicesPageRaw)
  const setShowContactPage = markDirty(setShowContactPageRaw)
  const setAllowIndexing = markDirty(setAllowIndexingRaw)

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
      savedBaselineRef.current = settings
      setIsDirty(false)
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
        <Button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="gap-2"
          aria-disabled={saving || !isDirty}
        >
          <Save className="size-4" aria-hidden="true" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
