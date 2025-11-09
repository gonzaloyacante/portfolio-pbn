'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  order: number;
}

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  async function loadSocialLinks() {
    try {
      const data = await apiClient.getSocialLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error loading social links:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold">Redes Sociales</h1>
        <p className="text-muted-foreground">Gestiona los enlaces a redes sociales</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Card key={link.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{link.platform}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{link.url}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
