'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface Settings {
  siteName: string;
  siteDescription: string;
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerLocation: string;
  logoUrl: string;
  metaKeywords: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    ownerName: '',
    ownerTitle: '',
    ownerBio: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerLocation: '',
    logoUrl: '',
    metaKeywords: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await apiClient.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateSettings(settings);
      alert('Configuración guardada');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración del sitio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Información del Sitio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="siteName">Nombre del Sitio</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ownerName">Nombre del Propietario</Label>
                <Input
                  id="ownerName"
                  value={settings.ownerName}
                  onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ownerTitle">Título Profesional</Label>
              <Input
                id="ownerTitle"
                value={settings.ownerTitle}
                onChange={(e) => setSettings({ ...settings, ownerTitle: e.target.value })}
                placeholder="Ej: Maquilladora Profesional"
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">Descripción del Sitio</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ownerBio">Biografía</Label>
              <Textarea
                id="ownerBio"
                value={settings.ownerBio}
                onChange={(e) => setSettings({ ...settings, ownerBio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="ownerEmail">Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={settings.ownerEmail}
                  onChange={(e) => setSettings({ ...settings, ownerEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ownerPhone">Teléfono</Label>
                <Input
                  id="ownerPhone"
                  value={settings.ownerPhone}
                  onChange={(e) => setSettings({ ...settings, ownerPhone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ownerLocation">Ubicación</Label>
              <Input
                id="ownerLocation"
                value={settings.ownerLocation}
                onChange={(e) => setSettings({ ...settings, ownerLocation: e.target.value })}
                placeholder="Ej: Madrid, España"
              />
            </div>

            <div>
              <Label htmlFor="logoUrl">URL del Logo</Label>
              <Input
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="metaKeywords">Palabras Clave SEO</Label>
              <Input
                id="metaKeywords"
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                placeholder="maquillaje, caracterización, cine, ..."
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
