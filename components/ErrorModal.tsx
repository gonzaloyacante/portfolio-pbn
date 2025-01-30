import React, { useEffect } from "react";
import { XCircle } from "lucide-react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-110 bg-black bg-opacity-50">
      <div className="bg-background text-red-500 p-4 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center">
        <XCircle size={48} className="mb-2" />
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
