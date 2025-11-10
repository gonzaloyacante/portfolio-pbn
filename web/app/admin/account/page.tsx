"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Key, Mail } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import AdminLayout from "@/components/AdminLayout";
import PasswordModal from "./PasswordModal";
import EmailModal from "./EmailModal";
import { useSession } from "@/lib/session";
import { useToast } from "@/components/ui/use-toast";

function AccountSettings() {
  const { user } = useSession();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <AdminLayout title="Configuración de la Cuenta">
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
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={(message) => setSuccessMessage(message)}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}

      {isEmailModalOpen && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSuccess={(message) => setSuccessMessage(message)}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          currentEmail={user?.email || null}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </AdminLayout>
  );
}

export default AccountSettings;
