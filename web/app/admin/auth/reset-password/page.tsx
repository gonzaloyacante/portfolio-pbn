"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!token) {
      setError("Token inválido o ausente.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess("Contraseña restablecida correctamente. Redirigiendo al login...");
      setTimeout(() => router.push("/admin/auth/login"), 1500);
    } catch (e) {
      console.error(e);
      setError("No se pudo restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 10rem)" }}
    >
      <div className="w-full max-w-xs">
        <img
          src="/images/login-Admin.svg"
          alt="Imagen de fondo restablecer contraseña"
          className="w-60 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded">
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/admin/auth/login")}
            variant="outline"
            className="w-full py-2 rounded"
          >
            Cancelar
          </Button>
        </form>
      </div>
    </div>
  );
}
