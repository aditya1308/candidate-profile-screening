import React from 'react';
import { X } from 'lucide-react';

const ResumeModal = ({ show, resume, onClose }) => {
  if (!show || !resume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
      <div className="relative flex flex-col w-full max-w-4xl h-[80vh] bg-white border rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            Resume Preview - {resume.candidateName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-auto">
          <iframe
            src={`data:application/pdf;base64,${resume.fileData}`}
            className="w-full h-full border-0 rounded shadow-sm"
            title={`Resume - ${resume.candidateName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
