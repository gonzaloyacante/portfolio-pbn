import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      id="modalSuccess"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-150 bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-background border-2 rounded-lg shadow">
          <div className="flex flex-col items-center justify-between p-4 md:p-5 border-b rounded-t">
            <Check className="h-14 w-14 text-green-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">Éxito!</h2>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
