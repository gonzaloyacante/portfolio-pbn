"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectService } from "@/lib/services/projects";
import { galleryService } from "@/lib/services/gallery";

type ProjectImage = { url: string; order?: number };
type Project = { id: number; title: string; images?: ProjectImage[] };

interface Props {
  currentCount: number; // cantidad actual en galería para calcular orden inicial
  onAdded: () => void;
  onClose: () => void;
}

export default function SelectFromProjectsModal({ currentCount, onAdded, onClose }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, { url: string; name: string }>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    (async () => {
      try {
        const list = await projectService.list();
        // Adaptamos al tipo local mínimo
        const mapped: Project[] = list.map((p: any) => ({ id: p.id, title: p.title, images: (p.images || []).map((i: any) => ({ url: i.url, order: i.order })) }));
        setProjects(mapped);
      } catch (e) {
        // noop, el modal puede cerrarse si falla
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(p => p.title.toLowerCase().includes(q));
  }, [projects, query]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

  const toggle = (img: { url: string }, name: string) => {
    setSelected(prev => {
      const key = img.url;
      const next = { ...prev };
      if (next[key]) delete next[key]; else next[key] = { url: img.url, name };
      return next;
    });
  };

  const countSelected = Object.keys(selected).length;

  const handleAdd = async () => {
    if (!countSelected) return onClose();
    setLoading(true);
    try {
      const start = currentCount;
      const items = Object.values(selected).map((s, idx) => ({ url: s.url, name: s.name || "Imagen", order: start + idx }));
      await galleryService.bulkCreate(items);
      onAdded();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Agregar imágenes desde proyectos" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input placeholder="Buscar proyecto..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-background" />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Seleccionar todas las visibles
              const next: Record<string, { url: string; name: string }> = { ...selected };
              visible.forEach((p) => (p.images || []).forEach((img) => { next[img.url] = { url: img.url, name: p.title }; }));
              setSelected(next);
            }}
          >
            Seleccionar todo
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSelected({})}
          >
            Limpiar
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-auto space-y-6 pr-1">
          {visible.map((p) => (
            <div key={p.id} className="space-y-2">
              <h4 className="font-medium text-left">{p.title}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(p.images || []).map((img, i) => {
                  const key = img.url;
                  const isSel = Boolean(selected[key]);
                  return (
                    <button
                      type="button"
                      key={key + i}
                      onClick={() => toggle(img, p.title)}
                      className={`relative rounded overflow-hidden border ${isSel ? 'ring-2 ring-primary' : 'border-muted'} aspect-[4/3]`}
                      aria-pressed={isSel}
                      aria-label={`Imagen de proyecto ${p.title}${isSel ? ' seleccionada' : ''}`}
                    >
                      <img src={img.url} alt="proj-img" className="w-full h-full object-cover" />
                      {isSel && (
                        <span className="absolute top-1 right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {visible.length < filtered.length && (
            <div className="flex justify-center pt-2">
              <button
                className="text-sm underline"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
              >
                Cargar más
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Seleccionadas: {countSelected}</span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={loading || countSelected === 0}>{loading ? 'Agregando...' : 'Agregar a galería'}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
