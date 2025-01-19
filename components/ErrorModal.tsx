import React from "react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-500 text-white p-4 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-white text-red-500 px-4 py-2 rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
