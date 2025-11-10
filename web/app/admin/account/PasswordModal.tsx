"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Modal from "@/components/Modal";
import { accountService } from "@/lib/services/account";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  errorMessage,
  setErrorMessage,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    setErrorMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las nuevas contraseñas no coinciden.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }
    try {
      await accountService.changePassword({ currentPassword, newPassword });
      onSuccess("Contraseña actualizada correctamente");
      handleClosePasswordModal();
    } catch (error) {
      console.error("Error actualizando la contraseña:", error);
      setErrorMessage(
        "Error actualizando la contraseña: " + (error as Error).message
      );
    }
  };

  const handleClosePasswordModal = () => {
    onClose();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordChange(currentPassword, newPassword, confirmNewPassword);
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Cambiar Contraseña"
      onClose={handleClosePasswordModal}
      footer="Guardar Cambios">
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
        <div className="relative">
          <Input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
            {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </form>
    </Modal>
  );
};

export default PasswordModal;
