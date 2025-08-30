import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const ToastNotification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed z-50 top-4 right-4 animate-fadeIn">
      <div
        className={`flex items-center px-4 py-3 rounded-lg shadow-lg border-l-4 ${
          type === "success"
            ? "bg-green-50 border-green-400 text-green-800"
            : "bg-red-50 border-red-400 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <X className="w-5 h-5 mr-2" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
