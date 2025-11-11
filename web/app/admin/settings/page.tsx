'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Loading, Input, Textarea } from '@/components/cms/form-components';
import { Save } from 'lucide-react';

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

  if (loading) return <Loading text="Cargando configuración..." />;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Configuración General</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Información principal del sitio y datos de contacto
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Site Info */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Información del Sitio
            </h2>
            
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nombre del Sitio"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="Portfolio de Paola"
                />
                
                <Input
                  label="Nombre Completo"
                  value={settings.ownerName}
                  onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                  placeholder="Paola Bolívar"
                />
              </div>

              <Input
                label="Título Profesional"
                value={settings.ownerTitle}
                onChange={(e) => setSettings({ ...settings, ownerTitle: e.target.value })}
                placeholder="Maquilladora Profesional & Artista de Caracterización"
              />

              <Textarea
                label="Descripción del Sitio"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                helperText="Breve descripción para SEO y redes sociales"
              />

              <Textarea
                label="Biografía"
                value={settings.ownerBio}
                onChange={(e) => setSettings({ ...settings, ownerBio: e.target.value })}
                rows={4}
                helperText="Historia profesional y experiencia"
              />
            </div>
          </Card>

          {/* Contact Info */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Datos de Contacto
            </h2>
            
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={settings.ownerEmail}
                  onChange={(e) => setSettings({ ...settings, ownerEmail: e.target.value })}
                  placeholder="paola@example.com"
                />
                
                <Input
                  label="Teléfono"
                  value={settings.ownerPhone}
                  onChange={(e) => setSettings({ ...settings, ownerPhone: e.target.value })}
                  placeholder="+34 600 123 456"
                />
              </div>

              <Input
                label="Ubicación"
                value={settings.ownerLocation}
                onChange={(e) => setSettings({ ...settings, ownerLocation: e.target.value })}
                placeholder="Madrid, España"
              />
            </div>
          </Card>

          {/* SEO & Assets */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              SEO y Recursos
            </h2>
            
            <div className="space-y-5">
              <Input
                label="URL del Logo"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                helperText="Logo principal del sitio"
              />

              <Input
                label="Palabras Clave SEO"
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                placeholder="maquillaje profesional, caracterización, cine, teatro"
                helperText="Separadas por comas"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
            <Button
              type="submit"
              icon={Save}
              loading={saving}
              disabled={saving}
              size="lg"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
