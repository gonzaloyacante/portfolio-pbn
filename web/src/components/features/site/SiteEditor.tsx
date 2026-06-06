'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui'
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
  const [defaultMetaTitle, setDefaultMetaTitle] = useState(settings?.defaultMetaTitle ?? '')
  const [defaultMetaDescription, setDefaultMetaDescription] = useState(
    settings?.defaultMetaDescription ?? ''
  )
  const [defaultOgImage, setDefaultOgImage] = useState(settings?.defaultOgImage ?? '')
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
        defaultMetaTitle: defaultMetaTitle.trim() || null,
        defaultMetaDescription: defaultMetaDescription.trim() || null,
        defaultOgImage: defaultOgImage.trim() || null,
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
