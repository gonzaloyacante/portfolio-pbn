"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login as apiLogin } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError("Debes completar el Email.");
      return;
    }

    if (!password) {
      setPasswordError("Debes completar la Contraseña.");
      return;
    }

    try {
      // Llama a la API para establecer cookie httpOnly de sesión
      await apiLogin(email, password);
      // Si necesitas persistir algo en localStorage a nivel UI (no sensible), puedes guardar el email
      try {
        localStorage.setItem("userEmail", email);
      } catch {}
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error de autenticación:", error);
      if (error instanceof ApiError) {
        if (error.code === "EMAIL_NOT_FOUND") {
          setEmailError("Email no registrado.");
          return;
        }
        if (error.code === "INVALID_PASSWORD") {
          setPasswordError("Contraseña incorrecta.");
          return;
        }
        setEmailError(error.message || "Error al iniciar sesión.");
      } else {
        setEmailError("Error al iniciar sesión.");
      }
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
        <h1 className="text-2xl font-bold my-8 text-center">
          Panel de Administrador
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <Button type="submit" className="w-full rounded mb-4">
            Iniciar Sesión
          </Button>
        </form>
        <button
          onClick={() => router.push("/admin/auth/forgot-password")}
          className="w-full py-2 rounded flex items-center justify-center space-x-2">
          <span>Olvidé mi contraseña</span>
        </button>
      </div>
    </div>
  );
}
