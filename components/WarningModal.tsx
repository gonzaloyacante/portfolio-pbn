import React from "react";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface WarningModalProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      id="modalWarning"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-110 bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-background border-2 rounded-lg shadow">
          <div className="flex flex-col items-center justify-between p-4 md:p-5 border-b rounded-t">
            <AlertTriangle className="h-14 w-14 text-yellow-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">Advertencia</h2>
            <p>{message}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant={"outline"}
                onClick={onClose}
                className="px-4 py-2 rounded">
                Cancelar
              </Button>
              <Button
                variant={"destructive"}
                onClick={onConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
