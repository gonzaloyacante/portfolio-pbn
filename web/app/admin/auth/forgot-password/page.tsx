"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPassword() {
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordReset = async () => {
    setError(null);
    setSuccess(null);

    if (!resetEmail) {
      setError("Debes completar el Email.");
      return;
    }

    try {
      await forgotPassword(resetEmail);
      setSuccess(
        "Correo de restablecimiento de contraseña enviado. Por favor, revisa tu bandeja de entrada."
      );
    } catch (error) {
      console.error("Error enviando correo de restablecimiento:", error);
      setError(
        "Error enviando correo de restablecimiento. Por favor, verifica tu correo electrónico."
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 10rem)" }}>
      <div className="w-full max-w-xs">
        <img
          src="/images/login-Admin.svg"
          alt="Imagen de fondo Iniciar sesión en administración"
          className="w-60 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-4 text-center">
          Restablecer Contraseña
        </h2>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
        <Button onClick={handlePasswordReset} className="w-full rounded mb-4">
          Enviar
        </Button>
        <Button
          onClick={() => router.push("/admin/auth/login")}
          variant="outline"
          className="w-full py-2 rounded">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
