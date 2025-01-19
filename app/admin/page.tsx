"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../lib/firebaseClient";
import { Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error de autenticación:", error);
      alert("Credenciales incorrectas: " + (error as Error).message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Correo de restablecimiento de contraseña enviado");
      setIsResettingPassword(false);
    } catch (error) {
      console.error("Error enviando correo de restablecimiento:", error);
      alert(
        "Error enviando correo de restablecimiento: " + (error as Error).message
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 10rem)" }}>
      <div className="w-full max-w-xs">
        <img
          src="/images/login_Admin.svg"
          alt="Imagen de fondo Iniciar sesión en administración"
          className="w-60 mx-auto"
        />
        <h1 className="text-2xl font-bold my-8 text-center">
          Panel de Administrador
        </h1>
        {isResettingPassword ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              Restablecer Contraseña
            </h2>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <Button
              onClick={handlePasswordReset}
              className="w-full rounded mb-4">
              Enviar
            </Button>
            <Button
              onClick={() => setIsResettingPassword(false)}
              variant="outline"
              className="w-full py-2 rounded border-white">
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
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
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            <Button onClick={handleLogin} className="w-full rounded mb-4">
              Iniciar Sesión
            </Button>
            <button
              onClick={() => setIsResettingPassword(true)}
              className="w-full py-2 rounded flex items-center justify-center space-x-2">
              <span>Olvidé mi contraseña</span>
              <Key size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
