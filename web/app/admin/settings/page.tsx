'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

interface PortfolioSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerLocation?: string;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    ownerName: '',
    ownerTitle: '',
    ownerBio: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerLocation: '',
    logoUrl: '',
    faviconUrl: '',
    ogImageUrl: '',
    metaKeywords: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSettings();
      if (data) {
        setSettings(data);
        setFormData({
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
          siteUrl: data.siteUrl || '',
          ownerName: data.ownerName || '',
          ownerTitle: data.ownerTitle || '',
          ownerBio: data.ownerBio || '',
          ownerEmail: data.ownerEmail || '',
          ownerPhone: data.ownerPhone || '',
          ownerLocation: data.ownerLocation || '',
          logoUrl: data.logoUrl || '',
          faviconUrl: data.faviconUrl || '',
          ogImageUrl: data.ogImageUrl || '',
          metaKeywords: data.metaKeywords || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          facebookPixelId: data.facebookPixelId || '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess(false);
      
      await apiClient.updateSettings(formData);
      await fetchSettings();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar configuración');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Portfolio</h1>
          <p className="text-muted-foreground">
            Personaliza la información general del sitio
          </p>
        </div>
      </div>

      {/* Error/Success Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Configuración guardada correctamente
          </AlertDescription>
        </Alert>
      )}

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Información del Sitio
          </CardTitle>
          <CardDescription>
            Datos generales del portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del Sitio *</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="Mi Portfolio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL del Sitio *</Label>
              <Input
                id="siteUrl"
                type="url"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                placeholder="https://miportfolio.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Descripción del Sitio *</Label>
            <Textarea
              id="siteDescription"
              value={formData.siteDescription}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
              placeholder="Breve descripción del portfolio..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Se usa para SEO y redes sociales
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Datos de la maquilladora/profesional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nombre Completo *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Paola Bolívar Nievas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerTitle">Título/Profesión *</Label>
              <Input
                id="ownerTitle"
                value={formData.ownerTitle}
                onChange={(e) => setFormData({ ...formData, ownerTitle: e.target.value })}
                placeholder="Maquilladora Profesional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerBio">Biografía *</Label>
            <Textarea
              id="ownerBio"
              value={formData.ownerBio}
              onChange={(e) => setFormData({ ...formData, ownerBio: e.target.value })}
              placeholder="Cuéntanos sobre tu experiencia y pasión..."
              rows={5}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Email *</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="contacto@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Teléfono</Label>
              <Input
                id="ownerPhone"
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                placeholder="+34 XXX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerLocation">Ubicación</Label>
              <Input
                id="ownerLocation"
                value={formData.ownerLocation}
                onChange={(e) => setFormData({ ...formData, ownerLocation: e.target.value })}
                placeholder="Madrid, España"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding e Imágenes</CardTitle>
          <CardDescription>
            Logos y recursos visuales del sitio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL del Logo</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Logo principal del sitio (header, footer)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faviconUrl">URL del Favicon</Label>
            <Input
              id="faviconUrl"
              type="url"
              value={formData.faviconUrl}
              onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
              placeholder="https://..."
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
