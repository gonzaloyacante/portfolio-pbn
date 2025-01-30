import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-background text-green-500 p-4 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center">
        <CheckCircle size={48} className="mb-2" />
        <h2 className="text-lg font-bold mb-2">Éxito</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
