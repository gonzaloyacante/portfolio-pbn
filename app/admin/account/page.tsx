"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebaseClient";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Key, Mail, Eye, EyeOff } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

function AccountSettings() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      setCurrentEmail(email);
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    const user = auth.currentUser;
    if (user && currentPassword && newPassword) {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccessMessage("Contraseña actualizada correctamente");
        handleClosePasswordModal();
      } catch (error) {
        console.error("Error actualizando la contraseña:", error);
        setErrorMessage(
          "Error actualizando la contraseña: " + (error as Error).message
        );
      }
    } else {
      setErrorMessage("Por favor, completa todos los campos.");
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const user = auth.currentUser;
    if (user && currentPassword && newEmail) {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      try {
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, newEmail);
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", newEmail);
        }
        setSuccessMessage("Correo electrónico actualizado correctamente");
        handleCloseEmailModal();
      } catch (error) {
        console.error("Error actualizando el correo electrónico:", error);
        setErrorMessage(
          "Error actualizando el correo electrónico: " +
            (error as Error).message
        );
      }
    } else {
      setErrorMessage("Por favor, completa todos los campos.");
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
    setCurrentPassword("");
    setNewEmail("");
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <header className="flex items-center space-x-4 w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/dashboard")}>
          <ArrowLeft className="h-20 w-20 scale-150" />
          <span className="sr-only">Volver</span>
        </Button>
        <h2 className="text-xl font-bold">Configuración de la Cuenta</h2>
      </header>
      <div className="grid grid-cols-1 gap-6 items-center justify-center px-4 justify-items-center">
        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => setIsPasswordModalOpen(true)}>
          <Key size={64} className="scale-150" />
          <span>Cambiar Contraseña</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 w-full flex flex-col items-center justify-center font-bold p-4"
          onClick={() => setIsEmailModalOpen(true)}>
          <Mail size={64} className="scale-150" />
          <span>Cambiar Correo</span>
        </Button>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-background p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Contraseña Actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    !currentPassword && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    !newPassword && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirmar Nueva Contraseña"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    !confirmNewPassword && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }>
                  {showConfirmNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClosePasswordModal}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEmailModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-background p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cambiar Correo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Correo actual: {currentEmail}
            </p>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Contraseña Actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    !currentPassword && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <Input
                type="email"
                placeholder="Nuevo Correo Electrónico"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded ${
                  !newEmail && "border-red-500"
                }`}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseEmailModal}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}

export default AccountSettings;
