"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AdminLayout from "@/components/AdminLayout";
import { settingsService } from "@/lib/services/settings";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const s = await settingsService.get();
        if (s) setTitle(s.title);
      } catch (error) {
        console.error("Error fetching title:", error);
        setErrorMessage("Error fetching title: " + (error as Error).message);
      }
    };

    fetchTitle();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.update({ title });
      setSuccessMessage("Título actualizado correctamente");
      toast({ title: "Guardado", description: "Se actualizó la configuración del sitio." });
    } catch (error) {
      console.error("Error actualizando el título:", error);
      setErrorMessage(
        "Hubo un error al actualizar el título: " + (error as Error).message
      );
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Configuración">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Título
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </AdminLayout>
  );
}
