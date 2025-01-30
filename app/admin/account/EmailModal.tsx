"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Modal from "@/components/Modal";
import { auth } from "../../../lib/firebaseClient";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  currentEmail: string | null;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  errorMessage,
  setErrorMessage,
  currentEmail,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleEmailChange = async (
    currentPassword: string,
    newEmail: string
  ) => {
    setErrorMessage(null);

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
        onSuccess("Correo electrónico actualizado correctamente");
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

  const handleCloseEmailModal = () => {
    onClose();
    setCurrentPassword("");
    setNewEmail("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailChange(currentPassword, newEmail);
  };

  if (!isOpen) return null;

  return (
    <Modal title="Cambiar Correo" onClose={handleCloseEmailModal} footer="Guardar Cambios">
      <p className="text-sm text-gray-300 mb-4">
        Correo actual: {currentEmail}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Contraseña Actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Input
          type="email"
          placeholder="Nuevo Correo Electrónico"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </form>
    </Modal>
  );
};

export default EmailModal;
