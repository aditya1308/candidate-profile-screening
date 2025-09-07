import React from 'react';
import { User, Mail, Phone, Calendar, Star, Tag, Eye, Download, ChevronDown, ChevronUp, Copy } from 'lucide-react';

const CandidateHeader = ({ 
  candidate, 
  isExpanded, 
  onToggleExpansion, 
  onOpenResume, 
  onDownloadResume, 
  onCopyPhone, 
  onOpenEmail,
  getScoreColor,
  formatDate 
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 space-x-3">
          <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 ease-out rounded-full shadow-lg bg-gradient-to-br from-sg-red to-red-600 hover:scale-110">
            <User className="w-5 h-5 text-white hover:animate-float" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {candidate.name}
            </h3>
            <div className="flex items-center mt-1 space-x-3 text-xs text-gray-600">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1 hover:animate-float" />
                <button
                  onClick={() => onOpenEmail(candidate.email, candidate.name)}
                  className="flex items-center transition-colors duration-200 hover:text-blue-600 group"
                  title="Click to send email"
                >
                  <span className="truncate">{candidate.email}</span>
                  <svg
                    className="w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1 hover:animate-float" />
                <button
                  onClick={() => onCopyPhone(candidate.phoneNumber)}
                  className="flex items-center transition-colors duration-200 hover:text-blue-600 group"
                  title="Click to copy phone number"
                >
                  <span className="truncate">{candidate.phoneNumber}</span>
                  <Copy className="w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 hover:animate-float" />
                {formatDate(candidate.dateOfBirth)}
              </div>
            </div>
          </div>
        </div>

        {/* Score and Actions */}
        <div className="flex items-center ml-3 space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border hover:animate-float ${getScoreColor(
              candidate.score
            )} hover:scale-105 transition-transform duration-300 ease-out`}
          >
            <Star className="w-4 h-4 mr-1 hover:animate-glow" />
            {candidate.score}/100
          </span>
          <div className="flex items-center text-xs text-gray-600">
            <Tag className="w-4 h-4 mr-1 hover:animate-float" />
            {candidate.matchedSkills?.length || 0}
          </div>
          <div className="flex items-center ml-2 space-x-1">
            <button
              onClick={() => onOpenResume(candidate.fileData, candidate.name)}
              className="flex items-center px-2 py-1 text-xs text-blue-600 transition-all duration-500 ease-out rounded hover:text-blue-800 hover:bg-blue-50 hover:scale-110 hover:rotate-6 transform-gpu"
              title="Preview Resume"
            >
              <Eye className="w-5 h-5 hover:animate-float" />
            </button>
            <button
              onClick={() => onDownloadResume(candidate.fileData, candidate.name)}
              className="flex items-center px-2 py-1 text-xs text-green-600 transition-all duration-500 ease-out rounded hover:text-green-800 hover:bg-green-50 hover:scale-110 hover:-rotate-6 transform-gpu"
              title="Download Resume"
            >
              <Download className="w-5 h-5 hover:animate-float" />
            </button>
            <button
              onClick={() => onToggleExpansion(candidate.id)}
              className="flex items-center px-2 py-1 text-xs text-gray-600 transition-all duration-500 ease-out rounded hover:text-gray-800 hover:bg-gray-50 hover:scale-110 transform-gpu"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 hover:animate-float" />
              ) : (
                <ChevronDown className="w-5 h-5 hover:animate-float" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;
