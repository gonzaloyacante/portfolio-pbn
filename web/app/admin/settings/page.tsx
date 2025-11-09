'use client''use client';



import { useEffect, useState } from 'react'import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api-client'import { apiClient } from '@/lib/api-client';

import { Loader2, Save, Settings as SettingsIcon, User, Mail, Phone, MapPin } from 'lucide-react'import { Button } from '@/components/ui/button';

import { ImageUploader } from '@/components/image-uploader'import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

interface Settings {import { Textarea } from '@/components/ui/textarea';

  siteName: stringimport { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

  siteDescription: stringimport { Alert, AlertDescription } from '@/components/ui/alert';

  contactEmail: stringimport { Separator } from '@/components/ui/separator';

  contactPhone: stringimport { Settings, Save, CheckCircle2 } from 'lucide-react';

  location: string

  logoUrl: stringinterface PortfolioSettings {

  faviconUrl: string  id: string;

}  siteName: string;

  siteDescription: string;

export default function AdminSettingsPage() {  siteUrl: string;

  const [loading, setLoading] = useState(true)  ownerName: string;

  const [submitting, setSubmitting] = useState(false)  ownerTitle: string;

  const [settings, setSettings] = useState<Settings>({  ownerBio: string;

    siteName: '',  ownerEmail: string;

    siteDescription: '',  ownerPhone?: string;

    contactEmail: '',  ownerLocation?: string;

    contactPhone: '',  logoUrl?: string;

    location: '',  faviconUrl?: string;

    logoUrl: '',  ogImageUrl?: string;

    faviconUrl: '',  metaKeywords?: string;

  })  googleAnalyticsId?: string;

  facebookPixelId?: string;

  useEffect(() => {  createdAt: string;

    loadSettings()  updatedAt: string;

  }, [])}



  const loadSettings = async () => {export default function AdminSettingsPage() {

    try {  const [settings, setSettings] = useState<PortfolioSettings | null>(null);

      setLoading(true)  const [loading, setLoading] = useState(true);

      const data = await apiClient.getSettings()  const [submitting, setSubmitting] = useState(false);

      if (data && typeof data === 'object') {  const [error, setError] = useState('');

        setSettings({  const [success, setSuccess] = useState(false);

          siteName: data.siteName || '',

          siteDescription: data.siteDescription || '',  // Form data

          contactEmail: data.contactEmail || '',  const [formData, setFormData] = useState({

          contactPhone: data.contactPhone || '',    siteName: '',

          location: data.location || '',    siteDescription: '',

          logoUrl: data.logoUrl || '',    siteUrl: '',

          faviconUrl: data.faviconUrl || '',    ownerName: '',

        })    ownerTitle: '',

      }    ownerBio: '',

    } catch (error) {    ownerEmail: '',

      console.error('Error al cargar configuración:', error)    ownerPhone: '',

    } finally {    ownerLocation: '',

      setLoading(false)    logoUrl: '',

    }    faviconUrl: '',

  }    ogImageUrl: '',

    metaKeywords: '',

  const handleSubmit = async (e: React.FormEvent) => {    googleAnalyticsId: '',

    e.preventDefault()    facebookPixelId: '',

    setSubmitting(true)  });



    try {  useEffect(() => {

      await apiClient.updateSettings(settings)    fetchSettings();

      alert('¡Configuración guardada con éxito! ✨')  }, []);

    } catch (error) {

      console.error('Error:', error)  const fetchSettings = async () => {

      alert('Hubo un error al guardar. Por favor, inténtalo de nuevo.')    try {

    } finally {      setLoading(true);

      setSubmitting(false)      const data = await apiClient.getSettings();

    }      if (data) {

  }        setSettings(data);

        setFormData({

  if (loading) {          siteName: data.siteName || '',

    return (          siteDescription: data.siteDescription || '',

      <div className="flex items-center justify-center min-h-screen">          siteUrl: data.siteUrl || '',

        <div className="text-center">          ownerName: data.ownerName || '',

          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />          ownerTitle: data.ownerTitle || '',

          <p className="mt-4 text-slate-600">Cargando configuración...</p>          ownerBio: data.ownerBio || '',

        </div>          ownerEmail: data.ownerEmail || '',

      </div>          ownerPhone: data.ownerPhone || '',

    )          ownerLocation: data.ownerLocation || '',

  }          logoUrl: data.logoUrl || '',

          faviconUrl: data.faviconUrl || '',

  return (          ogImageUrl: data.ogImageUrl || '',

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">          metaKeywords: data.metaKeywords || '',

      <div className="max-w-4xl mx-auto">          googleAnalyticsId: data.googleAnalyticsId || '',

        {/* Header */}          facebookPixelId: data.facebookPixelId || '',

        <div className="mb-8">        });

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">      }

            Configuración General    } catch (err: any) {

          </h1>      setError(err.message || 'Error al cargar configuración');

          <p className="text-slate-600 mt-2">    } finally {

            Personaliza la información de tu portfolio      setLoading(false);

          </p>    }

        </div>  };



        <form onSubmit={handleSubmit} className="space-y-6">  const handleSave = async () => {

          {/* Información General */}    try {

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">      setSubmitting(true);

            <div className="flex items-center gap-3 mb-6">      setError('');

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">      setSuccess(false);

                <SettingsIcon className="w-5 h-5 text-purple-600" />      

              </div>      await apiClient.updateSettings(formData);

              <h2 className="text-2xl font-bold text-slate-800">      await fetchSettings();

                Información del Sitio      

              </h2>      setSuccess(true);

            </div>      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {

            <div className="space-y-5">      setError(err.message || 'Error al guardar configuración');

              {/* Site Name */}    } finally {

              <div>      setSubmitting(false);

                <label className="block text-sm font-semibold text-slate-700 mb-2">    }

                  Nombre del Sitio <span className="text-rose-500">*</span>  };

                </label>

                <input  if (loading) {

                  type="text"    return (

                  required      <div className="space-y-4">

                  value={settings.siteName}        <h1 className="text-3xl font-bold">Configuración</h1>

                  onChange={(e) =>        <div className="flex items-center justify-center h-64">

                    setSettings({ ...settings, siteName: e.target.value })          <div className="text-center">

                  }            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />

                  placeholder="Ej: Portfolio de María"            <p className="mt-2 text-sm text-muted-foreground">Cargando configuración...</p>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-none"          </div>

                />        </div>

                <p className="text-xs text-slate-500 mt-1">      </div>

                  Aparece en el título del navegador    );

                </p>  }

              </div>

  return (

              {/* Site Description */}    <div className="space-y-6 max-w-4xl">

              <div>      {/* Header */}

                <label className="block text-sm font-semibold text-slate-700 mb-2">      <div className="flex items-center justify-between">

                  Descripción del Sitio        <div>

                </label>          <h1 className="text-3xl font-bold">Configuración del Portfolio</h1>

                <textarea          <p className="text-muted-foreground">

                  value={settings.siteDescription}            Personaliza la información general del sitio

                  onChange={(e) =>          </p>

                    setSettings({        </div>

                      ...settings,      </div>

                      siteDescription: e.target.value,

                    })      {/* Error/Success Alerts */}

                  }      {error && (

                  placeholder="Breve descripción de tu trabajo..."        <Alert variant="destructive">

                  rows={3}          <AlertDescription>{error}</AlertDescription>

                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"        </Alert>

                />      )}

                <p className="text-xs text-slate-500 mt-1">      

                  Se usa para SEO y redes sociales      {success && (

                </p>        <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">

              </div>          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />

            </div>          <AlertDescription className="text-green-800 dark:text-green-200">

          </div>            Configuración guardada correctamente

          </AlertDescription>

          {/* Información de Contacto */}        </Alert>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">      )}

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">      {/* Site Information */}

                <User className="w-5 h-5 text-rose-600" />      <Card>

              </div>        <CardHeader>

              <h2 className="text-2xl font-bold text-slate-800">          <CardTitle className="flex items-center gap-2">

                Información de Contacto            <Settings className="h-5 w-5" />

              </h2>            Información del Sitio

            </div>          </CardTitle>

          <CardDescription>

            <div className="space-y-5">            Datos generales del portfolio

              {/* Email */}          </CardDescription>

              <div>        </CardHeader>

                <label className="block text-sm font-semibold text-slate-700 mb-2">        <CardContent className="space-y-4">

                  <Mail className="w-4 h-4 inline mr-1" />          <div className="grid gap-4 md:grid-cols-2">

                  Email de Contacto            <div className="space-y-2">

                </label>              <Label htmlFor="siteName">Nombre del Sitio *</Label>

                <input              <Input

                  type="email"                id="siteName"

                  value={settings.contactEmail}                value={formData.siteName}

                  onChange={(e) =>                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}

                    setSettings({ ...settings, contactEmail: e.target.value })                placeholder="Mi Portfolio"

                  }              />

                  placeholder="tu@email.com"            </div>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"            <div className="space-y-2">

                />              <Label htmlFor="siteUrl">URL del Sitio *</Label>

                <p className="text-xs text-slate-500 mt-1">              <Input

                  Donde recibirás los mensajes                id="siteUrl"

                </p>                type="url"

              </div>                value={formData.siteUrl}

                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}

              {/* Phone */}                placeholder="https://miportfolio.com"

              <div>              />

                <label className="block text-sm font-semibold text-slate-700 mb-2">            </div>

                  <Phone className="w-4 h-4 inline mr-1" />          </div>

                  Teléfono

                </label>          <div className="space-y-2">

                <input            <Label htmlFor="siteDescription">Descripción del Sitio *</Label>

                  type="tel"            <Textarea

                  value={settings.contactPhone}              id="siteDescription"

                  onChange={(e) =>              value={formData.siteDescription}

                    setSettings({ ...settings, contactPhone: e.target.value })              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}

                  }              placeholder="Breve descripción del portfolio..."

                  placeholder="+1 234 567 8900"              rows={3}

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"            />

                />            <p className="text-xs text-muted-foreground">

                <p className="text-xs text-slate-500 mt-1">              Se usa para SEO y redes sociales

                  Número de contacto (opcional)            </p>

                </p>          </div>

              </div>        </CardContent>

      </Card>

              {/* Location */}

              <div>      {/* Owner Information */}

                <label className="block text-sm font-semibold text-slate-700 mb-2">      <Card>

                  <MapPin className="w-4 h-4 inline mr-1" />        <CardHeader>

                  Ubicación          <CardTitle>Información Personal</CardTitle>

                </label>          <CardDescription>

                <input            Datos de la maquilladora/profesional

                  type="text"          </CardDescription>

                  value={settings.location}        </CardHeader>

                  onChange={(e) =>        <CardContent className="space-y-4">

                    setSettings({ ...settings, location: e.target.value })          <div className="grid gap-4 md:grid-cols-2">

                  }            <div className="space-y-2">

                  placeholder="Ciudad, País"              <Label htmlFor="ownerName">Nombre Completo *</Label>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"              <Input

                />                id="ownerName"

                <p className="text-xs text-slate-500 mt-1">                value={formData.ownerName}

                  Tu ciudad o ubicación                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}

                </p>                placeholder="Paola Bolívar Nievas"

              </div>              />

            </div>            </div>

          </div>            <div className="space-y-2">

              <Label htmlFor="ownerTitle">Título/Profesión *</Label>

          {/* Imágenes */}              <Input

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">                id="ownerTitle"

            <div className="flex items-center gap-3 mb-6">                value={formData.ownerTitle}

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">                onChange={(e) => setFormData({ ...formData, ownerTitle: e.target.value })}

                <SettingsIcon className="w-5 h-5 text-emerald-600" />                placeholder="Maquilladora Profesional"

              </div>              />

              <h2 className="text-2xl font-bold text-slate-800">            </div>

                Identidad Visual          </div>

              </h2>

            </div>          <div className="space-y-2">

            <Label htmlFor="ownerBio">Biografía *</Label>

            <div className="space-y-6">            <Textarea

              {/* Logo */}              id="ownerBio"

              <div>              value={formData.ownerBio}

                <ImageUploader              onChange={(e) => setFormData({ ...formData, ownerBio: e.target.value })}

                  label="Logo del Sitio"              placeholder="Cuéntanos sobre tu experiencia y pasión..."

                  description="Logo principal que aparecerá en tu portfolio"              rows={5}

                  value={settings.logoUrl}            />

                  onChange={(url) => setSettings({ ...settings, logoUrl: url })}          </div>

                  onRemove={() => setSettings({ ...settings, logoUrl: '' })}

                />          <div className="grid gap-4 md:grid-cols-3">

              </div>            <div className="space-y-2">

              <Label htmlFor="ownerEmail">Email *</Label>

              {/* Favicon */}              <Input

              <div>                id="ownerEmail"

                <ImageUploader                type="email"

                  label="Favicon (Icono del Navegador)"                value={formData.ownerEmail}

                  description="Pequeño ícono que aparece en la pestaña del navegador (recomendado: 32x32px o 64x64px)"                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}

                  value={settings.faviconUrl}                placeholder="contacto@email.com"

                  onChange={(url) =>              />

                    setSettings({ ...settings, faviconUrl: url })            </div>

                  }            <div className="space-y-2">

                  onRemove={() => setSettings({ ...settings, faviconUrl: '' })}              <Label htmlFor="ownerPhone">Teléfono</Label>

                />              <Input

              </div>                id="ownerPhone"

            </div>                type="tel"

          </div>                value={formData.ownerPhone}

                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}

          {/* Info Card */}                placeholder="+34 XXX XXX XXX"

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6">              />

            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">            </div>

              💡 Consejos            <div className="space-y-2">

            </h4>              <Label htmlFor="ownerLocation">Ubicación</Label>

            <ul className="text-sm text-slate-600 space-y-2">              <Input

              <li>                id="ownerLocation"

                • El nombre del sitio aparece en la pestaña del navegador y en                value={formData.ownerLocation}

                los resultados de búsqueda                onChange={(e) => setFormData({ ...formData, ownerLocation: e.target.value })}

              </li>                placeholder="Madrid, España"

              <li>              />

                • La descripción ayuda a que te encuentren en Google y redes            </div>

                sociales          </div>

              </li>        </CardContent>

              <li>      </Card>

                • El email de contacto es donde llegarán los mensajes del

                formulario      {/* Branding */}

              </li>      <Card>

              <li>        <CardHeader>

                • El logo se mostrará en la parte superior de tu portfolio          <CardTitle>Branding e Imágenes</CardTitle>

              </li>          <CardDescription>

            </ul>            Logos y recursos visuales del sitio

          </div>          </CardDescription>

        </CardHeader>

          {/* Submit Button */}        <CardContent className="space-y-4">

          <button          <div className="space-y-2">

            type="submit"            <Label htmlFor="logoUrl">URL del Logo</Label>

            disabled={submitting}            <Input

            className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"              id="logoUrl"

          >              type="url"

            {submitting ? (              value={formData.logoUrl}

              <>              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}

                <Loader2 className="w-5 h-5 animate-spin" />              placeholder="https://..."

                Guardando cambios...            />

              </>            <p className="text-xs text-muted-foreground">

            ) : (              Logo principal del sitio (header, footer)

              <>            </p>

                <Save className="w-5 h-5" />          </div>

                Guardar Configuración

              </>          <div className="space-y-2">

            )}            <Label htmlFor="faviconUrl">URL del Favicon</Label>

          </button>            <Input

        </form>              id="faviconUrl"

      </div>              type="url"

    </div>              value={formData.faviconUrl}

  )              onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}

}              placeholder="https://..."

            />
            <p className="text-xs text-muted-foreground">
              Ícono que aparece en la pestaña del navegador (32x32px o 64x64px)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImageUrl">URL de Imagen Open Graph</Label>
            <Input
              id="ogImageUrl"
              type="url"
              value={formData.ogImageUrl}
              onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Imagen que aparece al compartir en redes sociales (1200x630px recomendado)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Meta Tags</CardTitle>
          <CardDescription>
            Optimización para motores de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Palabras Clave (Keywords)</Label>
            <Input
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="maquillaje, novias, profesional, madrid..."
            />
            <p className="text-xs text-muted-foreground">
              Palabras separadas por comas para mejorar el SEO
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>
            Integración con herramientas de análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              ID de seguimiento de Google Analytics 4
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              value={formData.facebookPixelId}
              onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
              placeholder="XXXXXXXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              ID del píxel de Facebook para tracking de ads
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div>
          <p className="font-medium">¿Listo para guardar?</p>
          <p className="text-sm text-muted-foreground">
            Los cambios se aplicarán inmediatamente en el sitio público
          </p>
        </div>
        <Button onClick={handleSave} disabled={submitting} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Last Update Info */}
      {settings?.updatedAt && (
        <p className="text-xs text-muted-foreground text-center">
          Última actualización:{' '}
          {new Date(settings.updatedAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
