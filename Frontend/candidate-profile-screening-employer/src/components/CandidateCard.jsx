import React from 'react';
import CandidateHeader from './CandidateHeader';
import CandidateExpandedContent from './CandidateExpandedContent';

const CandidateCard = ({ 
  candidate, 
  isExpanded, 
  activeTab,
  onToggleExpansion, 
  onOpenResume, 
  onDownloadResume, 
  onCopyPhone, 
  onOpenEmail,
  onStatusUpdate,
  onShowToast,
  onShowInterviewerSelection,
  getScoreColor,
  formatDate 
}) => {
  return (
    <div className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transform-gpu">
      {/* Card Header */}
      <CandidateHeader
        candidate={candidate}
        isExpanded={isExpanded}
        onToggleExpansion={onToggleExpansion}
        onOpenResume={onOpenResume}
        onDownloadResume={onDownloadResume}
        onCopyPhone={onCopyPhone}
        onOpenEmail={onOpenEmail}
        getScoreColor={getScoreColor}
        formatDate={formatDate}
      />

      {/* Expanded Content */}
      {isExpanded && (
        <CandidateExpandedContent
          candidate={candidate}
          activeTab={activeTab}
          onStatusUpdate={onStatusUpdate}
          onShowToast={onShowToast}
          onShowInterviewerSelection={onShowInterviewerSelection}
        />
      )}
    </div>
  );
};

export default CandidateCard;
